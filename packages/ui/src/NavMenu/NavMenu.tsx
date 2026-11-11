import { forwardRef, type AnchorHTMLAttributes, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import styles from './NavMenu.module.css';

// Not drawn in Figma yet: built from the existing parts. A SidebarNav item is a Medium Cell
// (87:46114) as a link: hover surface/level-2, the current page primary soft with primary text.
// TopNav is a bar of the App Header's height (Navigation 2196:16006) whose links are the pills of
// the secondary Tabs. Both are plain links; collapsing, nested groups and a mobile menu are the
// Pro Navigation's job.

export type NavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** The link element, e.g. a router's Link; an <a> by default. */
  as?: ElementType;
  /** An icon element (20px in SidebarNav, 16px in TopNav). */
  icon?: ReactNode;
  /** A count or short text at the end, drawn as a Tiny Badge (as in Cell); or your own Badge element. */
  badge?: ReactNode;
  /** Marks the page you are on (aria-current="page"). */
  current?: boolean;
  disabled?: boolean;
};

const NavItem = forwardRef<HTMLAnchorElement, NavItemProps & { kind: 'side' | 'top' }>(function NavItem(
  { as: Tag = 'a', kind, icon, badge, current = false, disabled = false, href, className, children, onClick, ...rest },
  ref,
) {
  return (
    <Tag
      ref={ref}
      className={[styles.item, className].filter(Boolean).join(' ')}
      data-kind={kind}
      href={disabled ? undefined : href}
      aria-current={current ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? (e: MouseEvent<HTMLAnchorElement>) => e.preventDefault() : onClick}
      {...rest}
    >
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {badge != null && <span className={styles.badge}>{typeof badge === 'string' || typeof badge === 'number' ? <Badge size="tiny">{badge}</Badge> : badge}</span>}
    </Tag>
  );
});

export type SidebarNavProps = HTMLAttributes<HTMLElement> & {
  /** Above the links, e.g. the product logo. */
  header?: ReactNode;
  /** Pinned to the bottom, e.g. a SidebarNavSection with settings or the account. */
  footer?: ReactNode;
};

/** A vertical menu of links for the side of a web app. Name it with aria-label. */
export const SidebarNav = forwardRef<HTMLElement, SidebarNavProps>(function SidebarNav({ header, footer, className, children, ...rest }, ref) {
  return (
    <nav ref={ref} className={[styles.sidebar, className].filter(Boolean).join(' ')} {...rest}>
      {header != null && <div className={styles.header}>{header}</div>}
      <ScrollArea className={styles.body} viewportProps={{ className: styles.bodyContent }}>
        {children}
      </ScrollArea>
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
});

export type SidebarNavSectionProps = HTMLAttributes<HTMLDivElement> & {
  /** A caption above the section's links. */
  title?: ReactNode;
};

export const SidebarNavSection = forwardRef<HTMLDivElement, SidebarNavSectionProps>(function SidebarNavSection({ title, className, children, ...rest }, ref) {
  return (
    <div ref={ref} className={[styles.section, className].filter(Boolean).join(' ')} {...rest}>
      {title != null && <p className={styles.sectionTitle}>{title}</p>}
      <ul className={styles.list}>{children}</ul>
    </div>
  );
});

export const SidebarNavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function SidebarNavItem(props, ref) {
  return (
    <li className={styles.listItem}>
      <NavItem ref={ref} kind="side" {...props} />
    </li>
  );
});

export type TopNavProps = HTMLAttributes<HTMLElement> & {
  /** At the start, e.g. the product logo. */
  brand?: ReactNode;
  /** At the end, e.g. a search, buttons or an Avatar. */
  actions?: ReactNode;
};

/** A horizontal menu bar for the top of a web app. Name it with aria-label. */
export const TopNav = forwardRef<HTMLElement, TopNavProps>(function TopNav({ brand, actions, className, children, ...rest }, ref) {
  return (
    <nav ref={ref} className={[styles.top, className].filter(Boolean).join(' ')} {...rest}>
      {brand != null && <div className={styles.brand}>{brand}</div>}
      <ul className={styles.topList}>{children}</ul>
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </nav>
  );
});

export const TopNavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function TopNavItem(props, ref) {
  return (
    <li className={styles.listItem}>
      <NavItem ref={ref} kind="top" {...props} />
    </li>
  );
});
