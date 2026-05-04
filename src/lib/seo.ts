/**
 * Site-wide SEO constants. Single source of truth for URL, brand strings, and
 * the canonical metadata description. Set NEXT_PUBLIC_SITE_URL in production
 * (e.g. https://finolingo.com) so absolute URLs in OG tags / sitemap / JSON-LD
 * point at the live host instead of the fallback.
 */

const RAW_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://finolingo.com';

export const SITE_URL = RAW_URL.replace(/\/$/, '');
export const SITE_NAME = 'FinoLingo';
export const SITE_TITLE = 'FinoLingo. Learn money. For real.';
export const SITE_TAGLINE = 'Learn money. For real.';
export const SITE_DESCRIPTION =
  'Gamified financial literacy for young Indian adults. Master budgeting, investing, taxes, and personal finance through interactive lessons, simulations, and challenges.';
export const SITE_LOCALE = 'en_IN';
export const SITE_KEYWORDS = [
  'financial literacy India',
  'personal finance for students',
  'learn investing India',
  'budgeting app India',
  'gamified financial education',
  'money management for young adults',
  'SIP and mutual funds basics',
  'credit and debt education',
  'finance learning platform',
  'FinoLingo',
] as const;

/** Build an absolute URL from a relative path. */
export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
