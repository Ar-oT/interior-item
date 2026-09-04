import type { Product } from "@/data/products";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export function toCartLine(product: Product, quantity: number): CartLine {
  return {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
  };
}

export function cartTotal(items: CartLine[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
