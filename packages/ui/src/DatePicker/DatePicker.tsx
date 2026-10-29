'use client';

import { useEffect, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { IconArrowLeft, IconArrowRight } from '@ladom/icons';
import { Button } from '../Button/Button';
import { Cell } from '../Cell/Cell';
import styles from './DatePicker.module.css';

// Figma: Components / Date Picker (node 2037:6346) with Date Month (1314:2115), Date Day
// (1313:304) and Date Filter (1314:2169). DatePicker is 🎛 Type=Default (one month in a panel);
// with mode="range" and months={2} and presets it is Type=Full Control. Calendar is the bare
// Type=Basic month. Day types: today ring, selected circle, event dot, range band.
export type DateRange = { start: Date | null; end: Date | null };

export type DatePreset = { label: ReactNode; range: DateRange };

type CommonProps = {
  /** Earliest and latest choosable days. */
  min?: Date;
  max?: Date;
  /** Marks days that cannot be chosen. */
  isDateDisabled?: (date: Date) => boolean;
  /** Days with an event dot. */
  events?: Date[];
  /** First day of the week: 0 Sunday, 1 Monday. */
  weekStartsOn?: 0 | 1;
  /** Locale for month names and day labels; the browser's when omitted. */
  locale?: string;
  /** The month shown first; follows the value when omitted. */
  defaultMonth?: Date;
  previousLabel?: string;
  nextLabel?: string;
};

type SingleProps = { mode?: 'single'; value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void };
type RangeProps = { mode: 'range'; value?: DateRange; defaultValue?: DateRange; onChange?: (range: DateRange) => void };

export type CalendarProps = CommonProps & (SingleProps | RangeProps) & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>;

export type DatePickerProps = CalendarProps & {
  /** Months side by side (Full Control shows 2). */
  months?: 1 | 2;
  /** Quick ranges listed beside the months (Figma Date Filter). */
  presets?: DatePreset[];
};

const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const same = (a: Date | null | undefined, b: Date | null | undefined) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// The weeks of a month, padded with the days of the months around it.
function weeks(month: Date, weekStartsOn: number) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -((first.getDay() - weekStartsOn + 7) % 7));
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const rows: Date[][] = [];
  for (let d = start; d <= last || rows.length === 0; ) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++, d = addDays(d, 1)) row.push(d);
    rows.push(row);
  }
  return rows;
}

type MonthProps = CommonProps & {
  month: Date;
  selected: DateRange;
  isRange: boolean;
  focus: Date;
  onFocus: (d: Date) => void;
  onPick: (d: Date) => void;
  showPrevious: boolean;
  showNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  autoFocus: boolean;
};

