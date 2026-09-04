import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cartTotal } from "@/lib/cart-model";
import { formatPrice } from "@/data/products";
import { getSharedCartItems } from "@/lib/shared-cart";
import { itemSummary, productImage } from "@/lib/share-copy";

type SharePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const items = await getSharedCartItems(id);
  if (items.length === 0) {
    return { title: "공유된 장바구니" };
  }

  return {
    title: `공유된 장바구니 · ${items.length}개 품목`,
    description: itemSummary(items).replaceAll("\n", " · "),
    openGraph: {
      title: `온결 장바구니 · ${items.length}개 품목`,
      description: items.map((item) => `${item.name} × ${item.quantity}`).join(", "),
      images: [{ url: productImage(items[0].productId) }],
    },
  };
}

export default async function SharedCartPage({ params }: SharePageProps) {
  const { id } = await params;
  const items = await getSharedCartItems(id);
  if (items.length === 0) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-1 flex-col px-5 py-16">
      <p className="text-xs tracking-[0.28em] text-clay">SHARED CART</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">공유된 장바구니</h1>
      <p className="mt-4 text-sm leading-7 text-ink/70">
        온결 손님이 골라 둔 소품 목록입니다.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-line/40">
              <Image
                src={productImage(item.productId)}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3 text-sm">
              <span>
                {item.name}
                <span className="ml-2 text-ink/50">× {item.quantity}</span>
              </span>
              <span className="tabular-nums">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-right font-serif text-xl tabular-nums">
        합계 {formatPrice(cartTotal(items))}
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex justify-center rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-clay"
      >
        온결 상점 보기
      </Link>
    </main>
  );
}
