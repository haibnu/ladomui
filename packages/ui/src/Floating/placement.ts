// Where a Tooltip or Popover sits next to its anchor. Figma 👉 Position names the beak's side:
// Position=Bottom is placement 'top', Bottom Right is 'top-end', Left Top is 'right-start', etc.
export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';
