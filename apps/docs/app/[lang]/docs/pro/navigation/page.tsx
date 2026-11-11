import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { NavigationPlayground } from './NavigationPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The bars on top of a page. AppHeader is the bar of app pages: a PageHeader at the start, a search in the center, controls at the end, and tabs under it. PublicHeader is the bar of public pages with the logo.',
    parts: 'Parts',
    partsItems: [
      'PageHeader (_Left Elements): back button, breadcrumb, the page title with info and subtext, icon actions and a chip. Large Title adds a line above a bigger title; Inline Edit turns the title into an input with save and cancel.',
      'AppHeader (App Header): three equal columns (start, center, end) and an optional bottom row for Tabs. The end holds buttons, a Switch, a Selectbox or a Segment (_Right Elements).',
      'PublicHeader (Public Page Navigation): the 64px bar of public pages: logo only, logo and title, or title, centered logo and a login button or avatar.',
    ],
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The back button is a tertiary Small icon button in Default but a primary Medium one in Large Title and Inline Edit; code follows this.',
      'The Large Title texts use the legacy “Paragraph Small/Regular” and “H3/Bold” styles; code uses ui/text small/regular and content/h3/bold.',
      'Inline Edit uses a Floating Label Input that is not in the Input set; code uses Input Medium.',
      'The Large Title chip is the deprecated Chips; pass a Chip or Badge as badge.',
      'The Slot types (left, right, Full Slot) are the start, center, end and bottom props with your own content.',
      'App Header Type=Default has no border; Full Slot has a Border Bottom rectangle. Code makes the line optional with border.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'AppHeader and PublicHeader render a header element; PageHeader renders the title as an h1.',
    a11y: 'Accessibility',
    a11yItems: [
      'AppHeader and PublicHeader are header landmarks; use one per page.',
      'PageHeader renders the page title as the h1; keep one h1 per page.',
      'Name icon actions with aria-label, and translate backLabel and the inline edit labels.',
      'Inline Edit focuses the input; Enter saves and Escape cancels.',
    ],
    mapping: 'Figma to code',
    props: {
      title: 'PageHeader: the page title.',
      variant: "PageHeader: 'default' or 'large' (Large Title).",
      edit: 'PageHeader: Inline Edit (value, onChange, onSave, onCancel).',
      onBack: 'PageHeader: Show Back Button.',
      actions: 'PageHeader: Show Actions.',
      start: 'AppHeader: Left Elements.',
      center: 'AppHeader: the center element.',
      end: 'AppHeader: Right Elements. PublicHeader: the button or avatar.',
      bottom: 'AppHeader: Tab or Bottom Slot.',
      logoPosition: "PublicHeader: 'center' or 'start' (Public Page Title).",
    },
  },
  tr: {
    description: 'Sayfanın üstündeki çubuklar. AppHeader uygulama sayfalarının çubuğudur: başta bir PageHeader, ortada arama, sonda kontroller ve altında sekmeler. PublicHeader herkese açık sayfaların logolu çubuğudur.',
    parts: 'Parçalar',
    partsItems: [
      'PageHeader (_Left Elements): geri butonu, breadcrumb, info ve alt metinli sayfa başlığı, ikon eylemler ve bir chip. Large Title daha büyük bir başlığın üstüne bir satır ekler; Inline Edit başlığı kaydet ve iptal butonlu bir input’a çevirir.',
      'AppHeader (App Header): üç eşit sütun (start, center, end) ve Tabs için isteğe bağlı bir alt satır. Sonda butonlar, Switch, Selectbox ya da Segment durur (_Right Elements).',
      'PublicHeader (Public Page Navigation): herkese açık sayfaların 64px çubuğu: yalnızca logo, logo ve başlık ya da başlık, ortada logo ve bir giriş butonu veya avatar.',
    ],
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Geri butonu Default’ta tertiary Small ikon buton, Large Title ve Inline Edit’te primary Medium; kod bunu izler.',
      'Large Title metinleri eski “Paragraph Small/Regular” ve “H3/Bold” stillerini kullanıyor; kod ui/text small/regular ve content/h3/bold kullanır.',
      'Inline Edit, Input setinde olmayan bir Floating Label Input kullanıyor; kod Input Medium kullanır.',
      'Large Title chip’i kullanımdan kalkmış Chips; badge olarak bir Chip ya da Badge verin.',
      'Slot tipleri (sol, sağ, Full Slot) kendi içeriğinizle start, center, end ve bottom özellikleridir.',
      'App Header Type=Default’ta çizgi yok; Full Slot’ta bir Border Bottom dikdörtgeni var. Kod çizgiyi border ile isteğe bağlı yapar.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'AppHeader ve PublicHeader bir header öğesi çizer; PageHeader başlığı h1 olarak çizer.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'AppHeader ve PublicHeader header landmark’ıdır; sayfa başına bir tane kullanın.',
      'PageHeader sayfa başlığını h1 olarak çizer; sayfada tek h1 olsun.',
      'İkon eylemleri aria-label ile adlandırın; backLabel’ı ve satır içi düzenleme label’larını çevirin.',
      'Inline Edit input’a odaklanır; Enter kaydeder, Escape iptal eder.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      title: 'PageHeader: sayfa başlığı.',
      variant: "PageHeader: 'default' ya da 'large' (Large Title).",
      edit: 'PageHeader: Inline Edit (value, onChange, onSave, onCancel).',
      onBack: 'PageHeader: Show Back Button.',
      actions: 'PageHeader: Show Actions.',
      start: 'AppHeader: Left Elements.',
      center: 'AppHeader: orta öğe.',
      end: 'AppHeader: Right Elements. PublicHeader: buton ya da avatar.',
      bottom: 'AppHeader: Tab ya da Bottom Slot.',
      logoPosition: "PublicHeader: 'center' ya da 'start' (Public Page Title).",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Navigation' };
}

