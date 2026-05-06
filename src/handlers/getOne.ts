import type { APIGatewayProxyHandler } from 'aws-lambda';
import { json } from '../lib/http';
import * as repo from '../services/menuRepository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id?.trim();
    if (!id) return json(400, { message: 'Missing path parameter id' });

    const item = await repo.getMenuItem(id);
    if (!item) return json(404, { message: 'Menu item not found' });
    return json(200, { item });
  } catch (err: unknown) {
    console.error(err);
    return json(500, { message: 'Internal server error' });
  }
};
