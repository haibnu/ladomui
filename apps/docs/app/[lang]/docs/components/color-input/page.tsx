import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ColorInputPlayground } from './ColorInputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A color field: a swatch that opens a color picker, next to the hex code.',
    look: 'Look',
    lookText: 'The Input box in Medium and Small. A round swatch, lined in a darker shade of its own color, as tall as the text line (24px in Medium, 16px in Small) and a “#” as Leading Text come before the hex code; the box starts 8px from the swatch, as far as above and below it. Without presets the swatch opens the browser’s color picker; with presets it opens a Popover of swatches, the chosen one ringed in primary, and a last “+” swatch that opens the picker. Default, focus, error and disabled follow Input. There is no Figma drawing yet.',
    usage: 'Usage',
    usageText: 'value is a color as “#rrggbb”. The field takes the code with or without “#”, in upper or lower case, and shows it in capitals (4F46E5). Six digits apply as they are typed; three digits (f60) apply on blur or Enter and become #ff6600. onValueChange is called only with a valid, lower-case “#rrggbb”; a code that is not valid goes back to the last color on blur.',
    presets: 'Presets',
    presetsText: 'presets lists the colors offered under the swatch. Picking one closes the Popover; the “+” swatch opens the browser’s picker for any other color.',
    normalize: 'normalizeHex',
    normalizeText: 'The same parsing is exported for your own code: normalizeHex("F60") returns "#ff6600", and anything that is not a hex code returns null.',
    api: 'API reference',
    apiText: 'ColorInput also takes Input’s error, disabled and iconRight, and the other input attributes.',
    a11y: 'Accessibility',
    a11yItems: [
      'The hex code is a plain text field; screen readers read the code. The “#” before it is hidden from them.',
      'Without presets the swatch is the browser’s own color input (named by pickerLabel), so the keyboard and the picker are the browser’s.',
      'With presets the swatch is a button that opens a dialog; the preset swatches are toggle buttons named by their code, with aria-pressed on the chosen one. Escape closes it. Translate pickerLabel, customLabel and presetsLabel.',
      'With name, the color is submitted as “#rrggbb”.',
    ],
    mapping: 'Figma to code',
    props: {
      value: 'The color as “#rrggbb”.',
      defaultValue: 'The first color (uncontrolled).',
      onValueChange: 'Called with a valid “#rrggbb” only.',
      presets: 'Colors offered under the swatch.',
      size: 'Figma 👕 Size.',
      name: 'Form name of the color.',
      pickerLabel: 'Name of the swatch.',
      customLabel: 'Name of the “+” swatch in the presets.',
      presetsLabel: 'Name of the presets group.',
    },
  },
  tr: {
    description: 'Bir renk alanı: renk seçiciyi açan bir renk kutucuğu ve yanında hex kodu.',
    look: 'Görünüm',
    lookText: 'Medium ve Small Input kutusu. Hex kodunun önünde metin satırı yüksekliğinde, kendi renginin koyu bir tonuyla çizilmiş yuvarlak bir renk kutucuğu (Medium’da 24px, Small’da 16px) ve Leading Text olarak bir “#” durur; kutu, kutucuğun alt ve üstündeki gibi soldan da 8px boşluk bırakır. Hazır renk yoksa kutucuk tarayıcının renk seçicisini açar; hazır renk varsa bir Popover açar: seçili olan primary bir halkayla çevrili renk kutucukları ve en sonda seçiciyi açan bir “+” kutucuğu. Default, focus, hata ve devre dışı Input’u izler. Henüz Figma çizimi yok.',
    usage: 'Kullanım',
    usageText: 'value “#rrggbb” biçiminde bir renktir. Alan kodu “#” ile ya da onsuz, büyük ya da küçük harfle alır ve büyük harfle gösterir (4F46E5). Altı basamak yazılırken uygulanır; üç basamak (f60) alandan çıkınca ya da Enter’la uygulanır ve #ff6600 olur. onValueChange yalnızca geçerli, küçük harfli bir “#rrggbb” ile çağrılır; geçersiz bir kod alandan çıkınca son renge döner.',
    presets: 'Hazır renkler',
    presetsText: 'presets, kutucuğun altında sunulan renkleri verir. Birini seçmek Popover’ı kapatır; “+” kutucuğu başka bir renk için tarayıcının seçicisini açar.',
    normalize: 'normalizeHex',
    normalizeText: 'Aynı ayrıştırma kendi kodunuz için de dışa açık: normalizeHex("F60") "#ff6600" döner, hex kodu olmayan her şey null.',
    api: 'API',
    apiText: 'ColorInput, Input’un error, disabled ve iconRight prop’larını ve diğer input özniteliklerini de alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Hex kodu düz bir metin alanıdır; ekran okuyucular kodu okur. Önündeki “#” onlardan gizlidir.',
      'Hazır renk yoksa kutucuk tarayıcının kendi renk input’udur (adı pickerLabel); klavye ve seçici tarayıcınındır.',
      'Hazır renk varsa kutucuk bir diyalog açan bir düğmedir; hazır renkler koduyla adlandırılmış aç/kapa düğmeleridir, seçili olanda aria-pressed vardır. Escape kapatır. pickerLabel, customLabel ve presetsLabel’ı çevirin.',
      'name verilirse renk formda “#rrggbb” olarak gönderilir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      value: '“#rrggbb” biçiminde renk.',
      defaultValue: 'İlk renk (kontrolsüz).',
      onValueChange: 'Yalnızca geçerli bir “#rrggbb” ile çağrılır.',
      presets: 'Kutucuğun altında sunulan renkler.',
      size: 'Figma 👕 Size.',
      name: 'Rengin form adı.',
      pickerLabel: 'Kutucuğun adı.',
      customLabel: 'Hazır renklerdeki “+” kutucuğunun adı.',
      presetsLabel: 'Hazır renk grubunun adı.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Color Input' };
}

export default async function ColorInputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={`${t.nav.components} / Input`} title="Color Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1133:303" />
        <h2 id="playground">{t.component.playground}</h2>
        <ColorInputPlayground />
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [color, setColor] = useState('#4f46e5');\n\n<FormField label="Brand color">\n  <ColorInput value={color} onValueChange={setColor} />\n</FormField>`}
          />
          <h3 id="presets">{c.presets}</h3>
          <p>{c.presetsText}</p>
          <CodeBlock code={`<ColorInput\n  value={color}\n  onValueChange={setColor}\n  presets={['#4f46e5', '#059669', '#d97706', '#dc2626']}\n/>`} />
          <h3 id="normalize-hex">{c.normalize}</h3>
          <p>{c.normalizeText}</p>
          <CodeBlock code={`import { normalizeHex } from '@/components/ladom';\n\nnormalizeHex('#F60'); // '#ff6600'\nnormalizeHex('blue'); // null`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'string', '—'],
              ['defaultValue', 'string', "'#000000'"],
              ['onValueChange', '(value: string) => void', '—'],
              ['presets', 'string[]', '—'],
              ['size', "'medium' | 'small'", "'medium'"],
              ['name', 'string', '—'],
              ['pickerLabel', 'string', "'Pick a color'"],
              ['customLabel', 'string', "'Custom color'"],
              ['presetsLabel', 'string', "'Colors'"],
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
            ['Input 👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['Input 🕹 State = Focus / Error / Disabled', ':focus-within / error / disabled'],
            ['Input Leading Text', 'swatch + “#”'],
            ['Popover 🎛 Type = HTML', 'presets'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
