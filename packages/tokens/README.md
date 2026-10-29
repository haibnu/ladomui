# @ladom/tokens

Design tokens of [Ladom UI](https://ui.ladom.co) as CSS variables, generated from the Ladom UI Figma file.

```bash
npm install @ladom/tokens
```

```ts
import '@ladom/tokens/index.css'; // or one group, e.g. '@ladom/tokens/color.css'
```

Load Hanken Grotesk and expose it as `--font-hanken-grotesk` on `<html>`. Modes go on `<html>` too: `data-theme="dark"`, `data-density="narrow"`, `data-device="mobile|tablet|desktop"`.

Every token is listed at [ui.ladom.co](https://ui.ladom.co/en/docs/foundations/color). MIT licensed.
