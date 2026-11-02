'use client';

import { useState } from 'react';
import { Badge, EmptyState, Pagination, Table, type TableColumn } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Person = { id: string; name: string; team: string; status: 'active' | 'away'; projects: number };
const PEOPLE: Person[] = [
  { id: '1', name: 'Ada Lovelace', team: 'Engineering', status: 'active', projects: 12 },
  { id: '2', name: 'Grace Hopper', team: 'Research', status: 'active', projects: 8 },
  { id: '3', name: 'Alan Turing', team: 'Engineering', status: 'away', projects: 5 },
  { id: '4', name: 'Katherine Johnson', team: 'Analytics', status: 'active', projects: 15 },
  { id: '5', name: 'Hedy Lamarr', team: 'Design', status: 'away', projects: 3 },
  { id: '6', name: 'Margaret Hamilton', team: 'Engineering', status: 'active', projects: 21 },
  { id: '7', name: 'Radia Perlman', team: 'Research', status: 'active', projects: 9 },
];
const PAGE_SIZE = 4;
const COPY = {
  en: { sortable: 'Sortable columns', selectable: 'Row selection', paged: 'Pagination', empty: 'No rows', figma: 'Figma variant', code: 'Code', name: 'Name', team: 'Team', status: 'Status', projects: 'Projects', active: 'Active', away: 'Away', none: 'No people match.', noneText: 'Try another search or filter.', selected: (n: number) => `${n} selected`, all: 'Select all rows', row: (p: Person) => `Select ${p.name}`, caption: 'People' },
  tr: { sortable: 'Sıralanabilir sütunlar', selectable: 'Satır seçimi', paged: 'Sayfalama', empty: 'Satır yok', figma: 'Figma varyantı', code: 'Kod', name: 'Ad', team: 'Ekip', status: 'Durum', projects: 'Proje', active: 'Aktif', away: 'Uzakta', none: 'Eşleşen kişi yok.', noneText: 'Başka bir arama ya da filtre deneyin.', selected: (n: number) => `${n} seçili`, all: 'Tüm satırları seç', row: (p: Person) => `${p.name} seç`, caption: 'Kişiler' },
};

export function TablePlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [sortable, setSortable] = useState(true);
  const [selectable, setSelectable] = useState(true);
  const [paged, setPaged] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [selected, setSelected] = useState<string[]>(['3']);
  const [page, setPage] = useState(1);

  const columns: TableColumn<Person>[] = [
    { key: 'name', header: c.name, sortable },
    { key: 'team', header: c.team, sortable },
    { key: 'status', header: c.status, cell: (p) => <Badge tone={p.status === 'active' ? 'success' : 'tertiary'}>{p.status === 'active' ? c.active : c.away}</Badge> },
    { key: 'projects', header: c.projects, sortable, align: 'end' },
  ];
  const all = empty ? [] : PEOPLE;
  const rows = paged ? all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : all;

  const code = `import { Table${paged ? ', Pagination' : ''} } from '@/components/ladom';

<Table
  caption="${c.caption}"
  columns={[
    { key: 'name', header: '${c.name}'${sortable ? ', sortable: true' : ''} },
    { key: 'team', header: '${c.team}'${sortable ? ', sortable: true' : ''} },
    { key: 'status', header: '${c.status}', cell: (p) => <Badge>…</Badge> },
    { key: 'projects', header: '${c.projects}', align: 'end'${sortable ? ', sortable: true' : ''} },
  ]}
  rows={people}
  rowKey={(p) => p.id}${selectable ? '\n  selectable\n  selected={selected}\n  onSelectedChange={setSelected}' : ''}
  empty={<EmptyState size="medium" title="${c.none}" />}
/>${paged ? '\n<Pagination page={page} pageCount={pageCount} onPageChange={setPage} />' : ''}`;
  const figma = `Table\n.Table Header Cell › ↕ Sort=${sortable ? 'Ascending / Descending / None' : 'None'}\n.Table Cell › 🎛 Type=${selectable ? 'Checkbox + Text' : 'Text'}\n.Table Row › 🕹 State=Default / Hover${selectable ? ' / Selected' : ''}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ display: 'block' }}>
        <Table
          caption={c.caption}
          columns={columns}
          rows={rows}
          rowKey={(p) => p.id}
          selectable={selectable}
          selected={selected}
          onSelectedChange={setSelected}
          defaultSort={{ key: 'name', direction: 'ascending' }}
          empty={<EmptyState size="medium" title={c.none} description={c.noneText} />}
          selectAllLabel={c.all}
          selectRowLabel={c.row}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-medium)', marginBlockStart: 'var(--space-small)' }}>
          <span style={{ font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-medium-emphasis)' }}>{selectable ? c.selected(selected.length) : ''}</span>
          {paged && <Pagination page={page} pageCount={Math.max(1, Math.ceil(all.length / PAGE_SIZE))} onPageChange={setPage} />}
        </div>
      </div>
      <div className={styles.controls}>
        {(
          [
            [c.sortable, sortable, setSortable],
            [c.selectable, selectable, setSelectable],
            [c.paged, paged, setPaged],
            [c.empty, empty, setEmpty],
          ] as [string, boolean, (v: boolean) => void][]
        ).map(([label, v, set]) => (
          <label key={label} className={styles.check}>
            <input
              type="checkbox"
              checked={v}
              onChange={(e) => {
                set(e.target.checked);
                setPage(1);
              }}
            />{' '}
            {label}
          </label>
        ))}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
