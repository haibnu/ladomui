'use client';

import { cloneElement, isValidElement, useEffect, useId, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode } from 'react';
import { IconClose } from '@ladom/icons';
import { Button } from '../Button/Button';
import floating from '../Floating/floating.module.css';
import type { Placement } from '../Floating/placement';
import styles from './Popover.module.css';

// Figma: Components / Popover (node 4201:12502). placement = 👉 Position (the beak's side, so
// Position=Bottom is placement 'top'); 🎛 Type=Default is a title with a close button and text,
// Type=HTML is any content. The trigger toggles it; Escape and a press outside close it.
export type PopoverProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** The element that opens it, usually a Button. */
  trigger: ReactElement;
  title?: ReactNode;
  children?: ReactNode;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Shows the close button next to the title. */
  closable?: boolean;
  closeLabel?: string;
};

export function Popover({
  trigger,
  title,
  children,
  placement = 'bottom',
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  closable = true,
  closeLabel = 'Close',
  className,
  ...rest
}: PopoverProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ?? inner;
  const anchor = useRef<HTMLSpanElement>(null);
  const set = (next: boolean) => {
    if (controlled === undefined) setInner(next);
    onOpenChange?.(next);
  };
  const close = (refocus = true) => {
    set(false);
    if (refocus) anchor.current?.querySelector<HTMLElement>('[aria-haspopup]')?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!anchor.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const opener = isValidElement<{ onClick?: (e: unknown) => void }>(trigger)
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? id : undefined,
        onClick: (e: unknown) => {
          trigger.props.onClick?.(e);
          set(!open);
        },
      })
    : trigger;

  return (
    <span ref={anchor} className={floating.anchor} onKeyDown={(e) => e.key === 'Escape' && open && close()}>
      {opener}
      {open && (
        <div
          id={id}
          role="dialog"
          aria-labelledby={title != null ? `${id}-title` : undefined}
          className={[floating.floating, styles.popover, className].filter(Boolean).join(' ')}
          data-placement={placement}
          {...rest}
        >
          {title != null && (
            <div className={styles.head}>
              <span id={`${id}-title`} className={styles.title}>
                {title}
              </span>
              {closable && <Button variant="ghost" tone="tertiary" size="tiny" icon={IconClose} aria-label={closeLabel} onClick={() => close()} />}
            </div>
          )}
          {children != null && <div className={title != null ? styles.body : undefined}>{children}</div>}
          <span className={floating.beak} aria-hidden="true" />
        </div>
      )}
    </span>
  );
}
