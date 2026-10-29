import type { Metadata } from 'next';
import { Chip, type ChipSize, type ChipTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ChipPlayground } from './ChipPlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: ChipTone[] = ['default', 'primary', 'success', 'error', 'warning'];
const SIZES: ChipSize[] = ['medium', 'small', 'tiny', 'micro'];

const COPY = {
  en: {
    description: 'A compact pill for filters, choices and entered values. It can toggle, show a key and be removed.',
    variants: 'Variants',
    variantsText: 'Five tones. Unselected chips use the soft tone with shade text; selected chips use the tone with its on-color. Default turns primary soft when selected.',
    sizes: 'Sizes',
    sizesText: 'Medium and Small use the body text, Tiny the small text, Micro the footnote.',
    parts: 'Key and remove',
    partsText: 'A key part sits before the text (for filters like “Status: Active”); the remove button sits after it.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The key text is Neue Haas Grotesk Text Pro 14 Medium, outside the type scale and the font variable. Code uses the bold UI style of each size (ui/text/bold, ui/text small/bold, ui/footnote/bold).',
      'Every selected chip keeps the neutral key (surface/level-4 with high-emphasis text), whatever its tone.',
      'Figma has no hover, focus or disabled state. Code adds the primary focus ring for keyboard users.',
      'The remove icon is Icon/clear, as in Figma.',
      'Primary Micro unselected pads the pill 2px on all sides and the text 0 4px, while the others pad the pill 0 2px and the text 2px 4px; both come out 16px tall.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Chip also accepts every span attribute and forwards its ref (to the outer pill).',
    a11y: 'Accessibility',
    a11yItems: [
      'With onClick the chip text is a toggle button with aria-pressed set to selected; without it, the chip is plain text.',
      'The remove button is a separate button named “Remove”; pass removeLabel to say what it removes (“Remove Istanbul”).',
      'Group filter chips in a labelled container (for example role="group" with aria-label).',
    ],
    mapping: 'Figma to code',
    props: {
      tone: 'Figma 💅 Style (Danger → error).',
      size: 'Figma 👕 Size.',
      selected: 'Figma Select.',
      keyLabel: 'Figma Key + ⮑ Key.',
      iconLeft: 'Figma Show Icon + Change Icon (L).',
      iconRight: 'Figma Show Icon (R) + Change Icon (R).',
      onClick: 'Makes the text a toggle button.',
      onRemove: 'Figma Remove: shows the remove button.',
      removeLabel: 'Accessible name of the remove button.',
    },
  },
  tr: {
    description: 'Filtreler, seçimler ve girilen değerler için küçük bir hap. Açılıp kapanabilir, anahtar gösterebilir ve kaldırılabilir.',
    variants: 'Tipler',
    variantsText: 'Beş ton. Seçili olmayan chip’ler soft tonu ve shade metni, seçili olanlar tonu ve on-rengini kullanır. Default seçilince primary soft olur.',
    sizes: 'Boyutlar',
    sizesText: 'Medium ve Small gövde metnini, Tiny küçük metni, Micro footnote’u kullanır.',
    parts: 'Anahtar ve kaldırma',
    partsText: 'Anahtar kısmı metnin önüne gelir (“Durum: Aktif” gibi filtreler için); kaldırma butonu metnin arkasına.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Anahtar metni Neue Haas Grotesk Text Pro 14 Medium; tip ölçeğinin ve font değişkeninin dışında. Kod her boyutun bold UI stilini kullanır (ui/text/bold, ui/text small/bold, ui/footnote/bold).',
      'Seçili her chip, tonu ne olursa olsun nötr anahtarı korur (surface/level-4 ve high-emphasis metin).',
      'Figma’da hover, focus ya da disabled durumu yok. Kod klavye kullanıcıları için primary focus halkasını ekler.',
      'Kaldırma ikonu, Figma’daki gibi Icon/clear.',
      'Seçili olmayan Primary Micro hapı her yandan 2px, metni 0 4px boşlukla; diğerleri hapı 0 2px, metni 2px 4px boşlukla sarar; ikisi de 16px yüksekliğinde çıkar.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Chip tüm span özniteliklerini de kabul eder ve ref’ini (dış hapa) iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'onClick verilince chip metni, aria-pressed’i selected olan bir toggle butonudur; verilmezse chip düz metindir.',
      'Kaldırma butonu “Remove” adlı ayrı bir butondur; neyi kaldırdığını söylemek için removeLabel verin (“İstanbul’u kaldır”).',
      'Filtre chip’lerini label’lı bir kapsayıcıda gruplayın (örneğin aria-label’lı role="group").',
    ],
    mapping: 'Figma’dan koda',
    props: {
      tone: 'Figma 💅 Style (Danger → error).',
      size: 'Figma 👕 Size.',
      selected: 'Figma Select.',
      keyLabel: 'Figma Key + ⮑ Key.',
      iconLeft: 'Figma Show Icon + Change Icon (L).',
      iconRight: 'Figma Show Icon (R) + Change Icon (R).',
      onClick: 'Metni toggle butonu yapar.',
      onRemove: 'Figma Remove: kaldırma butonunu gösterir.',
      removeLabel: 'Kaldırma butonunun erişilebilir adı.',
    },
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Chips' };
}

