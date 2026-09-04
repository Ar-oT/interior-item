"use client";

import { useState } from "react";
import { createCheckoutOrder } from "@/app/checkout/actions";

export function CheckoutButton() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setError(null);
          setPending(true);
          void createCheckoutOrder()
            .catch((caught: unknown) => {
              setError(
                caught instanceof Error
                  ? caught.message
                  : "주문을 만들지 못했습니다.",
              );
              setPending(false);
            });
        }}
        className="w-full rounded-sm bg-ink px-4 py-2.5 text-sm text-paper disabled:opacity-50"
      >
        {pending ? "주문서로 이동 중..." : "주문하기"}
      </button>
      {error ? <p className="text-xs leading-5 text-clay">{error}</p> : null}
    </div>
  );
}
