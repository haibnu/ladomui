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
```bash
npx ladom-ui init                      # ladom-ui.json + tokens in components/ladom
npx ladom-ui add button input selectbox  # components, the parts they need, their icons
npx ladom-ui list                      # every component, its tier and updates
npx ladom-ui update                    # updates the files you have not changed
```
Pro components (marked Pro on ui.ladom.co) need `LADOM_UI_KEY` set to a license key; never write the key into files. If it is missing, tell the user instead of rebuilding the component.
```tsx
// app/layout.tsx
import { Hanken_Grotesk } from 'next/font/google';
import '@/components/ladom/tokens/index.css';
const font = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken-grotesk' });
// <html className={font.variable}> … <body style={{ background: 'var(--color-surface-background)' }}>
```
Import components and icons from `@/components/ladom` (the folder in `ladom-ui.json`). Before using a component, check it is in that folder; add it with the CLI if not. Toasts need `<ToastProvider>` (a client component) around the app. Modes go on `<html>`: `data-theme="dark"`, `data-density="narrow"`, `data-device="mobile|tablet|desktop"`.

## Components
| Need | Component |
|---|---|
| Actions | `Button` (variant solid/ghost, tone, size, icon, iconLeft/Right, loading) |
| Form fields | `FormField` (label, hint, error) + `Input`, `Textarea` (showCount, maxLength), `NumberInput` (value, min, max, step), `Selectbox`, `Checkbox`, `Radio` in `ChoiceGroup`, `Switch`, `Segment`, `ItemSelector`, `Uploader`, `DatePicker`/`Calendar`, `TimePicker` |
| Labels and status | `Label`, `Hint`, `Badge`, `Chip`, `Avatar`/`AvatarGroup`, `Loader`, `Stepper` |
| Lists and menus | `Dropdown` with `Cell`, `CellHelper`, `CellSearch`, `CellActions` |
| Navigation | `AppHeader` with `PageHeader`, `PublicHeader`, `Tabs`, `Breadcrumb` |
| Overlays | `Tooltip`, `Popover` (placement = where it opens), `Modal` (size), `Drawer` (side); both need `open` and `onClose` |
| Empty and error states | `EmptyState` (size large on pages, medium in tables and cards, small inside components; tone error for failed loads) |
| Data | `Table` (columns, rows, rowKey, sortable columns, selectable), `Pagination` (page, pageCount, onPageChange) |
| Messages | `Alert` (inline), `Toast` via `useToast()` |
| Disclosure | `Accordion` |
| Sharing | `FileShare` (Pro: link with Copy Link, people with access and their role) |

CLI names are kebab-case: `form-field`, `choice-group`, `item-selector`, `date-picker` (DatePicker, Calendar), `time-picker`, `tabs`, `chip`, `avatar` (Avatar, AvatarGroup), `dropdown`, `cell`, `navigation` (AppHeader, PageHeader, PublicHeader), `modal` (Modal, Drawer), `table`, `pagination`. `npx ladom-ui list` shows them all.

Icon props: `Button` takes icon components (`icon={IconAdd}`); other components take elements (`iconLeft={<IconAdd />}`).

## Tokens
- Colors: `--color-primary|secondary|tertiary|success|error|warning|info` with `-soft`, `-tint`, `-shade`, `-natural` and `--color-on-*`; surfaces `--color-surface-background`, `--color-surface-level-1…4`; text `--color-foreground-high|medium|low-emphasis`.
- Space: `--space-atom` 2, `--space-micro` 4, `--space-tiny` 8, `--space-small` 12, `--space-medium` 16, `--space-large` 20, `--space-xlarge` 24, `--space-xxlarge` 32; `--layout-*` for layout gaps; `--space-form-gutter`, `--space-container`.
- Radius: `--radius-form-element`, `--radius-form-element-small`, `--radius-card`, `--radius-layout-base`, `--radius-full`.
- Shadow: `--shadow-card-style-1`, `--shadow-card-hover`, `--shadow-form-level-1`, `--shadow-focus-primary`, `--shadow-depth-*`.
- Text: `--text-ui-title`, `--text-ui-page-title`, `--text-ui-text-regular|bold`, `--text-ui-text-small-regular|bold`, `--text-ui-text-lead-*`, `--text-ui-footnote-*`, `--text-ui-caption`, `--text-content-h1…h6-*`.
The full list is under Foundations on ui.ladom.co.
