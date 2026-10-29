import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Avatar.module.css';

// Figma: Components / Avatar (node 1153:124). The 💅 Style follows the content: src = Image,
// name = Name Surname (initials), icon = Icon. size = 👕 Size, status = 🟢 Status,
// notification = 🔔 Notification. 🕹 State=Hover is shown when the avatar sits in a hovered
// link or button (or with data-state="hover").
export type AvatarSize = 'xlarge' | 'medium' | 'small' | 'tiny' | 'micro';

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  size?: AvatarSize;
  src?: string;
  /** Alt text of the image; defaults to the name. */
  alt?: string;
  /** Full name; the initials are drawn when there is no image (one letter in Tiny and Micro). */
  name?: string;
  /** Icon element, drawn when there is no image or name. */
  icon?: ReactNode;
  /** Green online dot (not in Micro). */
  status?: boolean;
  /** Count bubble (XLarge, Medium and Small only). */
  notification?: ReactNode;
  'data-state'?: 'hover';
};

const initials = (name: string, letters: number) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, letters === 1 ? 1 : undefined)
    .filter((_, i, all) => i === 0 || i === all.length - 1)
    .map((w) => w.charAt(0).toLocaleUpperCase())
    .join('');

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'medium', src, alt, name, icon, status = false, notification, className, ...rest },
  ref,
) {
  const style = src ? 'image' : name ? 'name' : 'icon';
  const small = size === 'tiny' || size === 'micro';
  return (
    <span
      ref={ref}
      className={[styles.avatar, className].filter(Boolean).join(' ')}
      data-size={size}
      data-style={style}
      role={style === 'image' ? undefined : 'img'}
      aria-label={style === 'image' ? undefined : name}
      {...rest}
    >
      {style === 'image' ? (
        <img className={styles.image} src={src} alt={alt ?? name ?? ''} />
      ) : (
        <span className={styles.face} aria-hidden="true">
          {style === 'name' ? initials(name!, small ? 1 : 2) : icon}
        </span>
      )}
      {status && size !== 'micro' && <span className={styles.status} aria-hidden="true" />}
      {notification != null && !small && <span className={styles.notification}>{notification}</span>}
    </span>
  );
});

// Figma: Components / Avatar Group (node 2194:13296). layout = Property 1 (Overlap / Spaced).
// Put Avatars (Small in Figma) and an optional trailing Button in it.
export type AvatarGroupProps = HTMLAttributes<HTMLDivElement> & {
  layout?: 'overlap' | 'spaced';
};

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { layout = 'overlap', className, ...rest },
  ref,
) {
  return <div ref={ref} role="group" className={[styles.group, className].filter(Boolean).join(' ')} data-layout={layout} {...rest} />;
});
