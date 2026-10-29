import type { Metadata } from 'next';
import { Breadcrumb } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { BreadcrumbDemo } from './BreadcrumbDemo';

type Props = { params: Promise<{ lang: string }> };

const PATH = [{ label: 'Previous Page 1' }, { label: 'Previous Page 2' }, { label: 'Current Page' }];

const COPY = {
  en: {
    description: 'A compact path control before the page title: a back button and a menu of the pages above the current one.',
    states: 'States',
    statesText: 'The round toggle is surface/level-4 at rest, surface/level-1 on hover and focus (with the focus ring), and primary with an up arrow while the menu is open. The menu is a Dropdown of Small Cells; the current page is checked.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'This is not a classic slash-separated breadcrumb; the path lives in the menu.',
      'The menu sits 16px in from the left (a Spacing instance) and 4px under the pill.',
      'The Size property on the page has no variants.',
      'The arrows are “Icon/arrow down” and “Icon/arrow up”; code uses arrow-bottom and arrow-top.',
    ],
    usage: 'Usage',
    usageText: 'List the path from the top; the last item is the current page. Items with href render as links.',
    api: 'API reference',
    apiText: 'Breadcrumb also accepts every nav attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'It is a nav landmark. The toggle has aria-haspopup="menu" and aria-expanded; the menu items are menuitems, the current page has aria-current="page".',
      'Arrow Down on the toggle opens the menu; Arrow keys, Home and End move, Escape closes and returns focus.',
      'Translate backLabel and menuLabel.',
    ],
    mapping: 'Figma to code',
    props: { items: 'The path; the last item is the current page.', onBack: 'Back button action; hidden when omitted.', backLabel: 'Name of the back button.', menuLabel: 'Name of the nav and the menu.', defaultOpen: 'Opens the menu at first.' },
  },
  tr: {
    description: 'Sayfa başlığının önündeki küçük konum kontrolü: bir geri butonu ve bulunulan sayfanın üstündeki sayfaların menüsü.',
    states: 'Durumlar',
    statesText: 'Yuvarlak açma düğmesi dururken surface/level-4, hover ve focus’ta surface/level-1 (focus halkasıyla), menü açıkken yukarı oklu primary’dir. Menü, Small Cell’lerden oluşan bir Dropdown’dur; bulunulan sayfa işaretlidir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Bu, eğik çizgilerle ayrılmış klasik bir breadcrumb değil; yol menüdedir.',
      'Menü soldan 16px içeride (bir Spacing örneği) ve hapın 4px altında duruyor.',
      'Sayfadaki Size özelliğinin varyantı yok.',
      'Oklar “Icon/arrow down” ve “Icon/arrow up”; kod arrow-bottom ve arrow-top kullanır.',
    ],
    usage: 'Kullanım',
    usageText: 'Yolu en üstten listeleyin; son öğe bulunulan sayfadır. href’li öğeler link olur.',
    api: 'API',
    apiText: 'Breadcrumb tüm nav özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Bir nav landmark’ıdır. Açma düğmesi aria-haspopup="menu" ve aria-expanded taşır; menü öğeleri menuitem’dır, bulunulan sayfa aria-current="page" taşır.',
      'Düğmede Aşağı ok menüyü açar; ok tuşları, Home ve End gezinir, Escape kapatıp odağı geri verir.',
      'backLabel ve menuLabel’ı çevirin.',
    ],
    mapping: 'Figma’dan koda',
    props: { items: 'Yol; son öğe bulunulan sayfa.', onBack: 'Geri butonu eylemi; verilmezse gizlenir.', backLabel: 'Geri butonunun adı.', menuLabel: 'Nav’ın ve menünün adı.', defaultOpen: 'Menüyü baştan açar.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Breadcrumb' };
}

export default async function BreadcrumbPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Breadcrumb" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4748:15272" />

        <h2 id="playground">{t.component.playground}</h2>
        <BreadcrumbDemo />

        <ForView view="designer">
          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example>
            <div style={{ minBlockSize: 180 }}>
              <Breadcrumb items={PATH} defaultOpen />
            </div>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Pill', '--color-surface-level-2, --radius-full, 32px'],
              ['Toggle (rest / hover / open)', '--color-surface-level-4 / --color-surface-level-1 / --color-primary'],
              ['Arrow (rest / open)', '--color-primary / --color-on-primary'],
              ['Menu', 'Dropdown, Cell Small'],
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
          <p>{c.usageText}</p>
          <CodeBlock
            code={`<Breadcrumb
  items={[
    { label: 'Projects', href: '/projects' },
    { label: 'Ladom UI', href: '/projects/ladom-ui' },
    { label: 'Settings' },
  ]}
  onBack={() => router.back()}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['items', 'BreadcrumbItem[]', '—'],
              ['onBack', '() => void', '—'],
              ['backLabel', 'string', "'Back'"],
              ['menuLabel', 'string', "'Path'"],
              ['defaultOpen', 'boolean', 'false'],
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
            ['🕹 State = Default / Hover / Focus', ':hover / :focus-visible'],
            ['🕹 State = Active', 'menu open'],
            ['Back Button', 'onBack'],
            ['Dropdown items', 'items'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
