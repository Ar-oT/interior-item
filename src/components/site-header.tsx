import { signOut } from "@/app/login/actions";
import { CartButton } from "@/components/cart-button";

const navItems = [
  { href: "#collection", label: "컬렉션" },
  { href: "#story", label: "이야기" },
  { href: "#visit", label: "방문" },
];

export function SiteHeader({ userName }: { userName?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="font-serif text-xl tracking-tight">
          온결
        </a>
        <nav aria-label="주요" className="flex items-center gap-3 text-xs sm:gap-6 sm:text-sm">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {userName ? (
            <span className="hidden max-w-28 truncate text-xs text-ink/60 sm:inline">
              {userName}
            </span>
          ) : null}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-ink/15 px-3 py-1.5 text-sm tracking-wide hover:border-ink/40"
            >
              로그아웃
            </button>
          </form>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
