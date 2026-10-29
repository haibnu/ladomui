import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.installation };
}

const LICENSE = [href('en', '/docs/license'), href('tr', '/docs/license')] as const;

const CODE = {
  init: `npx ladom-ui init`,
  add: `npx ladom-ui add button input form-field`,
  pro: `LADOM_UI_KEY=ldm_pro_… npx ladom-ui add accordion navigation`,
  icons: `npx ladom-ui icons share calendar`,
  update: `npx ladom-ui list      # shows (update available)
npx ladom-ui update    # updates the files you have not changed
npx ladom-ui diff button
npx ladom-ui update button --overwrite`,
  layout: `// app/layout.tsx
import { Hanken_Grotesk } from 'next/font/google';
import '@/components/ladom/tokens/index.css';

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
import { Button, FormField, IconAdd, Input } from '@/components/ladom';

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
import { ToastProvider } from '@/components/ladom';

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
import './components/ladom/tokens/index.css';
import '@fontsource-variable/hanken-grotesk';

document.documentElement.style.setProperty('--font-hanken-grotesk', "'Hanken Grotesk Variable'");`,
};

const COPY = {
  en: {
    description: 'Add Ladom UI to a Next.js app with the ladom-ui CLI: it copies the tokens, the components and the icons into your code.',
    requirements: 'Requirements',
    requirementsText: 'Node 20 or later for the CLI, React 19, and a bundler that handles CSS Modules. Next.js 15 or later works without any configuration.',
    init: '1. Set up the folder',
    initText: (
      <>
        <code>init</code> writes <code>ladom-ui.json</code> and copies the tokens to <code>components/ladom</code> (change it with{' '}
        <code>--dir</code>). The files are yours: read them, change them, commit them.
      </>
    ),
    setup: '2. Load the tokens and the font',
    setupText: (
      <>
        Import the tokens once at the root and load Hanken Grotesk as <code>--font-hanken-grotesk</code> on <code>{'<html>'}</code>. Give the
        body the background and text tokens.
      </>
    ),
    add: '3. Add components',
    addText: 'add copies the components you name, the parts they need and their icons, and keeps components/ladom/index.ts up to date.',
    pro: 'Pro components',
    proText: (
      <>
        Components marked Pro need a license key; pass it in <code>LADOM_UI_KEY</code>. See the <a href={LICENSE[0]}>license</a>.
      </>
    ),
    use: '4. Use them',
    useText: 'Import everything from the folder. Components work in server and client components; the interactive ones are client components already.',
    toast: 'Toasts',
    toastText: 'Toasts need a ToastProvider around the app; put it in a client component and render it from the layout.',
    icons: 'More icons',
    iconsText: 'Components bring the icons they use. For your own code, copy more by name:',
    update: 'Updating',
    updateText: 'Updates are not pushed to your project; you pull them. The CLI remembers every file it wrote, so update replaces the files you have not touched and keeps the ones you changed. diff shows how your copy differs from the latest; --overwrite takes the latest anyway.',
    modes: '5. Themes and modes',
    modesText: 'Set the modes on <html>. Device modes follow the window width (Mobile below 768px, Tablet below 1280px) unless data-device forces one.',
    styling: 'Your own styles',
    stylingText: 'Use the tokens in your CSS so your screens follow the same scale and themes. Every token is listed under Foundations.',
    vite: 'Other bundlers (Vite)',
    viteText: 'Outside Next.js, import with relative paths, load the font any way you like and set the variable yourself:',
    claude: 'With Claude',
    claudeText: (
      <>
        A Claude Code skill, <code>ladom-ui</code>, teaches Claude the components, the tokens and the rules. <code>npx ladom-ui skill</code>{' '}
        adds it to your project’s <code>.claude/skills</code> folder.
      </>
    ),
    next: 'Next',
    nextText: 'Browse the components; each page has a playground and the API.',
  },
  tr: {
    description: 'Ladom UI’ı ladom-ui CLI ile bir Next.js uygulamasına ekleyin: tokenları, bileşenleri ve ikonları kodunuza kopyalar.',
    requirements: 'Gereksinimler',
    requirementsText: 'CLI için Node 20 ve sonrası, React 19 ve CSS Modules’ü işleyen bir bundler. Next.js 15 ve sonrası hiçbir ayar gerektirmeden çalışır.',
    init: '1. Klasörü hazırlayın',
    initText: (
      <>
        <code>init</code>, <code>ladom-ui.json</code> dosyasını yazar ve tokenları <code>components/ladom</code> klasörüne kopyalar (
        <code>--dir</code> ile değiştirin). Dosyalar sizindir: okuyun, değiştirin, commit edin.
      </>
    ),
    setup: '2. Tokenları ve fontu yükleyin',
    setupText: (
      <>
        Tokenları kökte bir kez import edin ve Hanken Grotesk’i <code>{'<html>'}</code> üzerinde <code>--font-hanken-grotesk</code> olarak
        yükleyin. Body’ye zemin ve metin tokenlarını verin.
      </>
    ),
    add: '3. Bileşenleri ekleyin',
    addText: 'add, adını verdiğiniz bileşenleri, ihtiyaç duydukları parçaları ve ikonlarını kopyalar; components/ladom/index.ts dosyasını günceller.',
    pro: 'Pro bileşenler',
    proText: (
      <>
        Pro işaretli bileşenler bir lisans anahtarı ister; onu <code>LADOM_UI_KEY</code> içinde verin. <a href={LICENSE[1]}>Lisansa</a> bakın.
      </>
    ),
    use: '4. Kullanın',
    useText: 'Her şeyi klasörden import edin. Bileşenler sunucu ve istemci bileşenlerinde çalışır; etkileşimli olanlar zaten istemci bileşenidir.',
    toast: 'Toast’lar',
    toastText: 'Toast’lar uygulamanın çevresinde bir ToastProvider ister; onu bir istemci bileşenine koyup layout’tan çizin.',
    icons: 'Daha fazla ikon',
    iconsText: 'Bileşenler kullandıkları ikonları getirir. Kendi kodunuz için adıyla daha fazlasını kopyalayın:',
    update: 'Güncelleme',
    updateText: 'Güncellemeler projenize kendiliğinden gelmez; siz çekersiniz. CLI yazdığı her dosyayı hatırlar: update dokunmadığınız dosyaları yeniler, değiştirdiklerinizi korur. diff kopyanızın son sürümden farkını gösterir; --overwrite yine de son sürümü alır.',
    modes: '5. Temalar ve modlar',
    modesText: 'Modları <html> üzerine verin. Cihaz modları, data-device biri zorlamadıkça pencere genişliğini izler (768px altı Mobile, 1280px altı Tablet).',
    styling: 'Kendi stilleriniz',
    stylingText: 'Ekranlarınız aynı ölçeği ve temaları izlesin diye CSS’inizde tokenları kullanın. Tüm tokenlar Foundations altında listelenir.',
    vite: 'Diğer bundler’lar (Vite)',
    viteText: 'Next.js dışında göreli yollarla import edin, fontu istediğiniz gibi yükleyip değişkeni kendiniz tanımlayın:',
    claude: 'Claude ile',
    claudeText: (
      <>
        Bir Claude Code skill’i, <code>ladom-ui</code>, Claude’a bileşenleri, tokenları ve kuralları öğretir.{' '}
        <code>npx ladom-ui skill</code> onu projenizin <code>.claude/skills</code> klasörüne ekler.
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

      <h2 id="init">{c.init}</h2>
      <p>{c.initText}</p>
      <CodeBlock code={CODE.init} />

      <h2 id="setup">{c.setup}</h2>
      <p>{c.setupText}</p>
      <CodeBlock code={CODE.layout} />

      <h2 id="add">{c.add}</h2>
      <p>{c.addText}</p>
      <CodeBlock code={CODE.add} />
      <h3 id="pro">{c.pro}</h3>
      <p>{c.proText}</p>
      <CodeBlock code={CODE.pro} />

      <h2 id="use">{c.use}</h2>
      <p>{c.useText}</p>
      <CodeBlock code={CODE.usage} />
      <h3 id="toast">{c.toast}</h3>
      <p>{c.toastText}</p>
      <CodeBlock code={CODE.toast} />
      <h3 id="icons">{c.icons}</h3>
      <p>{c.iconsText}</p>
      <CodeBlock code={CODE.icons} />
      <h3 id="update">{c.update}</h3>
      <p>{c.updateText}</p>
      <CodeBlock code={CODE.update} />

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
