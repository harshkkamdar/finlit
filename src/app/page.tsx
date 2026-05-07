import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const chapters = [
  { n: 0, title: "What Even is Money?", desc: "Barter to UPI, and how money actually works in India.", color: "#F5A623", darkText: true },
  { n: 1, title: "The Stock Market", desc: "Sensex, Nifty, and why companies sell tiny pieces of themselves.", color: "#2ECC71", darkText: true },
  { n: 2, title: "Investing 101", desc: "SIPs, mutual funds, and compound interest. Your money making money.", color: "#4A90D9", darkText: false },
  { n: 3, title: "Your Money Psychology", desc: "Why you blow money on sales and how to stop.", color: "#8E44AD", darkText: false },
  { n: 4, title: "Managing Your Money", desc: "Budgeting that doesn't feel like punishment.", color: "#1ABC9C", darkText: true },
  { n: 5, title: "Credit & Debt", desc: "Credit scores, EMIs, and the debt traps nobody warns you about.", color: "#E74C3C", darkText: false },
  { n: 6, title: "Fraud Protection", desc: "Spot scams before they spot you.", color: "#2980B9", darkText: false },
] as const;

const steps = [
  { num: "1", title: "Read a lesson", desc: "Bite-sized cards that explain one concept at a time. No jargon walls." },
  { num: "2", title: "Play a simulation", desc: "Make financial decisions in realistic scenarios. See what happens." },
  { num: "3", title: "Earn XP and badges", desc: "Track your streak, climb the leaderboard, unlock your certificate." },
] as const;

// Structured data: tells Google what this site is, who runs it, and that the
// curriculum is a free educational course aimed at young Indian adults.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "Course",
      name: "FinoLingo: Financial Literacy for Young Adults in India",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      provider: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
      educationalLevel: "Beginner",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Young adults aged 18 to 25 in India",
      },
      about: chapters.map((c) => c.title),
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: "PT5H",
        inLanguage: "en-IN",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        category: "Free",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/signup`,
      },
    },
  ],
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
              Sign up
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

        {/* Mission */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-6">
              Why FinoLingo exists
            </h2>
            <div className="max-w-2xl space-y-4 text-base text-muted leading-relaxed">
              <p>
                Most young Indians never learn money in school. We graduate
                knowing trigonometry but not how a SIP works, what a credit
                score means, or how to spot a UPI scam. Then real life starts,
                and the cost of figuring it out alone is brutal.
              </p>
              <p>
                FinoLingo turns personal finance into something you actually
                want to do. Bite-sized lessons, real-world simulations where
                you make the calls, and gamification that keeps you coming
                back. Seven chapters, from what money even is to how to dodge
                the fraud aimed straight at your generation.
              </p>
              <p>
                It&apos;s free, and stays free. No paywall, no premium tier,
                no upsell to a course later. If you can sign up, you get
                everything.
              </p>
            </div>
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
                    backgroundColor: ch.color,
                    color: ch.darkText ? "#1A1A2E" : "#FFFFFF",
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

        {/* Close: free, signup link, no full-bleed promo */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-2">
                Free, and stays that way.
              </h2>
              <p className="text-muted text-base">
                No paywall, no upsell. Sign up and start with Chapter 1.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center bg-primary text-white px-7 py-3.5 rounded-lg font-display font-bold text-base hover:bg-primary/90 transition-colors min-h-[44px] shrink-0"
            >
              Create an account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
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
