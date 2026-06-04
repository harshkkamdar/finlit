import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: `${SITE_NAME} is a free, gamified financial literacy platform built for young adults in India. Learn how money actually works, with seven chapters of interactive lessons and real-world simulations.`,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${SITE_NAME}`,
    description: `Why ${SITE_NAME} exists, what we built, and who built it.`,
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#aboutpage`,
      url: `${SITE_URL}/about`,
      name: `About ${SITE_NAME}`,
      description: `Why ${SITE_NAME} exists, what we built, and who built it.`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon` },
      areaServed: { "@type": "Country", name: "India" },
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Young adults aged 18 to 25 in India",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
      />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>

      <SiteHeader active="about" />

      <main
        id="main-content"
        className="flex-1 px-6 sm:px-8 py-16 sm:py-20 max-w-3xl mx-auto w-full"
      >
        <header className="mb-14 sm:mb-16">
          <p className="font-mono text-xs text-muted mb-4">About</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark leading-[1.15] mb-5">
            A free, gamified way for young Indians to learn money — from what
            it even is, to how to dodge the scams aimed at you.
          </h1>
        </header>

        <section className="mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-dark mb-4">
            Why this exists
          </h2>
          <div className="space-y-4 text-base text-dark/80 leading-relaxed">
            <p>
              India teaches its kids a lot of things. Personal finance is not
              one of them. Most young adults leave school without a clue how
              SIPs work, what a credit score actually does, why their first
              salary disappears so fast, or how to tell a real UPI request from
              a fraud one.
            </p>
            <p>
              Then real life starts — rent, taxes, EMIs, side hustles, parents
              asking about investments, all at once. The default options are
              stiff textbooks, finance influencers selling a course, or
              learning the hard way after losing money. There should be a
              better one.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-dark mb-4">
            What it is
          </h2>
          <div className="space-y-4 text-base text-dark/80 leading-relaxed">
            <p>
              Seven chapters in plain English, built around how money actually
              shows up in your life in India. Each chapter has bite-sized
              lessons, scored exercises, and a branching simulation where you
              make real-feeling decisions and see the consequences.
            </p>
            <p>
              XP, streaks, badges, a downloadable certificate at the end. The
              gamification isn&rsquo;t the point — it&rsquo;s there to keep you
              showing up long enough for the lessons to stick.
            </p>
            <p>
              Free. No paywall, no premium tier, no upsell to a course later.
              Built by Karam, as one person trying to close a gap that&rsquo;s
              real.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-dark mb-4">
            What it isn&rsquo;t
          </h2>
          <p className="text-base text-dark/80 leading-relaxed">
            Educational use only. Not financial advice. We&rsquo;re not
            SEBI-registered advisors and nothing here is a recommendation to
            buy, sell, or invest. Information is simplified for learning and
            may not match current market conditions. Decisions you make with
            your money are yours.
          </p>
        </section>

        <p className="mt-14 text-sm text-muted">
          See the full chapter list on the{" "}
          <Link href="/" className="text-primary hover:underline">
            home page
          </Link>
          , or{" "}
          <Link href="/signup" className="text-primary hover:underline">
            create an account
          </Link>{" "}
          to start.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
