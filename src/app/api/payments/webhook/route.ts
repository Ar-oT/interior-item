import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { orderStatusFromToss, queryTossPayment } from "@/lib/toss";

type WebhookBody = {
  eventType?: string;
  data?: {
    paymentKey?: string;
    orderId?: string;
  };
};

export async function POST(request: Request) {
  const body = (await request.json()) as WebhookBody;
  const eventType = body.eventType;
  const paymentKey = body.data?.paymentKey;
  const orderId = body.data?.orderId;

  if (
    eventType !== "PAYMENT_STATUS_CHANGED" &&
    eventType !== "DEPOSIT_CALLBACK"
  ) {
    return NextResponse.json({ ok: true });
  }

  if (!paymentKey || !orderId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const queried = await queryTossPayment(paymentKey);
  if (!queried.ok) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { data: order } = await admin
    .from("orders")
    .select("amount, status")
    .eq("order_id", orderId)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  if (queried.amount !== order.amount) {
    return NextResponse.json({ ok: false }, { status: 409 });
  }

  const status = orderStatusFromToss(queried.payment.status);
  await admin
    .from("orders")
    .update({
      payment_key: queried.payment.paymentKey,
      status,
      method: queried.payment.method ?? null,
      toss_status: queried.payment.status ?? null,
      receipt_url: queried.payment.receipt?.url ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("order_id", orderId);

  return NextResponse.json({ ok: true });
}
