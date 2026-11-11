'use client';

import { useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { ScrollArea } from '../ScrollArea/ScrollArea';
import styles from './TimePicker.module.css';

// Figma: Components / Time Picker (node 6:1395) with .timepicker item (6:1421): hour, minute and
// second columns in a panel. Item Property 1: Default, hover (:hover), selected (the value),
// disable (isDisabled / outside min and max). Each column is a listbox; arrow keys change it.
export type TimeValue = { hours: number; minutes: number; seconds?: number };

export type TimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> & {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (value: TimeValue) => void;
  /** Shows the seconds column (Figma shows it). */
  showSeconds?: boolean;
  /** Step between minutes and seconds, e.g. 5 or 15. */
  step?: number;
  /** Marks items that cannot be chosen. */
  isDisabled?: (unit: 'hours' | 'minutes' | 'seconds', value: number) => boolean;
  labels?: { hours?: string; minutes?: string; seconds?: string };
};

type Unit = 'hours' | 'minutes' | 'seconds';
const pad = (n: number) => String(n).padStart(2, '0');

function Column({ prefix, unit, values, selected, label, disabled, onPick }: { prefix: string; unit: Unit; values: number[]; selected: number | undefined; label: string; disabled: (v: number) => boolean; onPick: (v: number) => void }) {
  const list = useRef<HTMLDivElement>(null);
  const id = (v: number) => `${prefix}-${unit}-${v}`;

  useEffect(() => {
    if (selected == null) return;
    // Scrolls only the column (scrollIntoView would also scroll the page).
    const box = list.current;
    const item = box?.querySelector<HTMLElement>(`[data-value="${selected}"]`);
    if (!box || !item) return;
    if (item.offsetTop < box.scrollTop) box.scrollTop = item.offsetTop - item.offsetHeight;
    else if (item.offsetTop + item.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = item.offsetTop + 2 * item.offsetHeight - box.clientHeight;
  }, [selected]);

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = values.filter((v) => !disabled(v));
    if (!enabled.length) return;
    const at = selected == null ? -1 : enabled.indexOf(selected);
    const target = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: enabled.length - 1 }[e.key];
    if (target == null) return;
    e.preventDefault();
    onPick(enabled[Math.max(0, Math.min(enabled.length - 1, target))]!);
  };

  return (
    <ScrollArea
      className={styles.column}
      viewportRef={list}
      viewportProps={{
        role: 'listbox',
        tabIndex: 0,
        'aria-label': label,
        'aria-activedescendant': selected != null ? id(selected) : undefined,
        className: styles.list,
        onKeyDown,
      }}
    >
      {values.map((v) => (
        <div
          key={v}
          id={id(v)}
          role="option"
          aria-selected={v === selected}
          aria-disabled={disabled(v) || undefined}
          data-value={v}
          className={styles.item}
          onClick={() => !disabled(v) && onPick(v)}
        >
          {pad(v)}
        </div>
      ))}
    </ScrollArea>
  );
}

export function TimePicker({
  value,
  defaultValue,
  onChange,
  showSeconds = true,
  step = 1,
  isDisabled,
  labels,
  className,
  id,
  ...rest
}: TimePickerProps) {
  const prefix = useId();
  const [inner, setInner] = useState<TimeValue | null>(defaultValue ?? null);
  const current = value !== undefined ? value : inner;
  const range = (count: number, by: number) => Array.from({ length: Math.ceil(count / by) }, (_, i) => i * by);

  const set = (unit: Unit, v: number) => {
    const next: TimeValue = { hours: current?.hours ?? 0, minutes: current?.minutes ?? 0, ...(showSeconds ? { seconds: current?.seconds ?? 0 } : {}), [unit]: v };
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  const columns: [Unit, number[], string][] = [
    ['hours', range(24, 1), labels?.hours ?? 'Hours'],
    ['minutes', range(60, step), labels?.minutes ?? 'Minutes'],
    ...(showSeconds ? ([['seconds', range(60, step), labels?.seconds ?? 'Seconds']] as [Unit, number[], string][]) : []),
  ];

  return (
    <div id={id} role="group" className={[styles.picker, className].filter(Boolean).join(' ')} {...rest}>
      {columns.map(([unit, values, label]) => (
        <Column key={unit} prefix={prefix} unit={unit} values={values} label={label} selected={current?.[unit]} disabled={(v) => isDisabled?.(unit, v) ?? false} onPick={(v) => set(unit, v)} />
      ))}
    </div>
  );
}
