import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="px-6 sm:px-8 py-8 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted">
        <span className="font-display font-semibold text-dark">
          Fino<span className="text-primary">Lingo</span>
        </span>
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/login" className="hover:text-primary transition-colors">
            Log in
          </Link>
        </div>
        <span>© {new Date().getFullYear()} FinoLingo. Built by Karam.</span>
      </div>
    </footer>
  );
}
