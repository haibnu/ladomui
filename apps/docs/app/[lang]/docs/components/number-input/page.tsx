import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { NumberInputPlayground } from './NumberInputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A number field with decrease and increase buttons: quantities, counts, amounts.',
    look: 'Sizes and states',
    lookText: 'The Input box in Medium and Small with tiny ghost buttons on both sides and the value in the middle. Default, focus, error and disabled follow Input; the buttons turn off at min and max.',
    usage: 'Usage',
    usageText: 'value is a number, or null when the field is empty. Typing is free; on blur the value is clamped to min and max and rounded to step. The arrow keys step it too.',
    api: 'API reference',
    apiText: 'NumberInput also takes Input’s size, error and disabled, and every input attribute except type.',
    a11y: 'Accessibility',
    a11yItems: ['It is a native number input, so screen readers announce it as a spin button and the arrow keys work.', 'The buttons are out of the tab order (the keyboard uses the arrows); translate decrementLabel and incrementLabel.'],
    mapping: 'Figma to code',
    props: { value: 'The number, or null.', defaultValue: 'The first value (uncontrolled).', onValueChange: 'Called with the number or null.', min: 'Lowest value.', max: 'Highest value.', step: 'Step of the buttons and arrows.', size: 'Figma 👕 Size.', decrementLabel: 'Name of the − button.', incrementLabel: 'Name of the + button.' },
  },
  tr: {
    description: 'Azaltma ve artırma butonlu bir sayı alanı: adet, miktar, tutar.',
    look: 'Boyutlar ve durumlar',
    lookText: 'Medium ve Small Input kutusu; iki yanda küçük ghost butonlar, ortada değer. Default, focus, hata ve devre dışı Input’u izler; butonlar min ve max’ta kapanır.',
    usage: 'Kullanım',
    usageText: 'value bir sayıdır, alan boşsa null. Yazmak serbesttir; alandan çıkınca değer min ve max arasına çekilir ve step’e yuvarlanır. Ok tuşları da adım atar.',
    api: 'API',
    apiText: 'NumberInput, Input’un size, error ve disabled prop’larını ve type dışındaki tüm input özniteliklerini de alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: ['Yerel bir sayı alanıdır; ekran okuyucular onu spin button olarak duyurur, ok tuşları çalışır.', 'Butonlar tab sırasında değildir (klavye okları kullanır); decrementLabel ve incrementLabel’ı çevirin.'],
    mapping: 'Figma’dan koda',
    props: { value: 'Sayı ya da null.', defaultValue: 'İlk değer (kontrolsüz).', onValueChange: 'Sayı ya da null ile çağrılır.', min: 'En düşük değer.', max: 'En yüksek değer.', step: 'Butonların ve okların adımı.', size: 'Figma 👕 Size.', decrementLabel: '− butonunun adı.', incrementLabel: '+ butonunun adı.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Number Input' };
}

export default async function NumberInputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={`${t.nav.components} / Input`} title="Number Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4238:3913" />
        <h2 id="playground">{t.component.playground}</h2>
        <NumberInputPlayground />
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock code={`const [quantity, setQuantity] = useState<number | null>(1);\n\n<FormField label="Quantity">\n  <NumberInput value={quantity} onValueChange={setQuantity} min={1} max={99} />\n</FormField>`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'number | null', '—'],
              ['defaultValue', 'number | null', 'null'],
              ['onValueChange', '(value: number | null) => void', '—'],
              ['min', 'number', '—'],
              ['max', 'number', '—'],
              ['step', 'number', '1'],
              ['size', "'medium' | 'small'", "'medium'"],
              ['decrementLabel', 'string', "'Decrease'"],
              ['incrementLabel', 'string', "'Increase'"],
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
            ['🕹 State = Focus / Error / Disabled', ':focus-within / error / disabled'],
            ['Value', 'value={…}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