export default async function NavigationPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Navigation" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2196:30679" />

        <h2 id="playground">{t.component.playground}</h2>
        <NavigationPlayground />

        <h2 id="parts">{c.parts}</h2>
        <ul>
          {c.partsItems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <ForView view="designer">
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['PageHeader padding / gap', '--layout-tiny --space-container / --space-form-gutter'],
              ['Page title / large title', '--text-ui-page-title / --text-content-h3-bold, --color-foreground-level-1'],
              ['Subtext / eyebrow', '--text-ui-text-small-regular, --color-foreground-medium-emphasis'],
              ['AppHeader', '--color-surface-level-1, --layout-micro block padding, --color-surface-level-3 line'],
              ['PublicHeader', '64px, --space-container padding, --color-surface-level-1, --color-surface-level-3 line'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="figma-notes">{c.notes}</h2>
          <ul>
            {c.notesItems.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <CodeBlock
            code={`<AppHeader
  border
  start={<PageHeader title="Reports" onBack={() => router.back()} actions={<Button tone="tertiary" icon={IconShare} aria-label="Share" />} />}
  center={<Input type="search" placeholder="Search" aria-label="Search" />}
  end={<Button>New report</Button>}
  bottom={<Tabs aria-label="Filter" items={tabs} />}
/>

<PublicHeader title="Pricing" end={<Button tone="tertiary">Login to App</Button>} />`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['title', 'ReactNode', '—'],
              ['variant', "'default' | 'large'", "'default'"],
              ['edit', 'PageHeaderEdit', '—'],
              ['onBack', '() => void', '—'],
              ['actions', 'ReactNode', '—'],
              ['start', 'ReactNode', '—'],
              ['center', 'ReactNode', '—'],
              ['end', 'ReactNode', '—'],
              ['bottom', 'ReactNode', '—'],
              ['logoPosition', "'center' | 'start'", "'center'"],
            ]}
            descriptions={c.props}
          />

          <h2 id="accessibility">{c.a11y}</h2>
          <ul>
            {c.a11yItems.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ForView>

        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable
          rows={[
            ['_Left Elements 🎛 Type = Default / Large Title', "<PageHeader variant='default' | 'large' />"],
            ['_Left Elements 🎛 Type = Inline Edit', '<PageHeader edit={…} />'],
            ['Show Back Button / Breadcrumb / Info / Subtitle / Actions', 'onBack / breadcrumb / info / subtitle / actions'],
            ['_Right Elements 🎛 Type = Full Control', 'end={<Button />, <Switch />, <Selectbox />, <Segment />}'],
            ['App Header Type = Default / Full Slot', '<AppHeader start center end bottom />'],
            ['App Header Tab', 'bottom={<Tabs />}'],
            ['Public Page Navigation = Public Logo', '<PublicHeader />'],
            ['Public Page Navigation = Public Page Title', '<PublicHeader title logoPosition="start" />'],
            ['Public Page Navigation = Login / Logged', '<PublicHeader title end={<Button /> | <Avatar />} />'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
