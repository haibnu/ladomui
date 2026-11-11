import type { ReactNode } from 'react';
import { Cell } from '@ladom/ui';
import styles from './hr.module.css';

type Row = { key?: string; label: ReactNode; value: ReactNode };

/** Label and value pairs of the demo (profile facts, payslip lines), as small Cells: the value is the title, the label the line under it. */
export function Rows({ title, items, total, className }: { title?: ReactNode; items: Row[]; total?: Row; className?: string }) {
  return (
    <div className={[styles.rows, className].filter(Boolean).join(' ')}>
      {title != null && <p className={styles.rowsTitle}>{title}</p>}
      {[...items, ...(total ? [{ ...total, key: 'total' }] : [])].map((r, i) => (
        <Cell key={r.key ?? i} size="small" subtitle={r.label}>
          {r.value}
        </Cell>
      ))}
    </div>
  );
}
