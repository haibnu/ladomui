import type { Metadata } from 'next';
import { Segment, type SegmentOption } from '@ladom/ui';
import { IconList, IconMap } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { SegmentPlayground } from './SegmentPlayground';

type Props = { params: Promise<{ lang: string }> };

const BASIC: SegmentOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

const COPY = {
  en: {
    description: 'Picks one of two or three options that sit side by side, like a view or a time range. The Designer / Developer switch on this page is a Segment.',
    items: 'Item types',
    itemsText: 'An item is text, text with an icon on either side, text with a count badge, or text with a small info icon.',
    sizes: 'Sizes and width',
    sizesText: 'Medium and Small. Fluid stretches the segment and shares the width between the items.',
    states: 'States',
    statesText: 'The chosen item is a raised surface/level-1 pill with primary text. Disabled greys the track and the text.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The fluid segments have a raw 8px radius in both sizes, the others the form element radius (12px Medium, 8px Small); code uses the size’s radius.',
      'Disabled active items keep primary text for the icon, info and badge types but not for the default type; code uses low-emphasis text for all.',
      'Figma has no hover or focus state; code adds the primary focus ring for keyboard users.',
      'Medium Info items put 8px between the text and the 12px icon, Small Info items 4px and an 8px icon.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Segment also accepts every div attribute (put aria-label or aria-labelledby on it).',
    a11y: 'Accessibility',
    a11yItems: [
      'Segment is a radiogroup of native radios: Tab reaches the chosen item, arrow keys move the choice.',
      'Name the group with aria-label or aria-labelledby.',
      'Icons and the info icon are decorative; keep a text label on every item.',
    ],
    mapping: 'Figma to code',
    props: {
      options: 'Items: value, label, and optional icon, iconPosition, badge, info, disabled.',
      value: 'Controlled value.',
      defaultValue: 'Initial value; the first option when omitted.',
      onChange: 'Called with the chosen value.',
      size: 'Figma 👕 Size.',
      fluid: 'Figma Fluid.',
      disabled: 'Figma Disable.',
      spacing: 'Figma Form Spacing.',
      name: 'Radio group name for forms.',
    },
  },
  tr: {
    description: 'Yan yana duran iki ya da üç seçenekten birini seçtirir; örneğin bir görünüm ya da zaman aralığı. Bu sayfadaki Tasarımcı / Geliştirici geçişi bir Segment’tir.',
    items: 'Öğe tipleri',
    itemsText: 'Bir öğe metin, iki yanından birinde ikonlu metin, sayı badge’li metin ya da küçük bilgi ikonlu metin olabilir.',
    sizes: 'Boyutlar ve genişlik',
    sizesText: 'Medium ve Small. Fluid segmenti uzatır ve genişliği öğeler arasında paylaştırır.',
    states: 'Durumlar',
    statesText: 'Seçili öğe, primary metinli, yükseltilmiş surface/level-1 bir haptır. Disabled zemini ve metni griye çevirir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Fluid segmentlerin köşesi iki boyutta da ham 8px, diğerleri form element köşesini (Medium 12px, Small 8px) kullanıyor; kod boyutun köşesini kullanır.',
      'Disabled aktif öğeler ikon, info ve badge tiplerinde primary metni koruyor ama default tipte korumuyor; kod hepsinde low-emphasis metin kullanır.',
      'Figma’da hover ya da focus durumu yok; kod klavye kullanıcıları için primary focus halkasını ekler.',
      'Medium Info öğelerde metin ile 12px ikon arasında 8px, Small Info öğelerde 4px ve 8px ikon var.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Segment tüm div özniteliklerini de kabul eder (aria-label ya da aria-labelledby verin).',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Segment yerel radio’lardan oluşan bir radiogroup’tur: Tab seçili öğeye gelir, ok tuşları seçimi değiştirir.',
      'Grubu aria-label ya da aria-labelledby ile adlandırın.',
      'İkonlar ve bilgi ikonu dekoratiftir; her öğede bir metin label bırakın.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      options: 'Öğeler: value, label ve isteğe bağlı icon, iconPosition, badge, info, disabled.',
      value: 'Kontrollü değer.',
      defaultValue: 'Başlangıç değeri; verilmezse ilk seçenek.',
      onChange: 'Seçilen değerle çağrılır.',
      size: 'Figma 👕 Size.',
      fluid: 'Figma Fluid.',
      disabled: 'Figma Disable.',
      spacing: 'Figma Form Spacing.',
      name: 'Formlar için radio grup adı.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Segment' };
}

export default async function SegmentPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Segment" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1229:1786" />

        <h2 id="playground">{t.component.playground}</h2>
        <SegmentPlayground />

        <ForView view="designer">
          <h2 id="items">{c.items}</h2>
          <p>{c.itemsText}</p>
          <Example stack>
            <Segment aria-label="Default" options={BASIC} />
            <Segment
              aria-label="Icons"
              options={[
                { value: 'list', label: 'List', icon: <IconList /> },
                { value: 'map', label: 'Map', icon: <IconMap /> },
              ]}
            />
            <Segment
              aria-label="Badges"
              options={[
                { value: 'open', label: 'Open', badge: 4 },
                { value: 'done', label: 'Done', badge: 12 },
              ]}
            />
            <Segment
              aria-label="Info"
              options={[
                { value: 'net', label: 'Net', info: true },
                { value: 'gross', label: 'Gross', info: true },
              ]}
            />
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example stack>
            <Segment aria-label="Medium" options={BASIC} />
            <Segment aria-label="Small" size="small" options={BASIC} />
            <Segment aria-label="Fluid" fluid options={BASIC} />
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Track padding', 'Item padding', 'Radius', 'Text', 'Icon']}
            rows={[
              ['medium', '40px', <code key="t">--space-micro</code>, <code key="p">--space-micro --space-small</code>, <code key="r">--radius-form-element</code>, 'ui/text/regular', '16px'],
              ['small', '32px', <code key="t">--space-micro</code>, <code key="p">--space-micro --space-tiny</code>, <code key="r">--radius-form-element-small</code>, 'ui/text small/regular', '12px'],
            ]}
          />

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            <Segment aria-label="Active" options={BASIC} defaultValue="week" />
            <Segment aria-label="Disabled" options={BASIC} disabled />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Track', '--color-surface-level-3'],
              ['Chosen item', '--color-surface-level-1, --shadow-card-style-1'],
              ['Chosen text', '--color-primary'],
              ['Text', '--color-foreground-high-emphasis'],
              ['Disabled track', '--color-surface-level-2, --color-surface-level-4 line'],
              ['Disabled text', '--color-foreground-low-emphasis'],
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
            code={`const [range, setRange] = useState('week');

<Segment
  aria-label="Range"
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ]}
  value={range}
  onChange={setRange}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['options', 'SegmentOption[]', '—'],
              ['value', 'string', '—'],
              ['defaultValue', 'string', 'first option'],
              ['onChange', '(value: string) => void', '—'],
              ['size', "'medium' | 'small'", "'medium'"],
              ['fluid', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
              ['spacing', 'boolean', 'false'],
              ['name', 'string', 'generated'],
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
            ['👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['Count = 2 / 3', 'options.length'],
            ['Fluid / Disable / Form Spacing', 'fluid / disabled / spacing'],
            ['.Segment Item Type = Left Icon / Right Icon', "{ icon, iconPosition: 'start' | 'end' }"],
            ['.Segment Item Type = Badge / Info', '{ badge } / { info: true }'],
            ['.Segment Item Active = True', 'value'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
