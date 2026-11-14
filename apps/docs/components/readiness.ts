// Whether each component and molecule page is drawn in the Ladom UI Figma file and built in code.
// A page exists only for built components, so code is ready unless listed in CODE_NOT_READY.
// Components built from existing parts before a Figma drawing go in FIGMA_NOT_READY; take them out
// once they are drawn.
export const FIGMA_NOT_READY = new Set(['bottom-nav', 'text-motion', 'color-input', 'otp-input', 'currency-input', 'nav-menu', 'app-sidebar', 'scroll-area', 'app-shell', 'agenda', 'bar-chart', 'bar-list', 'card', 'data-toolbar', 'delta', 'donut-chart', 'funnel-chart', 'chart-legend', 'person-cell', 'stat-card', 'wizard-modal']);
export const CODE_NOT_READY = new Set<string>();

export type Readiness = { figma: boolean; code: boolean };

/** The readiness of a docs path (/en/docs/components/<slug>), or null for other pages. */
export function readinessOf(pathname: string): Readiness | null {
  const m = pathname.match(/\/docs\/(?:components|pro)\/([^/]+)/);
  if (!m) return null;
  const slug = m[1]!;
  return { figma: !FIGMA_NOT_READY.has(slug), code: !CODE_NOT_READY.has(slug) };
}
