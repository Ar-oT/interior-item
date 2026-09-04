"use client";

import Link from "next/link";
import { CartShareActions } from "@/components/cart-share-actions";
import { CheckoutButton } from "@/components/checkout-button";
import { useCart } from "@/components/cart-provider";
import { cartTotal } from "@/lib/cart-model";
import { formatPrice } from "@/data/products";

export function CartPageContent({ kakaoJsKey }: { kakaoJsKey: string }) {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mt-10 max-w-lg">
        <p className="text-sm leading-7 text-ink/70">
          아직 담긴 소품이 없습니다. 컬렉션에서 마음에 드는 물건을 골라 보세요.
        </p>
        <Link
          href="/#collection"
          className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-clay"
        >
          컬렉션 보러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-lg">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((item) => (
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
        합계 {formatPrice(cartTotal(items))}
      </p>
      <div className="mt-8">
        <CheckoutButton />
      </div>
      <CartShareActions items={items} kakaoJsKey={kakaoJsKey} />
    </div>
  );
}
