'use client';

import { useRouter } from 'next/navigation';
import { IconArrowRight, IconContacts, IconCurrencyTl, IconDateRange, IconTime } from '@ladom/icons';
import { Avatar, Badge, Button, Cell } from '@ladom/ui';
import { BarList, Card, Meter, PageHeader, StatCard } from '@ladom/ui/pro';
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

  const stats = [
    {
      icon: IconContacts,
      label: d.headcount,
      value: String(EMPLOYEES.length),
      note: d.headcountNote(probation.length),
    },
    {
      icon: IconTime,
      label: d.onLeave,
      value: String(onLeave.length),
      note: d.onLeaveNote,
    },
    {
      icon: IconDateRange,
      label: d.pending,
      value: String(pending.length),
      note: d.pendingNote,
    },
    {
      icon: IconCurrencyTl,
      label: d.payroll,
      value: money(lang, cost, 0),
      note: d.payrollNote,
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
          const Icon = s.icon;
          return <StatCard key={s.label} icon={<Icon />} label={s.label} value={s.value} note={s.note} />;
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
            <BarList items={counts.map(({ k, n }) => ({ key: k, label: c.departments[k], value: n }))} />
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
