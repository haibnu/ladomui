'use client';

import { useState } from 'react';
import { IconSends } from '@ladom/icons';
import { Badge, Button, Segment, Table, useToast, type BadgeTone, type TableColumn } from '@ladom/ui';
import { PageHeader, PersonCell } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES, SHIFT_HOURS, WEEK, checkIn, date, weekShifts, type Employee, type Shift } from './data';
import styles from './hr.module.css';

const SHIFT_TONE: Record<Shift, BadgeTone> = {
  day: 'primary',
  early: 'secondary',
  late: 'tertiary',
  remote: 'default',
  leave: 'warning',
  off: 'default',
};
const HOURS: Record<Shift, number> = {
  day: 8,
  early: 8,
  late: 8,
  remote: 8,
  leave: 0,
  off: 0,
};

export function Timesheet() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.timesheet;
  const { toast } = useToast();
  const [view, setView] = useState('shifts');
  const [published, setPublished] = useState(false);

  const person = (e: Employee) => (
    <PersonCell name={e.name} subtitle={c.departments[e.department]} />
  );

  const shiftColumns: TableColumn<Employee>[] = [
    { key: 'employee', header: t.employee, cell: person },
    ...WEEK.map((day, i) => ({
      key: day,
      header: date(lang, day, { weekday: 'short', day: 'numeric' }),
      cell: (e: Employee) => {
        const s = weekShifts(e)[i]!;
        if (s === 'off') return <span className={styles.shiftHours}>{c.shifts.off}</span>;
        return (
          <span className={styles.shift}>
            <Badge size="tiny" tone={SHIFT_TONE[s]} filled={s === 'day'}>
              {c.shifts[s]}
            </Badge>
            {SHIFT_HOURS[s] && <span className={styles.shiftHours}>{SHIFT_HOURS[s]}</span>}
          </span>
        );
      },
    })),
    {
      key: 'total',
      header: t.total,
      align: 'end',
      cell: (e) => <span className={styles.num}>{weekShifts(e).reduce((n, s) => n + HOURS[s], 0)}</span>,
    },
  ];

  const state = (e: Employee) => {
    const s = weekShifts(e)[2]!;
    if (s === 'leave') return { label: t.away, tone: 'warning' as BadgeTone };
    const time = checkIn(e);
    if (!time) return { label: t.notIn, tone: 'error' as BadgeTone };
    const start = s === 'early' ? '07:00' : s === 'late' ? '13:00' : '09:00';
    return time > start ? { label: t.late, tone: 'warning' as BadgeTone } : { label: t.onTime, tone: 'success' as BadgeTone };
  };

  const attendanceColumns: TableColumn<Employee>[] = [
    { key: 'employee', header: t.employee, cell: person },
    {
      key: 'shift',
      header: t.shift,
      cell: (e) => {
        const s = weekShifts(e)[2]!;
        return `${c.shifts[s]}${SHIFT_HOURS[s] ? ` · ${SHIFT_HOURS[s]}` : ''}`;
      },
    },
    {
      key: 'in',
      header: t.checkIn,
      cell: (e) => <span className={styles.num}>{checkIn(e) ?? '—'}</span>,
    },
    {
      key: 'out',
      header: t.checkOut,
      cell: () => <span className={styles.num}>—</span>,
    },
    {
      key: 'state',
      header: t.state,
      align: 'end',
      cell: (e) => {
        const s = state(e);
        return (
          <Badge size="small" tone={s.tone}>
            {s.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button
            iconLeft={IconSends}
            disabled={published}
            onClick={() => {
              setPublished(true);
              toast({
                tone: 'success',
                title: t.published,
                description: t.publishedText,
              });
            }}
          >
            {t.publish}
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <Segment
          value={view}
          onChange={setView}
          options={[
            { value: 'shifts', label: t.view.shifts },
            { value: 'attendance', label: t.view.attendance },
          ]}
        />
        <span className={styles.statNote}>
          {view === 'shifts'
            ? t.week
            : date(lang, WEEK[2]!, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
        </span>
      </div>
      <div className={styles.tableWrap}>
        {view === 'shifts' ? <Table columns={shiftColumns} rows={EMPLOYEES} rowKey={(e) => e.id} /> : <Table columns={attendanceColumns} rows={EMPLOYEES} rowKey={(e) => e.id} />}
      </div>
      {view === 'shifts' && (
        <div className={styles.legend} aria-label={t.legend}>
          {(['day', 'early', 'late', 'remote', 'leave'] as Shift[]).map((s) => (
            <Badge key={s} size="small" tone={SHIFT_TONE[s]} filled={s === 'day'}>
              {c.shifts[s]} {SHIFT_HOURS[s]}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}
