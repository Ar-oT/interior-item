import { randomUUID } from "crypto";

export type TossPayment = {
  paymentKey: string;
  orderId: string;
  amount?: number;
  totalAmount?: number;
  status?: string;
  method?: string;
  receipt?: { url?: string };
};

export function getTossClientKey() {
  return process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";
}

function getTossSecretKey() {
  const secret = process.env.TOSS_SECRET_KEY;
  if (!secret) {
    throw new Error("TOSS_SECRET_KEY가 없습니다.");
  }
  return secret;
}

function tossAuthHeader() {
  return `Basic ${Buffer.from(`${getTossSecretKey()}:`).toString("base64")}`;
}

function paymentAmount(payment: TossPayment) {
  return payment.totalAmount ?? payment.amount;
}

export async function confirmTossPayment(input: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: tossAuthHeader(),
      "Content-Type": "application/json",
      "Idempotency-Key": randomUUID(),
    },
    body: JSON.stringify({
      paymentKey: input.paymentKey,
      orderId: input.orderId,
      amount: input.amount,
    }),
  });

  const payload = (await response.json()) as TossPayment & {
    code?: string;
    message?: string;
  };

  if (!response.ok) {
    return { ok: false as const, error: payload };
  }

  return { ok: true as const, payment: payload };
}

export async function queryTossPayment(paymentKey: string) {
  const response = await fetch(
    `https://api.tosspayments.com/v1/payments/${paymentKey}`,
    {
      headers: {
        Authorization: tossAuthHeader(),
      },
    },
  );

  const payload = (await response.json()) as TossPayment & {
    code?: string;
    message?: string;
  };

  if (!response.ok) {
    return { ok: false as const, error: payload };
  }

  return {
    ok: true as const,
    payment: payload,
    amount: paymentAmount(payload),
  };
}

export function orderStatusFromToss(status: string | undefined) {
  if (status === "DONE") return "paid";
  if (status === "WAITING_FOR_DEPOSIT") return "awaiting_deposit";
  if (status === "CANCELED" || status === "PARTIAL_CANCELED" || status === "ABORTED") {
    return "failed";
  }
  return "pending";
}
