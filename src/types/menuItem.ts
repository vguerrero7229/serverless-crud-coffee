/** Coffee shop menu row stored in DynamoDB */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Fields accepted when creating a menu item */
export interface CreateMenuItemInput {
  name: string;
  description?: string;
  priceCents: number;
  category: string;
  available?: boolean;
}

/** Fields accepted when updating (all optional) */
export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  priceCents?: number;
  category?: string;
  available?: boolean;
}
