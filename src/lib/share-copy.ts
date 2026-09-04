import { products, formatPrice } from "@/data/products";
import { cartTotal, type CartLine } from "@/lib/cart-model";

const fallbackImage =
  "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80";

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const item = value as CartLine;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.price === "number" &&
    typeof item.quantity === "number"
  );
}

export function productImage(productId: string) {
  return products.find((product) => product.id === productId)?.image ?? fallbackImage;
}

export function itemSummary(items: CartLine[]) {
  const lines = items.map(
    (item) => `${item.name} × ${item.quantity} · ${formatPrice(item.price * item.quantity)}`,
  );
  return `${lines.join("\n")}\n합계 ${formatPrice(cartTotal(items))}`;
}
