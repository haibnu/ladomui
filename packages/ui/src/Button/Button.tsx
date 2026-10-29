import { forwardRef, type ButtonHTMLAttributes, type ComponentType, type ReactNode } from 'react';
import { IconArrowBottom, IconRefresh, type IconProps } from '@ladom/icons';
import styles from './Button.module.css';

// Figma: Components / Button (node 1088:61). Prop names map to the Figma properties:
//   variant = 🎛 Type (Button -> solid, Ghost -> ghost), tone = 💅 Style, size = 👕 Size,
//   loading = Loading, disabled = Disable, icon = Icon Button, iconLeft/iconRight = Show L/R Icon,
//   subtitle = Subtitle, dropdown = Dropdown. The 🕹 State variants are the browser states
//   (:hover, :active, :focus-visible).
export type ButtonTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info';
export type ButtonSize = 'large' | 'medium' | 'small' | 'tiny';
type Icon = ComponentType<IconProps>;

type Look =
  | { /** Figma 🎛 Type=Button. */ variant?: 'solid'; tone?: ButtonTone }
  | { /** Figma 🎛 Type=Ghost. Ghost has no info tone in Figma. */ variant: 'ghost'; tone?: Exclude<ButtonTone, 'info'> };

type Content =
  | {
      children: ReactNode;
      icon?: never;
      iconLeft?: Icon;
      iconRight?: Icon;
      /** Secondary text after the label, in the regular weight. */
      subtitle?: ReactNode;
      /** Shows a down arrow after the label, for buttons that open a menu. */
      dropdown?: boolean;
    }
  | {
      children?: never;
      /** Icon-only button (Figma Icon Button=True). Needs an aria-label. */
      icon: Icon;
      'aria-label': string;
      iconLeft?: never;
      iconRight?: never;
      subtitle?: never;
      dropdown?: never;
    };

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> &
  Look &
  Content & {
    size?: ButtonSize;
    /** Shows the loader and blocks clicks, keeping the button's size. */
    loading?: boolean;
  };

// Icon sizes per button size, from Figma (label buttons / icon-only buttons / dropdown arrow / loader).
const ICON = { large: 20, medium: 16, small: 16, tiny: 12 } as const;
const ICON_ONLY = { large: 20, medium: 20, small: 16, tiny: 16 } as const;
const ARROW = { large: 16, medium: 14, small: 12, tiny: 10 } as const;
const LOADER = { large: 24, medium: 24, small: 16, tiny: 16 } as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'solid',
    tone = 'primary',
    size = 'medium',
    loading = false,
    icon: IconOnly,
    iconLeft: IconLeft,
    iconRight: IconRight,
    subtitle,
    dropdown,
    children,
    className,
    type = 'button',
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const iconSize = IconOnly ? ICON_ONLY[size] : ICON[size];
  return (
    <button
      ref={ref}
      type={type}
      className={[styles.button, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-icon-only={IconOnly ? '' : undefined}
      data-loading={loading ? '' : undefined}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      <span className={styles.content}>
        {IconOnly ? (
          <IconOnly size={iconSize} />
        ) : (
          <>
            {IconLeft && <IconLeft size={iconSize} />}
            <span className={styles.texts}>
              <span>{children}</span>
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </span>
            {IconRight && <IconRight size={iconSize} />}
            {dropdown && <IconArrowBottom size={ARROW[size]} />}
          </>
        )}
      </span>
      {loading && (
        <span className={styles.loader} style={{ inlineSize: LOADER[size], blockSize: LOADER[size] }} aria-hidden="true">
          <IconRefresh size={Math.round((LOADER[size] * 2) / 3)} />
        </span>
      )}
    </button>
  );
});
