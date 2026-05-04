'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Listens to a CSS media query. Returns null on first render (SSR + first
 * client paint) so callers can render a stable default. Returns boolean once
 * the listener has attached.
 *
 * Uses useSyncExternalStore so the initial paint matches SSR (avoids the
 * "setState in effect" cascade lint warning).
 *
 * Common queries:
 *   '(hover: hover)'       → mouse-like input
 *   '(pointer: coarse)'    → touch input
 *   '(min-width: 1024px)'  → desktop+
 */

const getServerSnapshot = (): null => null;

export function useMediaQuery(query: string): boolean | null {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    [query]
  );

  const getSnapshot = useCallback(
    () => (typeof window === 'undefined' ? null : window.matchMedia(query).matches),
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** True when device has a fine pointer (mouse/trackpad). False on touch-only. */
export function useHasHover(): boolean | null {
  return useMediaQuery('(hover: hover)');
}

/** True when viewport is desktop-sized (≥ lg breakpoint). */
export function useIsDesktop(): boolean | null {
  return useMediaQuery('(min-width: 1024px)');
}
