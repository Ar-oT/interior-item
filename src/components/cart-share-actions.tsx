"use client";

import { useState } from "react";
import { createCartShare } from "@/app/cart/actions";
import { cartTotal, type CartLine } from "@/lib/cart-model";
import { getSiteUrl } from "@/lib/site-url";
import { formatPrice } from "@/data/products";
import { itemSummary, productImage } from "@/lib/share-copy";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
      };
    };
  }
}

function initKakao(key: string) {
  if (!window.Kakao) return false;
  try {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(key);
    }
    return window.Kakao.isInitialized();
  } catch {
    return false;
  }
}

async function waitForKakao(key: string, timeoutMs = 8000) {
  if (initKakao(key)) return true;

  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise((resolve) => window.setTimeout(resolve, 50));
    if (initKakao(key)) return true;
  }
  return false;
}

function shareUrl(shareId: string) {
  return `${getSiteUrl()}/share/${shareId}`;
}

function kakaoLink(url: string) {
  return {
    mobileWebUrl: url,
    webUrl: url,
  };
}

function sendKakaoCart(url: string, items: CartLine[]) {
  if (!window.Kakao) return false;

  const title = `온결 장바구니 · ${items.length}개 품목`;
  const description = itemSummary(items);
  const firstImage = productImage(items[0].productId);

  if (items.length >= 2) {
    window.Kakao.Share.sendDefault({
      objectType: "list",
      headerTitle: title,
      headerLink: kakaoLink(url),
      contents: items.slice(0, 3).map((item) => ({
        title: item.name,
        description: `${item.quantity}개 · ${formatPrice(item.price * item.quantity)}`,
        imageUrl: productImage(item.productId),
        link: kakaoLink(url),
      })),
      buttons: [
        {
          title: "담긴 품목 보기",
          link: kakaoLink(url),
        },
      ],
    });
    return true;
  }

  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description,
      imageUrl: firstImage,
      link: kakaoLink(url),
    },
    itemContent: {
      profileText: "온결",
      items: items.map((item) => ({
        item: item.name,
        itemOp: `${item.quantity}개`,
      })),
      sum: "합계",
      sumOp: formatPrice(cartTotal(items)),
    },
    buttons: [
      {
        title: "담긴 품목 보기",
        link: kakaoLink(url),
      },
    ],
  });
  return true;
}

export function CartShareActions({
  items,
  kakaoJsKey,
}: {
  items: CartLine[];
  kakaoJsKey: string;
}) {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState<"kakao" | "link" | null>(null);

  async function createShareUrl() {
    const shareId = await createCartShare();
    return shareUrl(shareId);
  }

  async function shareToKakao() {
    setStatus(null);
    setBusy("kakao");
    try {
      const url = await createShareUrl();
      if (!kakaoJsKey) {
        setStatus(
          "카카오 JavaScript 키가 없어 카카오톡 창을 열 수 없습니다. 아래 링크 공유를 사용해 주세요.",
        );
        return;
      }
      if (!(await waitForKakao(kakaoJsKey))) {
        setStatus(
          "카카오톡 공유 준비에 실패했습니다. 잠시 후 다시 시도하거나 링크 공유를 사용해 주세요.",
        );
        return;
      }
      sendKakaoCart(url, items);
      setStatus("카카오톡으로 페이지와 담긴 품목을 공유합니다.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "공유에 실패했습니다.");
    } finally {
      setBusy(null);
    }
  }

  async function shareLink() {
    setStatus(null);
    setBusy("link");
    try {
      const url = await createShareUrl();
      await navigator.clipboard.writeText(url);
      setStatus("페이지 링크를 복사했습니다.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "링크를 복사하지 못했습니다.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={busy !== null}
          className="rounded-sm bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#191919] disabled:opacity-50"
          onClick={() => void shareToKakao()}
        >
          {busy === "kakao" ? "공유 준비 중..." : "카카오톡 공유하기"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          className="rounded-sm border border-ink/15 px-4 py-2.5 text-sm disabled:opacity-50"
          onClick={() => void shareLink()}
        >
          {busy === "link" ? "링크 만드는 중..." : "링크 공유하기"}
        </button>
      </div>
      <p className="text-xs leading-5 text-ink/55">
        카카오톡 공유는 페이지와 담긴 품목을 함께 보냅니다. 링크 공유는 페이지
        주소만 복사합니다.
      </p>
      {status ? <p className="text-xs leading-5 text-ink/70">{status}</p> : null}
    </div>
  );
}
