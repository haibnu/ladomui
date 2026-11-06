'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { IconClose } from '@ladom/icons';
import { Button } from '../Button/Button';
import styles from './Modal.module.css';

// Figma: Components / Modal (4212:111) and Drawer (4212:199), with the shared .Modal Header
// (4212:6) and .Modal Footer (4212:18). size = 👕 Size, side = 👉 Position, footer = Footer,
// description = Description. Built on <dialog>: the browser keeps focus inside, Escape closes it
// and the page behind is inert; a press on the overlay closes it too.
export type ModalSize = 'small' | 'medium' | 'large';

type DialogProps = Omit<HTMLAttributes<HTMLDialogElement>, 'title'> & {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions at the bottom, usually a ghost Button and a solid one; the main action last. */
  footer?: ReactNode;
  closeLabel?: string;
  /** false keeps it open on Escape and overlay presses, for steps that need an answer. */
  dismissible?: boolean;
};

function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = 'Close',
  dismissible = true,
  className,
  ...rest
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  // The header has no line under it, so it casts a shadow while the body is scrolled.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={description != null ? `${id}-description` : undefined}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      onCancel={(e) => {
        e.preventDefault();
        if (dismissible) onClose();
      }}
      // A press on the ::backdrop targets the dialog itself; the content is a child.
      onClick={(e) => e.target === e.currentTarget && dismissible && onClose()}
      {...rest}
    >
      <div className={styles.surface}>
        <div className={styles.header} data-scrolled={scrolled || undefined}>
          <div className={styles.text}>
            <h2 id={`${id}-title`} className={styles.title}>
              {title}
            </h2>
            {description != null && (
              <p id={`${id}-description`} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          <Button variant="ghost" tone="tertiary" size="small" icon={IconClose} aria-label={closeLabel} onClick={onClose} />
        </div>
        {children != null && (
          <div className={styles.body} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}>
            {children}
          </div>
        )}
        {footer != null && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}

export type ModalProps = DialogProps & { size?: ModalSize };

/** A dialog in the middle of the page, over the overlay. */
export function Modal({ size = 'medium', ...props }: ModalProps) {
  return <Dialog data-kind="modal" data-size={size} {...props} />;
}

export type DrawerProps = DialogProps & { side?: 'right' | 'left' };

/** A panel that slides in from the side and fills the height of the window. */
export function Drawer({ side = 'right', ...props }: DrawerProps) {
  return <Dialog data-kind="drawer" data-side={side} {...props} />;
}
