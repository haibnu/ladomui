'use client';

import { useState } from 'react';
import { SummaryList } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Layout = 'rows' | 'grid';

const COPY = {
  en: {
    layout: 'Layout',
    rows: 'Rows',
    grid: 'Grid',
    title: 'Title',
    total: 'Total',
    code: 'Code',
    payslip: 'October payslip',
    profile: 'Employment',
    gross: 'Gross salary',
    overtime: 'Overtime (6 h)',
    meal: 'Meal allowance',
    sgk: 'Social security (14%)',
    unemployment: 'Unemployment insurance (1%)',
    incomeTax: 'Income tax',
    stampTax: 'Stamp duty',
    net: 'Net pay',
    department: 'Department',
    departmentValue: 'Finance',
    jobTitle: 'Job title',
    jobTitleValue: 'Senior accountant',
    manager: 'Manager',
    startDate: 'Start date',
    startDateValue: '3 March 2021',
    contract: 'Contract',
    contractValue: 'Full-time, permanent',
    location: 'Location',
    locationValue: 'Istanbul office',
  },
  tr: {
    layout: 'Düzen',
    rows: 'Satırlar',
    grid: 'Izgara',
    title: 'Başlık',
    total: 'Toplam',
    code: 'Kod',
    payslip: 'Ekim bordrosu',
    profile: 'İstihdam',
    gross: 'Brüt maaş',
    overtime: 'Fazla mesai (6 sa)',
    meal: 'Yemek yardımı',
    sgk: 'SGK işçi payı (%14)',
    unemployment: 'İşsizlik sigortası (%1)',
    incomeTax: 'Gelir vergisi',
    stampTax: 'Damga vergisi',
    net: 'Net ödenen',
    department: 'Departman',
    departmentValue: 'Finans',
    jobTitle: 'Unvan',
    jobTitleValue: 'Kıdemli muhasebeci',
    manager: 'Yönetici',
    startDate: 'İşe giriş',
    startDateValue: '3 Mart 2021',
    contract: 'Sözleşme',
    contractValue: 'Tam zamanlı, süresiz',
    location: 'Lokasyon',
    locationValue: 'İstanbul ofisi',
  },
};

export function SummaryListPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [layout, setLayout] = useState<Layout>('rows');
  const [title, setTitle] = useState(true);
  const [total, setTotal] = useState(true);

  const money = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', { style: 'currency', currency: 'TRY', currencyDisplay: 'narrowSymbol' }).format(n);

  const payslip = [
    { key: 'gross', label: c.gross, value: money(85000) },
    { key: 'overtime', label: c.overtime, value: money(3825) },
    { key: 'meal', label: c.meal, value: money(4400) },
    { key: 'sgk', label: c.sgk, value: money(-11900) },
    { key: 'unemployment', label: c.unemployment, value: money(-850) },
    { key: 'incomeTax', label: c.incomeTax, value: money(-12410.35) },
    { key: 'stampTax', label: c.stampTax, value: money(-645.15) },
  ];
  const facts = [
    { key: 'department', label: c.department, value: c.departmentValue },
    { key: 'jobTitle', label: c.jobTitle, value: c.jobTitleValue },
    { key: 'manager', label: c.manager, value: 'Selin Aksoy' },
    { key: 'startDate', label: c.startDate, value: c.startDateValue },
    { key: 'contract', label: c.contract, value: c.contractValue },
    { key: 'location', label: c.location, value: c.locationValue },
  ];
  const rows = layout === 'rows';

  const code = rows
    ? `import { SummaryList } from '@ladom/ui/pro';\n\n<SummaryList${title ? '\n  title="October payslip"' : ''}\n  items={[\n    { label: 'Gross salary', value: '₺85,000.00' },\n    { label: 'Overtime (6 h)', value: '₺3,825.00' },\n    { label: 'Social security (14%)', value: '-₺11,900.00' },\n    …\n  ]}${total ? "\n  total={{ label: 'Net pay', value: '₺67,419.50' }}" : ''}\n/>`
    : `import { SummaryList } from '@ladom/ui/pro';\n\n<SummaryList\n  layout="grid"${title ? '\n  title="Employment"' : ''}\n  items={[\n    { label: 'Department', value: 'Finance' },\n    { label: 'Job title', value: 'Senior accountant' },\n    { label: 'Manager', value: 'Selin Aksoy' },\n    …\n  ]}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: '100%', maxInlineSize: 'var(--grid-column-5)' }}>
          {rows ? (
            <SummaryList title={title ? c.payslip : undefined} items={payslip} total={total ? { label: c.net, value: money(67419.5) } : undefined} />
          ) : (
            <SummaryList layout="grid" title={title ? c.profile : undefined} items={facts} />
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect
          label={c.layout}
          value={layout}
          options={[
            { value: 'rows', label: c.rows },
            { value: 'grid', label: c.grid },
          ]}
          onChange={setLayout}
        />
        <ControlCheck label={c.title} checked={title} onChange={setTitle} />
        <ControlCheck label={c.total} checked={rows && total} disabled={!rows} onChange={setTotal} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
