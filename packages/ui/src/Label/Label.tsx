import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react';
import { IconInfo } from '@ladom/icons';
import { Hint } from '../Hint/Hint';
import styles from './Label.module.css';

// Figma: Components / Label (node 1172:168). The 🎛 Type variants follow from the props:
//   Default = no extras, Icon = info, Subtitle = subtitle, Hint = hint.
//   withFormElement = with Form Element; optional = Optional (+ ⌙ Optional Text).
export type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children'> & {
  children: ReactNode;
  /** Text at the end of the row, e.g. "Optional". */
  optional?: ReactNode;
  /** Shows the info icon after the label (Figma Type=Icon). */
  info?: boolean;
  /** Secondary text under the label (Figma Type=Subtitle). */
  subtitle?: ReactNode;
  /** Hint under the label (Figma Type=Hint). */
  hint?: ReactNode;
  /** Compact label used directly above a form element (Figma with Form Element=True). */
  withFormElement?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { children, optional, info = false, subtitle, hint, withFormElement = false, className, ...rest },
  ref,
) {
  const stacked = subtitle != null || hint != null;
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} data-form={withFormElement || undefined} data-stacked={stacked || undefined}>
      <div className={styles.row}>
        <label ref={ref} className={styles.label} {...rest}>
          {children}
          {info && <IconInfo size={12} className={styles.info} aria-hidden="true" />}
        </label>
        {optional != null && <span className={styles.optional}>{optional}</span>}
      </div>
      {subtitle != null && <span className={styles.subtitle}>{subtitle}</span>}
      {hint != null && <Hint size="small">{hint}</Hint>}
    </div>
  );
});
