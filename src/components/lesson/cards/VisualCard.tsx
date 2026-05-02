'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { ImageIcon } from 'lucide-react';
import {
  MoneyTimelineSVG,
  SamosaPriceChart,
  BankDepositFlowSVG,
  InterestSpreadSVG,
  InflationThiefSVG,
  RBIFunctionsSVG,
} from '@/components/illustrations';

// ── Types ─────────────────────────────────────────────────────────────────────

interface VisualCardProps {
  src?: string;
  alt: string;
  caption?: string;
  description?: string;
  chapterColor: string;
}

interface IllustrationMatch {
  component: ComponentType<{ color: string; className?: string }>;
  match: (alt: string, src?: string) => boolean;
}

// ── Illustration Registry ─────────────────────────────────────────────────────
// Each entry maps a content image block to a code-generated SVG component.
// Matching is done by alt text keywords or src filename.

const illustrationRegistry: IllustrationMatch[] = [
  {
    component: MoneyTimelineSVG,
    match: (alt, src) =>
      alt.includes('evolution of money') ||
      (alt.includes('timeline') && alt.includes('barter')) ||
      !!src?.includes('money-timeline'),
  },
  {
    component: SamosaPriceChart,
    match: (alt, src) =>
      (alt.includes('samosa') && alt.includes('price')) ||
      !!src?.includes('samosa-inflation'),
  },
  {
    component: BankDepositFlowSVG,
    match: (alt, src) =>
      (alt.includes('deposited') && alt.includes('bank')) ||
      (alt.includes('deposit') && (alt.includes('crr') || alt.includes('loan'))) ||
      !!src?.includes('deposit-breakdown'),
  },
  {
    component: InterestSpreadSVG,
    match: (alt, src) =>
      (alt.includes('interest') && alt.includes('spread')) ||
      (alt.includes('earns') && alt.includes('loans') && alt.includes('deposits')) ||
      !!src?.includes('nim-diagram'),
  },
  {
    component: InflationThiefSVG,
    match: (alt, src) =>
      (alt.includes('inflation') && alt.includes('purchasing power')) ||
      (alt.includes('₹100') && alt.includes('buys')) ||
      !!src?.includes('inflation-thief'),
  },
  {
    component: RBIFunctionsSVG,
    match: (alt, src) =>
      (alt.includes('rbi') && alt.includes('function')) ||
      (alt.includes('currency') && alt.includes('regulation')) ||
      !!src?.includes('rbi-functions'),
  },
];

// ── Image-based Illustration Registry ─────────────────────────────────────────
// Maps content alt text / src to actual PNG illustrations in /public/

interface ImageIllustrationMatch {
  src: string;
  match: (alt: string, dataSrc?: string) => boolean;
}

const imageIllustrationRegistry: ImageIllustrationMatch[] = [
  {
    src: '/illustrations/ch0/farmer-rice.png',
    match: (alt) => alt.includes('farmer') && (alt.includes('rice') || alt.includes('sack')),
  },
  {
    src: '/illustrations/ch0/cobbler.png',
    match: (alt) => alt.includes('cobbler') || alt.includes('shoemaker'),
  },
  {
    src: '/illustrations/ch0/cowrie-shells.png',
    match: (alt) => alt.includes('cowrie') || (alt.includes('shell') && alt.includes('currency')),
  },
  {
    src: '/illustrations/ch0/ancient-coins.png',
    match: (alt) => alt.includes('ancient') && alt.includes('coin'),
  },
  {
    src: '/illustrations/ch0/banknotes.png',
    match: (alt) =>
      (alt.includes('banknote') || alt.includes('bank note')) &&
      !alt.includes('deposit'),
  },
  {
    src: '/illustrations/ch0/samosa-inflation.png',
    match: (alt, dataSrc) =>
      (alt.includes('samosa') && alt.includes('inflation')) ||
      !!dataSrc?.includes('samosa-inflation-illustration'),
  },
  {
    src: '/illustrations/ch0/bank-vault.png',
    match: (alt) => alt.includes('bank') && alt.includes('vault'),
  },
  {
    src: '/illustrations/ch0/rbi-building.png',
    match: (alt) => alt.includes('rbi') && alt.includes('building'),
  },
];

