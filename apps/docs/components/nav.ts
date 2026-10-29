import meta from '@ladom/tokens/tokens.json';

export type NavItem = { title: string; href?: string; soon?: boolean };
export type NavSection = { title: string; items: NavItem[] };

// Components from PLAN.md phases 3-5; each gets a page as it is built.
const PLANNED_COMPONENTS = [
  'Avatar', 'Badge', 'Brand', 'Button', 'Checkbox', 'Chips', 'Hint', 'Input', 'Label', 'Loader', 'Radio', 'Switch',
  'Breadcrumb', 'Cell', 'Date Picker', 'Dropdown', 'Item Selector', 'Popover', 'Segment', 'Selectbox', 'Stepper', 'Tab',
  'Time Picker', 'Tooltip', 'Uploader',
];
const PLANNED_MOLECULES = ['Accordion', 'Alert', 'Navigation', 'Toast'];

export const foundations = meta.groups.map((g) => ({ id: g.id, title: g.title, href: `/docs/foundations/${g.id}` }));

export const nav: NavSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs/introduction' },
      { title: 'Installation', href: '/docs/installation' },
    ],
  },
  {
    title: 'Foundations',
    items: [...foundations, { title: 'Icons', href: '/docs/foundations/icons' }],
  },
  { title: 'Components', items: PLANNED_COMPONENTS.map((title) => ({ title, soon: true })) },
  { title: 'Molecules', items: PLANNED_MOLECULES.map((title) => ({ title, soon: true })) },
];

export const GITHUB_URL = 'https://github.com/haibnu/ladomui';
