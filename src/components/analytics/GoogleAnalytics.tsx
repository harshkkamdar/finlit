import Script from "next/script";

/**
 * GA4 loader. Renders nothing in environments where NEXT_PUBLIC_GA_ID is unset,
 * so dev and preview deploys stay analytics-free until the measurement ID is
 * explicitly provided. `afterInteractive` (the next/script default) is what
 * Google itself recommends for gtag.js.
 */
export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
