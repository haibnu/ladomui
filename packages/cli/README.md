# ladom-ui

Adds [Ladom UI](https://ui.ladom.co) to your project. The components, tokens and icons are copied
into your code, like shadcn/ui: they are yours to read and change, and nothing from Ladom UI ends
up in your `node_modules`.

```bash
npx ladom-ui init                 # asks for your brand color and font, copies the tokens to components/ladom
npx ladom-ui add button input     # copies components and what they need
npx ladom-ui icons share calendar # copies extra icons for your own code
npx ladom-ui update               # brings installed components up to date
npx ladom-ui diff button          # how your files differ from the latest
npx ladom-ui list                 # every component and its tier
npx ladom-ui skill                # the Claude Code skill, in .claude/skills/ladom-ui
```

`init` asks two questions: your brand color (a hex code) and your font, by its name on
[Google Fonts](https://fonts.google.com) (e.g. Inter, DM Sans). Press Enter to keep the Ladom
defaults (#3c3c3c, Hanken Grotesk). The answers go to `ladom-ui.json` and to
`components/ladom/theme.css`, which loads the tokens and sets the primary colors and the font. Run
`init` again to change them. Without a terminal (CI, scripts, Claude), pass them as flags:

```bash
npx ladom-ui init --brand "#2563eb" --font "DM Sans"
```

Then import `@/components/ladom/theme.css` once, load your font as `--font-brand` on `<html>`
(init prints the next/font lines; with the default font, `--font-hanken-grotesk`), and import
components from `@/components/ladom`.

## Pro components

Pro components need a license key. Pass it in `LADOM_UI_KEY`:

```bash
LADOM_UI_KEY=ldm_pro_… npx ladom-ui add accordion navigation
```

## Updates

The CLI records a hash of every file it writes in `ladom-ui.json`. `update` replaces the files that
still match that hash (you have not changed them) and keeps the ones you changed; `list` marks the
components that have an update. Use `diff <name>` to see your changes against the latest version and
`update <name> --overwrite` to take the latest anyway. Projects set up with 0.1.x have no hashes yet:
run `npx ladom-ui update --overwrite` once (after committing your changes).

## Options

- `init --dir <path>`: where the files go (default `components/ladom`).
- `init --brand <hex> --font <name>`: answer the brand questions up front; `--yes` keeps the defaults.
- `init --overwrite`: rewrite `theme.css` even if you edited it.
- `add --overwrite`: replace files you changed; without it they are kept and listed.
- `LADOM_UI_REGISTRY`: another registry URL (default `https://ui.ladom.co/r`).

Requires Node 20 or later. Guide: https://ui.ladom.co/en/docs/installation

## License

The CLI is MIT. Free components, tokens and icons are MIT; Pro components are under the Ladom UI
Pro License. See https://ui.ladom.co/license.
