import Link from "next/link";
import { iconNames } from "@ladom/icons";
import meta from "@ladom/tokens/tokens.json";
import * as figmaArt from "@/components/landing/art/figma";
import { DRAWN } from "@/components/landing/art/drawn";
import { FIGMA_ART } from "@/components/landing/art/figmaCards";
import { coinOutline } from "@/components/landing/art/coinOutline";
import { FEATURE_ART } from "@/components/landing/art/features";
import { inter, jakarta, paprika } from "@/components/landing/fonts";
import { CopyButton } from "@/components/landing/CopyButton";
import { ReactMark } from "@/components/landing/ReactMark";
import { ThrowCoin } from "@/components/landing/ThrowCoin";
import { HeroL } from "@/components/landing/HeroL";
import { HeroStrip } from "@/components/landing/HeroStrip";
import styles from "@/components/landing/landing.module.css";
import { PlayInView } from "@/components/landing/PlayInView";
import { Logo } from "@/components/Logo";
import { getCatalog, GITHUB_URL, type CatalogItem } from "@/components/nav";
import { TopBar } from "@/components/TopBar";
import { getDictionary, href, type Locale } from "@/i18n";

// Built from the Ladom Agency Website Figma file, LP - Desktop (173:25296).
const FIGMA_FILE =
  "https://www.figma.com/design/VCJ6ew9Vk1gAqfnvQ1gfOz/Ladom-UI-Design-System";
const INSTALL = "npx ladom-ui init";
const tokenCount = meta.groups.reduce(
  (n, g) => n + g.variables.length + g.tokens.length,
  0,
);


function Svg({ svg, className }: { svg: string; className?: string }) {
  return (
    <span
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function Divider({ children }: { children: string }) {
  return (
    <p className={styles.divider}>
      <span>{children}</span>
    </p>
  );
}

function Card({
  item,
  t,
}: {
  item: CatalogItem;
  t: ReturnType<typeof getDictionary>["landing"];
}) {
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

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = (await params).lang as Locale;
  const dict = getDictionary(lang);
  const t = dict.landing;
  const catalog = getCatalog(lang);
  const components = catalog.filter((c) => !c.molecule);
  const molecules = catalog.filter((c) => c.molecule);
  return (
    <div
      className={[
        styles.page,
        jakarta.variable,
        paprika.variable,
        inter.variable,
      ].join(" ")}
    >
      <TopBar lang={lang} />
      <main>
        <section className={styles.hero}>
          <div
            className={styles.heroInner}
            style={
              {
                "--hero-display-lines": t.title.filter((l) => !l.script).length,
                "--hero-script-lines": t.title.filter((l) => l.script).length,
              } as React.CSSProperties
            }
          >
            <div className={styles.heroText}>
              <p className={styles.eyebrow}>{t.eyebrow}</p>
              <h1 className={styles.title}>
                {t.title.map((line) =>
                  line.script ? (
                    <em key={line.text} className={styles.titleScript}>
                      {line.text}
                    </em>
                  ) : (
                    <span key={line.text} className={styles.titleRow}>
                      {line.text}
                    </span>
                  ),
                )}
              </h1>
              <p className={styles.lead}>{t.lead}</p>
              <div className={styles.heroActions}>
                <a
                  href={FIGMA_FILE}
                  className={styles.heroButton}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Svg svg={figmaArt.figmaMark} className={styles.heroIcon} />
                  {t.figma}
                  <span className={styles.heroBadge}>{t.free}</span>
                </a>
                <Link
                  href={href(lang, "/docs/installation")}
                  className={styles.heroButton}
                >
                  <ReactMark className={styles.heroReact} />
                  {t.react}
                  <span className={styles.heroBadge}>v0.2</span>
                </Link>
                <span
                  className={`${styles.heroButton} ${styles.heroButtonOff}`}
                  aria-disabled
                >
                  {t.mobile}
                  <span
                    className={`${styles.heroBadge} ${styles.heroBadgeLight}`}
                  >
                    {t.soon}
                  </span>
                </span>
              </div>
            </div>
            <HeroL svg={figmaArt.heroL} />
          </div>
          <HeroStrip lang={lang} />
        </section>

        <div className={styles.sheets}>
          <section className={styles.sheet} aria-labelledby="components">
            <p className={styles.sheetEyebrow}>{t.library}</p>
            <h2 id="components" className={styles.sheetTitle}>
              {t.componentsTitle}
            </h2>
            <p className={styles.sheetLead}>
              {t.stats(catalog.length, tokenCount, iconNames.length)}
            </p>
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
              {t.features.map((f, i) => {
                const Glyph = FEATURE_ART[i];
                return (
                  <li key={f.title} className={styles.feature}>
                    {Glyph && (
                      <span className={styles.featureArt}>
                        <Glyph />
                      </span>
                    )}
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className={styles.cta} aria-labelledby="cta">
          <h2 id="cta" className={styles.ctaTitle}>
            {t.ctaTitle[0]} <span>{t.ctaTitle[1]}</span>
          </h2>
          <div className={styles.ctaStage}>
            <span className={styles.ctaGlow} aria-hidden />
            <ThrowCoin svg={coinOutline} className={styles.coinTop} />
            <ThrowCoin
              svg={coinOutline}
              className={styles.coinBottom}
              hint={t.throwIt}
            />
            <Link
              href={href(lang, "/docs/installation")}
              className={styles.glass}
            >
              {t.ctaButton}
            </Link>
          </div>
          <div className={styles.install}>
            <h3 className={styles.installLabel}>{t.installCommand}</h3>
            <div className={styles.command}>
              <code>
                <span aria-hidden>$ </span>
                {INSTALL}
              </code>
              <CopyButton text={INSTALL} label={t.copy} copiedLabel={t.copied} />
            </div>
            <h3 className={styles.installLabel}>{t.installAi}</h3>
            <ul className={styles.prompts}>
              {t.installTools.map((p) => (
                <li key={p.tool} className={styles.prompt}>
                  <span className={styles.promptHead}>
                    <strong>{p.tool}</strong>
                    <CopyButton text={p.prompt} label={t.copy} copiedLabel={t.copied} />
                  </span>
                  <p>{p.prompt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href={href(lang, "/")} className={styles.footerLogo} aria-label="Ladom UI">
          <Logo />
        </Link>
        <nav className={styles.footerLinks} aria-label="Footer">
          <Link href={href(lang, "/docs/introduction")}>{t.docsLinks[0]}</Link>
          <Link href={href(lang, "/docs/installation")}>{t.docsLinks[1]}</Link>
          <Link href={href(lang, "/docs/license")}>{t.docsLinks[3]}</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/ladom-ui" target="_blank" rel="noreferrer">
            npm
          </a>
        </nav>
        <p className={styles.rights}>© {new Date().getFullYear()} Ladom</p>
      </footer>
      <PlayInView />
    </div>
  );
}
