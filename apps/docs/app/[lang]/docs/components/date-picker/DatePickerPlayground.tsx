'use client';

import { useMemo, useState } from 'react';
import { Calendar, DatePicker, type DateRange } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Type = 'basic' | 'default' | 'full';
const COPY = {
  en: { type: 'Type', range: 'Range', events: 'Events', weekStart: 'Week starts on Monday', figma: 'Figma variant', code: 'Code', chosen: 'Chosen', none: 'nothing yet', presets: ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'This month', 'Last month'] },
  tr: { type: 'Tip', range: 'Aralık', events: 'Etkinlikler', weekStart: 'Hafta pazartesi başlar', figma: 'Figma varyantı', code: 'Kod', chosen: 'Seçilen', none: 'henüz yok', presets: ['Bugün', 'Dün', 'Son 7 gün', 'Son 30 gün', 'Bu ay', 'Geçen ay'] },
};

const at = (offset: number) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + offset);
};

export function DatePickerPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [type, setType] = useState<Type>('default');
  const [range, setRange] = useState(false);
  const [events, setEvents] = useState(true);
  const [monday, setMonday] = useState(true);
  const [single, setSingle] = useState<Date | null>(at(0));
  const [span, setSpan] = useState<DateRange>({ start: at(-3), end: at(3) });
  const eventDays = useMemo(() => [at(2), at(5), at(9)], []);

  const now = new Date();
  const presets = [
    { label: c.presets[0], range: { start: at(0), end: at(0) } },
    { label: c.presets[1], range: { start: at(-1), end: at(-1) } },
    { label: c.presets[2], range: { start: at(-6), end: at(0) } },
    { label: c.presets[3], range: { start: at(-29), end: at(0) } },
    { label: c.presets[4], range: { start: new Date(now.getFullYear(), now.getMonth(), 1), end: at(0) } },
    { label: c.presets[5], range: { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) } },
  ];
  const isRange = range || type === 'full';
  const shared = { locale: lang === 'tr' ? 'tr-TR' : 'en-GB', weekStartsOn: (monday ? 1 : 0) as 0 | 1, events: events ? eventDays : undefined, previousLabel: lang === 'tr' ? 'Önceki ay' : 'Previous month', nextLabel: lang === 'tr' ? 'Sonraki ay' : 'Next month' };
  const valueProps = isRange ? ({ mode: 'range', value: span, onChange: setSpan } as const) : ({ value: single, onChange: setSingle } as const);
  const picker =
    type === 'basic' ? <Calendar {...shared} {...valueProps} /> : type === 'full' ? <DatePicker {...shared} mode="range" value={span} onChange={setSpan} months={2} presets={presets} /> : <DatePicker {...shared} {...valueProps} />;
  const fmt = new Intl.DateTimeFormat(shared.locale, { dateStyle: 'medium' });
  const chosen = isRange ? [span.start, span.end].map((d) => (d ? fmt.format(d) : '…')).join(' – ') : single ? fmt.format(single) : c.none;

  const tag = type === 'basic' ? 'Calendar' : 'DatePicker';
  const props = [
    isRange && 'mode="range"',
    'value={value}',
    'onChange={setValue}',
    type === 'full' && 'months={2}',
    type === 'full' && 'presets={presets}',
    events && 'events={eventDays}',
    !monday && 'weekStartsOn={0}',
  ].filter(Boolean);
  const code = `import { ${tag} } from '@ladom/ui';\n\n<${tag}${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figma = `Date Picker\n🎛 Type=${{ basic: 'Basic', default: 'Default', full: 'Full Control' }[type]}\n\nDate Day\nType=${isRange ? 'Recurring Start / Recurring / Recurring End' : 'Day'}${events ? ', Event' : ''}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ flexDirection: 'column', gap: 'var(--space-medium)', overflowX: 'auto' }}>
        {picker}
        <p style={{ margin: 0, font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>
          {c.chosen}: {chosen}
        </p>
      </div>
      <div className={styles.controls}>
        <ControlSelect
          label={c.type}
          value={type}
          options={[
            { value: 'basic', label: 'basic' },
            { value: 'default', label: 'default' },
            { value: 'full', label: 'full control' },
          ]}
          onChange={setType}
        />
        <ControlCheck label={c.range} checked={isRange} disabled={type === 'full'} onChange={setRange} />
        <ControlCheck label={c.events} checked={events} onChange={setEvents} />
        <ControlCheck label={c.weekStart} checked={monday} onChange={setMonday} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
