/**
 * Cart type definitions
 */

export type PackageType = "recurring" | "one-time";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: PackageType;
  tier?: string;
  summary?: string;
  features: string[];
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}
