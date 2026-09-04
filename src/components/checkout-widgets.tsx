"use client";

import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";
import { getSiteUrl } from "@/lib/site-url";

export function CheckoutWidgets({
  clientKey,
  customerKey,
  orderId,
  orderName,
  amount,
  customerName,
}: {
  clientKey: string;
  customerKey: string;
  orderId: string;
  orderName: string;
  amount: number;
  customerName?: string;
}) {
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        await widgets.setAmount({ value: amount, currency: "KRW" });
        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#payment-method" }),
          widgets.renderAgreement({ selector: "#agreement" }),
        ]);
        if (cancelled) return;
        widgetsRef.current = widgets;
        setReady(true);
      } catch (renderError) {
        if (!cancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : "결제창을 불러오지 못했습니다.",
          );
        }
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [amount, clientKey, customerKey]);

  async function requestPay() {
    if (!widgetsRef.current) return;
    setPending(true);
    setError(null);
    try {
      const origin = getSiteUrl();
      await widgetsRef.current.requestPayment({
        orderId,
        orderName,
        customerName,
        successUrl: `${origin}/checkout/success`,
        failUrl: `${origin}/checkout/fail`,
      });
    } catch (payError) {
      setError(
        payError instanceof Error
          ? payError.message
          : "결제를 시작하지 못했습니다.",
      );
      setPending(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div id="payment-method" className="rounded-sm bg-white/60" />
      <div id="agreement" className="rounded-sm bg-white/60" />
      <button
        type="button"
        disabled={!ready || pending}
        onClick={() => void requestPay()}
        className="w-full rounded-sm bg-ink px-4 py-3 text-sm text-paper disabled:opacity-50"
      >
        {pending ? "결제 창을 여는 중..." : "결제하기"}
      </button>
      {error ? <p className="text-xs leading-5 text-clay">{error}</p> : null}
    </div>
  );
}
