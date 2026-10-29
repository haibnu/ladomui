import { forwardRef, type HTMLAttributes } from 'react';
import { IconCheck, IconError, IconInfo, IconWarning } from '@ladom/icons';
import styles from './Hint.module.css';

// Figma: Components / Hint (node 1137:183). tone = 🎛 Type, size = 👕 Size, withForm = with Form.
export type HintTone = 'default' | 'info' | 'error' | 'success' | 'warning';
export type HintSize = 'medium' | 'small';

export type HintProps = HTMLAttributes<HTMLDivElement> & {
  tone?: HintTone;
  size?: HintSize;
  /** Adds the in-group gap above the hint when it sits under a form element. */
  withForm?: boolean;
};

const GLYPH = { default: IconInfo, info: IconInfo, error: IconError, success: IconCheck, warning: IconWarning } as const;

export const Hint = forwardRef<HTMLDivElement, HintProps>(function Hint(
  { tone = 'default', size = 'small', withForm = false, className, children, ...rest },
  ref,
) {
  const Glyph = GLYPH[tone];
  return (
    <div
      ref={ref}
      className={[styles.hint, className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-size={size}
      data-with-form={withForm || undefined}
      {...rest}
    >
      <span className={styles.badge} aria-hidden="true">
        <Glyph size={12} />
      </span>
      <span className={styles.text}>{children}</span>
    </div>
  );
});
