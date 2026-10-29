import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.installation };
}

const CODE = {
  install: `npm install @ladom/ui @ladom/tokens @ladom/icons`,
  layout: `// app/layout.tsx
import { Hanken_Grotesk } from 'next/font/google';
import '@ladom/tokens/index.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body style={{ background: 'var(--color-surface-background)', color: 'var(--color-foreground-high-emphasis)' }}>
        {children}
      </body>
    </html>
  );
}`,
  usage: `// app/page.tsx
import { Button, FormField, Input } from '@ladom/ui';
import { IconAdd } from '@ladom/icons';

export default function Page() {
  return (
    <form>
      <FormField label="Project name" hint="You can change it later">
        <Input name="name" />
      </FormField>
      <Button type="submit" iconLeft={IconAdd}>Create project</Button>
    </form>
  );
}`,
  toast: `// app/providers.tsx
'use client';
import { ToastProvider } from '@ladom/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider closeLabel="Close">{children}</ToastProvider>;
}`,
  modes: `<html data-theme="dark">          {/* Dark theme (opt-in) */}
<html data-density="narrow">      {/* Narrow density */}
<html data-device="mobile">       {/* force a device mode; otherwise it follows the width */}`,
  styling: `.card {
  padding: var(--space-medium);
  border-radius: var(--radius-card);
  background: var(--color-surface-level-1);
  box-shadow: var(--shadow-card-style-1);
  font: var(--text-ui-text-regular);
}`,
  vite: `// main.tsx
import '@ladom/tokens/index.css';
import '@fontsource-variable/hanken-grotesk';

document.documentElement.style.setProperty('--font-hanken-grotesk', "'Hanken Grotesk Variable'");`,
};

const COPY = {
  en: {
    description: 'Add Ladom UI to a Next.js app: the packages, the tokens and the font, then the components.',
    requirements: 'Requirements',
    requirementsText: 'React 19 and a bundler that handles CSS Modules imported from node_modules. Next.js 15 or later works without any configuration.',
    install: '1. Install the packages',
    installText: (
      <>
        <code>@ladom/ui</code> holds the components, <code>@ladom/tokens</code> the CSS variables they use, <code>@ladom/icons</code> the icons.
      </>
    ),
    setup: '2. Load the tokens and the font',
    setupText: (
      <>
        Import the tokens once at the root and load Hanken Grotesk as <code>--font-hanken-grotesk</code> on <code>{'<html>'}</code>. Give the
        body the background and text tokens.
      </>
    ),
    use: '3. Use the components',
    useText: 'Components work in server and client components; the interactive ones are client components already.',
    toast: 'Toasts',
    toastText: 'Toasts need a ToastProvider around the app; put it in a client component and render it from the layout.',
    modes: '4. Themes and modes',
    modesText: 'Set the modes on <html>. Device modes follow the window width (Mobile below 768px, Tablet below 1280px) unless data-device forces one.',
    styling: 'Your own styles',
    stylingText: 'Use the tokens in your CSS so your screens follow the same scale and themes. Every token is listed under Foundations.',
    vite: 'Other bundlers (Vite)',
    viteText: 'Outside Next.js, load the font any way you like and set the variable yourself:',
    claude: 'With Claude',
    claudeText: (
      <>
        The repository has a Claude Code skill, <code>ladom-ui</code>, that teaches Claude the components, the tokens and the rules. Copy{' '}
        <code>skills/ladom-ui</code> into your project’s <code>.claude/skills</code> folder.
      </>
    ),
    next: 'Next',
    nextText: 'Browse the components; each page has a playground and the API.',
  },
  tr: {
    description: 'Ladom UI’ı bir Next.js uygulamasına ekleyin: paketler, tokenlar ve font, sonra bileşenler.',
    requirements: 'Gereksinimler',
    requirementsText: 'React 19 ve node_modules’tan import edilen CSS Modules’ü işleyen bir bundler. Next.js 15 ve sonrası hiçbir ayar gerektirmeden çalışır.',
    install: '1. Paketleri kurun',
    installText: (
      <>
        <code>@ladom/ui</code> bileşenleri, <code>@ladom/tokens</code> bileşenlerin kullandığı CSS değişkenlerini, <code>@ladom/icons</code>{' '}
        ikonları içerir.
      </>
    ),
    setup: '2. Tokenları ve fontu yükleyin',
    setupText: (
      <>
        Tokenları kökte bir kez import edin ve Hanken Grotesk’i <code>{'<html>'}</code> üzerinde <code>--font-hanken-grotesk</code> olarak
        yükleyin. Body’ye zemin ve metin tokenlarını verin.
      </>
    ),
    use: '3. Bileşenleri kullanın',
    useText: 'Bileşenler sunucu ve istemci bileşenlerinde çalışır; etkileşimli olanlar zaten istemci bileşenidir.',
    toast: 'Toast’lar',
    toastText: 'Toast’lar uygulamanın çevresinde bir ToastProvider ister; onu bir istemci bileşenine koyup layout’tan çizin.',
    modes: '4. Temalar ve modlar',
    modesText: 'Modları <html> üzerine verin. Cihaz modları, data-device biri zorlamadıkça pencere genişliğini izler (768px altı Mobile, 1280px altı Tablet).',
    styling: 'Kendi stilleriniz',
    stylingText: 'Ekranlarınız aynı ölçeği ve temaları izlesin diye CSS’inizde tokenları kullanın. Tüm tokenlar Foundations altında listelenir.',
    vite: 'Diğer bundler’lar (Vite)',
    viteText: 'Next.js dışında fontu istediğiniz gibi yükleyip değişkeni kendiniz tanımlayın:',
    claude: 'Claude ile',
    claudeText: (
      <>
        Repoda Claude’a bileşenleri, tokenları ve kuralları öğreten bir Claude Code skill’i var: <code>ladom-ui</code>.{' '}
        <code>skills/ladom-ui</code> klasörünü projenizin <code>.claude/skills</code> klasörüne kopyalayın.
      </>
    ),
    next: 'Sonra',
    nextText: 'Bileşenlere göz atın; her sayfada bir playground ve API var.',
  },
};

export default async function InstallationPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <DocPage eyebrow={t.nav.gettingStarted} title={t.nav.installation} description={c.description}>
      <h2 id="requirements">{c.requirements}</h2>
      <p>{c.requirementsText}</p>

      <h2 id="install">{c.install}</h2>
      <p>{c.installText}</p>
      <CodeBlock code={CODE.install} />

      <h2 id="setup">{c.setup}</h2>
      <p>{c.setupText}</p>
      <CodeBlock code={CODE.layout} />

      <h2 id="use">{c.use}</h2>
      <p>{c.useText}</p>
      <CodeBlock code={CODE.usage} />
      <h3 id="toast">{c.toast}</h3>
      <p>{c.toastText}</p>
      <CodeBlock code={CODE.toast} />

      <h2 id="modes">{c.modes}</h2>
      <p>{c.modesText}</p>
      <CodeBlock code={CODE.modes} />
      <h3 id="styling">{c.styling}</h3>
      <p>{c.stylingText}</p>
      <CodeBlock code={CODE.styling} />

      <h2 id="vite">{c.vite}</h2>
      <p>{c.viteText}</p>
      <CodeBlock code={CODE.vite} />

      <h2 id="claude">{c.claude}</h2>
      <p>{c.claudeText}</p>

      <h2 id="next">{c.next}</h2>
      <p>
        <a href={href(lang, '/docs/components/button')}>{c.nextText}</a>
      </p>
    </DocPage>
  );
}
