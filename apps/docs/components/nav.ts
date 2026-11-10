import meta from '@ladom/tokens/tokens.json';
import tiers from '@/registry/tiers.json';
import { getDictionary, href, type Locale } from '@/i18n';

export type NavItem = { title: string; href?: string; soon?: boolean; pro?: boolean; children?: NavItem[] };

// Docs path segment -> registry name, where they differ.
const REGISTRY_NAME: Record<string, string> = { chips: 'chip', tab: 'tabs', drawer: 'modal' };
const isPro = (slug: string) => (tiers as Record<string, string>)[REGISTRY_NAME[slug] ?? slug] === 'pro';
export type NavSection = { title: string; items: NavItem[] };

// Components from PLAN.md phases 3-5; each gets a page as it is built. Names stay as in Figma.
const PLANNED_COMPONENTS = [
  'Avatar', 'Badge', 'Brand', 'Button', 'Checkbox', 'Chips', 'Hint', 'Input', 'Label', 'Loader', 'Radio', 'Switch',
  'Alert', 'Breadcrumb', 'Cell', 'Currency Input', 'Date Picker', 'Drawer', 'Dropdown', 'Empty State', 'GSM Input', 'Item Selector', 'Modal', 'Nav Menu', 'Number Input',
  'Pagination', 'Popover', 'Segment', 'Selectbox', 'Stepper', 'Tab', 'Table', 'Textarea', 'Time Picker', 'Toast', 'Tooltip', 'Uploader',
];
// Separate components that the nav lists under a parent component.
const SUBCOMPONENTS: Record<string, string[]> = { Input: ['Number Input', 'Currency Input', 'GSM Input'] };
const IS_SUBCOMPONENT = new Set(Object.values(SUBCOMPONENTS).flat());
const PLANNED_MOLECULES = ['Accordion', 'File Share', 'Navigation'];
// Components that have a page, by their path segment.
const BUILT: Record<string, string> = { Alert: 'alert', Avatar: 'avatar', Badge: 'badge', Breadcrumb: 'breadcrumb', Button: 'button', Cell: 'cell', Checkbox: 'checkbox', Chips: 'chips', 'Currency Input': 'currency-input', 'Date Picker': 'date-picker', Drawer: 'drawer', Dropdown: 'dropdown', 'Empty State': 'empty-state', 'GSM Input': 'gsm-input', Hint: 'hint', Input: 'input', 'Item Selector': 'item-selector', Label: 'label', Loader: 'loader', Modal: 'modal', 'Nav Menu': 'nav-menu', 'Number Input': 'number-input', Pagination: 'pagination', Popover: 'popover', Radio: 'radio', Segment: 'segment', Selectbox: 'selectbox', Stepper: 'stepper', Switch: 'switch', Tab: 'tab', Table: 'table', Textarea: 'textarea', 'Time Picker': 'time-picker', Toast: 'toast', Tooltip: 'tooltip', Uploader: 'uploader' };

const BUILT_MOLECULES: Record<string, string> = { Accordion: 'accordion', 'File Share': 'file-share', Navigation: 'navigation' };

function component(lang: Locale, title: string): NavItem {
  const slug = BUILT[title];
  return slug ? { title, href: href(lang, `/docs/components/${slug}`), pro: isPro(slug) } : { title, soon: true };
}

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
      items: PLANNED_COMPONENTS.filter((title) => !IS_SUBCOMPONENT.has(title)).map((title) => {
        const item = component(lang, title);
        const children = SUBCOMPONENTS[title]?.map((child) => component(lang, child));
        return children ? { ...item, children } : item;
      }),
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

export type CatalogItem = { title: string; slug: string; href: string; pro: boolean; molecule: boolean };

// The built components and molecules, in nav order, for the landing page.
export function getCatalog(lang: Locale): CatalogItem[] {
  const pick = (names: string[], built: Record<string, string>, molecule: boolean) =>
    names
      .filter((title) => built[title])
      .map((title) => {
        const slug = built[title]!;
        return { title, slug, href: href(lang, `/docs/${molecule ? 'molecules' : 'components'}/${slug}`), pro: isPro(slug), molecule };
      });
  return [...pick(PLANNED_COMPONENTS, BUILT, false), ...pick(PLANNED_MOLECULES, BUILT_MOLECULES, true)];
}
