import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import { iconNames } from '@ladom/icons';
import meta from '@ladom/tokens/tokens.json';
import * as figmaArt from '@/components/landing/art/figma';
import { DRAWN } from '@/components/landing/art/drawn';
import { inter, jakarta, paprika } from '@/components/landing/fonts';
import { FooterMark } from '@/components/landing/FooterMark';
import { ThrowCoin } from '@/components/landing/ThrowCoin';
import { HeroStrip } from '@/components/landing/HeroStrip';
import styles from '@/components/landing/landing.module.css';
import { PlayInView } from '@/components/landing/PlayInView';
import { getCatalog, type CatalogItem } from '@/components/nav';
import { TopBar } from '@/components/TopBar';
import { getDictionary, href, type Locale } from '@/i18n';

// Built from the Ladom Agency Website Figma file, LP - Desktop (173:25296).
const FIGMA_FILE = 'https://www.figma.com/design/VCJ6ew9Vk1gAqfnvQ1gfOz/Ladom-UI-Design-System';
const footerMarkSvg = readFileSync(join(process.cwd(), 'components/landing/art/footer-mark.svg'), 'utf8');
const tokenCount = meta.groups.reduce((n, g) => n + g.variables.length + g.tokens.length, 0);

// Illustrations from the Figma Component Cards, by docs page; the rest are drawn in drawn.tsx.
const FIGMA_ART: Record<string, string> = {
  avatar: figmaArt.avatar,
  button: figmaArt.button,
  checkbox: figmaArt.checkbox,
  radio: figmaArt.radio,
  selectbox: figmaArt.selectbox,
  tab: figmaArt.tab,
  cell: figmaArt.cell,
  modal: figmaArt.modal,
  drawer: figmaArt.drawer,
};

function Svg({ svg, className }: { svg: string; className?: string }) {
  return <span className={className} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />;
}

function Divider({ children }: { children: string }) {
  return (
    <p className={styles.divider}>
      <span>{children}</span>
    </p>
  );
}

function Card({ item, t }: { item: CatalogItem; t: ReturnType<typeof getDictionary>['landing'] }) {
  const Drawn = DRAWN[item.slug];
  const figma = FIGMA_ART[item.slug];
  return (
    <li>
      <Link href={item.href} className={styles.card}>
        <span className={styles.cardHead}>
          <span className={styles.cardTitle}>{item.title}</span>
          <span className={styles.tier}>{item.pro ? t.pro : t.freeTier}</span>
        </span>
        <span className={styles.metas}>
          <span>
            Figma <span className={styles.status}>{t.available}</span>
          </span>
          <span>
            React <span className={styles.status}>{t.available}</span>
          </span>
          <span className={styles.metaLater}>
            Mobile <span className={styles.status}>{t.later}</span>
          </span>
        </span>
        <span className={styles.art} data-art>
          {figma ? <Svg svg={figma} /> : Drawn ? <Drawn /> : null}
        </span>
      </Link>
    </li>
  );
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Locale;
  const dict = getDictionary(lang);
  const t = dict.landing;
  const catalog = getCatalog(lang);
  const components = catalog.filter((c) => !c.molecule);
  const molecules = catalog.filter((c) => c.molecule);
  return (
    <div className={[styles.page, jakarta.variable, paprika.variable, inter.variable].join(' ')}>
      <TopBar lang={lang} />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <p className={styles.eyebrow}>{t.eyebrow}</p>
              <h1 className={styles.title}>
                <span className={styles.titleRow}>
                  {t.title[0]} <Svg svg={figmaArt.uiMark} className={styles.uiMark} />
                  <span className={styles.visuallyHidden}>UI</span>
                </span>
                <span className={styles.titleRow}>{t.title[1]}</span>
                <em className={styles.titleScript}>{t.title[2]}</em>
              </h1>
              <p className={styles.lead}>{t.lead}</p>
              <div className={styles.heroActions}>
                <a href={FIGMA_FILE} className={styles.heroButton} target="_blank" rel="noreferrer">
                  <Svg svg={figmaArt.figmaMark} className={styles.heroIcon} />
                  {t.figma}
                  <span className={styles.heroBadge}>{t.free}</span>
                </a>
                <Link href={href(lang, '/docs/installation')} className={styles.heroButton}>
                  <span className={styles.heroCode} aria-hidden>
                    {'</>'}
                  </span>
                  {t.react}
                  <span className={styles.heroBadge}>v0.2</span>
                </Link>
                <span className={`${styles.heroButton} ${styles.heroButtonOff}`} aria-disabled>
                  {t.mobile}
                  <span className={`${styles.heroBadge} ${styles.heroBadgeLight}`}>{t.soon}</span>
                </span>
              </div>
            </div>
            <span className={styles.heroArt} data-art>
              <Svg svg={figmaArt.heroL} />
            </span>
          </div>
          <HeroStrip lang={lang} />
        </section>

        <div className={styles.sheets}>
          <section className={styles.sheet} aria-labelledby="components">
            <p className={styles.sheetEyebrow}>{t.library}</p>
            <h2 id="components" className={styles.sheetTitle}>
              {t.componentsTitle}
            </h2>
            <p className={styles.sheetLead}>{t.stats(catalog.length, tokenCount, iconNames.length)}</p>
            <Divider>{t.baseComponents}</Divider>
            <ul className={styles.cards}>
              {components.map((item) => (
                <Card key={item.slug} item={item} t={t} />
              ))}
            </ul>
            <Divider>{t.molecules}</Divider>
            <ul className={styles.cards}>
              {molecules.map((item) => (
                <Card key={item.slug} item={item} t={t} />
              ))}
            </ul>
          </section>

          <section className={styles.sheet} aria-labelledby="why">
            <p className={styles.sheetEyebrow}>{t.library}</p>
            <h2 id="why" className={styles.sheetTitle}>
              {t.whyTitle}
            </h2>
            <p className={styles.sheetLead}>{t.whyLead}</p>
            <ul className={styles.features}>
              {t.features.map((f) => (
                <li key={f.title} className={styles.feature}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.cta} aria-labelledby="cta">
          <h2 id="cta" className={styles.ctaTitle}>
            {t.ctaTitle[0]} <span>{t.ctaTitle[1]}</span>
          </h2>
          <div className={styles.ctaStage}>
            <span className={styles.ctaGlow} aria-hidden />
            <ThrowCoin svg={figmaArt.logo} className={styles.coinTop} />
            <ThrowCoin svg={figmaArt.logo} className={styles.coinBottom} hint={t.throwIt} />
            <Link href={href(lang, '/docs/installation')} className={styles.glass}>
              {t.ctaButton}
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <nav className={styles.footerLinks} aria-label="Footer">
          <a className={styles.footerPill} href="https://www.npmjs.com/package/ladom-ui" target="_blank" rel="noreferrer">
            <span>npm</span>
          </a>
          <a className={styles.footerPill} href="https://ladom.co" target="_blank" rel="noreferrer">
            <span>ladom.co</span>
          </a>
          <Link className={styles.footerPill} href={href(lang, '/docs/license')}>
            <span>{t.docsLinks[3]}</span>
          </Link>
        </nav>
        <p className={styles.rights}>
          {t.rights} <i aria-hidden>C</i> <small>{t.founded}</small>
        </p>
        <FooterMark svg={footerMarkSvg} label="Ladom" />
      </footer>
      <PlayInView />
    </div>
  );
}
