import { forwardRef, type HTMLAttributes } from 'react';
import styles from './Dropdown.module.css';

// Figma: Components / Dropdown (node 1145:669): the floating panel of Selectbox and menus.
// fullWidth = 🎛 Type=Full Width (cells reach the edges). Type=Slot and Type=State are any
// children. Put Cells, CellHelpers, CellSearch or CellActions in it.
export type DropdownProps = HTMLAttributes<HTMLDivElement> & {
  fullWidth?: boolean;
};

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(function Dropdown({ fullWidth = false, className, ...rest }, ref) {
  return <div ref={ref} className={[styles.dropdown, className].filter(Boolean).join(' ')} data-full-width={fullWidth || undefined} {...rest} />;
});
