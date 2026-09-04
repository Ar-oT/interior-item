import Link from "next/link";

export default function SharedCartNotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-md flex-1 flex-col justify-center px-5 py-16 text-center">
      <h1 className="font-serif text-3xl tracking-tight">공유 목록을 찾을 수 없습니다</h1>
      <p className="mt-4 text-sm leading-7 text-ink/70">
        링크가 만료되었거나 잘못된 주소입니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex justify-center rounded-full bg-ink px-5 py-3 text-sm text-paper hover:bg-clay"
      >
        온결로 돌아가기
      </Link>
    </main>
  );
}
