import type { Metadata } from "next";
import Link from "next/link";
import { confirmCheckoutPayment } from "@/app/checkout/confirm";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "결제 결과",
};

function firstQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const paymentKey = firstQuery(query.paymentKey);
  const orderId = firstQuery(query.orderId);
  const amountValue = Number(firstQuery(query.amount));

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );

  const result =
    paymentKey && orderId && Number.isInteger(amountValue)
      ? await confirmCheckoutPayment({
          paymentKey,
          orderId,
          requestedAmount: amountValue,
        })
      : { ok: false as const, message: "결제 정보가 올바르지 않습니다." };

  return (
    <>
      <SiteHeader userName={userName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-clay">PAYMENT</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">
          {result.ok
            ? result.status === "awaiting_deposit"
              ? "입금 대기"
              : "결제가 완료되었습니다"
            : "결제를 마치지 못했습니다"}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          {result.ok
            ? result.status === "awaiting_deposit"
              ? "가상계좌가 발급되었습니다. 입금이 확인되면 주문이 완료됩니다."
              : "주문 내역에서 영수증과 결제 상태를 확인할 수 있습니다."
            : result.message}
        </p>
        <div className="mt-10 flex gap-3 text-sm">
          <Link
            href="/orders"
            className="rounded-full bg-ink px-5 py-3 text-paper hover:bg-clay"
          >
            주문 내역
          </Link>
          <Link
            href="/"
            className="rounded-full border border-ink/15 px-5 py-3 hover:border-ink/40"
          >
            컬렉션으로
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
