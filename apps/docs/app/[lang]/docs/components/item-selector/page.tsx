import type { Metadata } from 'next';
import { ItemSelector } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ItemSelectorPlayground } from './ItemSelectorPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A field that opens your own picker, such as a folder browser, and shows what was picked with a chip to change it.',
    states: 'States',
    statesText: 'Empty shows the placeholder in medium emphasis; Selected shows the item in high emphasis. Hover draws the primary tint line, Error the error line; Disabled greys the text.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The text uses the legacy “Paragraph / Regular” style (14/24); code uses ui/text/regular, which has the same size.',
      'The action chip is the deprecated “Chips” component with HK Grotesk Medium 12px text; code draws it with ui/text small/bold and the Chip tokens.',
      'The box has a raw 8px radius; code uses --radius-form-element-small.',
      'A hidden link Button sits inside every variant and is never shown.',
      'Figma has no focus state; code adds the primary line and focus ring.',
    ],
    usage: 'Usage',
    usageText: 'ItemSelector is a button: open your picker in onClick and pass the result as value. Wrap it in FormField for the label, hint and error.',
    api: 'API reference',
    apiText: 'ItemSelector also accepts every button attribute and forwards its ref.',
    a11y: 'Accessibility',
    a11yItems: [
      'It is a native button, so it is reachable with Tab and opens with Enter or Space.',
      'Name it with FormField or aria-label; the picked value is read as part of its text.',
    ],
    mapping: 'Figma to code',
    props: {
      value: 'Figma Selected: the picked item.',
      placeholder: 'Text when nothing is picked.',
      actionLabel: 'Text of the action chip.',
      icon: 'Leading icon; a folder by default.',
      error: 'Figma Error.',
      disabled: 'Figma Disabled.',
    },
  },
  tr: {
    description: 'Klasör tarayıcısı gibi kendi seçicinizi açan ve seçileni, değiştirmek için bir chip ile gösteren alan.',
    states: 'Durumlar',
    statesText: 'Boşken placeholder medium-emphasis görünür; seçiliyken öğe high-emphasis görünür. Hover primary tint çizgi, Error hata çizgisi çizer; Disabled metni griye çevirir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Metin eski “Paragraph / Regular” stilini (14/24) kullanıyor; kod aynı boyuttaki ui/text/regular’ı kullanır.',
      'Eylem chip’i, HK Grotesk Medium 12px metinli, kullanımdan kalkmış “Chips” bileşeni; kod onu ui/text small/bold ve Chip tokenlarıyla çizer.',
      'Kutunun köşesi ham 8px; kod --radius-form-element-small kullanır.',
      'Her varyantın içinde hiç görünmeyen gizli bir link Button var.',
      'Figma’da focus durumu yok; kod primary çizgi ve focus halkası ekler.',
    ],
    usage: 'Kullanım',
    usageText: 'ItemSelector bir butondur: seçicinizi onClick’te açın ve sonucu value olarak verin. Label, hint ve hata için FormField ile sarın.',
    api: 'API',
    apiText: 'ItemSelector tüm button özniteliklerini de kabul eder ve ref’ini iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Yerel bir buton olduğu için Tab ile ulaşılır, Enter ya da Space ile açılır.',
      'FormField ya da aria-label ile adlandırın; seçilen değer metninin parçası olarak okunur.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      value: 'Figma Selected: seçilen öğe.',
      placeholder: 'Hiçbir şey seçili değilken görünen metin.',
      actionLabel: 'Eylem chip’inin metni.',
      icon: 'Baştaki ikon; varsayılanı klasör.',
      error: 'Figma Error.',
      disabled: 'Figma Disabled.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Item Selector' };
}

export default async function ItemSelectorPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Item Selector" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4929:292" />

        <h2 id="playground">{t.component.playground}</h2>
        <ItemSelectorPlayground />

        <ForView view="designer">
          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            <ItemSelector aria-label="Default" />
            <ItemSelector aria-label="Hover" data-state="hover" />
            <ItemSelector aria-label="Selected" value="/Reports/2026" />
            <ItemSelector aria-label="Error" error />
            <ItemSelector aria-label="Disabled" disabled />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Box', '--color-surface-level-2, --radius-form-element-small'],
              ['Padding', '--space-tiny --space-medium'],
              ['Placeholder / value', '--color-foreground-medium-emphasis / --color-foreground-high-emphasis'],
              ['Chip', '--color-surface-level-3, --radius-full'],
              ['Hover / error line', '--color-primary-tint / --color-error'],
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
            code={`const [folder, setFolder] = useState('');

<FormField label="Export folder" hint="Reports are saved here">
  <ItemSelector
    value={folder}
    placeholder="Select a folder"
    actionLabel="Change folder"
    onClick={async () => setFolder(await openFolderPicker())}
  />
</FormField>`}
          />
          <p>{c.usageText}</p>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'ReactNode', '—'],
              ['placeholder', 'ReactNode', "'Select'"],
              ['actionLabel', 'ReactNode', "'Change'"],
              ['icon', 'ReactNode', '<IconFolder />'],
              ['error', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
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
            ['Selected = True', 'value="…"'],
            ['Error / Disabled', 'error / disabled'],
            ['Label / Hint / Form Spacing', '<FormField label hint spacing><ItemSelector /></FormField>'],
            ['🕹 State = Hover', ':hover'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
