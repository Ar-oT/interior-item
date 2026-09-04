import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "결제 실패",
};

function firstQuery(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutFailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const code = firstQuery(query.code);
  const message = firstQuery(query.message);
  const orderId = firstQuery(query.orderId);

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );

  return (
    <>
      <SiteHeader userName={userName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-clay">PAYMENT</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">
          결제가 취소되었습니다
        </h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          {message ?? "결제 인증이 끝나지 않았습니다. 다시 시도해 주세요."}
        </p>
        {code ? (
          <p className="mt-2 text-xs text-ink/50">{code}</p>
        ) : null}
        <div className="mt-10 flex gap-3 text-sm">
          {orderId ? (
            <Link
              href={`/checkout/${orderId}`}
              className="rounded-full bg-ink px-5 py-3 text-paper hover:bg-clay"
            >
              결제로 돌아가기
            </Link>
          ) : (
            <Link
              href="/cart"
              className="rounded-full bg-ink px-5 py-3 text-paper hover:bg-clay"
            >
              장바구니
            </Link>
          )}
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
