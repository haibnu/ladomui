'use client';

import { useEffect, useState } from 'react';
import { IconCurrencyTl, IconSuccess } from '@ladom/icons';
import { Alert, Button, Checkbox, EmptyState, FormField, Loader, Selectbox, type ModalSize } from '@ladom/ui';
import { SummaryList, WizardModal } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const MONTHS = ['2026-10', '2026-09', '2026-08'] as const;

const COPY = {
  en: {
    size: 'Size',
    confirm: 'Confirmation',
    doneStep: 'Done step',
    code: 'Code',
    open: 'Run payroll',
    title: 'Run payroll',
    description: 'Pay 48 employees of Acme Ltd.',
    steps: ['Period', 'Review', 'Confirm', 'Done'],
    labels: { back: 'Back', next: 'Next', cancel: 'Cancel', finish: 'Run payroll', close: 'Close' },
    period: 'Pay period',
    months: { '2026-10': 'October 2026', '2026-09': 'September 2026', '2026-08': 'August 2026' },
    overtime: 'Include approved overtime',
    calculating: 'Calculating 48 payslips…',
    totals: 'Totals',
    employees: 'Employees',
    gross: 'Gross pay',
    deductions: 'Deductions',
    employer: 'Employer cost',
    net: 'Net to pay',
    payday: 'Payments go out on 31 October',
    paydayText: 'The bank file is sent as soon as you run payroll; it cannot be cancelled here.',
    checked: 'I checked the totals',
    doneTitle: 'Payroll is on its way',
    doneText: '48 payslips were created and the bank file was sent.',
  },
  tr: {
    size: 'Boyut',
    confirm: 'Onay',
    doneStep: 'Bitti adımı',
    code: 'Kod',
    open: 'Bordroyu çalıştır',
    title: 'Bordroyu çalıştır',
    description: 'Acme Ltd.’nin 48 çalışanına ödeme yapın.',
    steps: ['Dönem', 'Kontrol', 'Onay', 'Bitti'],
    labels: { back: 'Geri', next: 'İleri', cancel: 'Vazgeç', finish: 'Bordroyu çalıştır', close: 'Kapat' },
    period: 'Bordro dönemi',
    months: { '2026-10': 'Ekim 2026', '2026-09': 'Eylül 2026', '2026-08': 'Ağustos 2026' },
    overtime: 'Onaylı fazla mesaiyi dahil et',
    calculating: '48 bordro hesaplanıyor…',
    totals: 'Toplamlar',
    employees: 'Çalışan',
    gross: 'Brüt ödeme',
    deductions: 'Kesintiler',
    employer: 'İşveren maliyeti',
    net: 'Ödenecek net',
    payday: 'Ödemeler 31 Ekim’de yapılır',
    paydayText: 'Bordroyu çalıştırdığınızda banka dosyası hemen gönderilir; buradan iptal edilemez.',
    checked: 'Toplamları kontrol ettim',
    doneTitle: 'Bordro yolda',
    doneText: '48 bordro oluşturuldu ve banka dosyası gönderildi.',
  },
};

export function WizardModalPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [size, setSize] = useState<ModalSize>('large');
  const [confirm, setConfirm] = useState(true);
  const [doneStep, setDoneStep] = useState(true);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [month, setMonth] = useState<string>(MONTHS[0]);
  const [overtime, setOvertime] = useState(true);
  const [checked, setChecked] = useState(false);

  // Moving to Review calculates the payslips first: the step is busy for a moment.
  useEffect(() => {
    if (!busy) return;
    const timer = window.setTimeout(() => setBusy(false), 1600);
    return () => window.clearTimeout(timer);
  }, [busy]);

  const start = () => {
    setStep(0);
    setChecked(false);
    setBusy(false);
    setOpen(true);
  };
  const changeStep = (next: number) => {
    if (step === 0 && next === 1) setBusy(true);
    setStep(next);
  };

  const money = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'currency', currency: 'TRY', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n);
  const extra = overtime ? 61200 : 0;
  const steps = doneStep ? c.steps : c.steps.slice(0, 3);

  const body = [
    <>
      <FormField label={c.period}>
        <Selectbox options={MONTHS.map((m) => ({ value: m, label: c.months[m] }))} value={month} onChange={setMonth} />
      </FormField>
      <Checkbox label={c.overtime} checked={overtime} onChange={(e) => setOvertime(e.target.checked)} />
    </>,
    busy ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-small)', flex: 1 }}>
        <Loader label={c.calculating} />
        <span aria-hidden="true">{c.calculating}</span>
      </div>
    ) : (
      <SummaryList
        title={`${c.totals} · ${c.months[month as (typeof MONTHS)[number]]}`}
        items={[
          { key: 'employees', label: c.employees, value: '48' },
          { key: 'gross', label: c.gross, value: money(3864000 + extra) },
          { key: 'deductions', label: c.deductions, value: money(-(1043280 + extra * 0.27)) },
          { key: 'employer', label: c.employer, value: money((3864000 + extra) * 1.1575) },
        ]}
        total={{ label: c.net, value: money(2820720 + extra * 0.73) }}
      />
    ),
    <>
      <Alert tone="warning" title={c.payday} description={c.paydayText} />
      {confirm && <Checkbox label={c.checked} checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
    </>,
    <EmptyState size="small" icon={<IconSuccess />} title={c.doneTitle} description={c.doneText} />,
  ];

  const code = `import { WizardModal } from '@ladom/ui/pro';\n\nconst [step, setStep] = useState(0);\n\n<WizardModal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Run payroll"${size !== 'large' ? `\n  size="${size}"` : ''}\n  steps={[${steps.map((s) => `'${COPY.en.steps[c.steps.indexOf(s)]}'`).join(', ')}]}\n  step={step}\n  onStepChange={setStep}${doneStep ? '\n  finishStep={2}' : ''}\n  onFinish={runPayroll}${confirm ? '\n  nextDisabled={step === 2 && !checked}' : ''}\n  busy={calculating}\n  labels={{ finish: 'Run payroll' }}\n>\n  {stepContent[step]}\n</WizardModal>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Button iconLeft={IconCurrencyTl} onClick={start}>
          {c.open}
        </Button>
        <WizardModal
          open={open}
          onClose={() => !busy && setOpen(false)}
          title={c.title}
          description={c.description}
          size={size}
          steps={steps}
          step={step}
          onStepChange={changeStep}
          finishStep={2}
          onFinish={doneStep ? undefined : () => setOpen(false)}
          nextDisabled={confirm && step === 2 && !checked}
          busy={busy}
          labels={c.labels}
        >
          {body[step]}
        </WizardModal>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.size} value={size} options={['medium', 'large'] as const} onChange={setSize} />
        <ControlCheck label={c.confirm} checked={confirm} onChange={setConfirm} />
        <ControlCheck label={c.doneStep} checked={doneStep} onChange={setDoneStep} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