export default async function ChipsPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const row = (selected: boolean) =>
    TONES.map((tone) => (
      <Chip key={tone} tone={tone} selected={selected}>
        {cap(tone)}
      </Chip>
    ));
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Chips" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="76:36872" />

        <h2 id="playground">{t.component.playground}</h2>
        <ChipPlayground />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <p>{c.variantsText}</p>
          <Example>{row(false)}</Example>
          <Example>{row(true)}</Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example>
            {SIZES.map((size) => (
              <Chip key={size} size={size}>
                {cap(size)}
              </Chip>
            ))}
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Pill padding', 'Text padding', 'Text', 'Icon']}
            rows={[
              ['medium', '40px', <code key="p">--space-micro</code>, <code key="t">--space-micro --space-small</code>, 'ui/text/regular', '20px'],
              ['small', '32px', <code key="p">--space-micro 6px</code>, <code key="t">0 --space-tiny</code>, 'ui/text/regular', '16px'],
              ['tiny', '24px', <code key="p">0 --space-atom</code>, <code key="t">--space-micro</code>, 'ui/text small/regular', '12px'],
              ['micro', '16px', <code key="p">0 --space-atom</code>, <code key="t">--space-atom --space-micro</code>, 'ui/footnote/regular', '12px'],
            ]}
          />

          <h2 id="parts">{c.parts}</h2>
          <p>{c.partsText}</p>
          <Example>
            <Chip keyLabel="Status" tone="primary">
              Active
            </Chip>
            <Chip keyLabel="Status" tone="success">
              Done
            </Chip>
            <Chip tone="primary" selected>
              Istanbul
            </Chip>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', 'Background', 'Text', 'Key background / text']}
            rows={[
              ['default', '--color-surface-level-3', '--color-foreground-high-emphasis', '--color-surface-level-4 / --color-foreground-high-emphasis'],
              ['default selected', '--color-primary-soft', '--color-primary', '--color-surface-level-4 / --color-foreground-high-emphasis'],
              ['{tone}', '--color-{tone}-soft', '--color-{tone}-shade', '--color-{tone}-shade / --color-{tone}-soft'],
              ['{tone} selected', '--color-{tone}', '--color-on-{tone}', '--color-surface-level-4 / --color-foreground-high-emphasis'],
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
          <Example
            code={`const [city, setCity] = useState(true);

<Chip selected={city} onClick={() => setCity(!city)}>Istanbul</Chip>
<Chip keyLabel="Status" tone="primary" onRemove={clearStatus} removeLabel="Remove status filter">
  Active
</Chip>`}
          >
            <Chip selected>Istanbul</Chip>
            <Chip keyLabel="Status" tone="primary">
              Active
            </Chip>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['tone', "'default' | 'primary' | 'success' | 'error' | 'warning'", "'default'"],
              ['size', "'medium' | 'small' | 'tiny' | 'micro'", "'medium'"],
              ['selected', 'boolean', 'false'],
              ['keyLabel', 'ReactNode', '—'],
              ['iconLeft', 'ReactNode', '—'],
              ['iconRight', 'ReactNode', '—'],
              ['onClick', 'MouseEventHandler<HTMLButtonElement>', '—'],
              ['onRemove', 'MouseEventHandler<HTMLButtonElement>', '—'],
              ['removeLabel', 'string', "'Remove'"],
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
            ['💅 Style = Default / Primary / Success / Danger / Warning', "tone='default' / 'primary' / 'success' / 'error' / 'warning'"],
            ['👕 Size = Medium / Small / Tiny / Micro', "size='medium' / 'small' / 'tiny' / 'micro'"],
            ['Select = True', 'selected'],
            ['Key + ⮑ Key', 'keyLabel="…"'],
            ['Show Icon / Show Icon (R)', 'iconLeft={<Icon… />} / iconRight={<Icon… />}'],
            ['Remove = True', 'onRemove={…}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
