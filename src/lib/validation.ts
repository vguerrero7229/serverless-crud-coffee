import type { CreateMenuItemInput, UpdateMenuItemInput } from '../types/menuItem';

const CATEGORIES = new Set([
  'espresso',
  'brew',
  'tea',
  'pastry',
  'seasonal',
  'other',
]);

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

export function parseCreateBody(raw: unknown): CreateMenuItemInput {
  if (raw === null || typeof raw !== 'object') {
    throw new TypeError('Body must be a JSON object');
  }
  const o = raw as Record<string, unknown>;
  if (!isNonEmptyString(o.name)) throw new TypeError('name is required');
  if (!isPositiveInt(o.priceCents)) throw new TypeError('priceCents must be a positive integer');
  if (!isNonEmptyString(o.category)) throw new TypeError('category is required');
  const cat = o.category.trim().toLowerCase();
  if (!CATEGORIES.has(cat)) {
    throw new TypeError(`category must be one of: ${[...CATEGORIES].join(', ')}`);
  }
  const description =
    o.description === undefined || o.description === null
      ? ''
      : isNonEmptyString(o.description)
        ? o.description.trim()
        : String(o.description);
  let available = true;
  if (o.available !== undefined) {
    if (typeof o.available !== 'boolean') throw new TypeError('available must be boolean');
    available = o.available;
  }
  return {
    name: o.name.trim(),
    description,
    priceCents: o.priceCents,
    category: cat,
    available,
  };
}

export function parseUpdateBody(raw: unknown): UpdateMenuItemInput {
  if (raw === null || typeof raw !== 'object') {
    throw new TypeError('Body must be a JSON object');
  }
  const o = raw as Record<string, unknown>;
  const out: UpdateMenuItemInput = {};
  if ('name' in o) {
    if (!isNonEmptyString(o.name)) throw new TypeError('name must be a non-empty string');
    out.name = o.name.trim();
  }
  if ('description' in o) {
    if (o.description === null) out.description = '';
    else if (isNonEmptyString(o.description)) out.description = o.description.trim();
    else if (typeof o.description === 'string') out.description = o.description;
    else throw new TypeError('description must be a string');
  }
  if ('priceCents' in o) {
    if (!isPositiveInt(o.priceCents)) throw new TypeError('priceCents must be a positive integer');
    out.priceCents = o.priceCents;
  }
  if ('category' in o) {
    if (!isNonEmptyString(o.category)) throw new TypeError('category must be a non-empty string');
    const cat = o.category.trim().toLowerCase();
    if (!CATEGORIES.has(cat)) {
      throw new TypeError(`category must be one of: ${[...CATEGORIES].join(', ')}`);
    }
    out.category = cat;
  }
  if ('available' in o) {
    if (typeof o.available !== 'boolean') throw new TypeError('available must be boolean');
    out.available = o.available;
  }
  if (
    out.name === undefined &&
    out.description === undefined &&
    out.priceCents === undefined &&
    out.category === undefined &&
    out.available === undefined
  ) {
    throw new TypeError('At least one field is required to update');
  }
  return out;
}
