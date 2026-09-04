import { revalidatePath } from "next/cache";
import { getOrderByOrderId, updateOrderPayment } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import {
  confirmTossPayment,
  orderStatusFromToss,
  queryTossPayment,
} from "@/lib/toss";

export type ConfirmResult =
  | { ok: true; status: "paid" | "awaiting_deposit"; orderId: string }
  | { ok: false; message: string };

export async function confirmCheckoutPayment(input: {
  paymentKey: string;
  orderId: string;
  requestedAmount: number;
}): Promise<ConfirmResult> {
  const order = await getOrderByOrderId(input.orderId);
  if (!order) {
    return { ok: false, message: "주문을 찾을 수 없습니다." };
  }

  if (order.status === "paid" || order.status === "awaiting_deposit") {
    return {
      ok: true,
      status: order.status,
      orderId: order.order_id,
    };
  }

  if (order.amount !== input.requestedAmount) {
    return {
      ok: false,
      message: "결제 금액이 주문 금액과 다릅니다. 결제를 진행하지 않았습니다.",
    };
  }

  const confirmed = await confirmTossPayment({
    paymentKey: input.paymentKey,
    orderId: order.order_id,
    amount: order.amount,
  });

  let payment = confirmed.ok ? confirmed.payment : undefined;

  if (!payment) {
    const queried = await queryTossPayment(input.paymentKey);
    if (!queried.ok) {
      return {
        ok: false,
        message:
          confirmed.ok === false
            ? (confirmed.error.message ?? "결제 승인에 실패했습니다.")
            : (queried.error.message ?? "결제 승인에 실패했습니다."),
      };
    }
    if (queried.amount !== order.amount) {
      return {
        ok: false,
        message: "결제 금액이 주문 금액과 다릅니다. 결제를 진행하지 않았습니다.",
      };
    }
    payment = queried.payment;
  }

  const status = orderStatusFromToss(payment.status);
  if (status === "pending" || status === "failed") {
    return {
      ok: false,
      message: "결제가 아직 완료되지 않았습니다.",
    };
  }

  await updateOrderPayment({
    orderId: order.order_id,
    userId: order.user_id,
    paymentKey: payment.paymentKey,
    status,
    method: payment.method ?? null,
    tossStatus: payment.status ?? null,
    receiptUrl: payment.receipt?.url ?? null,
  });

  if (status === "paid") {
    const supabase = await createClient();
    await supabase.from("cart_items").delete().eq("user_id", order.user_id);
    revalidatePath("/");
    revalidatePath("/cart");
  }

  revalidatePath("/orders");
  return { ok: true, status, orderId: order.order_id };
}