function findImageIllustration(alt: string, src?: string): string | null {
  const normalizedAlt = alt.toLowerCase();
  const match = imageIllustrationRegistry.find((entry) => entry.match(normalizedAlt, src));
  return match?.src ?? null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function findIllustration(alt: string, src?: string): IllustrationMatch | null {
  const normalizedAlt = alt.toLowerCase();
  return illustrationRegistry.find((entry) => entry.match(normalizedAlt, src)) ?? null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VisualCard({
  src,
  alt,
  caption,
  description,
  chapterColor,
}: VisualCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload direct-path images
  useEffect(() => {
    if (src && src.startsWith('/')) {
      setImageLoaded(false);
      let cancelled = false;
      const img = new window.Image();
      img.onload = () => { if (!cancelled) setImageLoaded(true); };
      img.onerror = () => { if (!cancelled) setImageError(true); };
      img.src = src;
      return () => { cancelled = true; };
    }
  }, [src]);

  // 1. Direct path resolution — if src starts with '/', use it as-is
  if (src && src.startsWith('/') && !imageError) {
    return (
      <div className="lesson-card !p-0 overflow-hidden">
        <div className="h-[2px]" style={{ backgroundColor: chapterColor }} />
        <div
          className="flex items-center justify-center px-6 py-8 min-h-[160px] lg:min-h-[200px]"
          style={{ backgroundColor: `${hexToRgba(chapterColor, 0.04)}` }}
        >
          {!imageLoaded ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full skeleton"
                style={{ backgroundColor: hexToRgba(chapterColor, 0.1) }}
              />
              <div className="h-3 w-32 rounded skeleton" style={{ backgroundColor: hexToRgba(chapterColor, 0.08) }} />
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              className="max-h-[220px] sm:max-h-[280px] lg:max-h-[340px] w-auto object-contain drop-shadow-sm"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>
    );
  }

  // 2. Check if we have a code-generated SVG illustration
  const illustration = findIllustration(alt, src);

  if (illustration) {
    const IllustrationComponent = illustration.component;
    return (
      <div className="lesson-card !p-0 overflow-hidden">
        <div className="h-[2px]" style={{ backgroundColor: chapterColor }} />
        <div className="px-3 py-3">
          <IllustrationComponent color={chapterColor} />
        </div>
      </div>
    );
  }

  // 3. Check legacy image registry (for backward compat with ch0 alt-text matching)
  const imageSrc = findImageIllustration(alt, src);

  if (imageSrc) {
    return (
      <div className="lesson-card !p-0 overflow-hidden">
        <div className="h-[2px]" style={{ backgroundColor: chapterColor }} />
        <div className="flex items-center justify-center px-6 py-6">
          <img
            src={imageSrc}
            alt={alt}
            className="max-h-[220px] sm:max-h-[280px] lg:max-h-[320px] w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  const showPlaceholder = !src || imageError;

  if (showPlaceholder) {
    return (
      <div className="lesson-card !p-0 overflow-hidden">
        <div className="h-1" style={{ backgroundColor: chapterColor }} />

        <div
          className="flex flex-col items-center justify-center gap-3 p-8 min-h-[160px] lg:min-h-[200px] relative overflow-hidden"
          style={{ backgroundColor: '#F9FAFB' }}
        >
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                ${chapterColor},
                ${chapterColor} 1px,
                transparent 1px,
                transparent 12px
              )`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-3 px-8">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: hexToRgba(chapterColor, 0.12) }}
            >
              <ImageIcon className="w-6 h-6" style={{ color: chapterColor }} />
            </div>

            {alt && (
              <p className="font-display text-dark font-semibold text-center text-sm">
                {alt}
              </p>
            )}

            {description && (
              <p className="text-muted font-body text-xs text-center max-w-md leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* No captions — illustrations speak for themselves */}
      </div>
    );
  }

  return (
    <div className="lesson-card p-0 overflow-hidden">
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className="w-full max-h-[260px] sm:max-h-[320px] lg:max-h-[400px] object-cover"
          onError={() => setImageError(true)}
        />
      </div>

      {caption && (
        <div className="px-6 py-3 border-t border-border-light">
          <p className="text-center text-muted text-sm font-body">{caption}</p>
        </div>
      )}
    </div>
  );
}
