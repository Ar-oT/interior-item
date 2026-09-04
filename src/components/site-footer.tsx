export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-serif text-2xl">온결</p>
          <p className="mt-2 text-sm text-paper/70">공간을 채우는 다섯 가지 소품</p>
        </div>
        <p className="text-xs text-paper/55">© 2026 Ongyeol. All rights reserved.</p>
      </div>
    </footer>
  );
}
