# Ladom UI — Plan

Goal: turn the Figma file "Ladom UI Design System v1.0" into a React design system, reused across the Next.js projects. The Figma style is followed 1:1; no new style is invented.

Figma file: https://www.figma.com/design/VCJ6ew9Vk1gAqfnvQ1gfOz/Ladom-UI-Design-System-v1.o--Ready-to-use-
(file key `VCJ6ew9Vk1gAqfnvQ1gfOz`)

## Decisions
- React components, framework-independent. Next.js is used only for the docs/preview app.
- Styling: CSS variables (design tokens) + CSS Modules. No Tailwind.
- Mobile components (Tab Bar, Bottomsheet, NavigationBar, iOS Base Components) are out of scope for now.
- Complex interactive components (Dropdown, Popover, Tooltip, Date Picker...) use Radix UI primitives, styled to match Figma.
- Work starts on the local machine (Claude Code + Figma desktop app), because Figma variable/selection tools and asset export need it.
- Icons: Tabler Icons behind a semantic icon layer. `packages/icons` maps each Ladom icon name to exactly one Tabler icon; components are generated from the `@tabler/icons` SVGs, and only mapped icons can be used.
- Docs: a public documentation website at **ui.ladom.co**, modelled on alignui.com (structure, not branding):
  - Landing page: hero, short pitch, get-started CTA, component showcase.
  - Docs layout: top bar (logo, version, search ⌘K, theme toggle, GitHub), left sidebar (Getting Started, Foundations, Components by category), right "On this page" table of contents.
  - Component page: title and description, Preview / Code tabs with copy, installation, one example per variant, API reference (props table).
  - Foundations pages per token group (colors, typography, spacing, radius, depth, grid, motion) and an icon gallery with search.
  - Built with the design system's own tokens and components; light and dark.

## Figma file map (page: node id)
Tokens: Typography 20:466, Colors 57:17380, Grid 1588:0, z-index 2580:0, Radius 105:246, Spacing 1143:266, Animation 2575:31, Depth 1087:5, Border 2675:8811
Foundation: Assets 2015:17870, Icons 2001:2
Components: Custom Scroll 5989:19353, Avatar 3949:31, Brand 2109:35672, Badge 1394:0, Button 1088:22, Breadcrumb 4746:0, Cell 1144:424, Checkbox 1182:0, Chips 1126:94, Cursor 1313:285, Date Picker 1313:0, Time Picker 6:1380, Dropdown 1145:481, Label 1172:48, Image 1153:28, Input 1133:300, Hint 1086:50, Loader 1780:0, Popover 4201:12499, Radio 1343:0, Switch 1125:0, Segment 1229:1723, Selectbox 1163:0, State 2585:0, Stepper 2495:1790, Uploader 4046:12820, Tab 1334:0, Item Selector 4929:0, Tooltip 1197:1026
Molecules: Alert 2109:14790, Accordion 2119:50032, Navigation 2196:16006, Toast 2110:36961

## Target structure
```
ladomui/
├── packages/
│   ├── tokens/   # Figma tokens -> CSS variables + TS
│   ├── icons/    # Semantic icon names -> Tabler icons, React components
│   └── ui/       # React components
├── apps/
│   └── docs/     # Next.js documentation website (ui.ladom.co)
├── CLAUDE.md
└── PLAN.md
```
pnpm workspace, TypeScript.

## Phases
1. Scaffold: pnpm workspace, TypeScript, Next.js docs app, CLAUDE.md, README.
2. Tokens: Colors, Typography, Spacing, Radius, Border, Depth, Animation, z-index, Grid. Token page in docs.
3. Icons and docs site shell: `packages/icons` (Figma icon names mapped to Tabler), then the docs website layout (landing, sidebar, search, theme toggle, foundations pages, icon gallery) so every component lands as a page.
   Basic components: Button, Input, Label, Hint, Checkbox, Radio, Switch, Badge, Chips, Avatar, Loader, each with its docs page.
4. Complex components: Dropdown, Selectbox, Tab, Segment, Tooltip, Popover, Date/Time Picker, Stepper, Uploader, Breadcrumb, Cell, Item Selector.
5. Molecules: Alert, Toast, Accordion, Navigation.
6. Integration: install guide for another Next.js project, add to Claude Design, deploy the docs to ui.ladom.co.

Each component is checked against a Figma screenshot before commit. Small commits.

## Open
- Brand logos (Brands / *) and flags on the Icons page are not Tabler icons; where they live (icons package or assets) is undecided.
- Hosting for ui.ladom.co (e.g. Vercel) and DNS for the subdomain.
