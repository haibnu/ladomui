'use client';

import { useState } from 'react';
import { IconAdd, IconDelete } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { Agenda, type AgendaEvent, type AgendaLabels, type AgendaRange } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type WeekStart = 'auto' | '1' | '0';
type Clock = 'auto' | '24' | '12';
type Max = 'auto' | '2' | '3';

const TR_LABELS: Partial<AgendaLabels> = {
  today: 'Bugün',
  previous: 'Önceki',
  next: 'Sonraki',
  view: 'Görünüm',
  views: { month: 'Ay', week: 'Hafta', day: 'Gün', list: 'Liste' },
  allDay: 'Tüm gün',
  more: (n) => `+${n} daha`,
  noEvents: 'Etkinlik yok',
  close: 'Kapat',
  unconfirmed: 'Onaylanmadı',
  declined: 'Reddedildi',
};

const COPY = {
  en: {
    weekStart: 'Week starts on',
    weekStarts: { auto: 'Locale', '1': 'Monday', '0': 'Sunday' },
    clock: 'Clock',
    clocks: { auto: 'Locale', '24': '24 hour', '12': '12 hour' },
    zone: 'Time zone',
    zones: { local: 'This device', 'Europe/Istanbul': 'Istanbul', 'America/New_York': 'New York', 'Asia/Tokyo': 'Tokyo' },
    max: 'Events per day',
    maxes: { auto: 'Fit the cell', '2': '2', '3': '3' },
    editing: 'Drag to create, move and resize',
    details: 'Details panel',
    newEvent: 'New event',
    untitled: 'New event',
    delete: 'Delete',
    code: 'Code',
    events: {
      standup: 'Standup',
      review: 'Design review',
      oneOnOne: '1:1 with Elif',
      interview: 'Interview: frontend',
      lunch: 'Lunch & learn',
      vendor: 'Vendor call',
      offsite: 'Team offsite',
      leave: 'Ece on leave',
      planning: 'Sprint planning',
      release: 'Release 2.4',
      conference: 'Design conference',
      holiday: 'Company holiday',
      payroll: 'Payroll run',
      sync: 'Team sync',
      retro: 'Retro',
      demo: 'Demo day',
      budget: 'Budget review',
      onboarding: 'Onboarding: Deniz',
      room: 'Room 3',
      online: 'Online',
      reviewNote: 'Walk through the new onboarding flow and agree on the next steps.',
    },
  },
  tr: {
    weekStart: 'Hafta başlangıcı',
    weekStarts: { auto: 'Yerel ayar', '1': 'Pazartesi', '0': 'Pazar' },
    clock: 'Saat',
    clocks: { auto: 'Yerel ayar', '24': '24 saat', '12': '12 saat' },
    zone: 'Saat dilimi',
    zones: { local: 'Bu cihaz', 'Europe/Istanbul': 'İstanbul', 'America/New_York': 'New York', 'Asia/Tokyo': 'Tokyo' },
    max: 'Gün başına etkinlik',
    maxes: { auto: 'Hücreye sığdır', '2': '2', '3': '3' },
    editing: 'Sürükleyerek oluştur, taşı, boyutlandır',
    details: 'Detay paneli',
    newEvent: 'Yeni etkinlik',
    untitled: 'Yeni etkinlik',
    delete: 'Sil',
    code: 'Kod',
    events: {
      standup: 'Günlük toplantı',
      review: 'Tasarım incelemesi',
      oneOnOne: 'Elif ile birebir',
      interview: 'Mülakat: frontend',
      lunch: 'Öğle sunumu',
      vendor: 'Tedarikçi görüşmesi',
      offsite: 'Ekip offsite',
      leave: 'Ece izinde',
      planning: 'Sprint planlama',
      release: 'Sürüm 2.4',
      conference: 'Tasarım konferansı',
      holiday: 'Şirket tatili',
      payroll: 'Bordro çalıştırma',
      sync: 'Ekip toplantısı',
      retro: 'Retro',
      demo: 'Demo günü',
      budget: 'Bütçe incelemesi',
      onboarding: 'Oryantasyon: Deniz',
      room: 'Salon 3',
      online: 'Çevrim içi',
      reviewNote: 'Yeni oryantasyon akışını gözden geçirip sonraki adımlarda anlaşalım.',
    },
  },
};

