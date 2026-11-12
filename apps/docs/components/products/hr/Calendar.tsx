'use client';

import { useState } from 'react';
import { IconCheck, IconClose } from '@ladom/icons';
import { Button, useToast } from '@ladom/ui';
import { Agenda, PageHeader, type AgendaColor, type AgendaEvent, type AgendaLabels } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { LEAVES, employee, type LeaveRequest, type LeaveStatus, type LeaveType } from './data';
import styles from './hr.module.css';

// Leave colors by type, then public holidays and company dates.
const TYPE_COLOR: Record<LeaveType, AgendaColor> = { annual: 1, sick: 4, unpaid: 5, excuse: 3 };
const HOLIDAY: AgendaColor = 6;
const COMPANY: AgendaColor = 2;

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
  unconfirmed: 'Onay bekliyor',
  declined: 'Reddedildi',
};

const day = (iso: string, h = 0, m = 0) => {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(y!, mo! - 1, d!, h, m);
};
const STATUS = { pending: 'unconfirmed', approved: 'confirmed', rejected: 'declined' } as const;

/** The leave calendar: everyone's leave by type, public holidays and company dates on an Agenda. */
export function Calendar() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.calendar;
  const { toast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>(LEAVES);

  const leaveEvents: AgendaEvent[] = requests.map((r) => {
    const e = employee(r.employee);
    return {
      id: r.id,
      title: `${e.name} · ${c.leaveTypes[r.type]}`,
      start: day(r.start),
      end: day(r.end),
      allDay: true,
      color: TYPE_COLOR[r.type],
      status: STATUS[r.status],
      readOnly: true,
      location: c.departments[e.department],
    };
  });
  const fixed: AgendaEvent[] = [
    { id: 'h-republic-eve', title: t.events.republicEve, start: day('2026-10-28', 13), end: day('2026-10-28', 18), color: HOLIDAY, readOnly: true, location: t.holiday },
    { id: 'h-republic', title: t.events.republic, start: day('2026-10-29'), end: day('2026-10-29'), allDay: true, color: HOLIDAY, readOnly: true, location: t.holiday },
    { id: 'h-new-year', title: t.events.newYear, start: day('2027-01-01'), end: day('2027-01-01'), allDay: true, color: HOLIDAY, readOnly: true, location: t.holiday },
    { id: 'c-payday-11', title: t.events.payday, start: day('2026-11-30'), end: day('2026-11-30'), allDay: true, color: COMPANY, readOnly: true, location: t.company },
    { id: 'c-payday-10', title: t.events.payday, start: day('2026-10-30'), end: day('2026-10-30'), allDay: true, color: COMPANY, readOnly: true, location: t.company },
    { id: 'c-all-hands', title: t.events.allHands, start: day('2026-11-19', 15), end: day('2026-11-19', 16), color: COMPANY, readOnly: true, location: t.company },
    { id: 'c-training', title: t.events.training, start: day('2026-11-11', 10), end: day('2026-11-11', 12), color: COMPANY, readOnly: true, location: t.company },
    { id: 'c-planning', title: t.events.planning, start: day('2026-12-03', 9, 30), end: day('2026-12-03', 12), color: COMPANY, readOnly: true, location: t.company },
  ];

  const decide = (id: string, status: LeaveStatus) => {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({
      tone: status === 'approved' ? 'success' : 'error',
      title: status === 'approved' ? c.leave.approved : c.leave.rejected,
      description: employee(requests.find((r) => r.id === id)!.employee).name,
    });
  };

  const legend: [AgendaColor, string][] = [
    ...(Object.keys(TYPE_COLOR) as LeaveType[]).map((k) => [TYPE_COLOR[k], c.leaveTypes[k]] as [AgendaColor, string]),
    [HOLIDAY, t.holiday],
    [COMPANY, t.company],
  ];

  return (
    <>
      <PageHeader className={styles.pageHeader} title={t.title} subtitle={t.subtitle} />
      <ul className={styles.legend} aria-label={t.legend}>
        {legend.map(([color, label]) => (
          <li key={label}>
            <span className={styles.legendDot} style={{ background: `var(--color-chart-${color})` }} aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
      <div className={styles.calendar}>
        <Agenda
          events={[...fixed, ...leaveEvents]}
          defaultDate={new Date(2026, 10, 12)}
          locale={lang === 'tr' ? 'tr-TR' : 'en-GB'}
          labels={lang === 'tr' ? TR_LABELS : { unconfirmed: t.pending }}
          headingLevel={2}
          renderEventDetails={(ev, close) => {
            const r = requests.find((x) => x.id === ev.id);
            if (!r || r.status !== 'pending') return null;
            return (
              <>
                <Button
                  size="small"
                  variant="ghost"
                  tone="error"
                  iconLeft={IconClose}
                  onClick={() => {
                    close();
                    decide(r.id, 'rejected');
                  }}
                >
                  {t.reject}
                </Button>
                <Button
                  size="small"
                  tone="success"
                  iconLeft={IconCheck}
                  onClick={() => {
                    close();
                    decide(r.id, 'approved');
                  }}
                >
                  {t.approve}
                </Button>
              </>
            );
          }}
        />
      </div>
    </>
  );
}
