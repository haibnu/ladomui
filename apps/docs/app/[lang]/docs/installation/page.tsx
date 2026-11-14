import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.installation };
}

const DESIGN_SYSTEM = 'https://claude.ai/artifact/GMGcccbEoBzuj6Q9Q5ZJdD';

const LICENSE = [href('en', '/docs/license'), href('tr', '/docs/license')] as const;

const CODE = {
  init: `npx ladom-ui init

Your brand (press Enter to keep the value in brackets)

  Brand color, as a hex code [#3c3c3c]: #2563eb

  Your font must be on Google Fonts. Find it at https://fonts.google.com and copy its name (e.g. Inter, DM Sans).
  Font [Hanken Grotesk]: DM Sans`,
  initFlags: `npx ladom-ui init --brand "#2563eb" --font "DM Sans"   # no questions (CI, scripts, Claude)
npx ladom-ui init --yes                                 # the Ladom defaults`,
  theme: `/* components/ladom/theme.css */
@import "./tokens/index.css";

:root {
  --color-static-brand-color: #2563eb;
}
:root,
:root[data-theme="dark"] {
  --color-primary-natural: #346dec;
  --color-primary-tint: #4b7eee;
  --color-primary-soft: #ebf1fd;
  --color-primary-shade: #153885;
  --color-on-primary: #ffffff;
  --color-on-primary-tint: var(--color-static-white-alpha-64);
}
:root {
  --font-family: var(--font-brand, "DM Sans"), system-ui, sans-serif;
}`,
  add: `npx ladom-ui add button input form-field`,
  pro: `LADOM_UI_KEY=ldm_pro_… npx ladom-ui add accordion navigation`,
  icons: `npx ladom-ui icons share calendar`,
  update: `npx ladom-ui list      # shows (update available)
npx ladom-ui update    # updates the files you have not changed
npx ladom-ui diff button
npx ladom-ui update button --overwrite`,
  contrast: `/* npx ladom-ui init --brand "#8ce99a" */
/* #8ce99a is 1.3:1 on the light surfaces, too low for text and icons (4.5:1) and lines (3:1). */
:root {
  --color-primary-foreground: #187d27;
  --color-primary-line: #1e9f32;
  --color-link-color: var(--color-primary-foreground);
}`,
  layout: `// app/layout.tsx
import { DM_Sans } from 'next/font/google';
import '@/components/ladom/theme.css';

// Your font from init, as --font-brand. With the default font:
// Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-hanken-grotesk' })
const font = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-brand',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
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
  modes: `<html data-theme="dark">          {/* force Dark; otherwise it follows the device setting */}
<html data-theme="light">         {/* force Light */}
<html data-density="narrow">      {/* Narrow density */}
<html data-device="mobile">       {/* force a device mode; otherwise it follows the width */}`,
  styling: `.card {
  padding: var(--space-medium);
  border-radius: var(--radius-card);
  background: var(--color-surface-level-1);
  box-shadow: var(--shadow-card-style-1);
  font: var(--text-ui-text-regular);
}`,
  skill: `npx ladom-ui skill`,
  vite: `<!-- index.html: your font from Google Fonts, by name -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" />

// main.tsx
import './components/ladom/theme.css';`,
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
        <code>--dir</code>). The files are yours: read them, change them, commit them. It then asks two questions about your brand:
      </>
    ),
    brandList: [
      <>
        <strong>Brand color</strong>: a hex code such as <code>#2563eb</code>. It becomes the primary color of buttons, links, focus rings and
        selections; the lighter and darker steps are derived from it.
      </>,
      <>
        <strong>Font</strong>: the name of a font on <a href="https://fonts.google.com">Google Fonts</a>, as it is written there (Inter, DM
        Sans, Plus Jakarta Sans). Look it up before you run init; the CLI checks the name.
      </>,
    ],
    brandText: (
      <>
        Press Enter to keep the Ladom defaults (#3c3c3c and Hanken Grotesk). The answers are saved in <code>ladom-ui.json</code> and written to{' '}
        <code>components/ladom/theme.css</code>. Run <code>init</code> again to change them. Where nobody can answer, pass them as flags:
      </>
    ),
    themeText: 'theme.css loads the tokens and sets your brand on top of them:',
    contrast: 'Light brand colors',
    contrastText: (
      <>
        The brand color fills buttons, checkboxes and switches, and it is also text and lines on light surfaces: links, active tabs, field
        borders. Those use two roles, <code>--color-primary-foreground</code> (text and icons, at least 4.5:1) and{' '}
        <code>--color-primary-line</code> (lines, at least 3:1). They are the brand color as long as it is dark enough. When it is not, for
        example a light green, init writes a darker step of the same hue for them in theme.css (a lighter one for the Dark theme), and the
        fills keep the brand color:
      </>
    ),
    setup: '2. Load the theme and the font',
    setupText: (
      <>
        Import <code>theme.css</code> once at the root and load your font as <code>--font-brand</code> on <code>{'<html>'}</code> (with the
        default font, Hanken Grotesk as <code>--font-hanken-grotesk</code>). init prints the exact lines for your font. Give the body the
        background and text tokens.
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
    viteText: 'Outside Next.js, import with relative paths and load your font from Google Fonts by name; theme.css uses the name when --font-brand is not set:',
    claude: 'With Claude',
    claudeCode: 'Claude Code',
    claudeText: (
      <>
        A Claude Code skill, <code>ladom-ui</code>, teaches Claude the components, the tokens and the rules. <code>npx ladom-ui skill</code>{' '}
        adds it to your project’s <code>.claude/skills</code> folder. When Claude sets up Ladom UI, it asks you for the brand color and the font
        first and passes them to <code>init</code>.
      </>
    ),
    claudeDesign: 'Design system on claude.ai',
    claudeDesignText: (
      <>
        The <a href={DESIGN_SYSTEM}>Ladom UI design system on claude.ai</a> holds the tokens, the brand book and every component with a live
        preview and its guidelines. Open it to browse the system, or use it when you design screens with Claude.
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
        <code>--dir</code> ile değiştirin). Dosyalar sizindir: okuyun, değiştirin, commit edin. Ardından markanızla ilgili iki soru sorar:
      </>
    ),
    brandList: [
      <>
        <strong>Marka rengi</strong>: <code>#2563eb</code> gibi bir hex kodu. Butonların, linklerin, odak halkalarının ve seçimlerin ana rengi
        olur; açık ve koyu tonlar ondan türetilir.
      </>,
      <>
        <strong>Font</strong>: <a href="https://fonts.google.com">Google Fonts</a>’taki bir fontun orada yazıldığı haliyle adı (Inter, DM
        Sans, Plus Jakarta Sans). init’i çalıştırmadan önce bakın; CLI adı kontrol eder.
      </>,
    ],
    brandText: (
      <>
        Enter’a basarsanız Ladom varsayılanları kalır (#3c3c3c ve Hanken Grotesk). Cevaplar <code>ladom-ui.json</code> içine kaydedilir ve{' '}
        <code>components/ladom/theme.css</code> dosyasına yazılır. Değiştirmek için <code>init</code>’i yeniden çalıştırın. Soruları
        cevaplayacak kimse yoksa bayrak olarak verin:
      </>
    ),
    themeText: 'theme.css tokenları yükler ve markanızı onların üstüne kurar:',
    contrast: 'Açık marka renkleri',
    contrastText: (
      <>
        Marka rengi butonları, checkbox’ları ve switch’leri doldurur; açık zeminlerde de yazı ve çizgi olur: linkler, aktif tab’lar, alan
        kenarları. Bunlar iki rol kullanır: <code>--color-primary-foreground</code> (yazı ve ikon, en az 4.5:1) ve{' '}
        <code>--color-primary-line</code> (çizgi, en az 3:1). Marka rengi yeterince koyuysa ikisi de odur. Değilse, örneğin açık bir
        yeşilde, init theme.css’e onlar için aynı tonun daha koyu bir adımını yazar (Dark temada daha açık bir adımını); dolgular marka
        renginde kalır:
      </>
    ),
    setup: '2. Temayı ve fontu yükleyin',
    setupText: (
      <>
        <code>theme.css</code>’i kökte bir kez import edin ve fontunuzu <code>{'<html>'}</code> üzerinde <code>--font-brand</code> olarak
        yükleyin (varsayılan fontta Hanken Grotesk’i <code>--font-hanken-grotesk</code> olarak). init, fontunuz için gereken satırları
        yazdırır. Body’ye zemin ve metin tokenlarını verin.
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
    viteText: 'Next.js dışında göreli yollarla import edin ve fontunuzu Google Fonts’tan adıyla yükleyin; --font-brand yoksa theme.css adı kullanır:',
    claude: 'Claude ile',
    claudeCode: 'Claude Code',
    claudeText: (
      <>
        Bir Claude Code skill’i, <code>ladom-ui</code>, Claude’a bileşenleri, tokenları ve kuralları öğretir.{' '}
        <code>npx ladom-ui skill</code> onu projenizin <code>.claude/skills</code> klasörüne ekler. Claude Ladom UI’ı kurarken önce size marka
        rengini ve fontu sorar, sonra bunları <code>init</code>’e verir.
      </>
    ),
    claudeDesign: 'claude.ai’daki tasarım sistemi',
    claudeDesignText: (
      <>
        <a href={DESIGN_SYSTEM}>claude.ai’daki Ladom UI tasarım sistemi</a> tokenları, marka kitabını ve her bileşeni canlı önizlemesi ve
        kullanım kurallarıyla birlikte barındırır. Sistemi incelemek için açın ya da Claude ile ekran tasarlarken kullanın.
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
      <ul>
        {c.brandList.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <p>{c.brandText}</p>
      <CodeBlock code={CODE.initFlags} />
      <p>{c.themeText}</p>
      <CodeBlock code={CODE.theme} />
      <h3 id="contrast">{c.contrast}</h3>
      <p>{c.contrastText}</p>
      <CodeBlock code={CODE.contrast} />

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
      <h3 id="claude-code">{c.claudeCode}</h3>
      <p>{c.claudeText}</p>
      <CodeBlock code={CODE.skill} />
      <h3 id="claude-design">{c.claudeDesign}</h3>
      <p>{c.claudeDesignText}</p>

      <h2 id="next">{c.next}</h2>
      <p>
        <a href={href(lang, '/docs/components/button')}>{c.nextText}</a>
      </p>
    </DocPage>
  );
}
