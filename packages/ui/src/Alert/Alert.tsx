import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconClose, IconInfo } from '@ladom/icons';
import { Button } from '../Button/Button';
import styles from './Alert.module.css';

// Figma: Molecules / Alert Message (node 2109:21906). tone = Style (Information -> info),
// direction = ✈️ Direction, description = Description, actions = CTA Buttons (Button 01-03),
// onClose = Close Button. An inline message in the page; for messages that come and go use Toast.
export type AlertTone = 'default' | 'info' | 'success' | 'error' | 'warning';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: AlertTone;
  direction?: 'vertical' | 'horizontal';
  title: ReactNode;
  description?: ReactNode;
  /** Small buttons under (Vertical) or after (Horizontal) the text. */
  actions?: ReactNode;
  /** Shows the close button. */
  onClose?: () => void;
  closeLabel?: string;
  /** Icon element; info by default, as in Figma. */
  icon?: ReactNode;
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'default', direction = 'vertical', title, description, actions, onClose, closeLabel = 'Close', icon, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={[styles.alert, className].filter(Boolean).join(' ')} data-tone={tone} data-direction={direction} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <IconInfo />}
      </span>
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        {description != null && <span className={styles.description}>{description}</span>}
        {actions != null && <div className={styles.actions}>{actions}</div>}
      </div>
      {onClose && <Button variant="ghost" tone="tertiary" size="small" icon={IconClose} aria-label={closeLabel} className={styles.close} onClick={onClose} />}
    </div>
  );
});
