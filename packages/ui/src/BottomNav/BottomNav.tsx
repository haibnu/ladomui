'use client';

import {
  forwardRef,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Badge } from '../Badge/Badge';
import styles from './BottomNav.module.css';

// Not drawn in Figma yet: built from the existing parts. A bar of links at the bottom of the
// screen for mobile web apps: an icon over a short label, the current page in primary with a
// primary soft pill behind its icon (as the current SidebarNav item). While a fixed BottomNav is
// on screen it writes its height to --ladom-bottom-nav-height on <html>; ToastProvider lifts its
// stack by that much, and pages can pad their content with it.

const HEIGHT_VAR = '--ladom-bottom-nav-height';

export type BottomNavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** The link element, e.g. a router's Link; an <a> by default. */
  as?: ElementType;
  /** An icon element, 24px. */
  icon: ReactNode;
  /** Shown instead of icon on the current page, e.g. the filled version. */
  currentIcon?: ReactNode;
  /** A count on the icon, drawn as a filled error Micro Badge; true shows a dot. */
  badge?: ReactNode | true;
  /** Marks the page you are on (aria-current="page"). */
  current?: boolean;
  disabled?: boolean;
};

export const BottomNavItem = forwardRef<HTMLAnchorElement, BottomNavItemProps>(function BottomNavItem(
  { as: Tag = 'a', icon, currentIcon, badge, current = false, disabled = false, href, className, children, onClick, ...rest },
  ref,
) {
  return (
    <li className={styles.cell}>
      <Tag
        ref={ref}
        className={[styles.item, className].filter(Boolean).join(' ')}
        href={disabled ? undefined : href}
        aria-current={current ? 'page' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick}
        {...rest}
      >
        <span className={styles.iconWrap}>
          <span className={styles.icon} aria-hidden="true">
            {current && currentIcon != null ? currentIcon : icon}
          </span>
          {badge === true ? (
            <span className={styles.dot} />
          ) : badge != null ? (
            <span className={styles.badge}>
              {typeof badge === 'string' || typeof badge === 'number' ? (
                <Badge size="micro" tone="error" filled>
                  {badge}
                </Badge>
              ) : (
                badge
              )}
            </span>
          ) : null}
        </span>
        <span className={styles.label}>{children}</span>
      </Tag>
    </li>
  );
});

export type BottomNavProps = HTMLAttributes<HTMLElement> & {
  /** fixed (default) pins the bar to the bottom of the screen; static leaves it in the flow. */
  position?: 'fixed' | 'static';
  /** Hides the bar from the Tablet breakpoint (768px) up, for apps that switch to a sidebar there. */
  mobileOnly?: boolean;
};

/** A bar of 3 to 5 BottomNavItems at the bottom of the screen. Name it with aria-label. */
export const BottomNav = forwardRef<HTMLElement, BottomNavProps>(function BottomNav(
  { position = 'fixed', mobileOnly = false, className, children, ...rest },
  ref,
) {
  const own = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = own.current;
    if (position !== 'fixed' || !el || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement;
    // Hidden (mobileOnly on a wide screen) measures 0, so nothing is lifted.
    const write = () => root.style.setProperty(HEIGHT_VAR, `${el.offsetHeight}px`);
    const observer = new ResizeObserver(write);
    observer.observe(el);
    write();
    return () => {
      observer.disconnect();
      root.style.removeProperty(HEIGHT_VAR);
    };
  }, [position]);

  return (
    <nav
      ref={(node) => {
        own.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={[styles.nav, className].filter(Boolean).join(' ')}
      data-position={position}
      data-mobile-only={mobileOnly || undefined}
      {...rest}
    >
      <ul className={styles.list}>{children}</ul>
    </nav>
  );
});
