import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart-page-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";
import { displayName } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "장바구니",
  description: "온결에서 담아 둔 소품 목록입니다.",
};

export default async function CartPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );

  return (
    <>
      <SiteHeader userName={userName} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-16 sm:px-8">
        <p className="text-xs tracking-[0.28em] text-clay">CART</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight">장바구니</h1>
        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70">
          계정에 저장된 소품입니다. 카카오톡으로는 페이지와 품목을, 링크로는
          페이지만 공유할 수 있습니다.
        </p>
        <CartPageContent
          kakaoJsKey={process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? ""}
        />
      </main>
      <SiteFooter />
    </>
  );
}
