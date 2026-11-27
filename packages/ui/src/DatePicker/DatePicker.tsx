'use client';

import { useEffect, useMemo, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { IconArrowLeft, IconArrowRight } from '@ladom/icons';
import { Button } from '../Button/Button';
import { Cell } from '../Cell/Cell';
import { InlinePicker } from '../Picker/InlinePicker';
import { TimePicker, type TimePickerProps, type TimeValue } from '../TimePicker/TimePicker';
import styles from './DatePicker.module.css';

// Figma: Components / Date Picker (node 2037:6346) with Date Month (1314:2115), Date Day
// (1313:304) and Date Filter (1314:2169). DatePicker is 🎛 Type=Default (one month in a panel);
// with mode="range" and months={2} and presets it is Type=Full Control. Calendar is the bare
// Type=Basic month. Day types: today ring, selected circle, event dot, range band. The day cells
// are 40px instead of Figma's 48px, for a more compact month.
// Not in Figma as one part: with time, a single DatePicker shows the TimePicker columns beside
// the month in the same panel, under a Time title that lines up with the month title; the value
// then carries the time.
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
  /** Accessible names of the month and year pickers in the header. */
  monthLabel?: string;
  yearLabel?: string;
};

type SingleProps = { mode?: 'single'; value?: Date | null; defaultValue?: Date | null; onChange?: (date: Date) => void };
type RangeProps = { mode: 'range'; value?: DateRange; defaultValue?: DateRange; onChange?: (range: DateRange) => void };

export type CalendarProps = CommonProps & (SingleProps | RangeProps) & Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>;

export type DatePickerProps = CalendarProps & {
  /** Months side by side (Full Control shows 2). */
  months?: 1 | 2;
  /** Quick ranges listed beside the months (Figma Date Filter). */
  presets?: DatePreset[];
  /** Single mode: shows hour and minute columns beside the month; the value then carries the time. */
  time?: boolean | DatePickerTime;
};

export type DatePickerTime = Pick<TimePickerProps, 'showSeconds' | 'step' | 'isDisabled' | 'labels'> & {
  /** Title over the columns, in line with the month title. */
  label?: string;
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
  /** Shows another month, picked in the header. */
  onGo: (month: Date) => void;
  autoFocus: boolean;
};

type View = 'days' | 'months' | 'years';

