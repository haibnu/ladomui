# Claude design system

Builds the files of the Ladom UI design system on claude.ai (an Artifact made from the "Design System" type): `tokens.json` from `packages/tokens/meta/tokens.json`, a live component bundle of `@ladom/ui` (`window.LadomUI`), a README and a preview per component, the brand book and the cover.

```bash
pnpm --filter @ladom/ui exec node ../../scripts/bundle-package.mjs --files   # types for index.d.ts
node -e "import('./scripts/claude-design/components.mjs').then(m=>require('fs').writeFileSync('/tmp/ds/names.json', JSON.stringify(m.COMPONENTS.map(c=>c.name))))"
node scripts/claude-design/bundle.mjs "$PWD" /tmp/ds /tmp/ds/names.json
node scripts/claude-design/gen.mjs "$PWD" /tmp/ds "$(git rev-parse --short HEAD)"
```

`/tmp/ds/project/` then holds the files to publish to the artifact (with Claude Code's Artifact tool). `static/` holds the hand-written files (the brand book, the cover, the asset group READMEs): copy them into `/tmp/ds/project/`. Read the live `design-system.json` from the artifact before publishing a new one. Icons and the logo are uploads: render them with `assets.tsx` (bundle it with esbuild for Node) and upload them to the artifact's asset store.
