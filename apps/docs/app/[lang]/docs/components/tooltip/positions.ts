import type { Placement } from '@ladom/ui';

// Figma 👉 Position names the beak's side, the opposite of the placement.
export const FIGMA_POSITION: Record<Placement, string> = {
  top: 'Bottom',
  'top-start': 'Bottom Left',
  'top-end': 'Bottom Right',
  bottom: 'Top',
  'bottom-start': 'Top Left',
  'bottom-end': 'Top Right',
  left: 'Right',
  'left-start': 'Right Top',
  'left-end': 'Right Bottom',
  right: 'Left',
  'right-start': 'Left Top',
  'right-end': 'Left Bottom',
};
