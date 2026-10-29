import meta from '@ladom/tokens/tokens.json';
import tiers from '@/registry/tiers.json';
import { getDictionary, href, type Locale } from '@/i18n';

export type NavItem = { title: string; href?: string; soon?: boolean; pro?: boolean };

// Docs path segment -> registry name, where they differ.
const REGISTRY_NAME: Record<string, string> = { chips: 'chip', tab: 'tabs' };
const isPro = (slug: string) => (tiers as Record<string, string>)[REGISTRY_NAME[slug] ?? slug] === 'pro';
export type NavSection = { title: string; items: NavItem[] };

// Components from PLAN.md phases 3-5; each gets a page as it is built. Names stay as in Figma.
const PLANNED_COMPONENTS = [
  'Avatar', 'Badge', 'Brand', 'Button', 'Checkbox', 'Chips', 'Hint', 'Input', 'Label', 'Loader', 'Radio', 'Switch',
  'Alert', 'Breadcrumb', 'Cell', 'Date Picker', 'Dropdown', 'Item Selector', 'Popover', 'Segment', 'Selectbox', 'Stepper', 'Tab',
  'Time Picker', 'Toast', 'Tooltip', 'Uploader',
];
const PLANNED_MOLECULES = ['Accordion', 'Navigation'];
// Components that have a page, by their path segment.
const BUILT: Record<string, string> = { Alert: 'alert', Avatar: 'avatar', Badge: 'badge', Breadcrumb: 'breadcrumb', Button: 'button', Cell: 'cell', Checkbox: 'checkbox', Chips: 'chips', 'Date Picker': 'date-picker', Dropdown: 'dropdown', Hint: 'hint', Input: 'input', 'Item Selector': 'item-selector', Label: 'label', Loader: 'loader', Popover: 'popover', Radio: 'radio', Segment: 'segment', Selectbox: 'selectbox', Stepper: 'stepper', Switch: 'switch', Tab: 'tab', 'Time Picker': 'time-picker', Toast: 'toast', Tooltip: 'tooltip', Uploader: 'uploader' };

const BUILT_MOLECULES: Record<string, string> = { Accordion: 'accordion', Navigation: 'navigation' };

export function getNav(lang: Locale): NavSection[] {
  const t = getDictionary(lang);
  return [
    {
      title: t.nav.gettingStarted,
      items: [
        { title: t.nav.introduction, href: href(lang, '/docs/introduction') },
        { title: t.nav.installation, href: href(lang, '/docs/installation') },
        { title: t.nav.license, href: href(lang, '/docs/license') },
      ],
    },
    {
      title: t.nav.foundations,
      items: [
        ...meta.groups.map((g) => ({ title: t.groups[g.id]?.title ?? g.title, href: href(lang, `/docs/foundations/${g.id}`) })),
        { title: t.nav.icons, href: href(lang, '/docs/foundations/icons') },
      ],
    },
    {
      title: t.nav.components,
      items: PLANNED_COMPONENTS.map((title) =>
        BUILT[title] ? { title, href: href(lang, `/docs/components/${BUILT[title]}`), pro: isPro(BUILT[title]!) } : { title, soon: true },
      ),
    },
    {
      title: t.nav.molecules,
      items: PLANNED_MOLECULES.map((title) =>
        BUILT_MOLECULES[title] ? { title, href: href(lang, `/docs/molecules/${BUILT_MOLECULES[title]}`), pro: isPro(BUILT_MOLECULES[title]!) } : { title, soon: true },
      ),
    },
  ];
}

export const GITHUB_URL = 'https://github.com/haibnu/ladomui';
