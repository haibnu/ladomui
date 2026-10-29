# Ladom UI

React design system built from the Figma file "Ladom UI Design System v1.0".

| Package | What it is |
|---|---|
| `packages/tokens` (`@ladom/tokens`) | Design tokens as CSS variables, generated from the Figma export |
| `packages/ui` (`@ladom/ui`) | React components (CSS Modules, no framework dependency) |
| `apps/docs` (`@ladom/docs`) | Next.js documentation and preview site |

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

See [PLAN.md](PLAN.md) for scope and phases.
