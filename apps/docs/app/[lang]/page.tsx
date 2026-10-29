import Link from 'next/link';
import type { CSSProperties } from 'react';
import { iconNames } from '@ladom/icons';
import { icons } from '@ladom/icons/all';
import meta from '@ladom/tokens/tokens.json';
import tiers from '@/registry/tiers.json';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { TopBar } from '@/components/TopBar';
import { getDictionary, href, type Locale } from '@/i18n';
import styles from './landing.module.css';

const componentCount = Object.keys(tiers).length;
const tokenCount = meta.groups.reduce((n, g) => n + g.variables.length + g.tokens.length, 0);

const SWATCHES = ['primary', 'primary-tint', 'secondary', 'surface-level-3', 'success', 'info', 'warning', 'error'];
const TYPE_SAMPLES = [
  { token: '--text-content-h2-bold', label: 'Content H2 Bold' },
  { token: '--text-ui-text-lead-regular', label: 'UI Text Lead' },
  { token: '--text-ui-text-regular', label: 'UI Text' },
  { token: '--text-ui-caption', label: 'UI Caption' },
];
const ICONS = iconNames.filter((n) => ['phone', 'search', 'setting', 'delete', 'add', 'check', 'info', 'warning', 'message', 'profile', 'download', 'ev'].includes(n));

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang).landing;
  const groups = getDictionary(lang).groups;
  return (
    <>
      <TopBar lang={lang} />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.lead}>{t.lead}</p>
          <div className={styles.actions}>
            <Link href={href(lang, '/docs/introduction')} className={styles.primaryAction}>
              {t.getStarted}
            </Link>
            <Link href={href(lang, '/docs/foundations/color')} className={styles.secondaryAction}>
              {t.browse}
            </Link>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt>{t.tokens}</dt>
              <dd>{tokenCount}</dd>
            </div>
            <div>
              <dt>{t.componentCount}</dt>
              <dd>{componentCount}</dd>
            </div>
            <div>
              <dt>{t.iconCount}</dt>
              <dd>{iconNames.length}</dd>
            </div>
            <div>
              <dt>{t.themes}</dt>
              <dd>{t.themesValue}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.showcase} aria-label={t.showcase}>
          <Link href={href(lang, '/docs/foundations/color')} className={styles.card}>
            <h2 className={styles.cardTitle}>{groups.color!.title}</h2>
            <div className={styles.swatches}>
              {SWATCHES.map((s) => (
                <span key={s} className={styles.swatch} style={{ background: `var(--color-${s})` }} title={`--color-${s}`} />
              ))}
            </div>
          </Link>
          <Link href={href(lang, '/docs/foundations/typography')} className={styles.card}>
            <h2 className={styles.cardTitle}>{groups.typography!.title}</h2>
            <div className={styles.typeSamples}>
              {TYPE_SAMPLES.map(({ token, label }) => (
                <span
                  key={token}
                  style={{ font: `var(${token})`, textTransform: `var(${token}-text-transform, none)` as CSSProperties['textTransform'] }}
                >
                  {label}
                </span>
              ))}
            </div>
          </Link>
          <Link href={href(lang, '/docs/foundations/icons')} className={styles.card}>
            <h2 className={styles.cardTitle}>{getDictionary(lang).nav.icons}</h2>
            <div className={styles.iconGrid}>
              {ICONS.map((name) => {
                const Icon = icons[name];
                return <Icon key={name} size={24} />;
              })}
            </div>
          </Link>
        </section>

        <section className={styles.why} aria-labelledby="why">
          <h2 id="why" className={styles.sectionTitle}>
            {t.whyTitle}
          </h2>
          <p className={styles.sectionLead}>{t.whyLead}</p>
          <ul className={styles.features}>
            {t.features.map((f) => (
              <li key={f.title} className={styles.feature}>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureText}>{f.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.install} aria-labelledby="install">
          <h2 id="install" className={styles.sectionTitle}>
            {t.installTitle}
          </h2>
          <p className={styles.sectionLead}>{t.installText}</p>
          <CodeBlock className={styles.installCode} code={'npx ladom-ui init\nnpx ladom-ui add button input table modal'} />
          <Link href={href(lang, '/docs/installation')} className={styles.primaryAction}>
            {t.getStarted}
          </Link>
        </section>
      </main>
      <footer className={styles.footer}>© Ladom</footer>
    </>
  );
}
