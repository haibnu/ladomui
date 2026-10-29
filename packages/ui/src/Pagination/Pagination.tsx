'use client';

import type { HTMLAttributes } from 'react';
import { IconArrowLeft, IconArrowRight } from '@ladom/icons';
import { Button } from '../Button/Button';
import styles from './Pagination.module.css';

// Figma: Components / Pagination (4215:13) with .Pagination Item (4215:12: 🕹 State, Current =
// the page on screen). Shows the first and last pages, `siblings` pages on each side of the
// current one and an ellipsis for the pages in between. Pages count from 1.
export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  previousLabel?: string;
  nextLabel?: string;
  /** Name of each page button; "Page 3" by default. */
  pageLabel?: (page: number) => string;
};

/** The pages to show, with 0 for an ellipsis: 1 … 4 5 6 … 12 */
export function paginationRange(page: number, pageCount: number, siblings = 1): number[] {
  const slots = siblings * 2 + 5;
  if (pageCount <= slots) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - siblings, pageCount - siblings * 2 - 2));
  const end = Math.min(pageCount - 1, Math.max(page + siblings, siblings * 2 + 3));
  const middle = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...(start > 2 ? [0] : []), ...middle, ...(end < pageCount - 1 ? [0] : []), pageCount];
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  previousLabel = 'Previous page',
  nextLabel = 'Next page',
  pageLabel = (p) => `Page ${p}`,
  className,
  'aria-label': label = 'Pagination',
  ...rest
}: PaginationProps) {
  return (
    <nav aria-label={label} className={[styles.pagination, className].filter(Boolean).join(' ')} {...rest}>
      <Button variant="ghost" tone="tertiary" size="small" icon={IconArrowLeft} aria-label={previousLabel} disabled={page <= 1} onClick={() => onPageChange(page - 1)} />
      <ul className={styles.list}>
        {paginationRange(page, pageCount, siblings).map((p, i) =>
          p === 0 ? (
            <li key={`gap-${i}`} className={styles.gap} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                className={styles.item}
                aria-label={pageLabel(p)}
                aria-current={p === page ? 'page' : undefined}
                onClick={() => p !== page && onPageChange(p)}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>
      <Button variant="ghost" tone="tertiary" size="small" icon={IconArrowRight} aria-label={nextLabel} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} />
    </nav>
  );
}
