'use client';

import { useState } from 'react';
import { DatePicker } from '@ladom/ui';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { locale: 'en-GB', title: 'Time', hours: 'Hours', minutes: 'Minutes', previous: 'Previous month', next: 'Next month', month: 'Month', year: 'Year', chosen: 'Chosen', none: 'nothing yet' },
  tr: { locale: 'tr-TR', title: 'Saat', hours: 'Saat', minutes: 'Dakika', previous: 'Önceki ay', next: 'Sonraki ay', month: 'Ay', year: 'Yıl', chosen: 'Seçilen', none: 'henüz yok' },
};

// A single DatePicker with time: the hour and minute columns sit beside the month in its panel.
export function DatePickerTimeDemo() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [when, setWhen] = useState<Date | null>(null);
  const fmt = new Intl.DateTimeFormat(c.locale, { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-medium)' }}>
      <DatePicker
        value={when}
        onChange={setWhen}
        locale={c.locale}
        previousLabel={c.previous}
        nextLabel={c.next}
        monthLabel={c.month}
        yearLabel={c.year}
        time={{ label: c.title, step: 15, labels: { hours: c.hours, minutes: c.minutes } }}
      />
      <p style={{ margin: 0, font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>
        {c.chosen}: {when ? fmt.format(when) : c.none}
      </p>
    </div>
  );
}