function Month({ month, selected, isRange, focus, onFocus, onPick, showPrevious, showNext, onPrevious, onNext, min, max, isDateDisabled, events = [], weekStartsOn = 1, locale, previousLabel = 'Previous month', nextLabel = 'Next month', autoFocus }: MonthProps) {
  const grid = useRef<HTMLDivElement>(null);
  const today = day(new Date());
  const eventKeys = useMemo(() => new Set(events.map((e) => key(e))), [events]);
  const title = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
  const label = new Intl.DateTimeFormat(locale, { dateStyle: 'full' });
  const { start, end } = selected;
  const blocked = (d: Date) => (min && d < day(min)) || (max && d > day(max)) || isDateDisabled?.(d) || false;

  useEffect(() => {
    if (autoFocus) grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [focus, autoFocus]);

  const onKeyDown = (e: KeyboardEvent) => {
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(focus, -1),
      ArrowRight: addDays(focus, 1),
      ArrowUp: addDays(focus, -7),
      ArrowDown: addDays(focus, 7),
      Home: addDays(focus, -((focus.getDay() - weekStartsOn + 7) % 7)),
      End: addDays(focus, 6 - ((focus.getDay() - weekStartsOn + 7) % 7)),
      PageUp: new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate()),
      PageDown: new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate()),
    };
    const next = moves[e.key];
    if (next) {
      e.preventDefault();
      onFocus(next);
    }
  };

  return (
    <div className={styles.month}>
      <div className={styles.header}>
        {showPrevious && (
          <Button variant="ghost" tone="tertiary" size="small" icon={IconArrowLeft} aria-label={previousLabel} className={styles.previous} onClick={onPrevious} />
        )}
        <span className={styles.title} aria-live="polite">
          {title}
        </span>
        {showNext && <Button variant="ghost" tone="tertiary" size="small" icon={IconArrowRight} aria-label={nextLabel} className={styles.next} onClick={onNext} />}
      </div>
      <div ref={grid} role="grid" aria-label={title} className={styles.grid} onKeyDown={onKeyDown}>
        {weeks(month, weekStartsOn).map((row) => (
          <div role="row" key={key(row[0]!)} className={styles.row}>
            {row.map((d) => {
              const outside = d.getMonth() !== month.getMonth();
              const off = outside || blocked(d);
              // Days of the months around show only their number.
              const isStart = !outside && same(d, start);
              const isEnd = !outside && isRange && same(d, end);
              const inRange = !outside && isRange && start && end && d > start && d < end;
              const chosen = isStart || isEnd;
              return (
                <div role="gridcell" key={key(d)} aria-selected={chosen || !!inRange || undefined}>
                  <button
                    type="button"
                    className={styles.day}
                    tabIndex={!outside && same(d, focus) ? 0 : -1}
                    disabled={off}
                    data-outside={outside || undefined}
                    data-today={(!outside && same(d, today)) || undefined}
                    data-selected={chosen || undefined}
                    data-range={isRange && start && end && !same(start, end) && !outside ? (isStart ? 'start' : isEnd ? 'end' : inRange ? 'middle' : undefined) : undefined}
                    aria-label={label.format(d)}
                    aria-current={!outside && same(d, today) ? 'date' : undefined}
                    onClick={() => onPick(d)}
                    onFocus={() => !same(d, focus) && onFocus(d)}
                  >
                    {d.getDate()}
                    {!outside && eventKeys.has(key(d)) && <span className={styles.dot} />}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function useCalendar(props: CalendarProps, monthCount: number) {
  const isRange = props.mode === 'range';
  const toRange = (v: Date | null | DateRange | undefined): DateRange => (v == null ? { start: null, end: null } : v instanceof Date ? { start: day(v), end: null } : v);
  const [inner, setInner] = useState<DateRange>(() => toRange(props.defaultValue));
  const selected = props.value !== undefined ? toRange(props.value) : inner;
  const initial = props.defaultMonth ?? selected.start ?? new Date();
  const [month, setMonth] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focus, setFocus] = useState(() => day(selected.start ?? new Date()));
  const [keyboard, setKeyboard] = useState(false);

  const commit = (range: DateRange) => {
    if (props.value === undefined) setInner(range);
    if (props.mode === 'range') props.onChange?.(range);
    else if (range.start) props.onChange?.(range.start);
  };

  const pick = (d: Date) => {
    setFocus(d);
    if (!isRange) return commit({ start: d, end: null });
    const { start, end } = selected;
    if (!start || end || d < start) commit({ start: d, end: null });
    else commit({ start, end: d });
  };

  // Keeps the focused day in view as it moves across months.
  const moveFocus = (d: Date) => {
    setKeyboard(true);
    setFocus(d);
    const first = month;
    const last = addMonths(month, monthCount - 1);
    if (d < first) setMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    else if (d >= addMonths(last, 1)) setMonth(addMonths(new Date(d.getFullYear(), d.getMonth(), 1), -(monthCount - 1)));
  };

  return { isRange, selected, month, setMonth, focus, keyboard, pick, moveFocus, commit };
}

/** One month without a panel (Figma Date Picker 🎛 Type=Basic). */
export function Calendar(props: CalendarProps) {
  return <DatePickerView {...props} months={1} bare />;
}

/** A month (or two) in a panel, with optional presets (Type=Default / Full Control). */
export function DatePicker(props: DatePickerProps) {
  return <DatePickerView {...props} />;
}

function DatePickerView(props: DatePickerProps & { bare?: boolean }) {
  const { months = 1, presets, bare = false, min, max, isDateDisabled, events, weekStartsOn, locale, previousLabel, nextLabel, className, mode: _mode, value: _value, defaultValue: _default, onChange: _onChange, defaultMonth: _month, ...rest } = props;
  const cal = useCalendar(props, months);
  const shared = { min, max, isDateDisabled, events, weekStartsOn, locale, previousLabel, nextLabel };
  return (
    <div className={[bare ? styles.bare : styles.picker, className].filter(Boolean).join(' ')} {...rest}>
      {presets && presets.length > 0 && (
        <div className={styles.presets} role="listbox" aria-label="Presets">
          {presets.map((p, i) => {
            const active = same(p.range.start, cal.selected.start) && same(p.range.end, cal.selected.end);
            return (
              <Cell
                key={i}
                size="small"
                role="option"
                aria-selected={active}
                selected={active}
                tabIndex={0}
                onClick={() => {
                  cal.commit(p.range);
                  if (p.range.start) cal.setMonth(new Date(p.range.start.getFullYear(), p.range.start.getMonth(), 1));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                {p.label}
              </Cell>
            );
          })}
        </div>
      )}
      {Array.from({ length: months }, (_, i) => {
        const month = addMonths(cal.month, i);
        return (
          <div key={i} className={styles.panel}>
            <Month
              {...shared}
              month={month}
              selected={cal.selected}
              isRange={cal.isRange}
              focus={cal.focus}
              onFocus={cal.moveFocus}
              onPick={cal.pick}
              showPrevious={i === 0}
              showNext={i === months - 1}
              onPrevious={() => cal.setMonth(addMonths(cal.month, -1))}
              onNext={() => cal.setMonth(addMonths(cal.month, 1))}
              autoFocus={cal.keyboard && cal.focus.getMonth() === month.getMonth() && cal.focus.getFullYear() === month.getFullYear()}
            />
          </div>
        );
      })}
    </div>
  );
}
