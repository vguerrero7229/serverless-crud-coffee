import { json, parseJsonBody } from './http';

describe('http helpers', () => {
  it('serializes JSON responses with CORS headers', () => {
    const res = json(200, { ok: true });
    expect(res.statusCode).toBe(200);
    expect(res.headers).toBeDefined();
    expect(res.headers?.['Content-Type']).toBe('application/json');
    expect(res.headers?.['Access-Control-Allow-Origin']).toBe('*');
    expect(JSON.parse(res.body)).toEqual({ ok: true });
  });

  it('parses JSON bodies', () => {
    expect(parseJsonBody('{"a":1}')).toEqual({ a: 1 });
  });

  it('returns empty object for empty body', () => {
    expect(parseJsonBody('')).toEqual({});
    expect(parseJsonBody(null)).toEqual({});
  });

  it('throws SyntaxError on invalid JSON', () => {
    expect(() => parseJsonBody('{')).toThrow(SyntaxError);
  });
});
