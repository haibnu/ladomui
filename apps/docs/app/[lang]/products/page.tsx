import type { Metadata } from 'next';
import Link from 'next/link';
import { IconExternalLink } from '@ladom/icons';
import { Badge } from '@ladom/ui';
import { PRODUCTS } from '@/components/products/products';
import { TopBar } from '@/components/TopBar';
import styles from '@/components/products/products.module.css';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary((await params).lang as Locale);
  return { title: t.products.title, description: t.products.lead };
}

export default async function ProductsPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  return (
    <>
      <TopBar lang={lang} />
      <main className={styles.index}>
      <h1 className={styles.title}>{t.products.title}</h1>
      <p className={styles.lead}>{t.products.lead}</p>
      <div className={styles.grid}>
        {PRODUCTS.map((p) => {
          const Icon = p.icon;
          const body = (
            <>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>
                  <Icon size={24} />
                </span>
                {!p.path && <Badge size="small">{t.products.soon}</Badge>}
              </div>
              <h2 className={styles.cardTitle}>{p.name[lang]}</h2>
              <p className={styles.cardText}>{p.description[lang]}</p>
              {p.path && (
                <span className={styles.cardAction}>
                  {t.products.open} <IconExternalLink size={16} />
                </span>
              )}
            </>
          );
          return p.path ? (
            <Link key={p.key} href={href(lang, p.path)} target="_blank" rel="noopener" className={styles.card}>
              {body}
            </Link>
          ) : (
            <div key={p.key} className={styles.card} aria-disabled="true">
              {body}
            </div>
          );
        })}
      </div>
    </main>
    </>
  );
}
