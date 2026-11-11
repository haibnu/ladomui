import Link from 'next/link';
import { IconExternalLink } from '@ladom/icons';
import { getDictionary, href, type Locale } from '@/i18n';
import { LanguageLink } from './LanguageLink';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { CustomizeButton } from './customize/CustomizeButton';
import { Search } from './Search';
import { ThemeToggle } from './ThemeToggle';
import { GITHUB_URL } from './nav';
import styles from './shell.module.css';

export function TopBar({ lang, withMenu = false }: { lang: Locale; withMenu?: boolean }) {
  const t = getDictionary(lang);
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarStart}>
        {withMenu && <MobileNav />}
        <Link href={href(lang, '/')} className={styles.brand}>
          <Logo />
        </Link>
        <CustomizeButton />
      </div>
      <div className={styles.topBarEnd}>
        <Search />
        <Link href={href(lang, '/docs/introduction')} className={styles.topLink}>
          {t.topBar.docs}
        </Link>
        <a href={GITHUB_URL} className={styles.topLink} target="_blank" rel="noreferrer">
          GitHub <IconExternalLink size={14} />
        </a>
        <LanguageLink />
        <ThemeToggle />
      </div>
    </header>
  );
}
