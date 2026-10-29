import type { Metadata } from 'next';
import { Selectbox, type SelectboxSize } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, href, type Locale } from '@/i18n';
import { SelectboxPlayground } from './SelectboxPlayground';

type Props = { params: Promise<{ lang: string }> };

const SIZES: SelectboxSize[] = ['large', 'medium', 'small', 'tiny'];
const OPTIONS = ['Istanbul', 'Ankara', 'Izmir'].map((label) => ({ value: label.toLowerCase(), label }));

const COPY = {
  en: {
    description: 'Picks one or more values from a list. The box opens a Dropdown whose options are Cells.',
    anatomy: 'Anatomy',
    anatomyText: 'The box shows the placeholder or the chosen value and an arrow. When it opens, a Dropdown appears 4px below it with one Cell per option; Multiselect cells have a checkbox.',
    types: 'Types',
    typesText: 'Basic picks one value. Inner Label draws the label inside the box. Multiselect picks many and shows a count badge; Chip shows each choice as a chip.',
    sizes: 'Sizes',
    sizesText: 'Large, Medium, Small and Tiny. Medium and Large use Medium cells in the list, Small and Tiny use Small cells.',
    states: 'States',
    statesText: 'Hover draws the primary tint line; Focus and Active (open) the primary line with the focus ring. Error turns the line, placeholder and label red and adds the error icon.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The resting box has no line, only the card style 1 shadow, unlike Input, which has a surface/level-4 line.',
      'The box radius is a raw 8px in every size; code uses --radius-form-element-small.',
      'The arrows are “Icon/arrow down” and “Icon/arrow up”, which are not on the Icons page; code uses arrow-bottom and arrow-top.',
      'Medium Error puts 8px between the error icon and the arrow, the other states 12px.',
      'Inner Label exists only in Medium. Its resting state shows no label, so code shows the label as the placeholder until the box is focused, opened or filled.',
      'Figma has no search in the list; searchable uses Cell Type=Search at the top of the Dropdown.',
    ],
    usage: 'Usage',
    form: 'In a form',
    formText: 'Wrap it in FormField for the label, hint and error (Figma Form Selectbox). Pass name to submit the value.',
    api: 'API reference',
    apiText: 'value is a string, or a string array with multiple.',
    a11y: 'Accessibility',
    a11yItems: [
      'The box is a button with role="combobox"; the list is a listbox of options with aria-selected, and aria-activedescendant follows the active option.',
      'Closed: Arrow keys, Enter or Space open the list; typing a letter selects the next matching option. Open: Arrow keys and Home/End move, Enter or Space picks, Escape closes, Tab closes and moves on.',
      'Give it a label with FormField, aria-label or innerLabel.',
      'Multiselect keeps the list open while picking; the box reads the count and the chosen labels.',
    ],
    mapping: 'Figma to code',
    props: {
      options: 'Options: value, label, and optional disabled, iconLeft, avatar, subtitle, bodycopy.',
      value: 'Controlled value.',
      defaultValue: 'Initial value when uncontrolled.',
      onChange: 'Called with the new value.',
      multiple: 'Figma Type=Multiselect.',
      display: "With multiple: 'count' (Multiselect) or 'chips' (Chip).",
      innerLabel: 'Figma Type=Inner Label.',
      size: 'Figma 👕 Size.',
      fluid: 'Figma Fluid.',
      error: 'Figma Error.',
      disabled: 'Figma Disable.',
      placeholder: 'Text when nothing is chosen.',
      searchable: 'Adds the search cell that filters the options.',
      name: 'Form field name.',
    },
    seeAlso: 'See also',
  },
  tr: {
    description: 'Bir listeden bir ya da birden çok değer seçtirir. Kutu, seçenekleri Cell olan bir Dropdown açar.',
    anatomy: 'Anatomi',
    anatomyText: 'Kutu placeholder’ı ya da seçili değeri ve bir oku gösterir. Açılınca 4px altında her seçenek için bir Cell içeren Dropdown çıkar; Multiselect hücrelerinde checkbox vardır.',
    types: 'Tipler',
    typesText: 'Basic tek değer seçer. Inner Label, label’ı kutunun içine çizer. Multiselect birden çok seçer ve sayı badge’i gösterir; Chip her seçimi bir chip olarak gösterir.',
    sizes: 'Boyutlar',
    sizesText: 'Large, Medium, Small ve Tiny. Medium ve Large listede Medium hücre, Small ve Tiny Small hücre kullanır.',
    states: 'Durumlar',
    statesText: 'Hover primary tint çizgi çizer; Focus ve Active (açık) primary çizgi ve focus halkası. Error çizgiyi, placeholder’ı ve label’ı kırmızı yapar ve hata ikonunu ekler.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Duran kutunun çizgisi yok, yalnızca card style 1 gölgesi var; Input’ta ise surface/level-4 çizgi var.',
      'Kutu köşesi her boyutta ham 8px; kod --radius-form-element-small kullanır.',
      'Oklar Icons sayfasında olmayan “Icon/arrow down” ve “Icon/arrow up”; kod arrow-bottom ve arrow-top kullanır.',
      'Medium Error’da hata ikonu ile ok arasında 8px, diğer durumlarda 12px var.',
      'Inner Label yalnızca Medium’da var. Duran hâlinde label görünmüyor; kod, kutu odaklanana, açılana ya da dolana kadar label’ı placeholder olarak gösterir.',
      'Figma’da listede arama yok; searchable, Dropdown’un üstünde Cell Type=Search kullanır.',
    ],
    usage: 'Kullanım',
    form: 'Formda',
    formText: 'Label, hint ve hata için FormField ile sarın (Figma Form Selectbox). Değeri göndermek için name verin.',
    api: 'API',
    apiText: 'value bir string; multiple ile string dizisi.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Kutu role="combobox" taşıyan bir buton; liste aria-selected’lı option’lardan oluşan bir listbox; aria-activedescendant aktif seçeneği izler.',
      'Kapalıyken: ok tuşları, Enter ya da Space listeyi açar; bir harf yazmak eşleşen sonraki seçeneği seçer. Açıkken: ok tuşları ve Home/End gezinir, Enter ya da Space seçer, Escape kapatır, Tab kapatıp ilerler.',
      'FormField, aria-label ya da innerLabel ile bir label verin.',
      'Multiselect seçerken listeyi açık tutar; kutu sayıyı ve seçili label’ları okur.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      options: 'Seçenekler: value, label ve isteğe bağlı disabled, iconLeft, avatar, subtitle, bodycopy.',
      value: 'Kontrollü değer.',
      defaultValue: 'Kontrolsüzken başlangıç değeri.',
      onChange: 'Yeni değerle çağrılır.',
      multiple: 'Figma Type=Multiselect.',
      display: "multiple ile: 'count' (Multiselect) ya da 'chips' (Chip).",
      innerLabel: 'Figma Type=Inner Label.',
      size: 'Figma 👕 Size.',
      fluid: 'Figma Fluid.',
      error: 'Figma Error.',
      disabled: 'Figma Disable.',
      placeholder: 'Hiçbir şey seçili değilken görünen metin.',
      searchable: 'Seçenekleri süzen arama hücresini ekler.',
      name: 'Form alanı adı.',
    },
    seeAlso: 'Ayrıca bakın',
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Selectbox' };
}

