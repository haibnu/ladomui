'use client';

import { useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { IconInfo } from '@ladom/icons';
import { Badge, type BadgeTone } from '../Badge/Badge';
import styles from './Tabs.module.css';

// Figma: Components / Tab (node 99:14457) with Tab Item (99:14488). variant = Tab Item Type
// (Primary underline, Secondary pills, Button), align = Align, border = Border Bottom,
// badge / info = Badge / Info; badgeTone = the nested Badge's 💅 Style. Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move
// and select. Give items content to render the active tab panel.
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
};

export function Tabs({ items, value, defaultValue, onChange, variant = 'primary', align = 'start', border = false, className, 'aria-label': ariaLabel, ...rest }: TabsProps) {
  const uid = useId();
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const current = value ?? inner;
  const list = useRef<HTMLDivElement>(null);
  const active = items.find((i) => i.value === current);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    const at = enabled.findIndex((i) => i.value === current);
    const target = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: enabled.length - 1 }[e.key];
    if (target == null) return;
    e.preventDefault();
    const next = enabled[(target + enabled.length) % enabled.length]!;
    select(next.value);
    list.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };

  return (
    <div className={className} {...rest}>
      <div
        ref={list}
        role="tablist"
        aria-label={ariaLabel}
        className={styles.tabs}
        data-variant={variant}
        data-align={align}
        data-border={border || undefined}
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${uid}-tab-${item.value}`}
              data-value={item.value}
              aria-selected={selected}
              aria-controls={item.content != null ? `${uid}-panel` : undefined}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={styles.tab}
              onClick={() => select(item.value)}
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
      {active?.content != null && (
        <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active.value}`} tabIndex={0} className={styles.panel}>
          {active.content}
        </div>
      )}
    </div>
  );
}
