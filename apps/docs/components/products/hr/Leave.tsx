'use client';

import { useState } from 'react';
import { IconAdd, IconCheck, IconClose, IconDateRange } from '@ladom/icons';
import { Avatar, Badge, Button, Cell, EmptyState, FormField, Input, Modal, Selectbox, Table, Tabs, Textarea, useToast, type BadgeTone, type TableColumn } from '@ladom/ui';
import { Card, PageHeader, PersonCell } from '@ladom/ui/pro';
import { useLocale } from '../../useLocale';
import { HR_COPY } from './copy';
import { EMPLOYEES, LEAVES, date, employee, type LeaveRequest, type LeaveStatus, type LeaveType } from './data';
import styles from './hr.module.css';

const TONE: Record<LeaveStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
};
const dayCount = (start: string, end: string) => Math.max(1, Math.round((Date.parse(end) - Date.parse(start)) / 86400000) + 1);

export function Leave() {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const t = c.leave;
  const { toast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>(LEAVES);
  const [tab, setTab] = useState<LeaveStatus>('pending');
  const [creating, setCreating] = useState(false);

  const decide = (id: string, status: LeaveStatus) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({
      tone: status === 'approved' ? 'success' : 'error',
      title: status === 'approved' ? t.approved : t.rejected,
      description: employee(requests.find((r) => r.id === id)!.employee).name,
    });
  };

  const range = (r: LeaveRequest) => (r.start === r.end ? date(lang, r.start) : `${date(lang, r.start, { day: 'numeric', month: 'short' })} – ${date(lang, r.end)}`);

  const columns: TableColumn<LeaveRequest>[] = [
    {
      key: 'employee',
      header: t.employee,
      cell: (r) => {
        const e = employee(r.employee);
        return (
          <PersonCell name={e.name} subtitle={c.departments[e.department]} />
        );
      },
    },
    { key: 'type', header: t.type, cell: (r) => c.leaveTypes[r.type] },
    {
      key: 'dates',
      header: t.dates,
      cell: (r) => <span className={styles.num}>{range(r)}</span>,
    },
    {
      key: 'days',
      header: t.days,
      align: 'end',
      cell: (r) => <span className={styles.num}>{r.days}</span>,
    },
    {
      key: 'requested',
      header: t.requested,
      cell: (r) => <span className={styles.num}>{date(lang, r.requested)}</span>,
    },
    {
      key: 'actions',
      header: tab === 'pending' ? t.actions : c.employees.status,
      align: 'end',
      cell: (r) =>
        r.status === 'pending' ? (
          <span className={styles.actions}>
            <Button size="small" variant="ghost" tone="error" iconLeft={IconClose} onClick={() => decide(r.id, 'rejected')}>
              {t.reject}
            </Button>
            <Button size="small" tone="success" iconLeft={IconCheck} onClick={() => decide(r.id, 'approved')}>
              {t.approve}
            </Button>
          </span>
        ) : (
          <Badge size="small" tone={TONE[r.status]}>
            {c.leaveStatus[r.status]}
          </Badge>
        ),
    },
  ];

  const count = (s: LeaveStatus) => requests.filter((r) => r.status === s).length;
  const table = (s: LeaveStatus) => (
    <div className={styles.tableWrap} style={{ marginBlockStart: 'var(--space-medium)' }}>
      <Table
        columns={columns}
        rows={requests.filter((r) => r.status === s)}
        rowKey={(r) => r.id}
        empty={<EmptyState size="small" icon={<IconDateRange />} title={t.empty} description={t.emptyText} />}
      />
    </div>
  );
  const away = requests.filter((r) => r.status === 'approved' && r.start <= '2026-11-15' && r.end >= '2026-11-09');

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title={t.title}
        subtitle={t.subtitle}
        actions={
          <Button iconLeft={IconAdd} onClick={() => setCreating(true)}>
            {t.newRequest}
          </Button>
        }
      />
      <Tabs
        value={tab}
        onChange={(v) => setTab(v as LeaveStatus)}
        items={(['pending', 'approved', 'rejected'] as LeaveStatus[]).map((s) => ({
          value: s,
          label: t.tabs[s],
          badge: count(s),
          badgeTone: s === 'pending' ? 'warning' : undefined,
          content: table(s),
        }))}
      />
      <Card title={t.away}>
        <div className={styles.list}>
          {away.map((r) => {
            const e = employee(r.employee);
            return (
              <Cell key={r.id} size="small" avatar={<Avatar size="tiny" name={e.name} />} subtitle={`${c.leaveTypes[r.type]} · ${range(r)}`}>
                {e.name}
              </Cell>
            );
          })}
        </div>
      </Card>
      <NewRequest
        open={creating}
        onClose={() => setCreating(false)}
        onSend={(r) => {
          setRequests([r, ...requests]);
          setTab('pending');
          setCreating(false);
          toast({
            tone: 'success',
            title: t.form.sent,
            description: employee(r.employee).name,
          });
        }}
      />
    </>
  );
}

function NewRequest({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (r: LeaveRequest) => void }) {
  const { lang } = useLocale();
  const c = HR_COPY[lang];
  const f = c.leave.form;
  const [who, setWho] = useState<string | null>('e14');
  const [type, setType] = useState<string | null>('annual');
  const [start, setStart] = useState('2026-12-07');
  const [end, setEnd] = useState('2026-12-09');
  const [note, setNote] = useState('');

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
          <Button
            disabled={!who || !type || end < start}
            onClick={() =>
              onSend({
                id: `n${Date.now()}`,
                employee: who!,
                type: type as LeaveType,
                start,
                end,
                days: dayCount(start, end),
                status: 'pending',
                requested: '2026-11-11',
              })
            }
          >
            {f.send}
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <FormField label={f.employee}>
          <Selectbox
            value={who}
            onChange={setWho}
            searchable
            options={EMPLOYEES.map((e) => ({
              value: e.id,
              label: e.name,
              subtitle: e.title[lang],
              avatar: <Avatar size="tiny" name={e.name} />,
            }))}
          />
        </FormField>
        <FormField label={f.type}>
          <Selectbox
            value={type}
            onChange={setType}
            options={(Object.keys(c.leaveTypes) as LeaveType[]).map((k) => ({
              value: k,
              label: c.leaveTypes[k],
            }))}
          />
        </FormField>
        <div className={styles.formRow}>
          <FormField label={f.from}>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </FormField>
          <FormField label={f.to} hint={c.employees.days(dayCount(start, end))}>
            <Input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
          </FormField>
        </div>
        <FormField label={f.note} optional={f.notePlaceholder}>
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        </FormField>
      </div>
    </Modal>
  );
}
