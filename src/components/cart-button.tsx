"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-full border border-ink/15 px-3 py-1.5 text-sm tracking-wide hover:border-ink/40"
      aria-label={`장바구니 ${count}개`}
    >
      장바구니
      <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-clay px-1.5 text-xs text-paper">
        {count}
      </span>
    </Link>
  );
}
