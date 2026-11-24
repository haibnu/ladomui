'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { IconClose, IconError, IconInfo, IconQuestion, IconWarning } from '@ladom/icons';
import { Button } from '../Button/Button';
import { ScrollArea } from '../ScrollArea/ScrollArea';
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
  /** Between the title and the close button, e.g. a Stepper. The title then stays on one line. */
  headerContent?: ReactNode;
  /** ConfirmModal: a round icon above the title; title, text and actions are centered. */
  media?: ReactNode;
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
  headerContent,
  media,
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
        <div className={styles.header} data-scrolled={scrolled || undefined} data-content={headerContent != null || undefined}>
          {media != null && (
            <span className={styles.media} aria-hidden="true">
              {media}
            </span>
          )}
          <div className={styles.text}>
            <h2 id={`${id}-title`} className={styles.title} title={headerContent != null && typeof title === 'string' ? title : undefined}>
              {title}
            </h2>
            {description != null && (
              <p id={`${id}-description`} className={styles.description}>
                {description}
              </p>
            )}
          </div>
          {headerContent != null && <div className={styles.headerContent}>{headerContent}</div>}
          <Button variant="ghost" tone="tertiary" size="small" icon={IconClose} aria-label={closeLabel} className={styles.close} onClick={onClose} />
        </div>
        {children != null && (
          <ScrollArea
            orientation="both"
            className={styles.body}
            viewportProps={{ className: styles.bodyContent, onScroll: (e) => setScrolled(e.currentTarget.scrollTop > 0) }}
          >
            {children}
          </ScrollArea>
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

export type ConfirmModalTone = 'danger' | 'warning' | 'info' | 'default';

const CONFIRM_ICONS = { danger: IconWarning, warning: IconError, info: IconInfo, default: IconQuestion };

export type ConfirmModalProps = Omit<DialogProps, 'headerContent' | 'media'> & {
  /** danger: a serious, often irreversible step (red); warning: a sensitive step (amber); info: a
   * notice (blue); default: a general question in the brand color. */
  tone?: ConfirmModalTone;
  /** Icon element in place of the tone's icon. */
  icon?: ReactNode;
};

/** A small, centered question or notice ("Delete Project?") with a round tone icon above the title
 * and its actions under the text. Give danger confirmations an error-tone main Button. No Figma drawing yet. */
export function ConfirmModal({ tone = 'default', icon, ...props }: ConfirmModalProps) {
  const ToneIcon = CONFIRM_ICONS[tone];
  return <Dialog data-kind="modal" data-size="small" data-confirm={tone} media={icon ?? <ToneIcon />} {...props} />;
}
