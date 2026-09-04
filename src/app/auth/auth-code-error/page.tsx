import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로그인 오류",
};

export default function AuthCodeErrorPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-1 flex-col justify-center px-5 py-16 text-center">
      <h1 className="font-serif text-3xl tracking-tight">로그인에 실패했습니다</h1>
      <p className="mt-4 text-sm leading-7 text-ink/70">
        카카오 인증을 완료하지 못했거나, 세션을 저장하는 과정에서 문제가 생겼습니다.
        다시 시도해 주세요.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex justify-center rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-clay"
      >
        로그인으로 돌아가기
      </Link>
    </main>
  );
}
