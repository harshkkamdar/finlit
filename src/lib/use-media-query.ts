'use client';

import { useEffect, useState } from 'react';

/**
 * Listens to a CSS media query. Returns null on first render (SSR + first
 * client paint) so callers can render a stable default. Returns boolean once
 * the listener has attached.
 *
 * Common queries:
 *   '(hover: hover)'       → mouse-like input
 *   '(pointer: coarse)'    → touch input
 *   '(min-width: 1024px)'  → desktop+
 */
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True when device has a fine pointer (mouse/trackpad). False on touch-only. */
export function useHasHover(): boolean | null {
  return useMediaQuery('(hover: hover)');
}

/** True when viewport is desktop-sized (≥ lg breakpoint). */
export function useIsDesktop(): boolean | null {
  return useMediaQuery('(min-width: 1024px)');
}
