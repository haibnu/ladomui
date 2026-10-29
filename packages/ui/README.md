# @ladom/ui

React components of [Ladom UI](https://ui.ladom.co), built 1:1 from the Ladom UI Figma file. Styling is CSS variables (from `@ladom/tokens`) and CSS Modules; no framework dependency.

```bash
npm install @ladom/ui @ladom/tokens
```

```tsx
import '@ladom/tokens/index.css';
import { Button } from '@ladom/ui';

<Button>Save</Button>;
```

Your bundler needs to handle CSS Modules imported from `node_modules` (Next.js, Vite and most bundlers do). Load Hanken Grotesk as `--font-hanken-grotesk` on `<html>`.

The guide and every component are at [ui.ladom.co](https://ui.ladom.co). MIT licensed.
