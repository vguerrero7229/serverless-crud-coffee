import type { APIGatewayProxyResult } from 'aws-lambda';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
} as const;

export function json(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  };
}

export function parseJsonBody(raw: string | null): unknown {
  if (raw === null || raw === undefined || raw === '') return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new SyntaxError('Invalid JSON body');
  }
}
