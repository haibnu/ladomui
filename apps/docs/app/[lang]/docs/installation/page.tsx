import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { getDictionary, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.installation };
}

const CODE = {
  tokens: `import '@ladom/tokens/index.css';`,
  font: `import { Hanken_Grotesk } from 'next/font/google';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}`,
  nextConfig: `// next.config.ts
const nextConfig = {
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
};`,
  usage: `import { IconPhone } from '@ladom/icons';

export function CallLink() {
  return (
    <a href="tel:+90..." style={{ font: 'var(--text-ui-text-regular)', color: 'var(--color-foreground-high-emphasis)' }}>
      <IconPhone size={20} /> Call us
    </a>
  );
}`,
};

const COPY = {
  en: {
    description: 'Set up the tokens, the font and the icons in a React app.',
    intro: (
      <>
        The packages live in the <code>ladomui</code> monorepo and are not published to npm yet. Until then, use them from
        the workspace (<code>workspace:*</code>). A guide for other Next.js projects follows with the first release.
      </>
    ),
    tokens: '1. Load the tokens',
    tokensText: 'Import all token groups once, at the root of the app:',
    tokensGroup: (
      <>
        A single group can be imported on its own, for example <code>@ladom/tokens/color.css</code>.
      </>
    ),
    font: '2. Load the font',
    fontText: (
      <>
        The tokens use Hanken Grotesk. Load it and expose it as <code>--font-hanken-grotesk</code> on <code>{'<html>'}</code>.
        With Next.js:
      </>
    ),
    compile: '3. Compile the packages (Next.js)',
    compileText: (
      <>
        <code>@ladom/ui</code> and <code>@ladom/icons</code> ship TypeScript source. Let Next.js compile them:
      </>
    ),
    usage: '4. Use them',
  },
  tr: {
    description: 'Tokenları, fontu ve ikonları bir React uygulamasına kurun.',
    intro: (
      <>
        Paketler <code>ladomui</code> monoreposunda duruyor ve henüz npm’e yayınlanmadı. O zamana kadar workspace üzerinden
        (<code>workspace:*</code>) kullanılır. Diğer Next.js projeleri için kurulum rehberi ilk sürümle birlikte gelecek.
      </>
    ),
    tokens: '1. Tokenları yükleyin',
    tokensText: 'Tüm token gruplarını uygulamanın kökünde bir kez import edin:',
    tokensGroup: (
      <>
        Tek bir grup da ayrıca import edilebilir, örneğin <code>@ladom/tokens/color.css</code>.
      </>
    ),
    font: '2. Fontu yükleyin',
    fontText: (
      <>
        Tokenlar Hanken Grotesk kullanır. Fontu yükleyip <code>{'<html>'}</code> üzerinde <code>--font-hanken-grotesk</code>{' '}
        olarak tanımlayın. Next.js ile:
      </>
    ),
    compile: '3. Paketleri derleyin (Next.js)',
    compileText: (
      <>
        <code>@ladom/ui</code> ve <code>@ladom/icons</code> TypeScript kaynağı olarak gelir. Next.js’in derlemesine izin verin:
      </>
    ),
    usage: '4. Kullanın',
  },
};

export default async function InstallationPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <DocPage eyebrow={t.nav.gettingStarted} title={t.nav.installation} description={c.description}>
      <p>{c.intro}</p>

      <h2 id="tokens">{c.tokens}</h2>
      <p>{c.tokensText}</p>
      <pre>
        <code>{CODE.tokens}</code>
      </pre>
      <p>{c.tokensGroup}</p>

      <h2 id="font">{c.font}</h2>
      <p>{c.fontText}</p>
      <pre>
        <code>{CODE.font}</code>
      </pre>

      <h2 id="next-config">{c.compile}</h2>
      <p>{c.compileText}</p>
      <pre>
        <code>{CODE.nextConfig}</code>
      </pre>

      <h2 id="usage">{c.usage}</h2>
      <pre>
        <code>{CODE.usage}</code>
      </pre>
    </DocPage>
  );
}
