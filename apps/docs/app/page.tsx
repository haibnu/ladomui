import Link from 'next/link';
import type { CSSProperties } from 'react';
import { iconNames } from '@ladom/icons';
import { icons } from '@ladom/icons/all';
import meta from '@ladom/tokens/tokens.json';
import { TopBar } from '../components/TopBar';
import styles from './landing.module.css';

const tokenCount = meta.groups.reduce((n, g) => n + g.variables.length + g.tokens.length, 0);

const SWATCHES = ['primary', 'primary-tint', 'secondary', 'surface-level-3', 'success', 'info', 'warning', 'error'];
const TYPE_SAMPLES = [
  { token: '--text-content-h2-bold', label: 'Content H2 Bold' },
  { token: '--text-ui-text-lead-regular', label: 'UI Text Lead' },
  { token: '--text-ui-text-regular', label: 'UI Text' },
  { token: '--text-ui-caption', label: 'UI Caption' },
];
const ICONS = iconNames.filter((n) => ['phone', 'search', 'setting', 'delete', 'add', 'check', 'info', 'warning', 'message', 'profile', 'download', 'ev'].includes(n));

export default function Home() {
  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Ladom Design System</p>
          <h1 className={styles.title}>One source of truth, from Figma to production.</h1>
          <p className={styles.lead}>
            Design tokens, icons and React components for every Ladom product, built 1:1 from the Ladom UI Figma file.
          </p>
          <div className={styles.actions}>
            <Link href="/docs/introduction" className={styles.primaryAction}>
              Get started
            </Link>
            <Link href="/docs/foundations/color" className={styles.secondaryAction}>
              Browse foundations
            </Link>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt>Design tokens</dt>
              <dd>{tokenCount}</dd>
            </div>
            <div>
              <dt>Icons</dt>
              <dd>{iconNames.length}</dd>
            </div>
            <div>
              <dt>Themes</dt>
              <dd>Light · Dark</dd>
            </div>
          </dl>
        </section>

        <section className={styles.showcase} aria-label="Showcase">
          <Link href="/docs/foundations/color" className={styles.card}>
            <h2 className={styles.cardTitle}>Colors</h2>
            <div className={styles.swatches}>
              {SWATCHES.map((s) => (
                <span key={s} className={styles.swatch} style={{ background: `var(--color-${s})` }} title={`--color-${s}`} />
              ))}
            </div>
          </Link>
          <Link href="/docs/foundations/typography" className={styles.card}>
            <h2 className={styles.cardTitle}>Typography</h2>
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
          <Link href="/docs/foundations/icons" className={styles.card}>
            <h2 className={styles.cardTitle}>Icons</h2>
            <div className={styles.iconGrid}>
              {ICONS.map((name) => {
                const Icon = icons[name];
                return <Icon key={name} size={24} />;
              })}
            </div>
          </Link>
        </section>
      </main>
      <footer className={styles.footer}>© Ladom</footer>
    </>
  );
}
