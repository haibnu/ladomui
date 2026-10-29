# Ladom UI

React design system built from the Figma file "Ladom UI Design System v1.0".

| Package | What it is |
|---|---|
| `packages/tokens` (`@ladom/tokens`) | Design tokens as CSS variables, generated from the Figma export |
| `packages/icons` (`@ladom/icons`) | Icon components: semantic names mapped to Tabler icons, plus custom icons from Figma |
| `packages/ui` (`@ladom/ui`) | React components (CSS Modules, no framework dependency) |
| `apps/docs` (`@ladom/docs`) | Next.js documentation site for ui.ladom.co, in English (`/en`) and Turkish (`/tr`) |

## Using Ladom UI in an app

Apps get Ladom UI with the `ladom-ui` CLI (`packages/cli`), which copies the tokens, components and icons into the app, shadcn/ui style. The workspace packages stay private.

```bash
npx ladom-ui init
npx ladom-ui add button input
```

The guide is at https://ui.ladom.co/en/docs/installation. `npx ladom-ui skill` adds the Claude Code skill (`skills/ladom-ui`) to a project.

## Getting started

Requires Node 20.9+ and pnpm 10.

```bash
pnpm install
pnpm dev
```

## Using the tokens in an app

```ts
import '@ladom/tokens/index.css'; // or a single group, e.g. '@ladom/tokens/color.css'
```

Groups: `color`, `typography`, `space`, `radius`, `size`, `grid`, `border`, `shadow`, `motion`. The docs app lists every token at `/tokens`.

Load Hanken Grotesk and expose it as `--font-hanken-grotesk` on `<html>` (with `next/font`, set `variable: '--font-hanken-grotesk'` and put the class on `<html>`). Text styles are used as `font: var(--text-ui-title);`.

Modes, all set on `<html>`:

- Device: Mobile below 768px, Tablet below 1280px, Desktop otherwise. `data-device="mobile|tablet|desktop"` forces one.
- Theme: Light by default, `data-theme="dark"` for Dark (opt-in; the Figma Dark mode is not final).
- Density: Comfort by default, `data-density="narrow"` for Narrow.

## Using the icons

```tsx
import { IconPhone } from '@ladom/icons';

<IconPhone size={20} />; // decorative by default
<IconPhone title="Call" />; // accessible name
```

Icons take the current text color. The docs app lists every icon at `/icons`.

## Registry and releasing

- `scripts/registry/build.mjs` builds the registry from `packages/ui/src`, `packages/tokens/css` and `packages/icons/src`; `scripts/registry/items.json` lists the components and their tier (free or Pro). The docs app serves it at https://ui.ladom.co/r and runs the build before `dev` and `build`.
- Pro items need a license key. `node scripts/registry/new-key.mjs <label>` makes one; add its digest to `LADOM_UI_PRO_KEYS` (comma-separated) on Vercel and redeploy. Remove a digest to revoke the key.
- The CLI is published from `packages/cli` with `npm publish` (bump its version first).
- The docs deploy to https://ui.ladom.co on Vercel on every push to `main`.

Free components, tokens, icons and the CLI are MIT; Pro components are under the Ladom UI Pro License. See [LICENSE.md](LICENSE.md) and [LICENSE-PRO.md](LICENSE-PRO.md).

See [PLAN.md](PLAN.md) for scope and phases.
