# Ladom UI

React design system built from the Figma file "Ladom UI Design System v1.0" (file key `VCJ6ew9Vk1gAqfnvQ1gfOz`). See PLAN.md for scope, decisions and phases.

## Rules
- Follow the Figma file exactly. Do not invent styles, colors or spacing.
- Colors, spacing, radius, typography and other visual values come from design tokens (CSS variables), never hard-coded in components.
- Styling is CSS variables + CSS Modules. No Tailwind.
- Components are plain React and must not depend on Next.js APIs. Next.js is only used by apps/docs.
- Mobile components are out of scope for now.
- Before committing a component, compare it with the Figma screenshot of its page (node ids are listed in PLAN.md).
- Keep commits small; one component or token group per commit.
