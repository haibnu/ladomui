'use client';

import { useEffect, useRef, useState } from 'react';
import { IconDownload, IconPlay, IconSuccess } from '@ladom/icons';
import { Alert, Badge, Button, Checkbox, Drawer, Loader, Selectbox, Table, useToast, type BadgeTone, type TableColumn } from '@ladom/ui';
import { PageHeader, PersonCell, StatCard, WizardModal } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { LEAVES, PAYROLL_MONTHS, money, monthName, payrollEmployees, payslip, type Employee, type Payslip, type PayrollMonth } from './data';
import { Rows } from './Rows';
import styles from './hr.module.css';

const STATUS_TONE: Record<PayrollMonth['status'], BadgeTone> = {
  draft: 'warning',
  approved: 'primary',
  paid: 'success',
};

/** Unpaid leave in a month, in days, per employee. */
const unpaidDays = (e: Employee, month: string) =>
  LEAVES.filter((l) => l.employee === e.id && l.type === 'unpaid' && l.status === 'approved' && l.start.startsWith(month)).reduce((n, l) => n + l.days, 0);

type Row = { e: Employee; slip: Payslip; unpaid: number };

function rowsFor(m: PayrollMonth): Row[] {
  return payrollEmployees(m.value).map((e) => {
    const unpaid = unpaidDays(e, m.value);
    const gross = Math.round(e.gross * m.raise * ((30 - unpaid) / 30));
    return { e, slip: payslip(gross), unpaid };
  });
}

export function Payroll() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.payroll;
  const { toast } = useToast();
  const [months, setMonths] = useState(PAYROLL_MONTHS);
  const [value, setValue] = useState(PAYROLL_MONTHS[0]!.value);
  const [slip, setSlip] = useState<Row | null>(null);
  const [running, setRunning] = useState(false);
  // The toast waits for the dialog to close, so it is not under the overlay.
  const approved = useRef(false);
  const month = months.find((m) => m.value === value)!;
  const rows = rowsFor(month);
  const sum = (k: keyof Payslip) => rows.reduce((n, r) => n + r.slip[k], 0);
  const m = (n: number) => money(lang, n);

  const columns: TableColumn<Row>[] = [
    {
      key: 'employee',
      header: t.employee,
      cell: (r) => (
        <PersonCell name={r.e.name} subtitle={r.unpaid ? c.payroll.flow.unpaid(r.unpaid) : r.e.title[lang]} onClick={() => setSlip(r)} />
      ),
    },
    {
      key: 'gross',
      header: t.gross,
      align: 'end',
      cell: (r) => <span className={styles.num}>{m(r.slip.gross)}</span>,
    },
    {
      key: 'sgk',
      header: t.sgk,
      align: 'end',
      cell: (r) => <span className={styles.num}>{m(r.slip.sgk + r.slip.unemployment)}</span>,
    },
    {
      key: 'incomeTax',
      header: t.incomeTax,
      align: 'end',
      cell: (r) => <span className={styles.num}>{m(r.slip.incomeTax)}</span>,
    },
    {
      key: 'stampTax',
      header: t.stampTax,
      align: 'end',
      cell: (r) => <span className={styles.num}>{m(r.slip.stampTax)}</span>,
    },
    {
      key: 'net',
      header: t.net,
      align: 'end',
      cell: (r) => <strong className={styles.num}>{m(r.slip.net)}</strong>,
    },
    {
      key: 'cost',
      header: t.cost,
      align: 'end',
      cell: (r) => <span className={styles.num}>{m(r.slip.cost)}</span>,
    },
  ];

  const stats = [
    { label: t.totalGross, value: sum('gross') },
    {
      label: t.deductions,
      value: sum('sgk') + sum('unemployment') + sum('incomeTax') + sum('stampTax'),
    },
    { label: t.totalNet, value: sum('net') },
    { label: t.totalCost, value: sum('cost') },
  ];

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title={t.title}
        subtitle={t.subtitle}
        badge={
          <Badge size="small" tone={STATUS_TONE[month.status]}>
            {t.monthStatus[month.status]}
          </Badge>
        }
        actions={
          month.status === 'draft' ? (
            <Button iconLeft={IconPlay} onClick={() => setRunning(true)}>
              {t.run}
            </Button>
          ) : (
            <Button variant="ghost" tone="secondary" iconLeft={IconDownload}>
              {t.download}
            </Button>
          )
        }
      />
      <div className={styles.toolbar}>
        <Selectbox
          className={styles.filter}
          aria-label={t.month}
          value={value}
          onChange={setValue}
          options={months.map((x) => ({
            value: x.value,
            label: monthName(lang, x.value),
          }))}
        />
        <span className={styles.statNote}>{t.people(rows.length)}</span>
      </div>
      <div className={styles.stats}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={money(lang, s.value, 0)} />
        ))}
      </div>
      <div className={styles.tableWrap}>
        <Table columns={columns} rows={rows} rowKey={(r) => r.e.id} caption={monthName(lang, month.value)} />
      </div>
      <p className={styles.statNote}>{t.note}</p>

      <Drawer
        open={slip !== null}
        onClose={() => setSlip(null)}
        title={t.slip}
        description={slip ? `${slip.e.name} · ${monthName(lang, month.value)}` : undefined}
        closeLabel={t.flow.close}
      >
        {slip && <PayslipView row={slip} />}
      </Drawer>

      <RunPayroll
        open={running}
        rows={rows}
        onClose={() => {
          setRunning(false);
          if (approved.current) toast({ tone: 'success', title: t.approvedToast });
          approved.current = false;
        }}
        onApprove={() => {
          approved.current = true;
          setMonths(months.map((x) => (x.value === month.value ? { ...x, status: 'approved' } : x)));
        }}
      />
    </>
  );
}

