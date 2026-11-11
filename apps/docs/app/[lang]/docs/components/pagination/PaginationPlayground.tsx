'use client';

import { useState } from 'react';
import { Pagination } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlNumber, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { pages: 'Pages', siblings: 'Siblings', figma: 'Figma variant', code: 'Code', label: 'Pagination', previous: 'Previous page', next: 'Next page', page: (p: number) => `Page ${p}` },
  tr: { pages: 'Sayfa sayısı', siblings: 'Komşu sayfa', figma: 'Figma varyantı', code: 'Kod', label: 'Sayfalama', previous: 'Önceki sayfa', next: 'Sonraki sayfa', page: (p: number) => `Sayfa ${p}` },
};

export function PaginationPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [page, setPage] = useState(2);
  const [pageCount, setPageCount] = useState(12);
  const [siblings, setSiblings] = useState(1);
  const code = `import { Pagination } from '@/components/ladom';\n\n<Pagination\n  page={${page}}\n  pageCount={${pageCount}}${siblings !== 1 ? `\n  siblings={${siblings}}` : ''}\n  onPageChange={setPage}\n/>`;
  const figma = `Pagination\n.Pagination Item › 🕹 State=Current (${page})`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Pagination
          page={page}
          pageCount={pageCount}
          siblings={siblings}
          onPageChange={setPage}
          aria-label={c.label}
          previousLabel={c.previous}
          nextLabel={c.next}
          pageLabel={c.page}
        />
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlNumber
          label={c.pages}
          value={pageCount}
          min={1}
          max={99}
          onChange={(v) => {
            const n = Math.max(1, v || 1);
            setPageCount(n);
            setPage((p) => Math.min(p, n));
          }}
        />
        <ControlSelect label={c.siblings} value={String(siblings)} options={['0', '1', '2']} onChange={(v) => setSiblings(Number(v))} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
