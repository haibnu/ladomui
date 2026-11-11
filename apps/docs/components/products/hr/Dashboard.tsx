'use client';

import { useRouter } from 'next/navigation';
import { IconArrowRight, IconContacts, IconCurrencyTl, IconDateRange, IconTime } from '@ladom/icons';
import { Avatar, Badge, Button, Cell } from '@ladom/ui';
import { BarList, Card, Meter, PageHeader, StatCard, type StatCardProps } from '@ladom/ui/pro';
import { href } from '@/i18n';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES, LEAVES, checkIn, date, employee, money, payrollEmployees, payslip, type Department } from './data';
import styles from './hr.module.css';

export function Dashboard() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const router = useRouter();
  const d = c.dashboard;
  const pending = LEAVES.filter((l) => l.status === 'pending');
  const onLeave = EMPLOYEES.filter((e) => e.status === 'onLeave');
  const probation = EMPLOYEES.filter((e) => e.status === 'probation');
  const cost = payrollEmployees('2026-11').reduce((n, e) => n + payslip(e.gross).cost, 0);
  const birthdays = EMPLOYEES.filter((e) => e.birthday.startsWith('11-')).sort((a, b) => a.birthday.localeCompare(b.birthday));
  const newcomers = [...EMPLOYEES].sort((a, b) => b.start.localeCompare(a.start)).slice(0, 3);
  const departments = Object.keys(c.departments) as Department[];
  const counts = departments.map((k) => ({
    k,
    n: EMPLOYEES.filter((e) => e.department === k).length,
  }));
  const working = EMPLOYEES.filter((e) => checkIn(e) !== null).length;
  const expected = EMPLOYEES.filter((e) => e.status !== 'onLeave').length;

  // Sample history for the charts: the last 12 months, or this week, ending at today's figures.
  const fmtMoney = (n: number) => money(lang, n, 0);
  const fmtNumber = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US').format(Math.round(n));
  const stats: (StatCardProps & { key: string })[] = [
    {
      key: 'headcount',
      icon: <IconContacts />,
      label: d.headcount,
      value: EMPLOYEES.length,
      delta: { value: '+2', direction: 'up', label: d.vsLastMonth },
      data: [11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 14, EMPLOYEES.length],
      chart: 'line',
      labels: [...d.months],
    },
    {
      key: 'onLeave',
      icon: <IconTime />,
      label: d.onLeave,
      value: onLeave.length,
      note: d.onLeaveNote,
      data: [1, 3, onLeave.length, 4, 2, 0, 0],
      chart: 'bars',
      tone: 'warning',
      labels: [...d.days],
    },
    {
      key: 'pending',
      icon: <IconDateRange />,
      label: d.pending,
      value: pending.length,
      delta: { value: '+1', direction: 'up', tone: 'neutral', label: d.vsLastWeek },
      data: [2, 3, 1, 3, 2, 3, pending.length],
      chart: 'step',
      labels: [...d.days],
    },
    {
      key: 'payroll',
      icon: <IconCurrencyTl />,
      label: d.payroll,
      value: cost,
      format: fmtMoney,
      delta: { value: '+4.1%', direction: 'up', tone: 'neutral', label: d.vsLastMonth },
      data: [1.71, 1.74, 1.78, 1.79, 1.83, 1.84, 1.86, 1.88, 1.9, 1.93, 1.96, cost / 1e6].map((m) => Math.round(m * 1e6)),
      labels: [...d.months],
    },
  ];

  const person = (e: (typeof EMPLOYEES)[number], subtitle: string) => (
    <Cell key={e.id} size="small" avatar={<Avatar size="tiny" name={e.name} />} subtitle={subtitle}>
      {e.name}
    </Cell>
  );

  return (
    <>
      <PageHeader className={styles.pageHeader} title={d.title} subtitle={d.subtitle} />
      <div className={styles.stats}>
        {stats.map((s) => {
          const { key, ...props } = s;
          return <StatCard key={key} format={props.format ?? fmtNumber} hover {...props} />;
        })}
      </div>
      <div className={styles.columns}>
        <div className={styles.stack}>
          <Card
            title={d.approvals}
            actions={
              <Button variant="ghost" tone="secondary" size="small" iconRight={IconArrowRight} onClick={() => router.push(href(lang, '/products/hr/leave'))}>
                {d.reviewAll}
              </Button>
            }
          >
            <div className={styles.list}>
              {pending.map((l) => {
                const e = employee(l.employee);
                return (
                  <Cell
                    key={l.id}
                    avatar={<Avatar size="small" name={e.name} />}
                    subtitle={`${c.leaveTypes[l.type]} · ${date(lang, l.start, { day: 'numeric', month: 'short' })} – ${date(lang, l.end, { day: 'numeric', month: 'short' })}`}
                    badgeRight={
                      <Badge size="tiny" tone="warning">
                        {c.employees.days(l.days)}
                      </Badge>
                    }
                  >
                    {e.name}
                  </Cell>
                );
              })}
            </div>
          </Card>
          <Card title={d.byDepartment}>
            <BarList
              variant="row"
              columns={[c.employees.department, d.headcount, c.status.onLeave]}
              items={counts.map(({ k, n }) => ({ key: k, label: c.departments[k], value: n, values: [EMPLOYEES.filter((e) => e.department === k && e.status === 'onLeave').length] }))}
            />
          </Card>
        </div>
        <div className={styles.stack}>
          <Card
            title={d.payrollCard}
            actions={
              <Badge size="small" tone="warning">
                {c.payroll.monthStatus.draft}
              </Badge>
            }
            footer={
              <Button size="small" onClick={() => router.push(href(lang, '/products/hr/payroll'))}>
                {d.openPayroll}
              </Button>
            }
          >
            <p className={styles.muted}>{d.payrollText}</p>
          </Card>
          <Card title={d.attendance}>
            <p className={styles.muted}>{d.checkedIn(working, expected)}</p>
            <Meter value={working} max={expected} aria-label={d.attendance} />
          </Card>
          <Card title={d.birthdays}>
            <div className={styles.list}>{birthdays.map((e) => person(e, date(lang, `2026-${e.birthday}`, { day: 'numeric', month: 'long' })))}</div>
          </Card>
          <Card title={d.newcomers}>
            <div className={styles.list}>{newcomers.map((e) => person(e, d.started(date(lang, e.start))))}</div>
          </Card>
        </div>
      </div>
    </>
  );
}
