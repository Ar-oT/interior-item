import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Script from "next/script";
import { CartProvider } from "@/components/cart-provider";
import { getCartLines } from "@/lib/cart";
import "./globals.css";

const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "온결 — 인테리어 소품",
    template: "%s | 온결",
  },
  description:
    "공간을 채우는 다섯 가지 인테리어 소품. 화병, 램프, 캔들, 쿠션, 트레이를 온결에서 만나보세요.",
};

export const viewport: Viewport = {
  themeColor: "#f3eadc",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cartItems = await getCartLines();

  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-paper font-sans text-ink antialiased">
        {kakaoJsKey ? (
          <Script
            src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js"
            integrity="sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}
        <CartProvider initialItems={cartItems}>{children}</CartProvider>
      </body>
    </html>
  );
}
