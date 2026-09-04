"use client";

import { useEffect, useId, useRef } from "react";
import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { items, count } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <button
        type="button"
        className="relative rounded-full border border-ink/15 px-3 py-1.5 text-sm tracking-wide hover:border-ink/40"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`장바구니 ${count}개`}
      >
        장바구니
        <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-clay px-1.5 text-xs text-paper">
          {count}
        </span>
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="w-[min(28rem,calc(100%-2rem))] rounded-2xl border border-line bg-paper p-6 text-ink shadow-xl backdrop:bg-ink/40"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-serif text-2xl">
            장바구니
          </h2>
          <button
            type="button"
            className="text-sm text-ink/60 hover:text-ink"
            onClick={() => dialogRef.current?.close()}
          >
            닫기
          </button>
        </div>
        {items.length === 0 ? (
          <p className="mt-6 text-sm leading-6 text-ink/70">
            아직 담긴 소품이 없습니다. 컬렉션에서 마음에 드는 물건을 골라 보세요.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-4 py-3 text-sm"
              >
                <span>{item.name}</span>
                <span className="tabular-nums text-ink/60">{item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs leading-5 text-ink/55">
          결제는 준비 중입니다. 담아 두신 소품은 이 브라우저에서만 유지됩니다.
        </p>
      </dialog>
    </>
  );
}
