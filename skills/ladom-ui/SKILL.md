---
name: ladom-ui
description: Build Ladom product screens with the Ladom UI design system, copied into the app with the ladom-ui CLI. Use when creating or changing React/Next.js UI in a Ladom project, picking components, styling with design tokens, or adding icons, so the result matches the Ladom UI Figma file.
---

# Ladom UI

Ladom UI is the design system of Ladom products, built 1:1 from the Figma file "Ladom UI Design System v1.0". Docs, playgrounds and every prop: https://ui.ladom.co (English `/en`, Turkish `/tr`).

## Rules
- Use a Ladom UI component whenever one fits; do not rebuild buttons, inputs, selects, tabs, toasts etc. by hand.
- Every visual value comes from a token (CSS variable). Never hard-code colors, spacing, radii, shadows or font sizes.
- Text styles are font shorthands: `font: var(--text-ui-text-regular);`.
- Icons come only from the Ladom UI icons folder (`import { IconAdd } from '@/components/ladom'`). Do not import Tabler or other icon sets; copy a missing icon with `npx ladom-ui icons <name>`.
- The copied files are the app's code, but keep them as Ladom UI ships them; do not restyle a component in place. Keep the license line at the top of each file.
- Keep accessibility the components provide: give icon-only buttons an `aria-label`, wrap fields in `FormField`, name groups (`Segment`, `Tabs`, `Stepper`) with `aria-label`.

