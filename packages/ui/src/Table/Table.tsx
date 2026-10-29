'use client';

import { useMemo, useState, type ReactNode, type TableHTMLAttributes } from 'react';
import { IconArrowBottom, IconArrowTop } from '@ladom/icons';
import { Checkbox } from '../Checkbox/Checkbox';
import styles from './Table.module.css';

// Figma: Components / Table (4214:61) with .Table Header Cell (4214:21: 🎛 Type, ↕ Sort),
// .Table Cell (4214:27: 🎛 Type) and .Table Row (4214:60: 🕹 State). Columns describe the
// header and each cell; sortable columns sort the rows by row[key] unless onSortChange is given
// (then the rows are expected sorted, e.g. by the server). selectable adds the checkbox column.
export type TableSortDirection = 'ascending' | 'descending';
export type TableSort = { key: string; direction: TableSortDirection };

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  /** The cell content; row[key] by default. */
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: 'start' | 'end';
  /** CSS width of the column, e.g. '12rem' or '30%'. */
  width?: string;
};

export type TableProps<T> = Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> & {
  columns: TableColumn<T>[];
  rows: T[];
  /** A stable key for each row; used for selection. */
  rowKey: (row: T) => string;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** Shown in place of the rows when there are none. */
  empty?: ReactNode;
  /** The table's name for screen readers; shown only to them. */
  caption?: ReactNode;
  selectAllLabel?: string;
  selectRowLabel?: (row: T) => string;
};

const compare = (a: unknown, b: unknown) =>
  typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true });

export function Table<T>({
  columns,
  rows,
  rowKey,
  sort: controlledSort,
  defaultSort = null,
  onSortChange,
  selectable = false,
  selected: controlledSelected,
  defaultSelected = [],
  onSelectedChange,
  empty,
  caption,
  selectAllLabel = 'Select all rows',
  selectRowLabel = () => 'Select row',
  className,
  ...rest
}: TableProps<T>) {
  const [innerSort, setInnerSort] = useState(defaultSort);
  const [innerSelected, setInnerSelected] = useState(defaultSelected);
  const sort = controlledSort === undefined ? innerSort : controlledSort;
  const selected = controlledSelected ?? innerSelected;

  const shown = useMemo(() => {
    if (!sort || onSortChange) return rows;
    const sign = sort.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => sign * compare((a as Record<string, unknown>)[sort.key], (b as Record<string, unknown>)[sort.key]));
  }, [rows, sort, onSortChange]);

  const setSort = (key: string) => {
    // ascending -> descending -> unsorted
    const next: TableSort | null = sort?.key !== key ? { key, direction: 'ascending' } : sort.direction === 'ascending' ? { key, direction: 'descending' } : null;
    if (controlledSort === undefined) setInnerSort(next);
    onSortChange?.(next);
  };
  const setSelected = (keys: string[]) => {
    if (controlledSelected === undefined) setInnerSelected(keys);
    onSelectedChange?.(keys);
  };
  const keys = shown.map(rowKey);
  const all = keys.length > 0 && keys.every((k) => selected.includes(k));
  const some = !all && keys.some((k) => selected.includes(k));

  return (
    <div className={styles.frame}>
      <table className={[styles.table, className].filter(Boolean).join(' ')} {...rest}>
        {caption != null && <caption className={styles.caption}>{caption}</caption>}
        <colgroup>
          {selectable && <col />}
          {columns.map((c) => (
            <col key={c.key} style={c.width ? { inlineSize: c.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selectable && (
              <th scope="col" className={styles.check}>
                <Checkbox
                  size="small"
                  aria-label={selectAllLabel}
                  checked={all}
                  indeterminate={some}
                  onChange={() => setSelected(all ? selected.filter((k) => !keys.includes(k)) : [...new Set([...selected, ...keys])])}
                />
              </th>
            )}
            {columns.map((c) => {
              const direction = sort?.key === c.key ? sort.direction : undefined;
              return (
                <th key={c.key} scope="col" aria-sort={c.sortable ? (direction ?? 'none') : undefined} data-align={c.align}>
                  {c.sortable ? (
                    <button type="button" className={styles.sort} onClick={() => setSort(c.key)}>
                      {c.header}
                      {direction && (direction === 'ascending' ? <IconArrowTop size={16} /> : <IconArrowBottom size={16} />)}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {shown.length === 0 && empty != null && (
            <tr>
              <td className={styles.empty} colSpan={columns.length + (selectable ? 1 : 0)}>
                {empty}
              </td>
            </tr>
          )}
          {shown.map((row) => {
            const key = rowKey(row);
            const isSelected = selected.includes(key);
            return (
              <tr key={key} aria-selected={selectable ? isSelected : undefined}>
                {selectable && (
                  <td className={styles.check}>
                    <Checkbox
                      size="small"
                      aria-label={selectRowLabel(row)}
                      checked={isSelected}
                      onChange={() => setSelected(isSelected ? selected.filter((k) => k !== key) : [...selected, key])}
                    />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} data-align={c.align}>
                    {c.cell ? c.cell(row) : ((row as Record<string, ReactNode>)[c.key] ?? null)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
