import type { Metadata } from 'next';
import { Tabs, type TabsItem } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { TabPlayground } from './TabPlayground';

type Props = { params: Promise<{ lang: string }> };

const ITEMS: TabsItem[] = [
  { value: 'a', label: 'Overview' },
  { value: 'b', label: 'Activity', badge: 3 },
  { value: 'c', label: 'Members', info: true },
  { value: 'd', label: 'Archive', disabled: true },
];

const COPY = {
  en: {
    description: 'Switches between views of the same page. Primary tabs are underlined, Secondary tabs are pills, Button tabs are small ghost buttons.',
    types: 'Types',
    typesText: 'All three types share the 40px height. The active Primary tab is underlined in primary; the active Secondary tab is primary soft; the active Button tab is pressed (surface/level-3). Hover is surface/level-2 with primary text.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Primary hover draws a 12px-radius surface/level-2 box 4px inside the item; default and active items have no box. Code keeps this with an inner part.',
      'Secondary items are surface/level-1 pills even when inactive, so they disappear on a white page.',
      'Button items pad 16px on the sides around the button, so Button tabs sit 32px apart.',
      'The deprecated Tab and Tab Item sets are not built.',
      'Figma has no focus state; code adds the primary focus ring.',
    ],
    usage: 'Usage',
    usageText: 'Pass content per item to render the active panel, or leave it out and render your own content from value.',
    api: 'API reference',
    apiText: 'Tabs also accepts every div attribute; aria-label names the tab list.',
    a11y: 'Accessibility',
    a11yItems: [
      'Follows the WAI-ARIA tabs pattern: the list is a tablist, items are tabs with aria-selected, the panel is a tabpanel.',
      'Tab reaches the active tab; Arrow Left/Right, Home and End move and select.',
      'Badges and the info icon are extra; keep the text label meaningful on its own.',
    ],
    mapping: 'Figma to code',
    props: {
      items: 'Tabs: value, label, and optional badge, info, disabled, content.',
      value: 'Controlled active tab.',
      defaultValue: 'Initial active tab; the first enabled one when omitted.',
      onChange: 'Called with the selected value.',
      variant: 'Figma Tab Item Type.',
      align: 'Figma Align.',
      border: 'Figma Border Bottom.',
    },
  },
  tr: {
    description: 'Aynı sayfanın görünümleri arasında geçiş yapar. Primary sekmelerin altı çizilidir, Secondary sekmeler haptır, Button sekmeler küçük ghost butonlardır.',
    types: 'Tipler',
    typesText: 'Üç tip de 40px yüksekliğindedir. Aktif Primary sekmenin altı primary çizilir; aktif Secondary sekme primary soft’tur; aktif Button sekme basılıdır (surface/level-3). Hover, primary metinli surface/level-2’dir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Primary hover, öğenin 4px içine 12px köşeli surface/level-2 bir kutu çiziyor; varsayılan ve aktif öğelerde kutu yok. Kod bunu bir iç parçayla korur.',
      'Secondary öğeler aktif değilken de surface/level-1 hap; beyaz sayfada kayboluyorlar.',
      'Button öğeler butonun iki yanında 16px boşluk bırakıyor; Button sekmeler arasında 32px oluyor.',
      'Kullanımdan kalkmış Tab ve Tab Item setleri yapılmadı.',
      'Figma’da focus durumu yok; kod primary focus halkası ekler.',
    ],
    usage: 'Kullanım',
    usageText: 'Aktif paneli göstermek için her öğeye content verin ya da vermeyip kendi içeriğinizi value’ya göre gösterin.',
    api: 'API',
    apiText: 'Tabs tüm div özniteliklerini de kabul eder; aria-label sekme listesini adlandırır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'WAI-ARIA tabs desenini izler: liste tablist, öğeler aria-selected’lı tab, panel tabpanel’dir.',
      'Tab aktif sekmeye gelir; Sol/Sağ ok, Home ve End gezinip seçer.',
      'Badge ve bilgi ikonu ektir; metin label tek başına anlamlı olsun.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      items: 'Sekmeler: value, label ve isteğe bağlı badge, info, disabled, content.',
      value: 'Kontrollü aktif sekme.',
      defaultValue: 'Başlangıçtaki aktif sekme; verilmezse ilk etkin olan.',
      onChange: 'Seçilen değerle çağrılır.',
      variant: 'Figma Tab Item Type.',
      align: 'Figma Align.',
      border: 'Figma Border Bottom.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Tab' };
}

export default async function TabPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Tab" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="99:14457" />

        <h2 id="playground">{t.component.playground}</h2>
        <TabPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            <Tabs aria-label="Primary" items={ITEMS} border />
            <Tabs aria-label="Secondary" items={ITEMS} variant="secondary" />
            <Tabs aria-label="Button" items={ITEMS} variant="button" />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Type', 'Item padding', 'Active', 'Hover']}
            rows={[
              ['primary', '--space-tiny --space-medium', '--color-primary underline and text', '--color-surface-level-2 inner box, --color-primary text'],
              ['secondary', '--space-micro + --space-micro --space-small', '--color-primary-soft, --color-primary text', '--color-surface-level-2, --color-primary text'],
              ['button', '--space-micro --space-medium + Button Small', '--color-surface-level-3', '--color-surface-level-2'],
              ['border', '—', '--border-width --color-surface-level-3', '—'],
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
            code={`<Tabs
  aria-label="Project"
  border
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', badge: 3, content: <Activity /> },
  ]}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['items', 'TabsItem[]', '—'],
              ['value', 'string', '—'],
              ['defaultValue', 'string', 'first enabled'],
              ['onChange', '(value: string) => void', '—'],
              ['variant', "'primary' | 'secondary' | 'button'", "'primary'"],
              ['align', "'start' | 'center' | 'end'", "'start'"],
              ['border', 'boolean', 'false'],
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
            ['Tab Item Type = Primary / Secondary / Button', "variant='primary' / 'secondary' / 'button'"],
            ['Tab Align = Left / Center / Right', "align='start' / 'center' / 'end'"],
            ['Tab Border Bottom', 'border'],
            ['Tab 02 … Tab 07', 'items.length'],
            ['Tab Item Badge / Info / Disabled', '{ badge } / { info: true } / { disabled: true }'],
            ['Tab Item Active / State=Hover', 'value / :hover'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
