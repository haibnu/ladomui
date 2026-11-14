'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  IconAi,
  IconArrowRight,
  IconCheck,
  IconCodeEditor,
  IconContacts,
  IconCopy,
  IconCurrencyTl,
  IconDesignEditor,
  IconTime,
} from '@ladom/icons';
import {
  Avatar,
  Badge,
  Button,
  Segment,
  Switch,
  TextMotion,
} from '@ladom/ui';
import { BarChart, Card, Delta, DonutChart, StatCard } from '@ladom/ui/pro';
import { DEFAULT_BRAND, primaryScale } from '@/components/customize/theme';
import { Logo } from '@/components/Logo';
import { GITHUB_URL } from '@/components/nav';
import { href, type Locale } from '@/i18n';
import { NEW_LANDING_COPY } from './copy';
import { IsoCanvas } from './IsoCanvas';
import type { SceneName } from './iso3d/scenes';
import styles from './new.module.css';

const INSTALL = 'npx ladom-ui init';

// Brand colors for the "one brand color" columns: the default and two Customize presets.
const BRANDS = [DEFAULT_BRAND, '#2563eb', '#d9480f'];

/** Scopes a brand color to a subtree: the same variables the Customize theme sets on :root. */
function brandScope(brand: string): CSSProperties | undefined {
  // The default brand is what the page already shows (and follows Customize); only the others are scoped.
  if (brand === DEFAULT_BRAND) return undefined;
  const p = primaryScale(brand);
  return {
    '--color-static-brand-color': brand,
    '--color-primary': brand,
    '--color-primary-natural': p.natural,
    '--color-primary-tint': p.tint,
    '--color-primary-soft': p.soft,
    '--color-primary-shade': p.shade,
    '--color-on-primary': p.on,
    '--color-on-primary-tint': p.onTint,
    '--color-primary-foreground': brand,
    '--color-primary-line': brand,
  } as CSSProperties;
}

// The first six components drawn in three.js (a preview; the rest keep their SVG drawings for now).
const COMPONENTS: { scene: SceneName; title: string; href: string; pro?: boolean }[] = [
  { scene: 'button', title: 'Button', href: '/docs/components/button' },
  { scene: 'toggle', title: 'Switch', href: '/docs/components/switch' },
  { scene: 'otp', title: 'OTP Input', href: '/docs/components/otp-input' },
  { scene: 'toast', title: 'Toast', href: '/docs/components/toast' },
  { scene: 'bars', title: 'Bar Chart', href: '/docs/pro/bar-chart', pro: true },
  { scene: 'donut', title: 'Donut Chart', href: '/docs/pro/donut-chart', pro: true },
];

