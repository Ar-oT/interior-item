import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { products } from "@/data/products";
import { createClient } from "@/lib/supabase/server";

const [featured, ...rest] = products;

function displayName(claims: { user_metadata?: Record<string, unknown> } | undefined) {
  const metadata = claims?.user_metadata ?? {};
  const name = metadata.name ?? metadata.full_name ?? metadata.nickname;
  return typeof name === "string" && name.trim() ? name : undefined;
}

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userName = displayName(
    data?.claims as { user_metadata?: Record<string, unknown> } | undefined,
  );

  return (
    <>
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        상품 목록으로 건너뛰기
      </a>
      <SiteHeader userName={userName} />
      <main id="top" className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-24">
          <div>
            <p className="text-xs tracking-[0.28em] text-clay">ONGYEOL · 05 PIECES</p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
              매일의 방에
              <br />
              온기와 결을 더합니다
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-ink/70">
              온결은 다섯 가지 소품만 만듭니다. 많이 모으기보다, 오래 곁에 둘 물건을
              고르는 작은 상점입니다.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6 text-sm">
            <div>
              <dt className="text-ink/50">컬렉션</dt>
              <dd className="mt-1 font-serif text-2xl">5</dd>
            </div>
            <div>
              <dt className="text-ink/50">제작</dt>
              <dd className="mt-1 font-serif text-2xl">소량</dd>
            </div>
            <div>
              <dt className="text-ink/50">배송</dt>
              <dd className="mt-1 font-serif text-2xl">서울</dd>
            </div>
          </dl>
        </section>

        <section
          id="collection"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-24 sm:px-8"
        >
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.28em] text-moss">COLLECTION</p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight">이번 계절의 다섯 점</h2>
            </div>
            <p className="hidden max-w-xs text-right text-sm leading-6 text-ink/55 sm:block">
              화병, 램프, 캔들, 쿠션, 트레이. 방에 하나씩만 두어도 공기가 달라집니다.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ProductCard product={featured} featured />
            {rest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section
          id="story"
          className="border-y border-line bg-white/35"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
            <h2 className="font-serif text-3xl leading-snug tracking-tight">
              물건의 결이
              <br />
              공간의 온도가 됩니다
            </h2>
            <div className="space-y-5 text-sm leading-7 text-ink/75">
              <p>
                반짝이는 신상보다, 손때가 묻는 물건을 좋아합니다. 온결의 소품은 모두
                만졌을 때의 감촉과 빛이 머무는 방식을 기준으로 골랐습니다.
              </p>
              <p>
                한 시즌에 다섯 점만 소개합니다. 재고가 끝나면 같은 결의 다음 작업을
                기다립니다.
              </p>
            </div>
          </div>
        </section>

        <section id="visit" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8">
          <p className="text-xs tracking-[0.28em] text-clay">VISIT</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight">방문과 문의</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <address className="not-italic text-sm leading-7 text-ink/75">
              <p>서울시 성동구 서울숲길 12</p>
              <p>수–일 12:00–19:00</p>
              <p>월요일 · 화요일 휴무</p>
            </address>
            <p className="text-sm leading-7 text-ink/75">
              주문과 재고 문의는{" "}
              <a className="underline decoration-line underline-offset-4 hover:text-clay" href="mailto:hello@ongyeol.kr">
                hello@ongyeol.kr
              </a>
              로 보내 주세요. 장바구니에 담아 두신 소품을 함께 적어 주시면 더
              빠르게 안내합니다.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
