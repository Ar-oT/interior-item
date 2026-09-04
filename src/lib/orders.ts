import type { CartLine } from "@/lib/cart-model";
import { createClient } from "@/lib/supabase/server";

export type OrderStatus = "pending" | "awaiting_deposit" | "paid" | "failed";

export type OrderRecord = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  status: OrderStatus;
  items: CartLine[];
  payment_key: string | null;
  method: string | null;
  toss_status: string | null;
  receipt_url: string | null;
  created_at: string;
};

export function createOrderId() {
  return `ord-${crypto.randomUUID()}`;
}

export function orderName(items: CartLine[]) {
  if (items.length === 1) return items[0].name;
  return `${items[0].name} 외 ${items.length - 1}건`;
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

export async function getOrderByOrderId(orderId: string) {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_id, user_id, amount, status, items, payment_key, method, toss_status, receipt_url, created_at",
    )
    .eq("order_id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return data as OrderRecord;
}

export async function listOrders() {
  const { supabase, userId } = await requireUserId();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_id, user_id, amount, status, items, payment_key, method, toss_status, receipt_url, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as OrderRecord[];
}

export async function updateOrderPayment(input: {
  orderId: string;
  userId?: string;
  paymentKey: string;
  status: OrderStatus;
  method?: string | null;
  tossStatus?: string | null;
  receiptUrl?: string | null;
}) {
  const supabase = await createClient();
  const query = supabase
    .from("orders")
    .update({
      payment_key: input.paymentKey,
      status: input.status,
      method: input.method ?? null,
      toss_status: input.tossStatus ?? null,
      receipt_url: input.receiptUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", input.orderId);

  const { error } = input.userId
    ? await query.eq("user_id", input.userId)
    : await query;

  if (error) {
    throw new Error(error.message);
  }
}
