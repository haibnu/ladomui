'use client';

import { useState } from 'react';
import { IconAdd, IconDataExport, IconSendEmail } from '@ladom/icons';
import { Badge, Button, Segment, Selectbox, Table, type TableColumn } from '@ladom/ui';
import { DataToolbar, PersonCell } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Status = 'active' | 'leave' | 'onboarding';
type Department = 'finance' | 'engineering' | 'sales' | 'people';
type Employee = { id: string; name: string; title: Record<'en' | 'tr', string>; department: Department; status: Status };

const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Selin Aksoy', title: { en: 'Finance manager', tr: 'Finans müdürü' }, department: 'finance', status: 'active' },
  { id: 'e2', name: 'Mert Yıldız', title: { en: 'Frontend developer', tr: 'Frontend geliştirici' }, department: 'engineering', status: 'leave' },
  { id: 'e3', name: 'Ayşe Demir', title: { en: 'Account executive', tr: 'Satış temsilcisi' }, department: 'sales', status: 'active' },
  { id: 'e4', name: 'Can Öztürk', title: { en: 'Backend developer', tr: 'Backend geliştirici' }, department: 'engineering', status: 'onboarding' },
  { id: 'e5', name: 'Zeynep Kaya', title: { en: 'HR specialist', tr: 'İK uzmanı' }, department: 'people', status: 'active' },
];

const TONE = { active: 'success', leave: 'warning', onboarding: 'primary' } as const;

const COPY = {
  en: {
    search: 'Search',
    filters: 'Filters',
    actions: 'Actions',
    code: 'Code',
    searchLabel: 'Search employees',
    searchPlaceholder: 'Search by name',
    department: 'Department',
    allDepartments: 'All departments',
    departments: { finance: 'Finance', engineering: 'Engineering', sales: 'Sales', people: 'People' },
    all: 'All',
    statuses: { active: 'Active', leave: 'On leave', onboarding: 'Onboarding' },
    name: 'Name',
    status: 'Status',
    export: 'Export',
    add: 'Add employee',
    message: 'Send message',
    clear: 'Clear',
    selected: (n: number) => `${n} selected`,
    caption: 'Employees',
    selectAll: 'Select all employees',
    selectRow: (e: Employee) => `Select ${e.name}`,
    empty: 'No employees match these filters.',
  },
  tr: {
    search: 'Arama',
    filters: 'Filtreler',
    actions: 'Eylemler',
    code: 'Kod',
    searchLabel: 'Çalışan ara',
    searchPlaceholder: 'Ada göre ara',
    department: 'Departman',
    allDepartments: 'Tüm departmanlar',
    departments: { finance: 'Finans', engineering: 'Mühendislik', sales: 'Satış', people: 'İnsan kaynakları' },
    all: 'Tümü',
    statuses: { active: 'Aktif', leave: 'İzinde', onboarding: 'İşe alışta' },
    name: 'Ad',
    status: 'Durum',
    export: 'Dışa aktar',
    add: 'Çalışan ekle',
    message: 'Mesaj gönder',
    clear: 'Temizle',
    selected: (n: number) => `${n} seçili`,
    caption: 'Çalışanlar',
    selectAll: 'Tüm çalışanları seç',
    selectRow: (e: Employee) => `${e.name} seç`,
    empty: 'Bu filtrelere uyan çalışan yok.',
  },
};

