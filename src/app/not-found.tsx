import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  // 404s should not be indexed — they have no canonical content.
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Large 404 */}
        <h1 className="font-display text-display font-bold text-dark/10 leading-none select-none">
          404
        </h1>

        {/* Coin visual */}
        <div className="relative -mt-8 mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center shadow-lg shadow-accent/10">
            <span className="text-3xl" role="img" aria-label="coin">
              &#x1FA99;
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="font-display text-2xl font-bold text-dark mb-2">
          Looks like this page got lost
        </h2>
        <p className="text-muted font-body text-base mb-8 leading-relaxed">
          Even the best investors take a wrong turn sometimes.
          Let&apos;s get you back on track.
        </p>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="
            inline-flex items-center justify-center gap-2
            px-7 py-3 rounded-lg text-base font-body font-medium
            bg-primary text-white hover:bg-primary/90
            transition-all duration-150 ease-out
            active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
          "
        >
          Back to Dashboard
        </Link>

        {/* Decorative dots */}
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
        </div>
      </div>
    </div>
  );
}