## Setup (once per app)
Before running `init`, ask the user two questions and wait for the answers:
1. "What is your brand color?" (a hex code such as #2563eb)
2. "What is your font? It must be on Google Fonts: find it at https://fonts.google.com and tell me its name." (e.g. Inter, DM Sans)

If they have none, keep the Ladom defaults (#3c3c3c, Hanken Grotesk). `init` cannot ask questions when Claude runs it, so pass the answers as flags; it checks the font name against Google Fonts.
```bash
npx ladom-ui init --brand "#2563eb" --font "DM Sans"   # ladom-ui.json, tokens and theme.css in components/ladom
npx ladom-ui init --yes                                 # the Ladom defaults
npx ladom-ui add button input selectbox  # components, the parts they need, their icons
npx ladom-ui list                      # every component, its tier and updates
npx ladom-ui update                    # updates the files you have not changed
```
Pro components (marked Pro on ui.ladom.co) need `LADOM_UI_KEY` set to a license key; never write the key into files. If it is missing, tell the user instead of rebuilding the component.
```tsx
// app/layout.tsx (init prints these lines for the chosen font)
import { DM_Sans } from 'next/font/google';
import '@/components/ladom/theme.css'; // loads the tokens, then the brand color and font
const font = DM_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-brand' });
// With the default font: Hanken_Grotesk({ …, variable: '--font-hanken-grotesk' })
// <html className={font.variable}> … <body style={{ background: 'var(--color-surface-background)' }}>
```
To change the brand later, run `init` again with new flags; never hard-code the brand color in components, use `--color-primary*`.
Import components and icons from `@/components/ladom` (the folder in `ladom-ui.json`). Before using a component, check it is in that folder; add it with the CLI if not. Toasts need `<ToastProvider>` (a client component) around the app. Modes go on `<html>`: `data-theme="dark"`, `data-density="narrow"`, `data-device="mobile|tablet|desktop"`.

## Components
| Need | Component |
|---|---|
| Actions | `Button` (variant solid/ghost, tone, size, icon, iconLeft/Right, loading) |
| Form fields | `FormField` (label, hint, error) + `Input`, `Textarea` (showCount, maxLength), `NumberInput` (value, min, max, step), `CurrencyInput` (value, currency, currencies, locale, currencySelect), `GsmInput` (E.164 value, country, countries (every country by default), countrySelect; pasted +90/0 are dropped), `ColorInput` ("#rrggbb" value, presets; `normalizeHex` parses 3/6-digit codes), `OtpInput` (length, groups, mask, onComplete; one box per character, paste/SMS autofill fill all), `Selectbox`, `Checkbox`, `Radio` in `ChoiceGroup`, `Switch`, `Segment`, `ItemSelector`, `Uploader`, `DatePicker`/`Calendar`, `TimePicker` |
| Labels and status | `Label`, `Hint`, `Badge`, `Chip`, `Avatar`/`AvatarGroup`, `Loader`, `Stepper` |
| Lists and menus | `Dropdown` with `Cell`, `CellHelper`, `CellSearch`, `CellActions` |
| Scrolling | `ScrollArea` (orientation vertical/horizontal/both, scrollbars auto/always, viewportRef, viewportProps): any box that scrolls; give it a size or max size. Dropdown, TimePicker, Modal/Drawer body, Table and SidebarNav already use it |
| Navigation | `SidebarNav` (`SidebarNavSection`, `SidebarNavItem`) and `TopNav` (`TopNavItem`): simple free menus of links (`href`, `as`, `icon`, `badge`, `current`); `AppSidebar` (`AppSidebarSection`, `AppSidebarItem`; Pro): a side menu that collapses to a rail of icons and holds nested groups (`collapsed`, `onCollapsedChange`, nested items, `defaultOpen`); `AppHeader` with `PageHeader`, `PublicHeader` (Pro), `Tabs`, `Breadcrumb` |
| Overlays | `Tooltip`, `Popover` (placement = where it opens), `Modal` (size), `Drawer` (side); both need `open` and `onClose` |
| Empty and error states | `EmptyState` (size large on pages, medium in tables and cards, small inside components; tone error for failed loads) |
| Data | `Table` (columns, rows, rowKey, sortable columns, selectable), `Pagination` (page, pageCount, onPageChange) |
| Messages | `Alert` (inline), `Toast` via `useToast()` |
| Disclosure | `Accordion` |
| Admin screens (Pro) | `AppShell` (sidebar, headerStart/Center/End, offsetTop; the side menu moves to a Drawer on phones), `Card` (title, description, actions, footer, titleStyle default/caption), `Delta` (value, direction, tone, variant pill/plain: a change with a trend arrow), `BarChart` (title, categories, series, mode grouped/stacked, format: bar charts in the chart colors), `DonutChart` (title, data, size, label, sublabel, caption: a ring of parts), `ChartLegend` (items with name, values, delta; columns), `FunnelChart` (title, stages with name, value, delta, caption: a stepped funnel), `StatCard` (label, value, unit, delta, data + chart for a small chart, layout), `PersonCell` (name, subtitle, onClick: Avatar + name in tables), `BarList` (items `{ label, value }`, max) and `Meter` (value, max), `DataToolbar` (search, filters, actions, selectedCount, bulkActions: above a Table), `WizardModal` (steps, step, onStepChange, finishStep, onFinish, busy: a task in steps) |
| Sharing | `FileShare` (Pro: link with Copy Link, people with access and their role) |

CLI names are kebab-case: `form-field`, `choice-group`, `item-selector`, `date-picker` (DatePicker, Calendar), `time-picker`, `tabs`, `chip`, `avatar` (Avatar, AvatarGroup), `dropdown`, `cell`, `navigation` (AppHeader, PageHeader, PublicHeader), `nav-menu` (SidebarNav, TopNav), `app-sidebar` (AppSidebar; Pro), `app-shell`, `card`, `stat-card`, `person-cell`, `bar-list` (BarList, Meter), `bar-chart`, `chart-legend`, `delta`, `donut-chart`, `funnel-chart`, `data-toolbar`, `wizard-modal` (Pro), `modal` (Modal, Drawer), `table`, `pagination`, `scroll-area`. `npx ladom-ui list` shows them all.

Icon props: `Button` takes icon components (`icon={IconAdd}`); other components take elements (`iconLeft={<IconAdd />}`).

## Tokens
- Colors: `--color-primary|secondary|tertiary|success|error|warning|info` with `-soft`, `-tint`, `-shade`, `-natural` and `--color-on-*`. The brand color as text or an icon on a surface is `--color-primary-foreground`, as a line (border, indicator) `--color-primary-line`; `--color-primary` is for fills. These two stay readable when the brand color is light; surfaces `--color-surface-background`, `--color-surface-level-1…4`; text `--color-foreground-high|medium|low-emphasis`.
- Space: `--space-atom` 2, `--space-micro` 4, `--space-tiny` 8, `--space-small` 12, `--space-medium` 16, `--space-large` 20, `--space-xlarge` 24, `--space-xxlarge` 32; `--layout-*` for layout gaps; `--space-form-gutter`, `--space-container`.
- Radius: `--radius-form-element`, `--radius-form-element-small`, `--radius-card`, `--radius-layout-base`, `--radius-full`.
- Shadow: `--shadow-card-style-1`, `--shadow-card-hover`, `--shadow-form-level-1`, `--shadow-focus-primary`, `--shadow-depth-*`.
- Text: `--text-ui-title`, `--text-ui-page-title`, `--text-ui-text-regular|bold`, `--text-ui-text-small-regular|bold`, `--text-ui-text-lead-*`, `--text-ui-footnote-*`, `--text-ui-caption`, `--text-content-h1…h6-*`.
The full list is under Foundations on ui.ladom.co.
