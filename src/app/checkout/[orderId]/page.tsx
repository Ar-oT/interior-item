import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutWidgets } from "@/components/checkout-widgets";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatPrice } from "@/data/products";
import { cartTotal } from "@/lib/cart-model";
import { getOrderByOrderId, orderName } from "@/lib/orders";
import { createClient } from "@/lib/supabase/server";
import { getTossClientKey } from "@/lib/toss";
import { displayName } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "주문서",
  description: "온결 소품 주문을 결제합니다.",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderByOrderId(orderId);
  if (!order) notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );
  const clientKey = getTossClientKey();

  return (
    <>
      <SiteHeader userName={userName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-clay">CHECKOUT</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">주문서</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          결제 금액은 서버에 저장된 주문 금액으로 승인합니다. 테스트 키에서는
          실제 출금이 되지 않습니다.
        </p>

        <div className="mt-10 max-w-lg">
          <ul className="divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li
                key={item.productId}
                className="flex items-baseline justify-between gap-4 py-4 text-sm"
              >
                <span>
                  {item.name}
                  <span className="ml-2 text-ink/50">× {item.quantity}</span>
                </span>
                <span className="tabular-nums text-ink/70">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-right font-serif text-xl tabular-nums">
            합계 {formatPrice(cartTotal(order.items))}
          </p>

          {order.status !== "pending" ? (
            <p className="mt-8 text-sm leading-7 text-ink/70">
              이미 처리된 주문입니다.{" "}
              <Link href="/orders" className="underline">
                주문 내역
              </Link>
              에서 확인해 주세요.
            </p>
          ) : !clientKey ? (
            <p className="mt-8 text-sm leading-7 text-clay">
              NEXT_PUBLIC_TOSS_CLIENT_KEY가 없어 결제창을 열 수 없습니다.
            </p>
          ) : (
            <CheckoutWidgets
              clientKey={clientKey}
              customerKey={order.user_id}
              orderId={order.order_id}
              orderName={orderName(order.items)}
              amount={order.amount}
              customerName={userName}
            />
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
