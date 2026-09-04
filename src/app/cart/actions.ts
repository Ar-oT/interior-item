"use server";

import { revalidatePath } from "next/cache";
import { products } from "@/data/products";
import { getCartLines, toCartLine } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";

function isProductId(id: string) {
  return products.some((product) => product.id === id);
}

async function requireUserId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (typeof userId !== "string") {
    throw new Error("로그인이 필요합니다.");
  }
  return { supabase, userId };
}

export async function addCartItem(productId: string) {
  if (!isProductId(productId)) {
    throw new Error("없는 상품입니다.");
  }

  const { supabase, userId } = await requireUserId();
  const { data: existing, error: readError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existing.quantity + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: productId,
      quantity: 1,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/");
  revalidatePath("/cart");
}

export async function createCartShare() {
  const { supabase, userId } = await requireUserId();
  const lines = await getCartLines();

  if (lines.length === 0) {
    throw new Error("공유할 장바구니가 비어 있습니다.");
  }

  const snapshot = lines.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? toCartLine(product, line.quantity) : line;
  });

  const { data, error } = await supabase
    .from("cart_shares")
    .insert({
      user_id: userId,
      items: snapshot,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "장바구니 공유에 실패했습니다.");
  }

  return data.id as string;
}
