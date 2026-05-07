import Link from "next/link";

export default function SiteHeader({ active }: { active?: "home" | "about" }) {
  const linkBase =
    "text-sm font-medium px-3 py-2 min-h-[44px] flex items-center transition-colors";

  return (
    <header className="border-b border-border">
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between gap-4 px-6 sm:px-8 py-4 max-w-5xl mx-auto w-full"
      >
        <Link href="/" className="font-display text-2xl font-bold text-dark">
          Fino<span className="text-primary">Lingo</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/about"
            aria-current={active === "about" ? "page" : undefined}
            className={`${linkBase} ${
              active === "about"
                ? "text-primary"
                : "text-dark hover:text-primary"
            }`}
          >
            About
          </Link>
          <Link
            href="/login"
            className={`${linkBase} text-dark hover:text-primary`}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm min-h-[44px] flex items-center"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
