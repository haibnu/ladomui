import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconError, IconFolder } from '@ladom/icons';
import styles from './EmptyState.module.css';

// Figma: Components / Empty State (4239:82). size = 👕 Size: large on pages, medium in tables and
// cards, small inside components (the Selectbox list, a dropdown). tone = 🎛 Type (Error is for a
// failed load). Title, Description and Action follow the Figma properties.
export type EmptyStateSize = 'large' | 'medium' | 'small';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  size?: EmptyStateSize;
  tone?: 'default' | 'error';
  title: ReactNode;
  description?: ReactNode;
  /** A Button: medium on large, small on medium; Figma has none on small. */
  action?: ReactNode;
  /** Icon element; a folder by default, the error icon for tone="error". */
  icon?: ReactNode;
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { size = 'medium', tone = 'default', title, description, action, icon, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={[styles.empty, className].filter(Boolean).join(' ')} data-size={size} data-tone={tone} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? (tone === 'error' ? <IconError /> : <IconFolder />)}
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {description != null && <p className={styles.description}>{description}</p>}
      </div>
      {action != null && <div className={styles.action}>{action}</div>}
    </div>
  );
});
