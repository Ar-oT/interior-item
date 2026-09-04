import type { Metadata } from "next";
import { signInWithKakao } from "@/app/login/actions";

export const metadata: Metadata = {
  title: "로그인",
};

function KakaoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.86 5.33 4.62 6.74-.2.74-.72 2.66-.82 3.07-.12.49.18.48.38.35.16-.11 2.55-1.73 3.58-2.44A13 13 0 0 0 12 19c5.52 0 10-3.58 10-8S17.52 3 12 3Z"
      />
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-1 flex-col justify-center px-5 py-16">
      <p className="text-xs tracking-[0.28em] text-clay">ONGYEOL</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">온결</h1>
      <p className="mt-4 text-sm leading-7 text-ink/70">
        카카오 계정으로 로그인한 뒤에만 컬렉션을 볼 수 있습니다.
      </p>
      {error ? (
        <p
          role="alert"
          className="mt-6 rounded-sm border border-clay/30 bg-white/50 px-4 py-3 text-sm leading-6 text-clay"
        >
          카카오 로그인을 시작하지 못했습니다. 카카오 앱과 Supabase Kakao
          제공자가 켜져 있는지 확인해 주세요.
        </p>
      ) : null}
      <form action={signInWithKakao} className="mt-10">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#FEE500] px-4 py-3 text-sm font-medium text-[#191919] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <KakaoMark />
          카카오로 로그인
        </button>
      </form>
    </main>
  );
}
