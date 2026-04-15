import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Coins } from "lucide-react";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 max-w-[1200px] mx-auto w-full">
        <span className="font-display text-2xl font-bold text-dark">
          Fin<span className="text-primary">Lit</span>
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-dark font-medium hover:text-primary transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Coins className="w-4 h-4" />
              <span>Free financial literacy for everyone</span>
            </div>
            <h1 className="font-display text-5xl lg:text-[5rem] font-bold text-dark leading-[1.05] mb-6">
              Learn money.
              <br />
              <span className="text-primary relative">
                For real.
                <span className="absolute -bottom-1 left-0 w-full h-2 bg-accent/30 rounded-full -z-10" />
              </span>
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-10 max-w-md">
              Master personal finance through interactive lessons, immersive
              simulations, and gamified challenges. Built for teenagers, useful
              for everyone.
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/signup"
                className="bg-primary text-white px-10 py-4 rounded-xl font-display font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Start Your Journey
              </Link>
              <span className="text-muted text-sm font-body">
                100% free · No credit card
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-14 pt-8 border-t border-border">
              <div>
                <div className="font-mono text-3xl font-bold text-chapter-0">7</div>
                <div className="text-sm text-muted font-body">Chapters</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-chapter-2">
                  35+
                </div>
                <div className="text-sm text-muted font-body">Lessons</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-chapter-3">7</div>
                <div className="text-sm text-muted font-body">Simulations</div>
              </div>
              <div>
                <div className="font-mono text-3xl font-bold text-accent">
                  27
                </div>
                <div className="text-sm text-muted font-body">Badges</div>
              </div>
            </div>
          </div>

          {/* Right - Chapter preview */}
          <div className="flex-1 max-w-md w-full">
            <div className="bg-surface rounded-2xl shadow-xl shadow-dark/5 p-8 border border-border-light">
              <h3 className="font-display text-xl font-bold text-dark mb-6">
                Your Journey
              </h3>
              {[
                { n: 0, title: "What Even is Money?", color: "#F5A623" },
                { n: 1, title: "The Stock Market", color: "#2ECC71" },
                { n: 2, title: "Investing 101", color: "#4A90D9" },
                { n: 3, title: "Your Money Psychology", color: "#8E44AD" },
                { n: 4, title: "Managing Your Money", color: "#1ABC9C" },
                { n: 5, title: "Credit & Debt", color: "#E74C3C" },
                { n: 6, title: "Fraud Protection", color: "#2980B9" },
              ].map((ch, i) => (
                <div key={ch.n} className="flex items-center gap-4 mb-4 last:mb-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold text-sm shrink-0"
                    style={{ backgroundColor: ch.color }}
                  >
                    {ch.n}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-dark text-sm">
                      {ch.title}
                    </div>
                    <div className="h-1.5 bg-fill-muted rounded-full mt-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: ch.color,
                          width: i === 0 ? "10%" : "0%",
                          opacity: i === 0 ? 1 : 0.3,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-sm text-muted">
        <p>
          Built by Karam · A FinLit Initiative ·{" "}
          <span className="font-display font-semibold text-primary">
            FinLit
          </span>
        </p>
      </footer>
    </div>
  );
}
