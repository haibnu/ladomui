'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { IconInfo } from '@ladom/icons';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import styles from './Tabs.module.css';

// Figma: Components / Tab (node 99:14457) with Tab Item (99:14488). variant = Tab Item Type
// (Primary underline, Secondary pills, Button), align = Align, border = Border Bottom,
// badge / info = Badge / Info; badgeTone = the nested Badge's 💅 Style. Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move
// and select. Give items content to render the active tab panel. When the tabs do not fit, the row
// scrolls sideways (ScrollArea) and the active tab is always brought into view.
// Tabs in tabs: give an item its own items and, while it is active, a second row of tabs opens
// under the first (Primary -> Secondary -> Button by default, subVariant changes it). Values are
// unique across both rows; value / onChange carry the inner tab's value, and a parent tab reopens
// on the inner tab that was picked last. Not drawn in Figma as one part: both rows are Tab types.
export type TabsItem = {
  value: string;
  label: ReactNode;
  /** Count in a Micro badge after the label. */
  badge?: ReactNode;
  /** Tone of the badge, e.g. `warning` for counts that need attention. */
  badgeTone?: BadgeTone;
  /** Shows the info icon after the label. */
  info?: boolean;
  disabled?: boolean;
  /** Panel content of the tab. */
  content?: ReactNode;
  /** Inner tabs: a second row under this tab while it is active. */
  items?: TabsItem[];
};

export type TabsProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  items: TabsItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'primary' | 'secondary' | 'button';
  align?: 'start' | 'center' | 'end';
  /** Draws the surface/level-3 line under the tabs. */
  border?: boolean;
  /** Type of the inner row of tabs; one step quieter than variant by default. */
  subVariant?: 'primary' | 'secondary' | 'button';
};

const QUIETER = { primary: 'secondary', secondary: 'button', button: 'button' } as const;

const contains = (item: TabsItem, v: string | undefined): boolean => item.value === v || !!item.items?.some((c) => contains(c, v));

// The tab a parent opens on: the inner tab picked last (memo), else the first enabled one.
const leafOf = (item: TabsItem, memo?: string): string => {
  if (!item.items?.length) return item.value;
  const next = (memo ? item.items.find((c) => contains(c, memo) && !c.disabled) : undefined) ?? item.items.find((c) => !c.disabled) ?? item.items[0]!;
  return leafOf(next, memo);
};

const resolve = (items: TabsItem[], v: string | undefined): string | undefined => {
  const top = items.find((i) => contains(i, v));
  if (!top) return v;
  return top.value === v ? leafOf(top) : v;
};

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = 'primary',
  subVariant,
  align = 'start',
  border = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  ...rest
}: TabsProps) {
  const uid = useId();
  const [inner, setInner] = useState(() => resolve(items, defaultValue ?? items.find((i) => !i.disabled)?.value));
  // The selected tab, always an inner one when the active tab has inner tabs.
  const current = resolve(items, value ?? inner);
  const list = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const active = items.find((i) => contains(i, current));
  const shown = useRef(false);
  const memo = useRef<Record<string, string>>({});
  if (active?.items?.length && current) memo.current[active.value] = current;

  // Keeps the active tab in view when the row is wider than its box: at first without motion, then
  // smoothly whenever the active tab changes. Only the row scrolls, never the page.
  useEffect(() => {
    const v = viewport.current;
    const tab = list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(active?.value ?? '')}"]`);
    if (!v || !tab || v.scrollWidth <= v.clientWidth) return;
    const box = v.getBoundingClientRect();
    const t = tab.getBoundingClientRect();
    const delta = t.left < box.left ? t.left - box.left : t.right > box.right ? t.right - box.right : 0;
    if (delta) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      v.scrollBy({
        left: delta,
        behavior: shown.current && !reduce ? 'smooth' : 'auto',
      });
    }
    shown.current = true;
  }, [active?.value]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const pick = (item: TabsItem) => select(leafOf(item, memo.current[item.value]));

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i === active);
    const target = {
      ArrowRight: at + 1,
      ArrowLeft: at - 1,
      Home: 0,
      End: enabled.length - 1,
    }[e.key];
    if (target == null) return;
    e.preventDefault();
    const next = enabled[(target + enabled.length) % enabled.length]!;
    pick(next);
    list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div className={className} {...rest}>
      <ScrollArea orientation="horizontal" viewportRef={viewport} className={styles.scroller}>
        <div ref={list} role="tablist" aria-label={ariaLabel} aria-labelledby={ariaLabelledby} className={styles.tabs} data-variant={variant} data-align={align} data-border={border || undefined} onKeyDown={onKeyDown}>
          {items.map((item) => {
            const selected = item === active;
            const nested = !!item.items?.length;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                id={`${uid}-tab-${item.value}`}
                data-value={item.value}
                aria-selected={selected}
                aria-controls={nested ? (selected ? `${uid}-sub` : undefined) : item.content != null ? `${uid}-panel` : undefined}
                tabIndex={selected ? 0 : -1}
                disabled={item.disabled}
                className={styles.tab}
                onClick={() => pick(item)}
              >
                <span className={styles.inner}>
                  {item.label}
                  {item.info && <IconInfo className={styles.info} aria-hidden="true" />}
                  {item.badge != null && (
                    <Badge size="micro" tone={item.badgeTone ?? 'primary'} disabled={item.disabled}>
                      {item.badge}
                    </Badge>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
      {active?.items?.length ? (
        <Tabs
          id={`${uid}-sub`}
          aria-labelledby={`${uid}-tab-${active.value}`}
          className={styles.sub}
          items={active.items}
          value={current}
          onChange={select}
          variant={subVariant ?? QUIETER[variant]}
          align={align}
        />
      ) : active?.content != null && (
        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active.value}`} tabIndex={0} className={styles.panel}>
          {active.content}
        </div>
      )}
    </div>
  );
}