// Phones (the Mobile breakpoint, or data-device="mobile"): the header pickers turn the month into
// a grid of months or years instead of opening a list.
function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(width < 768px)');
    const update = () => setMobile(document.documentElement.dataset.device ? document.documentElement.dataset.device === 'mobile' : query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

function Month({ month, selected, isRange, focus, onFocus, onPick, showPrevious, showNext, onPrevious, onNext, onGo, min, max, isDateDisabled, events = [], weekStartsOn = 1, locale, previousLabel = 'Previous month', nextLabel = 'Next month', monthLabel = 'Month', yearLabel = 'Year', autoFocus }: MonthProps) {
  const grid = useRef<HTMLDivElement>(null);
  const mobile = useMobile();
  const [view, setView] = useState<View>('days');
  const [editing, setEditing] = useState(false);
  const year = month.getFullYear();
  const [page, setPage] = useState(year - 7);
  const monthNames = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { month: 'long' });
    return Array.from({ length: 12 }, (_, m) => f.format(new Date(2000, m, 1)));
  }, [locale]);
  // Years in the list: from min (or 100 years back) to max (or 20 years on).
  const firstYear = min ? min.getFullYear() : Math.min(year, new Date().getFullYear()) - 100;
  const lastYear = max ? max.getFullYear() : Math.max(year, new Date().getFullYear()) + 20;
  const monthOff = (y: number, m: number) => (!!min && new Date(y, m + 1, 0) < day(min)) || (!!max && new Date(y, m, 1) > day(max));
  const go = (y: number, m: number) => {
    onGo(new Date(y, m, 1));
    setView('days');
  };
  const typeYear = (text: string) => {
    setEditing(false);
    const y = Number(text);
    if (Number.isInteger(y) && y >= 1000 && y <= 9999) go(Math.min(Math.max(y, firstYear), lastYear), month.getMonth());
  };
  const today = day(new Date());
  const eventKeys = useMemo(() => new Set(events.map((e) => key(e))), [events]);
  const titleFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const title = titleFormat.format(month);
  // The title in the locale's order; its month and year parts are pickers.
  const parts = titleFormat.formatToParts(month);
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
          <Button
            variant="ghost"
            tone="tertiary"
            size="small"
            icon={IconArrowLeft}
            aria-label={previousLabel}
            className={styles.previous}
            onClick={() => (view === 'days' ? onPrevious() : view === 'months' ? onGo(new Date(year - 1, month.getMonth(), 1)) : setPage((p) => p - 12))}
          />
        )}
        <span className={styles.title} aria-live="polite">
          {parts.map((part, i) =>
            part.type === 'month' ? (
              mobile ? (
                <button key={i} type="button" className={styles.titleButton} aria-label={`${monthLabel}: ${part.value}`} aria-expanded={view === 'months'} onClick={() => setView((v) => (v === 'months' ? 'days' : 'months'))}>
                  {part.value}
                </button>
              ) : (
                <InlinePicker
                  key={i}
                  className={styles.titlePicker}
                  size="small"
                  align="start"
                  label={monthLabel}
                  value={String(month.getMonth())}
                  options={monthNames.map((name, m) => ({ value: String(m), trigger: part.value, title: name, search: name }))}
                  onPick={(v) => go(year, Number(v))}
                  onDone={() => {}}
                />
              )
            ) : part.type === 'year' ? (
              editing ? (
                <input
                  key={i}
                  className={styles.yearInput}
                  aria-label={yearLabel}
                  inputMode="numeric"
                  maxLength={4}
                  defaultValue={year}
                  autoFocus
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={(e) => typeYear(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') typeYear(e.currentTarget.value);
                    else if (e.key === 'Escape') {
                      e.stopPropagation();
                      setEditing(false);
                    }
                  }}
                />
              ) : mobile ? (
                <button
                  key={i}
                  type="button"
                  className={styles.titleButton}
                  aria-label={`${yearLabel}: ${part.value}`}
                  aria-expanded={view === 'years'}
                  onClick={() => {
                    setPage(year - 7);
                    setView((v) => (v === 'years' ? 'days' : 'years'));
                  }}
                  onDoubleClick={() => {
                    setView('days');
                    setEditing(true);
                  }}
                >
                  {part.value}
                </button>
              ) : (
                <span key={i} className={styles.titlePicker} onDoubleClick={() => setEditing(true)}>
                  <InlinePicker
                    size="small"
                    align="start"
                    label={yearLabel}
                    value={String(year)}
                    options={Array.from({ length: lastYear - firstYear + 1 }, (_, k) => String(firstYear + k)).map((y) => ({ value: y, trigger: part.value, title: y, search: y }))}
                    onPick={(v) => go(Number(v), month.getMonth())}
                    onDone={() => {}}
                  />
                </span>
              )
            ) : (
              <span key={i}>{part.value}</span>
            ),
          )}
        </span>
        {showNext && (
          <Button
            variant="ghost"
            tone="tertiary"
            size="small"
            icon={IconArrowRight}
            aria-label={nextLabel}
            className={styles.next}
            onClick={() => (view === 'days' ? onNext() : view === 'months' ? onGo(new Date(year + 1, month.getMonth(), 1)) : setPage((p) => p + 12))}
          />
        )}
      </div>
      {view !== 'days' ? (
        <div className={styles.choices} style={{ blockSize: `calc(${weeks(month, weekStartsOn).length} * var(--_cell))` }}>
          {view === 'months'
            ? monthNames.map((name, m) => (
                <button
                  key={m}
                  type="button"
                  className={styles.choice}
                  disabled={monthOff(year, m)}
                  data-selected={m === month.getMonth() || undefined}
                  data-today={(year === today.getFullYear() && m === today.getMonth()) || undefined}
                  onClick={() => go(year, m)}
                >
                  {name}
                </button>
              ))
            : Array.from({ length: 12 }, (_, k) => page + k).map((y) => (
                <button
                  key={y}
                  type="button"
                  className={styles.choice}
                  disabled={y < firstYear || y > lastYear}
                  data-selected={y === year || undefined}
                  data-today={y === today.getFullYear() || undefined}
                  onClick={() => go(y, month.getMonth())}
                >
                  {y}
                </button>
              ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}

const withTime = (d: Date, t: TimeValue) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.hours, t.minutes, t.seconds ?? 0);
const timeOf = (d: Date): TimeValue => ({ hours: d.getHours(), minutes: d.getMinutes(), seconds: d.getSeconds() });

function useCalendar(props: CalendarProps, monthCount: number, keepTime = false) {
  const isRange = props.mode === 'range';
  const toRange = (v: Date | null | DateRange | undefined): DateRange => (v == null ? { start: null, end: null } : v instanceof Date ? { start: keepTime ? new Date(v) : day(v), end: null } : v);
  const [inner, setInner] = useState<DateRange>(() => toRange(props.defaultValue));
  const selected = props.value !== undefined ? toRange(props.value) : inner;
  const initial = props.defaultMonth ?? selected.start ?? new Date();
  const [month, setMonth] = useState(() => new Date(initial.getFullYear(), initial.getMonth(), 1));
  const [focus, setFocus] = useState(() => day(selected.start ?? new Date()));
  const [keyboard, setKeyboard] = useState(false);

  const clamp = (d: Date) => (props.min && d < props.min ? new Date(props.min) : props.max && d > props.max ? new Date(props.max) : d);

  const commit = (range: DateRange) => {
    if (props.value === undefined) setInner(range);
    if (props.mode === 'range') props.onChange?.(range);
    else if (range.start) props.onChange?.(range.start);
  };

  const pick = (d: Date) => {
    setFocus(d);
    // With time, a new day keeps the chosen time, moved inside min and max when it falls outside.
    if (!isRange) return commit({ start: keepTime ? clamp(selected.start ? withTime(d, timeOf(selected.start)) : d) : d, end: null });
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

  // A time before any day is chosen goes on the focused day (today at first).
  const pickTime = (t: TimeValue) => commit({ start: clamp(withTime(selected.start ?? focus, t)), end: null });

  return { isRange, selected, month, setMonth, focus, keyboard, pick, moveFocus, commit, pickTime };
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
  const { months = 1, presets, time, bare = false, min, max, isDateDisabled, events, weekStartsOn, locale, previousLabel, nextLabel, monthLabel, yearLabel, className, mode: _mode, value: _value, defaultValue: _default, onChange: _onChange, defaultMonth: _month, ...rest } = props;
  const showTime = !!time && props.mode !== 'range';
  const timeOptions = typeof time === 'object' ? time : {};
  const cal = useCalendar(props, months, showTime);
  // On the min and max days, the hours, minutes and seconds outside them cannot be chosen.
  const timeBlocked = (unit: 'hours' | 'minutes' | 'seconds', v: number) => {
    const d = cal.selected.start ?? cal.focus;
    const t = cal.selected.start ? timeOf(cal.selected.start) : { hours: 0, minutes: 0, seconds: 0 };
    const at = (h: number, m: number, s: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s);
    const [first, last] =
      unit === 'hours' ? [at(v, 0, 0), at(v, 59, 59)] : unit === 'minutes' ? [at(t.hours, v, 0), at(t.hours, v, 59)] : [at(t.hours, t.minutes, v), at(t.hours, t.minutes, v)];
    return (!!min && last < min) || (!!max && first > max);
  };
  const shared = { min, max, isDateDisabled, events, weekStartsOn, locale, previousLabel, nextLabel, monthLabel, yearLabel };
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
              onGo={(m) => cal.setMonth(addMonths(m, -i))}
              autoFocus={cal.keyboard && cal.focus.getMonth() === month.getMonth() && cal.focus.getFullYear() === month.getFullYear()}
            />
          </div>
        );
      })}
      {showTime && (
        <div className={[styles.panel, styles.time].join(' ')}>
          <div className={styles.header}>
            <span className={styles.title}>{timeOptions.label ?? 'Time'}</span>
          </div>
          <div className={styles.timeBody}>
            <TimePicker
              data-embedded=""
              showSeconds={timeOptions.showSeconds ?? false}
              step={timeOptions.step}
              isDisabled={(unit, v) => timeBlocked(unit, v) || (timeOptions.isDisabled?.(unit, v) ?? false)}
              labels={timeOptions.labels}
              value={cal.selected.start ? timeOf(cal.selected.start) : null}
              onChange={cal.pickTime}
            />
          </div>
        </div>
      )}
    </div>
  );
}
