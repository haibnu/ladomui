'use client';

import { useMemo, useState } from 'react';
import { IconAdd, IconDownload, IconSearch } from '@ladom/icons';
import {
  Avatar,
  Badge,
  Button,
  CurrencyInput,
  Drawer,
  EmptyState,
  FormField,
  Input,
  Modal,
  Pagination,
  Selectbox,
  Table,
  Tabs,
  useToast,
  type BadgeTone,
  type TableColumn,
  type TableSort,
} from '@ladom/ui';
import { DataToolbar, PageHeader, PersonCell, SummaryList } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES, LEAVES, date, employee, money, payslip, type Department, type Employee, type EmployeeStatus } from './data';
import styles from './hr.module.css';

const STATUS_TONE: Record<EmployeeStatus, BadgeTone> = {
  active: 'success',
  onLeave: 'warning',
  probation: 'primary',
};
const PAGE_SIZE = 8;

export function Employees() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.employees;
  const { toast } = useToast();
  const [people, setPeople] = useState<Employee[]>(EMPLOYEES);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<Employee | null>(null);
  const [tab, setTab] = useState('overview');
  const [adding, setAdding] = useState(false);
  const [sort, setSort] = useState<TableSort | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLocaleLowerCase(lang);
    const list = people.filter(
      (e) =>
        (department === 'all' || e.department === department) &&
        (status === 'all' || e.status === status) &&
        (!q || e.name.toLocaleLowerCase(lang).includes(q) || e.title[lang].toLocaleLowerCase(lang).includes(q)),
    );
    if (!sort) return list;
    const value = (e: Employee) => (sort.key === 'department' ? c.departments[e.department] : sort.key === 'start' ? e.start : e.name);
    const sign = sort.direction === 'ascending' ? 1 : -1;
    return [...list].sort((a, b) => sign * value(a).localeCompare(value(b), lang));
  }, [people, query, department, status, lang, sort, c]);
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const shown = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const filter = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };
  const clear = () => {
    setQuery('');
    setDepartment('all');
    setStatus('all');
    setPage(1);
  };

  const columns: TableColumn<Employee>[] = [
    {
      key: 'name',
      header: t.name,
      sortable: true,
      cell: (e) => (
        <PersonCell
          name={e.name}
          subtitle={e.title[lang]}
          onClick={() => {
            setTab('overview');
            setOpen(e);
          }}
        />
      ),
    },
    {
      key: 'department',
      header: t.department,
      sortable: true,
      cell: (e) => c.departments[e.department],
    },
    {
      key: 'location',
      header: t.location,
      cell: (e) => c.locations[e.location],
    },
    {
      key: 'start',
      header: t.start,
      sortable: true,
      cell: (e) => <span className={styles.num}>{date(lang, e.start)}</span>,
    },
    {
      key: 'status',
      header: t.status,
      cell: (e) => (
        <Badge size="small" tone={STATUS_TONE[e.status]}>
          {c.status[e.status]}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title={t.title}
        subtitle={t.subtitle(people.length)}
        actions={
          <>
            <Button variant="ghost" tone="secondary" iconLeft={IconDownload}>
              {t.export}
            </Button>
            <Button iconLeft={IconAdd} onClick={() => setAdding(true)}>
              {t.add}
            </Button>
          </>
        }
      />
      <DataToolbar
        search={{ value: query, onChange: filter(setQuery), placeholder: t.search, label: t.search }}
        filters={
          <>
            <Selectbox
              aria-label={t.department}
              value={department}
              onChange={filter(setDepartment)}
              options={[{ value: 'all', label: t.allDepartments }, ...(Object.keys(c.departments) as Department[]).map((k) => ({ value: k, label: c.departments[k] }))]}
            />
            <Selectbox
              aria-label={t.status}
              value={status}
              onChange={filter(setStatus)}
              options={[{ value: 'all', label: t.allStatuses }, ...(Object.keys(c.status) as EmployeeStatus[]).map((k) => ({ value: k, label: c.status[k] }))]}
            />
          </>
        }
        selectedCount={selected.length}
        selectionLabel={t.selected}
        bulkActions={
          <Button size="small" variant="ghost" tone="secondary" iconLeft={IconDownload}>
            {t.export}
          </Button>
        }
      />
      <div className={styles.tableWrap}>
        <Table
          columns={columns}
          rows={shown}
          rowKey={(e) => e.id}
          sort={sort}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          selectRowLabel={(e) => e.name}
          empty={
            <EmptyState
              size="small"
              icon={<IconSearch />}
              title={t.empty}
              description={t.emptyText}
              action={
                <Button variant="ghost" tone="secondary" size="small" onClick={clear}>
                  {t.clear}
                </Button>
              }
            />
          }
        />
      </div>
      {pageCount > 1 && (
        <div className={styles.footRow}>
          <span className={styles.statNote}>{t.subtitle(rows.length)}</span>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}

      <Drawer
        open={open !== null}
        onClose={() => setOpen(null)}
        title={t.profile}
        closeLabel={t.close}
        footer={
          <>
            <Button variant="ghost" tone="secondary" onClick={() => setOpen(null)}>
              {t.close}
            </Button>
            <Button>{t.edit}</Button>
          </>
        }
      >
        {open && <Profile e={open} tab={tab} setTab={setTab} />}
      </Drawer>

      <AddEmployee
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(e) => {
          setPeople([e, ...people]);
          setAdding(false);
          toast({
            tone: 'success',
            title: t.added,
            description: t.addedText(e.name),
          });
        }}
      />
    </>
  );
}

function Profile({ e, tab, setTab }: { e: Employee; tab: string; setTab: (v: string) => void }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.employees;
  const leaves = LEAVES.filter((l) => l.employee === e.id);
  const slip = payslip(e.gross);
  return (
    <>
      <div className={styles.profileTop}>
        <Avatar size="xlarge" name={e.name} />
        <span className={styles.personText}>
          <span className={styles.cardTitle}>{e.name}</span>
          <span className={styles.muted}>{e.title[lang]}</span>
          <span>
            <Badge size="small" tone={STATUS_TONE[e.status]}>
              {c.status[e.status]}
            </Badge>
          </span>
        </span>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          {
            value: 'overview',
            label: t.tabs.overview,
            content: (
              <SummaryList
                className={styles.tabBody}
                layout="grid"
                items={[
                  { label: t.department, value: c.departments[e.department] },
                  { label: t.location, value: c.locations[e.location] },
                  { label: t.tenure, value: date(lang, e.start) },
                  { label: t.manager, value: e.manager ? employee(e.manager).name : '—' },
                  { label: t.leaveLeft, value: t.days(e.leaveLeft) },
                ]}
              />
            ),
          },
          {
            value: 'leave',
            label: t.tabs.leave,
            badge: leaves.length || undefined,
            content: leaves.length ? (
              <SummaryList
                className={styles.tabBody}
                layout="grid"
                items={leaves.map((l) => ({ key: l.id, label: `${date(lang, l.start)} – ${date(lang, l.end)}`, value: `${c.leaveTypes[l.type]} · ${c.leaveStatus[l.status]}` }))}
              />
            ) : (
              <p className={`${styles.muted} ${styles.tabBody}`}>
                {t.noLeave}
              </p>
            ),
          },
          {
            value: 'payroll',
            label: t.tabs.payroll,
            content: (
              <SummaryList
                className={styles.tabBody}
                layout="grid"
                items={[
                  { label: t.gross, value: money(lang, slip.gross) },
                  { label: t.net, value: money(lang, slip.net) },
                  { label: c.payroll.cost, value: money(lang, slip.cost) },
                ]}
              />
            ),
          },
        ]}
      />
    </>
  );
}

