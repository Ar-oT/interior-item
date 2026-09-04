"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function AddToCartButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="rounded-full border border-ink/15 bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-clay focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
      onClick={() => {
        add(id, name);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      {added ? "담았습니다" : "장바구니 담기"}
    </button>
  );
}
