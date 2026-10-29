'use client';

import { cloneElement, isValidElement, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import floating from '../Floating/floating.module.css';
import type { Placement } from '../Floating/placement';
import styles from './Tooltip.module.css';

// Figma: Components / Tooltip (node 1199:126). placement = 👉 Position (the beak's side, so
// Position=Bottom is placement 'top'), beak = 🤥 Beak; 🎛 Type=HTML is rich content.
// Shows on hover and keyboard focus of its child, hides on leave, blur and Escape.
export type TooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'content'> & {
  /** The tooltip text or content. */
  content: ReactNode;
  /** The element it describes; it gets aria-describedby. */
  children: ReactElement;
  placement?: Placement;
  beak?: boolean;
  /** Keeps it open (docs, onboarding). */
  open?: boolean;
  /** Delay before showing, in ms. */
  delay?: number;
};

export function Tooltip({ content, children, placement = 'top', beak = true, open: forced, delay = 300, className, ...rest }: TooltipProps) {
  const id = useId();
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const open = forced ?? shown;
  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setShown(false);
  };

  const child = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, { 'aria-describedby': [children.props['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined })
    : children;

  return (
    <span
      className={floating.anchor}
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => e.key === 'Escape' && hide()}
    >
      {child}
      {open && (
        <span id={id} role="tooltip" className={[floating.floating, styles.tooltip, className].filter(Boolean).join(' ')} data-placement={placement} {...rest}>
          {content}
          {beak && <span className={floating.beak} aria-hidden="true" />}
        </span>
      )}
    </span>
  );
}
