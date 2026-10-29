# ladom-ui

Adds [Ladom UI](https://ui.ladom.co) to your project. The components, tokens and icons are copied
into your code, like shadcn/ui: they are yours to read and change, and nothing from Ladom UI ends
up in your `node_modules`.

```bash
npx ladom-ui init                 # writes ladom-ui.json, copies the tokens to components/ladom
npx ladom-ui add button input     # copies components and what they need
npx ladom-ui icons share calendar # copies extra icons for your own code
npx ladom-ui update               # brings installed components up to date
npx ladom-ui diff button          # how your files differ from the latest
npx ladom-ui list                 # every component and its tier
npx ladom-ui skill                # the Claude Code skill, in .claude/skills/ladom-ui
```

Then import the tokens once (`import '@/components/ladom/tokens/index.css'`), load Hanken Grotesk
as `--font-hanken-grotesk` on `<html>`, and import components from `@/components/ladom`.

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
- `add --overwrite`: replace files you changed; without it they are kept and listed.
- `LADOM_UI_REGISTRY`: another registry URL (default `https://ui.ladom.co/r`).

Requires Node 20 or later. Guide: https://ui.ladom.co/en/docs/installation

## License

The CLI is MIT. Free components, tokens and icons are MIT; Pro components are under the Ladom UI
Pro License. See https://ui.ladom.co/license.
