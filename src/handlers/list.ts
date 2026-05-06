import type { APIGatewayProxyHandler } from 'aws-lambda';
import { json } from '../lib/http';
import * as repo from '../services/menuRepository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const category = event.queryStringParameters?.category?.trim();
    const items = await repo.scanMenuItems(category === '' ? undefined : category);
    items.sort((a, b) => a.name.localeCompare(b.name));
    return json(200, { items, count: items.length });
  } catch (err: unknown) {
    console.error(err);
    return json(500, { message: 'Internal server error' });
  }
};
