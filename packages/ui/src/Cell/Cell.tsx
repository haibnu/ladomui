import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconCheck } from '@ladom/icons';
import styles from './Cell.module.css';

// Figma: Components / Cell (node 87:46114), the row used in Dropdown, Selectbox options and lists.
// size = 👕 Size, selected = Selected, tone='destructive' = 🎛 Type=Destructive,
// control = 🎛 Type=Checkbox / Radio. 🎛 Type=Multi Text follows from subtitle, bodycopy and
// inlineBadge. 🕹 State=Hover is :hover and the active option (data-active). Type=Action and
// Type=Search are CellActions and CellSearch; Cell Helper (89:48390) is CellHelper.
export type CellSize = 'medium' | 'small';

export type CellProps = HTMLAttributes<HTMLDivElement> & {
  size?: CellSize;
  selected?: boolean;
  tone?: 'default' | 'destructive';
  /** Draws a checkbox or radio before the text that follows selected. */
  control?: 'checkbox' | 'radio';
  /** Icon elements (20px Medium, 16px Small). A selected cell without iconRight shows a check. */
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  /** An Avatar (Tiny in Medium, Micro in Small). */
  avatar?: ReactNode;
  /** Badges before and after the text (Tiny in Medium, Micro in Small). */
  badgeLeft?: ReactNode;
  badgeRight?: ReactNode;
  /** Secondary text after the title, on the same line. */
  bodycopy?: ReactNode;
  /** A Badge after the title, on the same line. */
  inlineBadge?: ReactNode;
  /** A line under the title. */
  subtitle?: ReactNode;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover';
};

export const Cell = forwardRef<HTMLDivElement, CellProps>(function Cell(
  { size = 'medium', selected = false, tone = 'default', control, iconLeft, iconRight, avatar, badgeLeft, badgeRight, bodycopy, inlineBadge, subtitle, className, children, ...rest },
  ref,
) {
  const trailing = iconRight ?? (selected && !control ? <IconCheck /> : null);
  return (
    <div
      ref={ref}
      className={[styles.cell, className].filter(Boolean).join(' ')}
      data-size={size}
      data-tone={tone}
      data-selected={selected || undefined}
      {...rest}
    >
      {control && <span className={styles.control} data-kind={control} data-checked={selected || undefined} aria-hidden="true">{control === 'checkbox' ? <IconCheck /> : <span className={styles.dot} />}</span>}
      {iconLeft != null && (
        <span className={styles.icon} aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {avatar}
      {badgeLeft}
      <span className={styles.texts}>
        <span className={styles.line}>
          <span className={styles.title}>{children}</span>
          {bodycopy != null && <span className={styles.secondary}>{bodycopy}</span>}
          {inlineBadge}
        </span>
        {subtitle != null && <span className={styles.secondary}>{subtitle}</span>}
      </span>
      {badgeRight}
      {trailing != null && (
        <span className={styles.icon} aria-hidden="true">
          {trailing}
        </span>
      )}
    </div>
  );
});

// Figma: Cell 🎛 Type=Action — a row of small ghost buttons.
export const CellActions = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { size?: CellSize }>(function CellActions(
  { size = 'medium', className, ...rest },
  ref,
) {
  return <div ref={ref} className={[styles.actions, className].filter(Boolean).join(' ')} data-size={size} {...rest} />;
});

// Figma: Cell 🎛 Type=Search — holds an <Input type="search" size="small" />.
export const CellSearch = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CellSearch({ className, ...rest }, ref) {
  return <div ref={ref} className={[styles.search, className].filter(Boolean).join(' ')} {...rest} />;
});

// Figma: Cell Helper (node 89:48390). variant = Type: caption, caption with a divider above,
// a plain divider, or a caption without side padding.
export type CellHelperProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'caption' | 'caption-divider' | 'divider' | 'caption-flush';
};

export const CellHelper = forwardRef<HTMLDivElement, CellHelperProps>(function CellHelper({ variant = 'caption', className, children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      role={variant === 'divider' ? 'separator' : 'presentation'}
      className={[styles.helper, className].filter(Boolean).join(' ')}
      data-variant={variant}
      {...rest}
    >
      {variant !== 'divider' && children}
    </div>
  );
});
