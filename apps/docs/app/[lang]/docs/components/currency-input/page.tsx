import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { CurrencyInputPlayground } from './CurrencyInputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'An amount field that formats money as it is typed, with a currency picker that can be turned off.',
    look: 'Look',
    lookText: 'The Input box in Medium and Small. The currency symbol is its Leading Text (or Trailing Text where the locale writes it after the amount, as in 1.234,56 €), and the picker at the end opens the Selectbox list: a Dropdown of Cells with the code and the currency name. Default, focus, error and disabled follow Input. There is no Figma drawing yet.',
    usage: 'Usage',
    usageText: 'value is a number, or null when the field is empty. The field adds a group separator every three digits while you type, keeps one decimal separator (both “.” and “,” type it, unless one of them is the group separator) and stops at the currency’s fraction digits: 2 for USD, 0 for JPY. On blur it shows every fraction digit (1.250 → 1,250.00). locale sets the separators and where the symbol goes.',
    fixed: 'Fixed currency',
    fixedText: 'currencySelect={false} removes the picker; the currency still sets the symbol and the fraction digits. showSymbol={false} hides the symbol too.',
    api: 'API reference',
    apiText: 'CurrencyInput also takes Input’s size, error, disabled and iconLeft, and the other input attributes.',
    a11y: 'Accessibility',
    a11yItems: [
      'The amount is a text field with inputMode="decimal", so phones open the number keyboard and screen readers read the formatted amount.',
      'The picker is a select-only combobox, as in Selectbox: arrows, Home/End, Enter/Space, Escape and a letter jump to a code. Translate currencyLabel.',
      'With name, the amount is submitted as a plain number (1250.5), not as the formatted text.',
    ],
    mapping: 'Figma to code',
    props: {
      value: 'The amount, or null.',
      defaultValue: 'The first amount (uncontrolled).',
      onValueChange: 'Called with the amount or null.',
      currency: 'ISO 4217 code.',
      defaultCurrency: 'The first currency (uncontrolled); the first of currencies by default.',
      onCurrencyChange: 'Called with the picked code.',
      currencies: 'The codes in the picker.',
      currencySelect: 'Shows the picker.',
      showSymbol: 'Shows the currency symbol.',
      locale: 'Separators and the symbol’s place.',
      decimals: 'Fraction digits; the currency’s own by default.',
      allowNegative: 'Lets a leading minus in.',
      name: 'Form name of the amount (a plain number).',
      currencyName: 'Form name of the currency code.',
      size: 'Figma 👕 Size.',
      currencyLabel: 'Name of the picker.',
    },
  },
  tr: {
    description: 'Parayı yazarken biçimlendiren bir tutar alanı; para birimi seçicisi istenirse kapatılır.',
    look: 'Görünüm',
    lookText: 'Medium ve Small Input kutusu. Para birimi simgesi Leading Text’tir (yerel ayar tutarın arkasına yazıyorsa, 1.234,56 € gibi, Trailing Text). Sondaki seçici Selectbox listesini açar: kod ve para biriminin adıyla Cell’lerden oluşan bir Dropdown. Default, focus, hata ve devre dışı Input’u izler. Henüz Figma çizimi yok.',
    usage: 'Kullanım',
    usageText: 'value bir sayıdır, alan boşsa null. Alan yazarken her üç basamağa bir binlik ayırıcı koyar, tek bir ondalık ayırıcı tutar (biri binlik ayırıcı değilse hem “.” hem “,” ondalık yazar) ve para biriminin kuruş basamağında durur: USD’de 2, JPY’de 0. Alandan çıkınca tüm kuruş basamaklarını gösterir (1.250 → 1.250,00). locale ayırıcıları ve simgenin yerini belirler.',
    fixed: 'Sabit para birimi',
    fixedText: 'currencySelect={false} seçiciyi kaldırır; para birimi yine simgeyi ve kuruş basamağını belirler. showSymbol={false} simgeyi de gizler.',
    api: 'API',
    apiText: 'CurrencyInput, Input’un size, error, disabled ve iconLeft prop’larını ve diğer input özniteliklerini de alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Tutar inputMode="decimal" olan bir metin alanıdır; telefonlarda sayı klavyesi açılır, ekran okuyucular biçimli tutarı okur.',
      'Seçici, Selectbox’taki gibi select-only bir combobox’tır: oklar, Home/End, Enter/Space, Escape ve harfle koda atlama. currencyLabel’ı çevirin.',
      'name verilirse tutar formda biçimli metin olarak değil, düz sayı olarak gönderilir (1250.5).',
    ],
    mapping: 'Figma’dan koda',
    props: {
      value: 'Tutar ya da null.',
      defaultValue: 'İlk tutar (kontrolsüz).',
      onValueChange: 'Tutar ya da null ile çağrılır.',
      currency: 'ISO 4217 kodu.',
      defaultCurrency: 'İlk para birimi (kontrolsüz); varsayılan currencies’in ilki.',
      onCurrencyChange: 'Seçilen kodla çağrılır.',
      currencies: 'Seçicideki kodlar.',
      currencySelect: 'Seçiciyi gösterir.',
      showSymbol: 'Para birimi simgesini gösterir.',
      locale: 'Ayırıcılar ve simgenin yeri.',
      decimals: 'Kuruş basamağı; varsayılan para biriminin kendi değeri.',
      allowNegative: 'Baştaki eksi işaretine izin verir.',
      name: 'Tutarın form adı (düz sayı).',
      currencyName: 'Para birimi kodunun form adı.',
      size: 'Figma 👕 Size.',
      currencyLabel: 'Seçicinin adı.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Currency Input' };
}

export default async function CurrencyInputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Currency Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1133:303" />
        <h2 id="playground">{t.component.playground}</h2>
        <CurrencyInputPlayground />
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [amount, setAmount] = useState<number | null>(null);\nconst [currency, setCurrency] = useState('TRY');\n\n<FormField label="Amount">\n  <CurrencyInput\n    value={amount}\n    onValueChange={setAmount}\n    currency={currency}\n    onCurrencyChange={setCurrency}\n    currencies={['TRY', 'USD', 'EUR']}\n    locale="tr-TR"\n  />\n</FormField>`}
          />
          <h3 id="fixed">{c.fixed}</h3>
          <p>{c.fixedText}</p>
          <CodeBlock code={`<CurrencyInput currency="EUR" currencySelect={false} locale="de-DE" />`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'number | null', '—'],
              ['defaultValue', 'number | null', 'null'],
              ['onValueChange', '(value: number | null) => void', '—'],
              ['currency', 'string', '—'],
              ['defaultCurrency', 'string', 'currencies[0]'],
              ['onCurrencyChange', '(currency: string) => void', '—'],
              ['currencies', 'string[]', "['USD', 'EUR', 'GBP', 'TRY']"],
              ['currencySelect', 'boolean', 'true'],
              ['showSymbol', 'boolean', 'true'],
              ['locale', 'string', "'en-US'"],
              ['decimals', 'number', '—'],
              ['allowNegative', 'boolean', 'false'],
              ['name', 'string', '—'],
              ['currencyName', 'string', '—'],
              ['size', "'medium' | 'small'", "'medium'"],
              ['currencyLabel', 'string', "'Currency'"],
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
            ['Input Leading / Trailing Text', 'showSymbol (place from locale)'],
            ['Dropdown + Cell (Selectbox list)', 'currencySelect, currencies'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