function PayslipView({ row }: { row: Row }) {
  const { lang } = useLocale();
  const t = HR_COPY[lang].payroll;
  const s = row.slip;
  const m = (n: number) => money(lang, n);
  const minus = (n: number) => `−${m(n)}`;
  return (
    <div className={styles.slip}>
      <Rows title={t.earnings} items={[{ label: t.baseSalary, value: m(s.gross) }]} />
      <Rows
        title={t.employeeDeductions}
        items={[
          { label: t.sgkEmployee, value: minus(s.sgk) },
          { label: t.unemploymentEmployee, value: minus(s.unemployment) },
          { label: t.incomeTax, value: minus(s.incomeTax) },
          { label: t.stampTax, value: minus(s.stampTax) },
        ]}
        total={{ label: t.netPay, value: m(s.net) }}
      />
      <Rows
        title={t.employerShare}
        items={[
          { label: t.sgkEmployer, value: m(s.employerSgk) },
          { label: t.unemploymentEmployer, value: m(s.employerUnemployment) },
        ]}
        total={{ label: t.cost, value: m(s.cost) }}
      />
      <p className={styles.statNote}>{t.note}</p>
    </div>
  );
}

function RunPayroll({ open, rows, onClose, onApprove }: { open: boolean; rows: Row[]; onClose: () => void; onApprove: () => void }) {
  const { lang } = useLocale();
  const t = HR_COPY[lang].payroll;
  const f = t.flow;
  const [step, setStep] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [notify, setNotify] = useState(true);
  const [bank, setBank] = useState(true);
  const changed = rows.filter((r) => r.unpaid > 0);
  const total = (k: keyof Payslip) => rows.reduce((n, r) => n + r.slip[k], 0);

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  useEffect(() => {
    if (step !== 1) return;
    setCalculating(true);
    const id = setTimeout(() => setCalculating(false), 1200);
    return () => clearTimeout(id);
  }, [step]);

  return (
    <WizardModal
      open={open}
      onClose={onClose}
      title={f.title}
      steps={f.steps}
      step={step}
      onStepChange={setStep}
      finishStep={2}
      onFinish={onApprove}
      finishTone="success"
      busy={step === 1 && calculating}
      labels={{ back: f.back, next: f.next, cancel: f.cancel, finish: f.approve, close: f.close }}
    >
      {step === 0 && (
        <>
          <h3 className={styles.stepTitle}>{f.timesheetTitle}</h3>
          <p className={styles.muted}>{f.timesheetText}</p>
          {changed.map((r) => (
            <Alert key={r.e.id} tone="warning" direction="horizontal" title={r.e.name} description={f.unpaid(r.unpaid)} />
          ))}
          <p className={styles.muted}>{f.missing}</p>
        </>
      )}
      {step === 1 &&
        (calculating ? (
          <div className={styles.center}>
            <Loader />
            <p className={styles.muted}>{f.calculating}</p>
          </div>
        ) : (
          <div className={styles.center}>
            <IconSuccess size={40} />
            <h3 className={styles.stepTitle}>{f.calculated(rows.length)}</h3>
            <p className={styles.muted}>
              {t.totalNet}: {money(lang, total('net'))}
            </p>
          </div>
        ))}
      {step === 2 && (
        <>
          <h3 className={styles.stepTitle}>{f.reviewTitle}</h3>
          <p className={styles.muted}>{f.reviewText}</p>
          <Rows
            items={[
              { label: `${t.totalGross} · ${t.people(rows.length)}`, value: money(lang, total('gross')) },
              { label: t.totalCost, value: money(lang, total('cost')) },
            ]}
            total={{ label: t.totalNet, value: money(lang, total('net')) }}
          />
          <Checkbox label={f.notify} checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          <Checkbox label={f.bank} checked={bank} onChange={(e) => setBank(e.target.checked)} />
        </>
      )}
      {step === 3 && (
        <div className={styles.center}>
          <IconSuccess size={40} />
          <h3 className={styles.stepTitle}>{f.doneTitle}</h3>
          <p className={styles.muted}>{f.doneText}</p>
        </div>
      )}
    </WizardModal>
  );
}
