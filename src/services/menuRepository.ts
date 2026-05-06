import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import type { MenuItem, UpdateMenuItemInput } from '../types/menuItem';

function requireTable(): string {
  const table = process.env.TABLE_NAME;
  if (!table) throw new Error('TABLE_NAME is not configured');
  return table;
}

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function putMenuItem(item: MenuItem): Promise<void> {
  await doc.send(
    new PutCommand({
      TableName: requireTable(),
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    }),
  );
}

export async function getMenuItem(id: string): Promise<MenuItem | undefined> {
  const out = await doc.send(
    new GetCommand({
      TableName: requireTable(),
      Key: { id },
      ConsistentRead: true,
    }),
  );
  return out.Item as MenuItem | undefined;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    await doc.send(
      new DeleteCommand({
        TableName: requireTable(),
        Key: { id },
        ConditionExpression: 'attribute_exists(id)',
      }),
    );
    return true;
  } catch (e: unknown) {
    const name = e && typeof e === 'object' && 'name' in e ? String((e as { name?: string }).name) : '';
    if (name === 'ConditionalCheckFailedException') return false;
    throw e;
  }
}

export async function scanMenuItems(category?: string): Promise<MenuItem[]> {
  const req =
    category === undefined || category === ''
      ? new ScanCommand({ TableName: requireTable() })
      : new ScanCommand({
          TableName: requireTable(),
          FilterExpression: '#c = :cat',
          ExpressionAttributeNames: { '#c': 'category' },
          ExpressionAttributeValues: { ':cat': category.toLowerCase() },
        });
  const out = await doc.send(req);
  return (out.Items ?? []) as MenuItem[];
}

export async function updateMenuItem(id: string, patch: UpdateMenuItemInput): Promise<MenuItem | undefined> {
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};
  const sets: string[] = [];
  let i = 0;
  const add = (field: keyof UpdateMenuItemInput, value: unknown) => {
    const nk = `#f${i}`;
    const vk = `:v${i}`;
    i += 1;
    names[nk] = field;
    values[vk] = value;
    sets.push(`${nk} = ${vk}`);
  };
  if (patch.name !== undefined) add('name', patch.name);
  if (patch.description !== undefined) add('description', patch.description);
  if (patch.priceCents !== undefined) add('priceCents', patch.priceCents);
  if (patch.category !== undefined) add('category', patch.category);
  if (patch.available !== undefined) add('available', patch.available);

  const updatedAt = new Date().toISOString();
  names['#ua'] = 'updatedAt';
  values[':ua'] = updatedAt;
  sets.push('#ua = :ua');

  try {
    const out = await doc.send(
      new UpdateCommand({
        TableName: requireTable(),
        Key: { id },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW',
      }),
    );
    return out.Attributes as MenuItem | undefined;
  } catch (e: unknown) {
    const name = e && typeof e === 'object' && 'name' in e ? String((e as { name?: string }).name) : '';
    if (name === 'ConditionalCheckFailedException') return undefined;
    throw e;
  }
}
