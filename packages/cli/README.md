# ladom-ui

Adds [Ladom UI](https://ui.ladom.co) to your project. The components, tokens and icons are copied
into your code, like shadcn/ui: they are yours to read and change, and nothing from Ladom UI ends
up in your `node_modules`.

```bash
npx ladom-ui init                 # writes ladom-ui.json, copies the tokens to components/ladom
npx ladom-ui add button input     # copies components and what they need
npx ladom-ui icons share calendar # copies extra icons for your own code
npx ladom-ui list                 # every component and its tier
npx ladom-ui skill                # the Claude Code skill, in .claude/skills/ladom-ui
```

Then import the tokens once (`import '@/components/ladom/tokens/index.css'`), load Hanken Grotesk
as `--font-hanken-grotesk` on `<html>`, and import components from `@/components/ladom`.

## Pro components

Pro components need a license key. Pass it in `LADOM_UI_KEY`:

```bash
LADOM_UI_KEY=ldm_pro_… npx ladom-ui add toast accordion
```

## Options

- `init --dir <path>`: where the files go (default `components/ladom`).
- `add --overwrite`: replace files you changed; without it they are kept and listed.
- `LADOM_UI_REGISTRY`: another registry URL (default `https://ui.ladom.co/r`).

Requires Node 20 or later. Guide: https://ui.ladom.co/en/docs/installation

## License

The CLI is MIT. Free components, tokens and icons are MIT; Pro components are under the Ladom UI
Pro License. See https://ui.ladom.co/license.
