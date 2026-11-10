import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { GsmInputPlayground } from './GsmInputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A phone number field with a country picker. A pasted number loses its country code and leading 0.',
    look: 'Look',
    lookText: 'Input 🎛 Type=GSM: the flag with a 12px chevron opens the country list, then the calling code and the number as one text, “90 (5XX) XXX XX XX”. The list is the Selectbox one: a Dropdown of Cells with the flag, the country name and its code. Default, hover, focus, typed, error and disabled follow Input.',
    paste: 'Pasting a number',
    pasteText: 'A number pasted into an empty or fully selected field is cleaned before it is written: “+90 532 123 45 67”, “0090 532 …”, “0532 123 45 67” and “905321234567” all become (532) 123 45 67. When the code belongs to another listed country (“+1 415 …”), the field switches to it. A leading 0 is dropped while typing too, and the number stops at the country’s length.',
    usage: 'Usage',
    usageText: 'value is the number in E.164 (“+905321234567”), or null when the field is empty. onValueChange also gives the country, the national digits and whether the number is complete.',
    countries: 'Countries',
    countriesText: 'Figma draws the Turkish and US flags, so the default list is TR and US. Pass countries to add more: each has its code, calling code and a format with # for every digit; a country without a flag shows its code. countrySelect={false} fixes the country.',
    api: 'API reference',
    apiText: 'GsmInput also takes Input’s size, error and disabled, and the other input attributes.',
    a11y: 'Accessibility',
    a11yItems: [
      'The number is a tel field (inputMode="tel", autocomplete="tel-national"), so phones open the phone keypad and browsers can fill it.',
      'The country picker is a select-only combobox, as in Selectbox: arrows, Home/End, Enter/Space, Escape and a letter jump to a country. Translate countryLabel.',
      'With name, the number is submitted in E.164, not as the formatted text.',
    ],
    mapping: 'Figma to code',
    props: {
      value: 'The number in E.164, or null.',
      defaultValue: 'The first number (uncontrolled).',
      onValueChange: 'Called with the number and its country, national digits and completeness.',
      country: 'ISO 3166-1 alpha-2 code.',
      defaultCountry: 'The first country (uncontrolled); the first of countries by default.',
      onCountryChange: 'Called with the picked code.',
      countries: 'The countries in the list.',
      countrySelect: 'Shows the country list.',
      locale: 'Language of the country names.',
      name: 'Form name of the number (E.164).',
      countryName: 'Form name of the country code.',
      size: 'Figma 👕 Size.',
      countryLabel: 'Name of the picker.',
    },
  },
  tr: {
    description: 'Ülke seçicili bir telefon numarası alanı. Yapıştırılan numaranın ülke kodu ve baştaki 0’ı silinir.',
    look: 'Görünüm',
    lookText: 'Input 🎛 Type=GSM: 12px oklu bayrak ülke listesini açar, ardından ülke kodu ve numara tek bir metin olarak gelir, “90 (5XX) XXX XX XX”. Liste Selectbox’ınkidir: bayrak, ülke adı ve koduyla Cell’lerden oluşan bir Dropdown. Default, hover, focus, typed, hata ve devre dışı Input’u izler.',
    paste: 'Numara yapıştırma',
    pasteText: 'Boş ya da tamamen seçili alana yapıştırılan numara yazılmadan önce temizlenir: “+90 532 123 45 67”, “0090 532 …”, “0532 123 45 67” ve “905321234567” hepsi (532) 123 45 67 olur. Kod listedeki başka bir ülkenin koduysa (“+1 415 …”) alan o ülkeye geçer. Baştaki 0 yazarken de silinir ve numara ülkenin uzunluğunda durur.',
    usage: 'Kullanım',
    usageText: 'value numaranın E.164 hâlidir (“+905321234567”), alan boşsa null. onValueChange ülkeyi, ulusal basamakları ve numaranın tamam olup olmadığını da verir.',
    countries: 'Ülkeler',
    countriesText: 'Figma’da Türkiye ve ABD bayrakları çizili, bu yüzden varsayılan liste TR ve US. Başka ülke eklemek için countries verin: her birinin kodu, ülke kodu ve her basamak için # içeren bir formatı olur; bayrağı olmayan ülke kodunu gösterir. countrySelect={false} ülkeyi sabitler.',
    api: 'API',
    apiText: 'GsmInput, Input’un size, error ve disabled prop’larını ve diğer input özniteliklerini de alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Numara bir tel alanıdır (inputMode="tel", autocomplete="tel-national"); telefonlarda tuş takımı açılır, tarayıcılar alanı doldurabilir.',
      'Ülke seçici, Selectbox’taki gibi select-only bir combobox’tır: oklar, Home/End, Enter/Space, Escape ve harfle ülkeye atlama. countryLabel’ı çevirin.',
      'name verilirse numara formda biçimli metin olarak değil, E.164 olarak gönderilir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      value: 'E.164 numara ya da null.',
      defaultValue: 'İlk numara (kontrolsüz).',
      onValueChange: 'Numara, ülkesi, ulusal basamakları ve tamamlığıyla çağrılır.',
      country: 'ISO 3166-1 alpha-2 kodu.',
      defaultCountry: 'İlk ülke (kontrolsüz); varsayılan countries’in ilki.',
      onCountryChange: 'Seçilen kodla çağrılır.',
      countries: 'Listedeki ülkeler.',
      countrySelect: 'Ülke listesini gösterir.',
      locale: 'Ülke adlarının dili.',
      name: 'Numaranın form adı (E.164).',
      countryName: 'Ülke kodunun form adı.',
      size: 'Figma 👕 Size.',
      countryLabel: 'Seçicinin adı.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'GSM Input' };
}

export default async function GsmInputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={`${t.nav.components} / Input`} title="GSM Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1591:5" />
        <h2 id="playground">{t.component.playground}</h2>
        <GsmInputPlayground />
        <h2 id="paste">{c.paste}</h2>
        <p>{c.pasteText}</p>
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [phone, setPhone] = useState<string | null>(null);\n\n<FormField label="Phone">\n  <GsmInput value={phone} onValueChange={setPhone} name="phone" />\n</FormField>`}
          />
          <h3 id="countries">{c.countries}</h3>
          <p>{c.countriesText}</p>
          <CodeBlock
            code={`import { DEFAULT_COUNTRIES, GsmInput } from '@/components/ladom';\n\n<GsmInput\n  countries={[\n    ...DEFAULT_COUNTRIES,\n    { code: 'DE', dial: '49', format: '#### #######' },\n  ]}\n/>`}
          />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'string | null', '—'],
              ['defaultValue', 'string | null', 'null'],
              ['onValueChange', '(value, { country, national, complete }) => void', '—'],
              ['country', 'string', '—'],
              ['defaultCountry', 'string', 'countries[0]'],
              ['onCountryChange', '(country: string) => void', '—'],
              ['countries', 'GsmCountry[]', 'DEFAULT_COUNTRIES (TR, US)'],
              ['countrySelect', 'boolean', 'true'],
              ['locale', 'string', "'en-US'"],
              ['name', 'string', '—'],
              ['countryName', 'string', '—'],
              ['size', "'medium' | 'small'", "'medium'"],
              ['countryLabel', 'string', "'Country'"],
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
            ['Input 🎛 Type = GSM', '<GsmInput>'],
            ['👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['🕹 State = Hover / Focus / Typed', ':hover / :focus-within / value'],
            ['Error / Disable', 'error / disabled'],
            ['Flags / TR, Flags / EN', "countries: 'TR', 'US'"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