type Names = (typeof COPY)['en']['events'];

/** Sample events around the current week, so the playground always has something to show. */
function sampleEvents(n: Names): AgendaEvent[] {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const at = (day: number, h: number, m = 0) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + day, h, m);
  const day = (d: number) => at(d, 0);
  return [
    { id: 'standup-0', title: n.standup, start: at(0, 9, 30), end: at(0, 9, 45), color: 1 },
    { id: 'review', title: n.review, start: at(0, 11), end: at(0, 12, 30), color: 2, location: n.room, description: n.reviewNote },
    { id: 'one-on-one', title: n.oneOnOne, start: at(0, 11, 30), end: at(0, 12), color: 3, location: n.online },
    { id: 'interview', title: n.interview, start: at(1, 14), end: at(1, 15, 30), color: 4, status: 'unconfirmed', location: n.online },
    { id: 'standup-2', title: n.standup, start: at(2, 9, 30), end: at(2, 9, 45), color: 1 },
    { id: 'lunch', title: n.lunch, start: at(2, 12, 30), end: at(2, 13, 30), color: 5, location: n.room },
    { id: 'vendor', title: n.vendor, start: at(3, 10), end: at(3, 11), color: 6, status: 'declined' },
    { id: 'offsite', title: n.offsite, start: day(3), end: day(4), allDay: true, color: 2 },
    { id: 'leave', title: n.leave, start: day(4), end: day(4), allDay: true, color: 3 },
    { id: 'standup-4', title: n.standup, start: at(4, 9, 30), end: at(4, 9, 45), color: 1 },
    { id: 'sync', title: n.sync, start: at((now.getDay() + 6) % 7, 15), end: at((now.getDay() + 6) % 7, 16), color: 4, location: n.room },
    { id: 'payroll', title: n.payroll, start: at(-3, 10), end: at(-3, 11), color: 6, readOnly: true },
    { id: 'retro', title: n.retro, start: at(-3, 16), end: at(-3, 17), color: 5 },
    { id: 'planning', title: n.planning, start: at(7, 10), end: at(7, 12), color: 1 },
    { id: 'conference', title: n.conference, start: day(8), end: day(10), allDay: true, color: 5 },
    { id: 'release', title: n.release, start: at(9, 17), end: at(9, 18), color: 4 },
    { id: 'demo', title: n.demo, start: at(9, 13), end: at(9, 14), color: 2 },
    { id: 'budget', title: n.budget, start: at(9, 9), end: at(9, 10), color: 6 },
    { id: 'onboarding', title: n.onboarding, start: at(9, 11), end: at(9, 12), color: 3 },
    { id: 'holiday', title: n.holiday, start: day(-6), end: day(-6), allDay: true, color: 6 },
  ];
}

let created = 0;

