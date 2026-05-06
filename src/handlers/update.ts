import type { APIGatewayProxyHandler } from 'aws-lambda';
import { json, parseJsonBody } from '../lib/http';
import { parseUpdateBody } from '../lib/validation';
import * as repo from '../services/menuRepository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const id = event.pathParameters?.id?.trim();
    if (!id) return json(400, { message: 'Missing path parameter id' });

    const patch = parseUpdateBody(parseJsonBody(event.body));
    const item = await repo.updateMenuItem(id, patch);
    if (!item) return json(404, { message: 'Menu item not found' });
    return json(200, { item });
  } catch (err: unknown) {
    if (err instanceof SyntaxError) return json(400, { message: err.message });
    if (err instanceof TypeError) return json(400, { message: err.message });
    console.error(err);
    return json(500, { message: 'Internal server error' });
  }
};
