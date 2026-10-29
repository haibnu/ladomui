Ladom UI is the design system of Ladom products: quiet neutral surfaces, one brand gray (`color-primary`, the gray of the Ladom keycap) for the main action and selection, and status colors only where they mean something. Type is Hanken Grotesk throughout. Every value below is a token; components in code are `@ladom/ui` (here `window.LadomUI`), icons `@ladom/icons` (`window.LadomUI.Icons`). The live docs are https://ui.ladom.co.

## Content fundamentals

- Write from the user's side: name things by what people recognize ("Notifications", "Export folder"), never by how they are built.
- Sentence case everywhere: buttons, titles, labels, menu items ("New report", "Change folder"). Capitals only through the caption style (`ui-caption`), for small section labels.
- Buttons say exactly what happens: a verb and an object ("Create project", "Upgrade", "Login to App"). A toast confirms in the past tense ("Changes saved", "Link copied").
- Errors say what is wrong and how to fix it, in the field's hint: "Use at least 8 characters", "Pick a folder". No apologies, no "Oops".
- Address the reader as "you"; the product speaks without "we" where it can ("Your trial ends in 3 days").
- No emoji in UI text. The one exception is a Toast with `Style=Icon`, where an emoji can be the icon.
- Products ship in English and Turkish; keep strings short enough for Turkish, which runs about a fifth longer.

## Visual foundations

### Color
- Pages sit on `color-surface-background`; cards, panels, inputs and dropdowns on `color-surface-level-1`. Step up with `color-surface-level-2` (hover, disabled), `color-surface-level-3` (tracks, neutral chips, pressed) and `color-surface-level-4` (lines and borders).
- Body text is `color-foreground-high-emphasis` on those surfaces; secondary text `color-foreground-medium-emphasis`; placeholders and disabled text `color-foreground-low-emphasis`, never for content that must be read.
- `color-primary` (the brand gray) fills the main action and marks selection; text on it is `color-on-primary`. Its `-soft` step is the selected background of cells, chips and tabs, with `color-primary` text.
- Status colors are `success`, `error`, `warning`, `info`, each with `-soft` (background), `-tint`, `-natural`, `-shade` steps and an `on-` color. Use them for status only: a filled badge, an alert, a hint, a destructive action (`error`). Always pair the color with words.
- Contrast: white `on-` text on the solid `success`, `warning` and `info` fills stays under 4.5:1. Use those fills for icons, badges and short labels, not for paragraphs; on soft backgrounds, write the text in `color-foreground-high-emphasis`.
- Dark theme is opt-in (`data-theme="dark"`) and not final in Figma: primary stays the light brand gray, and some secondary steps carry green leftovers.

### Type
- One family, Hanken Grotesk (`font-family`), loaded from Google Fonts; weights 400, 500 and 700.
- Use the text styles as font shorthands, never single sizes: `font: var(--text-ui-text-regular);`.
- UI text: `ui-text-regular` (14/24) for body and controls, `ui-text-small-regular` (12/16) for secondary text, hints and small controls, `ui-text-bold` for titles inside components, `ui-text-lead-bold` (16/24) for card and accordion titles, `ui-footnote-*` (10/12) for counts and fine print, `ui-caption` (12/16 bold, capitals) for section labels, `ui-page-title` (18/24) for page titles, `ui-title` (32/48) for big headings.
- Content text (articles, marketing): `content-h1…h6`, `content-hero`, `content-paragraphy` in regular, semibold and bold.
- Display sizes shrink on Tablet and Mobile; the shorthands follow the device mode on their own.

### Spacing and layout
- Space steps: `space-atom` 2, `space-micro` 4, `space-tiny` 8, `space-small` 12, `space-medium` 16, `space-large` 20, `space-xlarge` 24, `space-xxlarge` 32. `layout-*` steps are the same scale for layout gaps and shrink in the Narrow density (`data-density="narrow"`).
- Forms: `space-form-gutter` (16) between fields, `space-form-ingroup-gutter` (8) between a field and its hint, `space-form-dropdown-top` (4) between a box and its list.
- Page side padding is `space-container`. Device modes: Mobile below 768px, Tablet below 1280px, Desktop above; `data-device` forces one.

### Shape and depth
- Radius: `radius-form-element` (12) for inputs, buttons and cells; `radius-form-element-small` (8) for small controls; `radius-card` (16) for cards and toasts; `radius-layout-base` (16) for dropdowns and pickers; `radius-full` for pills, chips, badges, avatars and icon buttons.
- Lines are 1px in `color-surface-level-4`, drawn inside the element (as an inset shadow), so sizes stay on the grid.
- Elevation: `shadow-card-style-1` for resting cards and selects, `shadow-card-hover` for raised cards, `shadow-form-level-1` for floating panels (dropdowns, popovers, toasts), `shadow-depth-*` for general depth.
- Focus is a 3px ring: `shadow-focus-primary` (and `shadow-focus-error` on fields in error). Every interactive component shows it on keyboard focus.

### States and motion
- Hover lightens to the next surface step or draws a `color-primary-tint` line on fields; pressed uses the `-shade` or `surface-level-3` step; disabled uses `surface-level-2` with `foreground-low-emphasis` text.
- Motion is short and calm: `motion-fade-default` (250ms ease-in-out) for color and shadow changes, `motion-swipe-y` for things that slide in. Spinners stop under `prefers-reduced-motion`.

## Iconography

- Icons come from `@ladom/icons` only (`window.LadomUI.Icons.IconAdd`): Ladom names mapped to Tabler outline icons (2px stroke, round caps, `currentColor`), plus a few custom fill icons from Figma.
- Default size is 24px; components size their own icons (20 in Medium cells, 16 in buttons and fields, 12 in small controls).
- An icon next to text is decorative (no label). An icon-only button needs an `aria-label`.
- The Icons group below holds the most used icons as SVG files, inked `#1f1f1f`; in code they inherit the text color. The full set of 229 icons is at https://ui.ladom.co/en/docs/foundations/icons.

## Logo

- The Ladom mark is the keycap in `color-static-brand-color` with the white gradient stroke. It appears 24–32px in public headers (`PublicHeader`) and the brand loader. Do not recolor or redraw it.

## Components

Build screens from the components, not from raw elements:
- Actions: `Button` (solid or ghost, seven tones, four sizes).
- Forms: wrap every field in `FormField` (label, hint, error). Fields are `Input`, `Selectbox`, `Checkbox` and `Radio` inside `ChoiceGroup`, `Switch`, `Segment`, `ItemSelector`, `Uploader`, `DatePicker`, `TimePicker`.
- Display: `Badge`, `Chip`, `Avatar`, `Loader`, `Stepper`.
- Lists: `Dropdown` holding `Cell`s.
- Navigation: `AppHeader` with a `PageHeader`; `PublicHeader`; `Tabs`; `Breadcrumb`.
- Overlays: `Tooltip` for short labels, `Popover` for content people use.
- Feedback: `Alert` inline, `Toast` after an action (`ToastProvider` + `useToast`).
- Layout: `Accordion`.

## Not synced

- Motion, border, grid and the text-style shorthands live in `components/bundle.css` (from `@ladom/tokens`), because `tokens.json` has no place for them; Tablet, Mobile and Narrow-density values apply in code, not on this page.
- Hanken Grotesk is a Google font and has no file here; previews load it from Google Fonts.
- Only 29 of the 229 icons are uploaded as files.
- No Ladom UI wordmark file exists in the source; only the keycap mark is included.
