import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";

const chapters = [
  { n: 0, title: "What Even is Money?", desc: "Barter to UPI — how money actually works in India." },
  { n: 1, title: "The Stock Market", desc: "Sensex, Nifty, and why companies sell tiny pieces of themselves." },
  { n: 2, title: "Investing 101", desc: "SIPs, mutual funds, compound interest — your money making money." },
  { n: 3, title: "Your Money Psychology", desc: "Why you blow money on sales and how to stop." },
  { n: 4, title: "Managing Your Money", desc: "Budgeting that doesn't feel like punishment." },
  { n: 5, title: "Credit & Debt", desc: "Credit scores, EMIs, and the debt traps nobody warns you about." },
  { n: 6, title: "Fraud Protection", desc: "Spot scams before they spot you." },
] as const;

const steps = [
  { num: "1", title: "Read a lesson", desc: "Bite-sized cards that explain one concept at a time. No jargon walls." },
  { num: "2", title: "Play a simulation", desc: "Make financial decisions in realistic scenarios. See what happens." },
  { num: "3", title: "Earn XP & badges", desc: "Track your streak, climb the leaderboard, unlock your certificate." },
] as const;

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      {/* Nav */}
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
              Sign up free
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="px-6 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28 max-w-5xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-display font-bold text-dark leading-[1.08] mb-5">
              Learn money.{" "}
              <span className="text-primary">For real.</span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
              Seven chapters. Interactive lessons, real-world simulations, and
              zero jargon. Built for young adults figuring out money in India.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center bg-primary text-white px-8 py-3.5 rounded-lg font-display font-bold text-base hover:bg-primary/90 transition-colors min-h-[44px]"
            >
              Start Chapter 1: What Even is Money?
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 bg-fill-subtle border-t border-b border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-10">
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
              {steps.map((step) => (
                <div key={step.num}>
                  <div className="font-mono text-sm font-bold text-primary mb-2">
                    {step.num}.
                  </div>
                  <h3 className="font-display text-lg font-semibold text-dark mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you'll learn */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-3">
            What you&apos;ll learn
          </h2>
          <p className="text-muted text-base mb-10 max-w-lg">
            Seven chapters from the basics to fraud protection. Each one has
            lessons, exercises, and a simulation where you make the calls.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {chapters.map((ch) => (
              <div
                key={ch.n}
                className="flex items-start gap-4 py-3 border-b border-border last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
              >
                <span
                  className="font-mono text-xs font-bold w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: `var(--color-chapter-${ch.n})`,
                    color: ch.n === 0 || ch.n === 1 || ch.n === 4 ? "#1A1A2E" : "#FFFFFF",
                  }}
                >
                  {ch.n}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-dark text-sm">
                    {ch.title}
                  </div>
                  <div className="text-sm text-muted leading-relaxed mt-0.5">
                    {ch.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 bg-primary">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to start?
            </h2>
            <p className="text-white/80 text-base mb-8 max-w-md mx-auto">
              Takes 30 seconds to sign up. Your first lesson is waiting.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center bg-white text-primary px-8 py-3.5 rounded-lg font-display font-bold text-base hover:bg-white/90 transition-colors min-h-[44px]"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-8 py-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted">
          <span className="font-display font-semibold text-dark">
            Fino<span className="text-primary">Lingo</span>
          </span>
          <span>Built by Karam</span>
        </div>
      </footer>
    </div>
  );
}
