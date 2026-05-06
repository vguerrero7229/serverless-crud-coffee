import { parseCreateBody, parseUpdateBody } from './validation';

describe('parseCreateBody', () => {
  it('accepts a valid payload', () => {
    expect(
      parseCreateBody({
        name: ' Flat White ',
        priceCents: 450,
        category: 'Espresso',
        description: 'Microfoam',
        available: false,
      }),
    ).toEqual({
      name: 'Flat White',
      description: 'Microfoam',
      priceCents: 450,
      category: 'espresso',
      available: false,
    });
  });

  it('defaults description and available', () => {
    expect(
      parseCreateBody({
        name: 'Cold Brew',
        priceCents: 500,
        category: 'brew',
      }),
    ).toMatchObject({
      description: '',
      available: true,
      category: 'brew',
    });
  });

  it('rejects invalid payloads', () => {
    expect(() => parseCreateBody(null)).toThrow(TypeError);
    expect(() => parseCreateBody({ name: '', priceCents: 1, category: 'brew' })).toThrow(TypeError);
    expect(() =>
      parseCreateBody({ name: 'x', priceCents: 0, category: 'brew' }),
    ).toThrow(TypeError);
    expect(() =>
      parseCreateBody({ name: 'x', priceCents: 10, category: 'invalid' }),
    ).toThrow(TypeError);
  });
});

describe('parseUpdateBody', () => {
  it('requires at least one field', () => {
    expect(() => parseUpdateBody({})).toThrow(TypeError);
  });

  it('parses partial updates', () => {
    expect(parseUpdateBody({ priceCents: 600 })).toEqual({ priceCents: 600 });
    expect(parseUpdateBody({ available: true })).toEqual({ available: true });
  });
});
