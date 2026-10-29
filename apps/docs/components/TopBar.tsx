import Link from 'next/link';
import { IconExternalLink } from '@ladom/icons';
import { MobileNav } from './MobileNav';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';
import { GITHUB_URL } from './nav';
import styles from './shell.module.css';

export function TopBar({ withMenu = false }: { withMenu?: boolean }) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarStart}>
        {withMenu && <MobileNav />}
        <Link href="/" className={styles.brand}>
          Ladom UI
        </Link>
      </div>
      <div className={styles.topBarEnd}>
        <Search />
        <Link href="/docs/introduction" className={styles.topLink}>
          Docs
        </Link>
        <a href={GITHUB_URL} className={styles.topLink} target="_blank" rel="noreferrer">
          GitHub <IconExternalLink size={14} />
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
