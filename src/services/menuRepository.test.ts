/**
 * @jest-environment node
 */
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import type { MenuItem } from '../types/menuItem';

describe('menuRepository', () => {
  const ddbMock = mockClient(DynamoDBDocumentClient);
  const prevTable = process.env.TABLE_NAME;

  beforeAll(() => {
    process.env.TABLE_NAME = 'test-table';
  });

  afterAll(() => {
    process.env.TABLE_NAME = prevTable;
  });

  beforeEach(() => {
    ddbMock.reset();
  });

  it('putMenuItem sends PutCommand', async () => {
    ddbMock.on(PutCommand).resolves({});
    const repo = await import('./menuRepository');
    const item: MenuItem = {
      id: '1',
      name: 'Latte',
      description: '',
      priceCents: 400,
      category: 'espresso',
      available: true,
      createdAt: 't',
      updatedAt: 't',
    };
    await repo.putMenuItem(item);
    expect(ddbMock.commandCalls(PutCommand).length).toBe(1);
  });
});
