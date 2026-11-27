'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, FormField, Input } from '@ladom/ui';
import { IconDateTime } from '@ladom/icons';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { locale: 'en-GB', pickup: 'Pick-up', ret: 'Return', placeholder: 'Choose a date and time', time: 'Time', hours: 'Hours', minutes: 'Minutes', previous: 'Previous month', next: 'Next month', month: 'Month', year: 'Year', hint: 'After the pick-up', days: (n: number) => `${n} day${n === 1 ? '' : 's'}`, none: 'Choose both dates', search: 'Find Cars' },
  tr: { locale: 'tr-TR', pickup: 'Alış', ret: 'Dönüş', placeholder: 'Tarih ve saat seçin', time: 'Saat', hours: 'Saat', minutes: 'Dakika', previous: 'Önceki ay', next: 'Sonraki ay', month: 'Ay', year: 'Yıl', hint: 'Alıştan sonra', days: (n: number) => `${n} gün`, none: 'İki tarihi de seçin', search: 'Araç Ara' },
};

type Copy = (typeof COPY)['en'];

// One field: a read-only Input that opens a DatePicker with time under it. A press outside or
// Escape closes it.
function DateTimeField({ label, hint, value, onChange, min, align, c }: { label: string; hint?: string; value: Date | null; onChange: (d: Date) => void; min: Date; align: 'start' | 'end'; c: Copy }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const fmt = new Intl.DateTimeFormat(c.locale, { dateStyle: 'medium', timeStyle: 'short' });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <div
      ref={box}
      style={{ position: 'relative' }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          setOpen(false);
          box.current?.querySelector('input')?.focus();
        }
      }}
    >
      <FormField label={label} hint={hint}>
        <Input
          readOnly
          iconLeft={<IconDateTime />}
          placeholder={c.placeholder}
          value={value ? fmt.format(value) : ''}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
      </FormField>
      {open && (
        <div role="dialog" aria-label={label} style={{ position: 'absolute', insetBlockStart: 'calc(100% + var(--space-form-dropdown-top))', [align === 'end' ? 'insetInlineEnd' : 'insetInlineStart']: 0, zIndex: 10 }}>
          <DatePicker
            value={value}
            onChange={onChange}
            min={min}
            defaultMonth={value ?? min}
            locale={c.locale}
            previousLabel={c.previous}
            nextLabel={c.next}
            monthLabel={c.month}
            yearLabel={c.year}
            time={{ label: c.time, step: 30, labels: { hours: c.hours, minutes: c.minutes } }}
          />
        </div>
      )}
    </div>
  );
}

const nextHalfHour = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  return d;
};

// A pick-up and return form: two date-and-time fields; the return cannot be before the pick-up.
export function DateTimeFormDemo() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [pickup, setPickup] = useState<Date | null>(null);
  const [ret, setRet] = useState<Date | null>(null);
  const now = nextHalfHour();
  const days = pickup && ret ? Math.max(1, Math.ceil((ret.getTime() - pickup.getTime()) / 864e5)) : null;

  return (
    // The docs example box clips what overflows it, so the demo keeps room under the form for the panel.
    <div style={{ inlineSize: '100%', maxInlineSize: 640, minBlockSize: 560, alignSelf: 'flex-start', marginInline: 'auto' }}>
    <form
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'var(--space-medium)', alignItems: 'start' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <DateTimeField
        c={c}
        label={c.pickup}
        value={pickup}
        min={now}
        align="start"
        onChange={(d) => {
          setPickup(d);
          // A return before the new pick-up is cleared.
          if (ret && ret <= d) setRet(null);
        }}
      />
      <DateTimeField c={c} label={c.ret} hint={c.hint} value={ret} min={pickup ?? now} align="end" onChange={setRet} />
      <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-medium)' }}>
        <span style={{ font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>{days ? c.days(days) : c.none}</span>
        <Button type="submit" disabled={!days}>
          {c.search}
        </Button>
      </div>
    </form>
    </div>
  );
}
