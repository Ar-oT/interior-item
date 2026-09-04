import { products } from "@/data/products";
import { toCartLine, type CartLine } from "@/lib/cart-model";
import { createClient } from "@/lib/supabase/server";

export type { CartLine } from "@/lib/cart-model";
export { cartTotal, toCartLine } from "@/lib/cart-model";

const productById = new Map(products.map((product) => [product.id, product]));

export async function getCartLines(): Promise<CartLine[]> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (typeof userId !== "string") {
    return [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("product_id, quantity")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.flatMap((row) => {
    const product = productById.get(row.product_id);
    if (!product) return [];
    return [toCartLine(product, row.quantity)];
  });
}
