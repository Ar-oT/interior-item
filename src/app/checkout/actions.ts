"use server";

import { redirect } from "next/navigation";
import { getCartLines } from "@/lib/cart";
import { cartTotal } from "@/lib/cart-model";
import { createOrderId } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";

export async function createCheckoutOrder() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (typeof userId !== "string") {
    throw new Error("로그인이 필요합니다.");
  }

  const items = await getCartLines();
  const amount = cartTotal(items);
  if (items.length === 0 || amount <= 0) {
    throw new Error("결제할 소품이 없습니다.");
  }

  const orderId = createOrderId();
  const { error } = await supabase.from("orders").insert({
    order_id: orderId,
    user_id: userId,
    amount,
    status: "pending",
    items,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/checkout/${orderId}`);
}
