import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: `${SITE_NAME} is a free, gamified financial literacy platform built for young adults in India. Learn how money actually works, with seven chapters of interactive lessons and real-world simulations.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description: `Why ${SITE_NAME} exists, what we built, and who built it.`,
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <header className="border-b border-border">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between px-6 sm:px-8 py-4 max-w-5xl mx-auto w-full"
        >
          <Link href="/" className="font-display text-2xl font-bold text-dark">
            Fino<span className="text-primary">Lingo</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-dark font-medium hover:text-primary transition-colors px-3 py-2 min-h-[44px] flex items-center text-sm"
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

      <main id="main-content" className="flex-1">
        <section className="px-6 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-display font-bold text-dark leading-[1.08] mb-5">
              About <span className="text-primary">FinoLingo</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-lg">
              A free, gamified way for young Indians to learn money &mdash;
              from what it even is, to how to dodge the scams aimed at you.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-8 py-16 sm:py-20 max-w-5xl mx-auto border-t border-border">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">
            The problem
          </h2>
          <div className="max-w-2xl space-y-4 text-base text-muted leading-relaxed">
            <p>
              India teaches its kids a lot of things. Personal finance is not
              one of them. Most young adults leave school without a clue how
              SIPs work, what a credit score actually does, why their first
              salary disappears so fast, or how to tell a real UPI request
              from a fraud one.
            </p>
            <p>
              Then real life starts. Rent, taxes, EMIs, side hustles, parents
              asking about investments &mdash; all at once, all without a
              manual. The default options are stiff textbooks, finance
              influencers selling a course, or learning the hard way after
              losing money. We thought there should be a better one.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-8 py-16 sm:py-20 bg-fill-subtle border-t border-b border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">
              What we built
            </h2>
            <div className="max-w-2xl space-y-4 text-base text-muted leading-relaxed">
              <p>
                Seven chapters, in plain English, built around how money
                actually shows up in your life in India. Each chapter has
                bite-sized lessons, scored exercises, and a branching
                simulation where you make real-feeling decisions and see the
                consequences play out.
              </p>
              <p>
                XP, streaks, badges, leagues, and a downloadable certificate
                when you finish. The gamification isn&apos;t the point &mdash;
                it&apos;s just there to keep you showing up long enough for
                the lessons to stick.
              </p>
              <p>
                You can see the full chapter list on the{" "}
                <Link href="/" className="text-primary hover:underline">
                  home page
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 sm:px-8 py-16 sm:py-20 max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">
            Who built it
          </h2>
          <div className="max-w-2xl text-base text-muted leading-relaxed">
            <p>
              FinoLingo is built by Karam &mdash; an initiative to make
              financial literacy something young people in India actually
              reach for, instead of something they pick up too late. No team,
              no investors, no upsell. Just a project that exists because the
              gap is real.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-8 py-16 sm:py-20 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">
              A note on what this is, and isn&apos;t
            </h2>
            <p className="max-w-2xl text-base text-muted leading-relaxed">
              FinoLingo is for educational purposes only and does not
              constitute financial advice. We are not SEBI-registered
              advisors. Any financial decisions you make are your own
              responsibility. Information may be simplified for learning and
              may not reflect current market conditions.
            </p>
          </div>
        </section>

        <section className="px-6 sm:px-8 py-16 sm:py-20 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-2">
                Ready when you are.
              </h2>
              <p className="text-muted text-base">
                Free, no paywall, no upsell. Sign up and start with Chapter 1.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center bg-primary text-white px-7 py-3.5 rounded-lg font-display font-bold text-base hover:bg-primary/90 transition-colors min-h-[44px] shrink-0"
            >
              Start Chapter 1: What Even is Money?
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 sm:px-8 py-8 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-muted">
          <span className="font-display font-semibold text-dark">
            Fino<span className="text-primary">Lingo</span>
          </span>
          <Link
            href="/about"
            className="hover:text-primary transition-colors"
          >
            About
          </Link>
          <span>© {new Date().getFullYear()} FinoLingo. Built by Karam.</span>
        </div>
      </footer>
    </div>
  );
}
