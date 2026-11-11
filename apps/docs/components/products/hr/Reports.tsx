'use client';

import { IconContacts, IconDateTime, IconLogout, IconTime } from '@ladom/icons';
import { Badge } from '@ladom/ui';
import { BarChart, BarList, Card, ChartLegend, DonutChart, FunnelChart, PageHeader, StatCard, type StatCardProps } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES, type Department, type LeaveType } from './data';
import styles from './hr.module.css';

// Sample history of the last 12 months (December to November), ending at today's employees.
const HIRES = [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 2];
const LEAVERS = [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0];
const FUNNEL = [126, 18, 3, 2];
const FUNNEL_DELTA = [
  { value: '12.0%', direction: 'up' },
  { value: '4.5%', direction: 'down' },
  { value: '5.5%', direction: 'up' },
  { value: '10.3%', direction: 'down' },
] as const;
// Leave days of the last 6 months, per type.
const LEAVE_DAYS: Record<LeaveType, number[]> = {
  annual: [14, 22, 31, 18, 9, 12],
  sick: [3, 2, 1, 4, 6, 5],
  excuse: [1, 2, 0, 1, 2, 1],
  unpaid: [0, 0, 5, 0, 0, 0],
};
const LOCATION_DELTA: Record<string, { value: string; direction: 'up' | 'down' | 'flat' }> = {
  istanbul: { value: '+2', direction: 'up' },
  ankara: { value: '+1', direction: 'up' },
  izmir: { value: '0', direction: 'flat' },
  remote: { value: '-1', direction: 'down' },
};

/** Reports: the HR figures of the year as charts. */
export function Reports() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const r = c.reports;
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const num = (digits: number) => (n: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
  const percent = (n: number, total: number) => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(n / total);

  const stats: (StatCardProps & { key: string })[] = [
    {
      key: 'turnover',
      icon: <IconLogout />,
      label: r.turnover,
      value: 8.3,
      unit: '%',
      format: num(1),
      delta: { value: '2.1%', direction: 'down', tone: 'success', label: r.vsLastYear },
      data: [12.5, 12.1, 11.4, 11.0, 10.6, 10.4, 10.1, 9.6, 9.4, 9.0, 8.7, 8.3],
      chart: 'line',
      tone: 'success',
      labels: [...c.dashboard.months],
    },
    {
      key: 'tenure',
      icon: <IconContacts />,
      label: r.tenure,
      value: 2.8,
      unit: r.years,
      format: num(1),
      delta: { value: '0.3', direction: 'up', label: r.vsLastYear },
      data: [2.5, 2.5, 2.6, 2.6, 2.6, 2.7, 2.7, 2.7, 2.7, 2.8, 2.8, 2.8],
      labels: [...c.dashboard.months],
    },
    {
      key: 'timeToHire',
      icon: <IconTime />,
      label: r.timeToHire,
      value: 34,
      unit: r.days,
      format: num(0),
      delta: { value: '6', direction: 'down', tone: 'success', label: r.vsLastQuarter },
      data: [48, 44, 41, 40, 38, 34],
      chart: 'bars',
      labels: c.dashboard.months.slice(6),
    },
    {
      key: 'absence',
      icon: <IconDateTime />,
      label: r.absence,
      value: 2.4,
      unit: '%',
      format: num(1),
      delta: { value: '0.4%', direction: 'up', tone: 'error', label: r.vsLastQuarter },
      data: [1.8, 1.9, 2.0, 2.2, 2.6, 2.4],
      chart: 'step',
      tone: 'warning',
      labels: c.dashboard.months.slice(6),
    },
  ];

  const departments = (Object.keys(c.departments) as Department[])
    .map((k) => ({ key: k, name: c.departments[k], value: EMPLOYEES.filter((e) => e.department === k).length }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
  const locations = Object.keys(c.locations)
    .map((k) => ({ key: k, label: c.locations[k], value: EMPLOYEES.filter((e) => e.location === k).length, delta: LOCATION_DELTA[k] }))
    .filter((l) => l.value > 0)
    .sort((a, b) => b.value - a.value);
  const leaveTypes = Object.keys(LEAVE_DAYS) as LeaveType[];
  const captions = r.captions(FUNNEL);

  return (
    <>
      <PageHeader className={styles.pageHeader} title={r.title} subtitle={r.subtitle} />
      <div className={styles.stats}>
        {stats.map(({ key, ...props }) => (
          <StatCard key={key} hover {...props} />
        ))}
      </div>
      <div className={styles.columns}>
        <div className={styles.stack}>
          <Card title={r.movement}>
            <BarChart title={r.movement} locale={locale} categories={[...c.dashboard.months]} series={[{ name: r.hires, data: HIRES }, { name: r.leavers, data: LEAVERS }]} legend axisFormat={num(0)} />
          </Card>
          <Card
            title={r.funnel}
            actions={
              <Badge size="small">
                {r.funnelPeriod}
              </Badge>
            }
          >
            <FunnelChart
              title={r.funnel}
              locale={locale}
              labels={{ ofFirst: r.ofFirst, ofPrevious: r.ofPrevious }}
              stages={r.stages.map((name, i) => ({ key: name, name, value: FUNNEL[i]!, delta: FUNNEL_DELTA[i], caption: captions[i] }))}
            />
          </Card>
          <Card title={r.leaveDays}>
            <BarChart
              title={r.leaveDays}
              locale={locale}
              mode="stacked"
              categories={c.dashboard.months.slice(6)}
              series={leaveTypes.map((t) => ({ name: c.leaveTypes[t], data: LEAVE_DAYS[t] }))}
              legend
              axisFormat={num(0)}
            />
          </Card>
        </div>
        <div className={styles.stack}>
          <Card title={r.byDepartment}>
            <div className={styles.donut}>
              <DonutChart title={r.byDepartment} locale={locale} data={departments} label={EMPLOYEES.length} sublabel={r.people} />
              <ChartLegend columns={[c.employees.department, r.headcount, r.share]} items={departments.map((d) => ({ key: d.key, name: d.name, values: [d.value, percent(d.value, EMPLOYEES.length)] }))} />
            </div>
          </Card>
          <Card title={r.byLocation}>
            <BarList
              variant="row"
              columns={[r.location, r.headcount, r.change]}
              items={locations.map((l) => ({ key: l.key, label: l.label, value: l.value, delta: l.delta && { ...l.delta, tone: l.delta.direction === 'down' ? 'error' : l.delta.direction === 'up' ? 'success' : 'neutral' } }))}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
