import type { ReactNode } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Toc } from '../../components/Toc';
import { TopBar } from '../../components/TopBar';
import styles from '../../components/shell.module.css';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <TopBar withMenu />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
        <main className={styles.main}>{children}</main>
        <aside className={styles.tocColumn}>
          <Toc />
        </aside>
      </div>
    </>
  );
}