function AddEmployee({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (e: Employee) => void }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const f = c.employees.form;
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<string | null>(null);
  const [start, setStart] = useState('2026-12-01');
  const [gross, setGross] = useState<number | null>(60000);
  const [tried, setTried] = useState(false);

  const submit = () => {
    setTried(true);
    if (!name.trim() || !department) return;
    onAdd({
      id: `n${Date.now()}`,
      name: name.trim(),
      title: { en: title.trim() || '—', tr: title.trim() || '—' },
      department: department as Department,
      location: 'istanbul',
      start,
      gross: gross ?? 0,
      leaveLeft: 0,
      status: 'probation',
      birthday: '01-01',
    });
    setName('');
    setTitle('');
    setDepartment(null);
    setTried(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={f.title}
      description={f.description}
      closeLabel={c.employees.close}
      footer={
        <>
          <Button variant="ghost" tone="secondary" onClick={onClose}>
            {f.cancel}
          </Button>
          <Button onClick={submit}>{f.save}</Button>
        </>
      }
    >
      <div className={styles.form}>
        <FormField label={f.name} error={tried && !name.trim() ? f.required : undefined}>
          <Input value={name} onChange={(e) => setName(e.target.value)} error={tried && !name.trim()} />
        </FormField>
        <FormField label={f.jobTitle}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>
        <div className={styles.formRow}>
          <FormField label={f.department} error={tried && !department ? f.required : undefined}>
            <Selectbox
              value={department}
              onChange={setDepartment}
              error={tried && !department}
              options={(Object.keys(c.departments) as Department[]).map((k) => ({ value: k, label: c.departments[k] }))}
            />
          </FormField>
          <FormField label={f.start}>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </FormField>
        </div>
        <FormField label={f.gross}>
          <CurrencyInput value={gross} onValueChange={setGross} currency="TRY" currencySelect={false} locale={lang === 'tr' ? 'tr-TR' : 'en-US'} />
        </FormField>
      </div>
    </Modal>
  );
}