export function NewLanding({ lang }: { lang: Locale }) {
  const c = NEW_LANDING_COPY[lang];
  const d = c.dash;
  const nf = new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US');
  const money = (n: number) => new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', { style: 'currency', currency: 'TRY', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 1, notation: 'compact' }).format(n);

  return (
    <main className={styles.page}>
      {/* ───────────── Hero ───────────── */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <Badge size="small" tone="secondary" iconLeft={<IconAi size={14} />} className={styles.eyebrow}>
            {c.eyebrow}
          </Badge>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>{c.title[0]}</span>
            <span className={`${styles.heroLine} ${styles.heroAccent}`}>
              {c.title[1]}
              <span className={styles.caret} aria-hidden />
            </span>
          </h1>
          <p className={styles.heroLead}>{c.lead}</p>
          <div className={styles.heroActions}>
            <Link href={href(lang, '/docs/introduction')} className={styles.buttonLink}>
              <Button size="large" iconRight={IconArrowRight}>
                <TextMotion effect="roll">{c.start}</TextMotion>
              </Button>
            </Link>
            <span className={styles.command}>
              <span className={styles.prompt}>$</span>
              <code>{INSTALL}</code>
              <IconCopy size={16} />
            </span>
          </div>
        </div>
        <figure className={styles.heroArt}>
          <IsoCanvas scene="hero" labels={c.iso} interactive className={styles.heroCanvas} />
          <figcaption className={styles.heroHint}>{c.heroHint}</figcaption>
        </figure>
      </section>

      {/* ───────────── Handoff, deleted ───────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <h2 className={styles.h2}>{c.oldTitle}</h2>
          <p className={styles.lead}>{c.oldLead}</p>
        </header>
        <div className={styles.pipes}>
          <div className={styles.pipe} data-old>
            <span className={styles.pipeLabel}>
              {c.oldWay} <span className={styles.pipeTime}>{c.oldTime}</span>
            </span>
            <ol className={styles.steps}>
              {c.oldSteps.map((s, i) => (
                <li key={s} className={styles.step} style={{ '--_i': i } as CSSProperties}>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.pipe} data-new>
            <span className={styles.pipeLabel}>
              {c.newWay} <span className={styles.pipeTime}>{c.newTime}</span>
            </span>
            <ol className={styles.steps}>
              {c.newSteps.map((s, i) => (
                <li key={s} className={styles.step} style={{ '--_i': i } as CSSProperties}>
                  {i === 0 ? <IconDesignEditor size={20} /> : i === 1 ? <IconAi size={20} /> : <IconCodeEditor size={20} />}
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── Sentence to screen ───────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <h2 className={styles.h2}>{c.buildTitle}</h2>
          <p className={styles.lead}>{c.buildLead}</p>
        </header>
        <div className={styles.build}>
          <div className={styles.chat}>
            <div className={styles.msg}>
              <Avatar size="tiny" name="H" />
              <div>
                <span className={styles.msgWho}>{c.you}</span>
                <p className={styles.msgText}>{c.buildPrompt}</p>
              </div>
            </div>
            <div className={styles.msg}>
              <span className={styles.aiMark}>
                <IconAi size={16} />
              </span>
              <div>
                <span className={styles.msgWho}>{c.ai}</span>
                <ul className={styles.checks}>
                  {c.buildSteps.map((s) => (
                    <li key={s}>
                      <IconCheck size={16} />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.dash}>
            <div className={styles.dashStats}>
              <StatCard icon={<IconContacts />} label={d.headcount} value={48} format={(n) => nf.format(n)} delta={{ value: '+3', direction: 'up', label: d.vsLast }} data={[38, 40, 41, 43, 45, 48]} chart="line" />
              <StatCard icon={<IconTime />} label={d.onLeave} value={6} format={(n) => nf.format(n)} note={d.thisWeek} data={[2, 4, 3, 6, 5, 6]} chart="bars" tone="warning" />
              <StatCard icon={<IconCurrencyTl />} label={d.payroll} value={2_140_000} format={money} delta={{ value: '+4.1%', direction: 'up', tone: 'neutral', label: d.vsLast }} data={[1.8, 1.86, 1.9, 1.97, 2.05, 2.14]} />
            </div>
            <div className={styles.dashCharts}>
              <Card title={d.payrollTitle}>
                <BarChart
                  title={d.payrollTitle}
                  categories={d.months}
                  series={d.depts.slice(0, 3).map((name, k) => ({ name, data: [0, 1, 2, 3, 4, 5].map((m) => 300 + k * 120 + m * (30 + k * 12) + ((m * 37 + k * 11) % 50)) }))}
                  mode="stacked"
                  height={200}
                  animate={false}
                  locale={lang}
                />
              </Card>
              <Card title={d.teamsTitle}>
                <DonutChart
                  title={d.teamsTitle}
                  data={d.depts.map((name, k) => ({ name, value: [21, 8, 12, 7][k]! }))}
                  label="48"
                  sublabel={d.total}
                  size="medium"
                  animate={false}
                  locale={lang}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── One brand color ───────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHead}>
          <h2 className={styles.h2}>{c.brandTitle}</h2>
          <p className={styles.lead}>{c.brandLead}</p>
        </header>
        <div className={styles.brands}>
          {BRANDS.map((b, k) => (
            <div key={b} className={styles.brandCol} style={brandScope(b)}>
              <span className={styles.brandHex}>
                <span className={styles.swatch} />
                {k === 0 ? '--color-primary' : b}
              </span>
              <Card title={c.brandCard.title} actions={<Delta value="+12%" direction="up" size="small" />}>
                <div className={styles.brandBody}>
                  <Segment
                    size="small"
                    fluid
                    name={`range-${k}`}
                    defaultValue="week"
                    options={[
                      { value: 'week', label: c.brandCard.week },
                      { value: 'month', label: c.brandCard.month },
                    ]}
                  />
                  <Switch label={c.brandCard.email} defaultChecked labelPosition="start" />
                  <Switch label={c.brandCard.push} labelPosition="start" />
                  <div className={styles.miniBars} aria-hidden>
                    {[40, 62, 48, 80, 66, 92, 74].map((h, i) => (
                      <span key={i} style={{ height: `${h}%`, background: `var(--color-chart-${(i % 3) + 1})` }} />
                    ))}
                  </div>
                  <Button iconLeft={IconCheck} className={styles.fluid}>
                    {c.brandCard.save}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Numbers ───────────── */}
      <section className={styles.numbers}>
        {[
          ['0', c.stats.handoffs],
          ['44', c.stats.components],
          ['600+', c.stats.tokens],
          ['285', c.stats.icons],
        ].map(([n, l]) => (
          <div key={l} className={styles.number}>
            <span className={styles.numberValue}>{n}</span>
            <span className={styles.numberLabel}>{l}</span>
          </div>
        ))}
      </section>

      {/* ───────────── Components, in 3D ───────────── */}
      <section className={styles.section}>
        <header className={styles.sectionHeadRow}>
          <div className={styles.sectionHead}>
            <h2 className={styles.h2}>{c.compsTitle}</h2>
            <p className={styles.lead}>{c.compsLead}</p>
          </div>
          <Link href={href(lang, '/docs/components/button')} className={styles.buttonLink}>
            <Button variant="ghost" tone="secondary" iconRight={IconArrowRight}>
              <TextMotion effect="roll">{c.compsAll}</TextMotion>
            </Button>
          </Link>
        </header>
        <ul className={styles.comps}>
          {COMPONENTS.map((item) => (
            <li key={item.scene}>
              <Link href={href(lang, item.href)} className={styles.comp}>
                <IsoCanvas scene={item.scene} labels={c.iso} className={styles.compArt} />
                <span className={styles.compFoot}>
                  <span className={styles.compTitle}>{item.title}</span>
                  <Badge size="tiny" tone={item.pro ? 'primary' : 'secondary'}>
                    {item.pro ? c.pro : c.free}
                  </Badge>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          <span>{c.ctaTitle[0]}</span>
          <span className={styles.ctaAccent}>{c.ctaTitle[1]}</span>
        </h2>
        <p className={styles.lead}>{c.ctaLead}</p>
        <div className={styles.terminal}>
          <div className={styles.terminalBar} aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <code className={styles.terminalLine}>
            <span className={styles.prompt}>$</span> npx ladom-ui init --yes
          </code>
          <code className={styles.terminalLine}>
            <span className={styles.prompt}>$</span> npx ladom-ui skill
          </code>
          <code className={`${styles.terminalLine} ${styles.terminalOk}`}>✓ 44 components · tokens · icons · Claude skill</code>
        </div>
        <p className={styles.ctaPrompt}>{c.ctaPrompt}</p>
        <Link href={href(lang, '/docs/installation')} className={styles.buttonLink}>
          <Button size="large" iconRight={IconArrowRight}>
            <TextMotion effect="roll">{c.start}</TextMotion>
          </Button>
        </Link>
      </section>

      <footer className={styles.footer}>
        <Link href={href(lang, '/')} aria-label="Ladom UI">
          <Logo />
        </Link>
        <span>{c.footer}</span>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </main>
  );
}
