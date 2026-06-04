import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

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

// Q&A is rendered as visible content below AND emitted as FAQPage JSON-LD.
// Google's FAQ-rich-result policy requires the on-page text to match the schema.
const faqs = [
  {
    q: "Is FinoLingo really free?",
    a: "Yes. All seven chapters, every lesson, simulation, daily challenge, and the end-of-course certificate are free. There is no paywall, no premium tier, and no course you have to buy later.",
  },
  {
    q: "Who is FinoLingo for?",
    a: "Young adults aged 18 to 25 in India who never got taught money in school. If you have a UPI app, are about to start your first job, or just want to stop being confused by SIPs and credit scores — this is built for you.",
  },
  {
    q: "What will I actually learn?",
    a: "Seven chapters: what money is, how the stock market works, investing basics (SIPs, mutual funds, compounding), money psychology, budgeting, credit and debt, and how to spot fraud aimed at your generation. All in plain English with India-specific context.",
  },
  {
    q: "How long does it take to finish?",
    a: "About five hours of focused learning across all seven chapters. Most people do it in bite-sized sessions over two to three weeks, fifteen minutes a day.",
  },
  {
    q: "Is FinoLingo giving financial advice?",
    a: "No. FinoLingo is for educational purposes only. We are not SEBI-registered advisors and nothing here is a recommendation to buy, sell, or invest. Decisions you make with your money are yours.",
  },
  {
    q: "Do I need any background in finance to start?",
    a: "Zero background needed. Chapter 0 starts with what money even is — barter, currency, UPI — and every later chapter builds on the previous one. If you can read this sentence, you can start.",
  },
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
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
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

      <SiteHeader active="home" />

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

        {/* FAQ — visible Q&A matched by FAQPage JSON-LD above */}
        <section className="px-6 sm:px-8 py-16 sm:py-20 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-dark mb-3">
              Common questions
            </h2>
            <p className="text-muted text-base mb-10 max-w-lg">
              Short, honest answers. If something is missing, the{" "}
              <Link href="/about" className="text-primary hover:underline">
                About page
              </Link>{" "}
              covers the why.
            </p>
            <dl className="max-w-3xl divide-y divide-border border-y border-border">
              {faqs.map((f) => (
                <div key={f.q} className="py-5 sm:py-6">
                  <dt className="font-display text-base sm:text-lg font-semibold text-dark mb-2">
                    {f.q}
                  </dt>
                  <dd className="text-sm sm:text-base text-muted leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
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

      <SiteFooter />
    </div>
  );
}