export function AgendaPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [events, setEvents] = useState(() => sampleEvents(c.events));
  const [weekStart, setWeekStart] = useState<WeekStart>('auto');
  const [clock, setClock] = useState<Clock>('auto');
  const [zone, setZone] = useState<keyof typeof c.zones>('local');
  const [max, setMax] = useState<Max>('auto');
  const [editing, setEditing] = useState(true);
  const [details, setDetails] = useState(true);

  const update = (id: string, r: AgendaRange) => setEvents((list) => list.map((e) => (e.id === id ? { ...e, start: r.start, end: r.end, allDay: r.allDay } : e)));
  const remove = (id: string) => setEvents((list) => list.filter((e) => e.id !== id));
  const add = (r: AgendaRange) => setEvents((list) => [...list, { id: `new-${++created}`, title: c.untitled, start: r.start, end: r.end, allDay: r.allDay, color: 1 }]);
  const addNow = () => {
    const s = new Date();
    s.setMinutes(0, 0, 0);
    s.setHours(s.getHours() + 1);
    add({ start: s, end: new Date(s.getTime() + 3600_000), allDay: false });
  };

  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const props = [
    `locale="${locale}"`,
    ...(weekStart !== 'auto' ? [`weekStartsOn={${weekStart}}`] : []),
    ...(clock !== 'auto' ? [`hourCycle={${clock}}`] : []),
    ...(zone !== 'local' ? [`timeZone="${zone}"`] : []),
    ...(max !== 'auto' ? [`maxEvents={${max}}`] : []),
    ...(editing
      ? [
          'onEventCreate={(range) => addEvent(range)}',
          'onEventMove={(event, range) => updateEvent(event.id, range)}',
          'onEventResize={(event, range) => updateEvent(event.id, range)}',
          'onEventDelete={(event) => removeEvent(event.id)}',
        ]
      : []),
    ...(details ? ['renderEventDetails={(event, close) => <Button …>Delete</Button>}'] : ['eventDetails={false}']),
  ];
  const code = `import { Agenda } from '@ladom/ui/pro';\n\n<div style={{ blockSize: '100dvh' }}>\n  <Agenda\n    events={events}\n${props.map((p) => `    ${p}`).join('\n')}\n  />\n</div>`;

  return (
    <div className={`${styles.playground} ${styles.playgroundWide}`}>
      <div className={styles.stage} style={{ placeItems: 'stretch', padding: 'var(--space-medium)' }}>
        <div style={{ blockSize: 'calc(7 * var(--grid-column-1))', minBlockSize: 0 }}>
          <Agenda
            events={events}
            locale={locale}
            labels={lang === 'tr' ? TR_LABELS : undefined}
            weekStartsOn={weekStart === 'auto' ? undefined : (Number(weekStart) as 0 | 1)}
            hourCycle={clock === 'auto' ? undefined : (Number(clock) as 12 | 24)}
            timeZone={zone === 'local' ? undefined : zone}
            maxEvents={max === 'auto' ? 'auto' : Number(max)}
            onEventCreate={editing ? add : undefined}
            onEventMove={editing ? (e, r) => update(e.id, r) : undefined}
            onEventResize={editing ? (e, r) => update(e.id, r) : undefined}
            onEventDelete={editing ? (e) => remove(e.id) : undefined}
            eventDetails={details}
            renderEventDetails={(e, close) =>
              e.readOnly ? null : (
                <Button
                  size="small"
                  variant="ghost"
                  tone="error"
                  iconLeft={IconDelete}
                  onClick={() => {
                    close();
                    remove(e.id);
                  }}
                >
                  {c.delete}
                </Button>
              )
            }
            actions={
              <Button size="small" iconLeft={IconAdd} onClick={addNow}>
                {c.newEvent}
              </Button>
            }
          />
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.weekStart} value={weekStart} onChange={setWeekStart} options={(Object.keys(c.weekStarts) as WeekStart[]).map((k) => ({ value: k, label: c.weekStarts[k] }))} />
        <ControlSelect label={c.clock} value={clock} onChange={setClock} options={(Object.keys(c.clocks) as Clock[]).map((k) => ({ value: k, label: c.clocks[k] }))} />
        <ControlSelect label={c.zone} value={zone} onChange={setZone} options={(Object.keys(c.zones) as (keyof typeof c.zones)[]).map((k) => ({ value: k, label: c.zones[k] }))} />
        <ControlSelect label={c.max} value={max} onChange={setMax} options={(Object.keys(c.maxes) as Max[]).map((k) => ({ value: k, label: c.maxes[k] }))} />
        <ControlCheck label={c.editing} checked={editing} onChange={setEditing} />
        <ControlCheck label={c.details} checked={details} onChange={setDetails} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