export function DataToolbarPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [hasSearch, setHasSearch] = useState(true);
  const [hasFilters, setHasFilters] = useState(true);
  const [hasActions, setHasActions] = useState(true);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState<string | null>(null);
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);

  const rows = EMPLOYEES.filter(
    (e) =>
      (!hasSearch || e.name.toLocaleLowerCase(lang).includes(query.trim().toLocaleLowerCase(lang))) &&
      (!hasFilters || ((!department || e.department === department) && (status === 'all' || e.status === status))),
  );

  const columns: TableColumn<Employee>[] = [
    { key: 'name', header: c.name, sortable: true, cell: (e) => <PersonCell name={e.name} subtitle={e.title[lang]} /> },
    { key: 'department', header: c.department, cell: (e) => c.departments[e.department] },
    {
      key: 'status',
      header: c.status,
      cell: (e) => (
        <Badge tone={TONE[e.status]} size="small">
          {c.statuses[e.status]}
        </Badge>
      ),
    },
  ];

  const code = `import { DataToolbar } from '@ladom/ui/pro';\n\n<DataToolbar\n  aria-label="Employees"${hasSearch ? `\n  search={{ value: query, onChange: setQuery, label: 'Search employees', placeholder: 'Search by name' }}` : ''}${hasFilters ? `\n  filters={\n    <>\n      <Selectbox fluid={false} placeholder="All departments" options={departments} value={department} onChange={setDepartment} />\n      <Segment options={statuses} value={status} onChange={setStatus} />\n    </>\n  }` : ''}${hasActions ? `\n  actions={\n    <>\n      <Button variant="ghost" tone="secondary" iconLeft={IconDataExport}>Export</Button>\n      <Button iconLeft={IconAdd}>Add employee</Button>\n    </>\n  }` : ''}\n  selectedCount={selected.length}\n  bulkActions={\n    <>\n      <Button variant="ghost" tone="secondary" iconLeft={IconSendEmail}>Send message</Button>\n      <Button variant="ghost" tone="secondary" onClick={() => setSelected([])}>Clear</Button>\n    </>\n  }\n/>\n<Table columns={columns} rows={rows} rowKey={(e) => e.id} selectable selected={selected} onSelectedChange={setSelected} />`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ placeItems: 'stretch', alignContent: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-medium)', minInlineSize: 0 }}>
          <DataToolbar
            aria-label={c.caption}
            search={hasSearch ? { value: query, onChange: setQuery, label: c.searchLabel, placeholder: c.searchPlaceholder } : undefined}
            filters={
              hasFilters ? (
                <>
                  <Selectbox
                    fluid={false}
                    aria-label={c.department}
                    placeholder={c.allDepartments}
                    options={[{ value: '', label: c.allDepartments }, ...(Object.keys(c.departments) as Department[]).map((d) => ({ value: d, label: c.departments[d] }))]}
                    value={department}
                    onChange={(v) => setDepartment(v || null)}
                  />
                  <Segment
                    aria-label={c.status}
                    options={[{ value: 'all', label: c.all }, ...(Object.keys(c.statuses) as Status[]).map((s) => ({ value: s, label: c.statuses[s] }))]}
                    value={status}
                    onChange={setStatus}
                  />
                </>
              ) : undefined
            }
            actions={
              hasActions ? (
                <>
                  <Button variant="ghost" tone="secondary" iconLeft={IconDataExport}>
                    {c.export}
                  </Button>
                  <Button iconLeft={IconAdd}>{c.add}</Button>
                </>
              ) : undefined
            }
            selectedCount={selected.length}
            selectionLabel={c.selected}
            bulkActions={
              <>
                <Button variant="ghost" tone="secondary" iconLeft={IconSendEmail}>
                  {c.message}
                </Button>
                <Button variant="ghost" tone="secondary" onClick={() => setSelected([])}>
                  {c.clear}
                </Button>
              </>
            }
          />
          <Table
            columns={columns}
            rows={rows}
            rowKey={(e) => e.id}
            selectable
            selected={selected}
            onSelectedChange={setSelected}
            caption={c.caption}
            selectAllLabel={c.selectAll}
            selectRowLabel={c.selectRow}
            empty={c.empty}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.search} checked={hasSearch} onChange={setHasSearch} />
        <ControlCheck label={c.filters} checked={hasFilters} onChange={setHasFilters} />
        <ControlCheck label={c.actions} checked={hasActions} onChange={setHasActions} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