export default async function SelectboxPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Selectbox" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1163:3" />

        <h2 id="playground">{t.component.playground}</h2>
        <SelectboxPlayground />

        <ForView view="designer">
          <h2 id="anatomy">{c.anatomy}</h2>
          <p>{c.anatomyText}</p>
          <p>
            {c.seeAlso}: <a href={href(lang, '/docs/components/dropdown')}>Dropdown</a>, <a href={href(lang, '/docs/components/cell')}>Cell</a>
          </p>

          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            <Selectbox options={OPTIONS} defaultValue="istanbul" aria-label="Basic" />
            <Selectbox options={OPTIONS} defaultValue="istanbul" innerLabel="City" />
            <Selectbox options={OPTIONS} multiple defaultValue={['istanbul', 'izmir']} aria-label="Multiselect" />
            <Selectbox options={OPTIONS} multiple display="chips" defaultValue={['istanbul', 'izmir']} aria-label="Chip" />
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example stack>
            {SIZES.map((size) => (
              <Selectbox key={size} options={OPTIONS} size={size} placeholder={cap(size)} aria-label={size} />
            ))}
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Padding', 'Gap', 'Text', 'Arrow']}
            rows={[
              ['large', '48px', <code key="p">--space-small --space-medium</code>, <code key="g">--layout-small</code>, 'ui/text lead/regular', '16px'],
              ['medium', '40px', <code key="p">--space-tiny --space-medium</code>, <code key="g">--layout-small</code>, 'ui/text/regular', '16px'],
              ['small', '32px', <code key="p">--space-tiny --space-small</code>, <code key="g">--space-micro</code>, 'ui/text small/regular', '16px'],
              ['tiny', '24px', <code key="p">--space-micro --space-tiny</code>, <code key="g">--space-micro</code>, 'ui/text small/regular', '12px'],
            ]}
          />

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            <Selectbox options={OPTIONS} data-state="hover" aria-label="Hover" placeholder="Hover" />
            <Selectbox options={OPTIONS} data-state="focus" aria-label="Focus" placeholder="Focus" />
            <Selectbox options={OPTIONS} data-state="active" aria-label="Active" placeholder="Active" />
            <Selectbox options={OPTIONS} error aria-label="Error" placeholder="Error" />
            <Selectbox options={OPTIONS} disabled aria-label="Disabled" placeholder="Disabled" />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', 'Background', 'Line', 'Shadow']}
            rows={[
              ['default', '--color-surface-level-1', '—', '--shadow-card-style-1'],
              ['hover', '--color-surface-level-1', '--color-primary-tint', '--shadow-card-style-1'],
              ['focus / active', '--color-surface-level-1', '--color-primary', '--shadow-focus-primary'],
              ['error', '--color-surface-level-1', '--color-error', '--shadow-card-style-1'],
              ['disabled', '--color-surface-level-2', '--color-surface-level-4', '—'],
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
            code={`const cities = [
  { value: 'istanbul', label: 'Istanbul' },
  { value: 'ankara', label: 'Ankara' },
  { value: 'izmir', label: 'Izmir', disabled: true },
];
const [city, setCity] = useState('');

<Selectbox options={cities} value={city} onChange={setCity} aria-label="City" />
<Selectbox options={cities} multiple display="chips" defaultValue={['istanbul']} aria-label="Cities" />`}
          />

          <h3 id="form">{c.form}</h3>
          <p>{c.formText}</p>
          <CodeBlock
            code={`<FormField label="City" hint="Where you live">
  <Selectbox options={cities} name="city" searchable />
</FormField>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['options', 'SelectboxOption[]', '—'],
              ['value', 'string | string[]', '—'],
              ['defaultValue', 'string | string[]', '—'],
              ['onChange', '(value) => void', '—'],
              ['multiple', 'boolean', 'false'],
              ['display', "'count' | 'chips'", "'count'"],
              ['innerLabel', 'ReactNode', '—'],
              ['size', "'large' | 'medium' | 'small' | 'tiny'", "'medium'"],
              ['fluid', 'boolean', 'true'],
              ['error', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
              ['placeholder', 'string', "'Select'"],
              ['searchable', 'boolean', 'false'],
              ['name', 'string', '—'],
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
            ['🎛 Type = Basic', '<Selectbox options value onChange />'],
            ['🎛 Type = Inner Label', 'innerLabel="…"'],
            ['🎛 Type = Multiselect', 'multiple'],
            ['🎛 Type = Chip', 'multiple display="chips"'],
            ['👕 Size = Large / Medium / Small / Tiny', "size='large' / 'medium' / 'small' / 'tiny'"],
            ['Fluid = False', 'fluid={false}'],
            ['Error / Disable', 'error / disabled'],
            ['Form Selectbox', '<FormField label hint><Selectbox /></FormField>'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
