import meta from '@ladom/tokens/tokens.json';
import { getDictionary, href, type Locale } from '@/i18n';

export type NavItem = { title: string; href?: string; soon?: boolean };
export type NavSection = { title: string; items: NavItem[] };

// Components from PLAN.md phases 3-5; each gets a page as it is built. Names stay as in Figma.
const PLANNED_COMPONENTS = [
  'Avatar', 'Badge', 'Brand', 'Button', 'Checkbox', 'Chips', 'Hint', 'Input', 'Label', 'Loader', 'Radio', 'Switch',
  'Breadcrumb', 'Cell', 'Date Picker', 'Dropdown', 'Item Selector', 'Popover', 'Segment', 'Selectbox', 'Stepper', 'Tab',
  'Time Picker', 'Tooltip', 'Uploader',
];
const PLANNED_MOLECULES = ['Accordion', 'Alert', 'Navigation', 'Toast'];
// Components that have a page, by their path segment.
const BUILT: Record<string, string> = { Badge: 'badge', Button: 'button', Checkbox: 'checkbox', Hint: 'hint', Input: 'input', Label: 'label', Loader: 'loader', Radio: 'radio', Switch: 'switch' };

export function getNav(lang: Locale): NavSection[] {
  const t = getDictionary(lang);
  return [
    {
      title: t.nav.gettingStarted,
      items: [
        { title: t.nav.introduction, href: href(lang, '/docs/introduction') },
        { title: t.nav.installation, href: href(lang, '/docs/installation') },
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
        BUILT[title] ? { title, href: href(lang, `/docs/components/${BUILT[title]}`) } : { title, soon: true },
      ),
    },
    { title: t.nav.molecules, items: PLANNED_MOLECULES.map((title) => ({ title, soon: true })) },
  ];
}

export const GITHUB_URL = 'https://github.com/haibnu/ladomui';
