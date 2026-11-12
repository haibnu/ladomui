import type { ReactNode } from 'react';
import { ScrollArea } from '@ladom/ui';
import { Sidebar } from '@/components/Sidebar';
import { Toc } from '@/components/Toc';
import { TopBar } from '@/components/TopBar';
import styles from '@/components/shell.module.css';
import type { Locale } from '@/i18n';

export default async function DocsLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  return (
    <>
      <TopBar lang={lang} withMenu />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ScrollArea className={styles.scroll} viewportProps={{ className: styles.scrollViewport }}>
            <Sidebar />
          </ScrollArea>
        </aside>
        <main className={styles.main}>{children}</main>
        <aside className={styles.tocColumn}>
          <ScrollArea className={styles.scroll} viewportProps={{ className: styles.scrollViewport }}>
            <Toc />
          </ScrollArea>
        </aside>
      </div>
    </>
  );
}
