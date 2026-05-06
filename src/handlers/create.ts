import type { APIGatewayProxyHandler } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { json, parseJsonBody } from '../lib/http';
import { parseCreateBody } from '../lib/validation';
import * as repo from '../services/menuRepository';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = parseCreateBody(parseJsonBody(event.body));
    const now = new Date().toISOString();
    const item = {
      id: uuidv4(),
      name: body.name,
      description: body.description ?? '',
      priceCents: body.priceCents,
      category: body.category,
      available: body.available ?? true,
      createdAt: now,
      updatedAt: now,
    };
    await repo.putMenuItem(item);
    return json(201, { item });
  } catch (err: unknown) {
    if (err instanceof SyntaxError) return json(400, { message: err.message });
    if (err instanceof TypeError) return json(400, { message: err.message });
    console.error(err);
    return json(500, { message: 'Internal server error' });
  }
};
