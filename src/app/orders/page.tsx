import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/data/products";
import { listOrders, type OrderStatus } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "주문 내역",
  description: "온결에서 결제한 주문입니다.",
};

const statusLabel: Record<OrderStatus, string> = {
  pending: "결제 대기",
  awaiting_deposit: "입금 대기",
  paid: "결제 완료",
  failed: "실패",
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );
  const orders = await listOrders();

  return (
    <>
      <SiteHeader userName={userName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-clay">ORDERS</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">주문 내역</h1>
        {orders.length === 0 ? (
          <p className="mt-10 max-w-md text-sm leading-7 text-ink/70">
            아직 주문이 없습니다. 장바구니에서 소품을 담은 뒤 결제해 보세요.
          </p>
        ) : (
          <ul className="mt-10 max-w-lg divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li key={order.order_id} className="py-5">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-ink/55">{statusLabel[order.status]}</span>
                  <span className="tabular-nums">{formatPrice(order.amount)}</span>
                </div>
                <p className="mt-2 text-sm leading-6">
                  {order.items
                    .map((item) => `${item.name} × ${item.quantity}`)
                    .join(", ")}
                </p>
                <div className="mt-3 flex gap-3 text-xs text-ink/55">
                  {order.status === "pending" ? (
                    <Link href={`/checkout/${order.order_id}`} className="underline">
                      이어서 결제
                    </Link>
                  ) : null}
                  {order.receipt_url ? (
                    <a
                      href={order.receipt_url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      영수증
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/cart"
          className="mt-10 inline-flex rounded-full border border-ink/15 px-5 py-3 text-sm hover:border-ink/40"
        >
          장바구니
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
