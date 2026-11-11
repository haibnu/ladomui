import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { BarListPlayground } from './BarListPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Pro bars for amounts: BarList ranks labelled values, such as headcount per department; Meter is one bar on its own, a share of a whole.',
    behavior: 'Behavior',
    behaviorItems: [
      'variant="row" makes a small table: column headings, the label and its value over a see-through bar of the brand color as long as the row’s share, then more value columns (values). It suits ranked lists such as visits per page or headcount per team; put it in a Card for its title.',
      'Bars grow in from the start when they first show, one after another; under prefers-reduced-motion they show at once.',
      'Each BarList row is a label, a level-3 track with a primary fill and the value; long labels are cut with an ellipsis.',
      'A full bar is the largest value by default; set max to compare against a total instead, e.g. all employees.',
      'display replaces the number at the end of a row, e.g. a percentage, while value still sets the bar.',
      'Meter is the same track and fill; a value above max shows a full bar.',
      'Bars grow with motion-fade-default when the values change.',
    ],
    usage: 'Usage',
    usageText:
      'Sort the items from the largest value down; BarList keeps the order you give. Keep it to about eight rows and put it in a Card with a title that says what is counted. Use Meter for a single share, such as attendance or a leave balance, next to a text label.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'BarList is a <ul>; every row reads its label and value, and the bar itself is hidden from assistive technology.',
      'Meter has role="meter" with aria-valuenow, aria-valuemin and aria-valuemax; name it with aria-label or aria-labelledby.',
      'The bars use one color, so the label and value carry the meaning, not the color.',
    ],
    props: {
      variant: 'BarList: track (label, bar, value) or row (a table with the bar behind each row).',
      columns: 'BarList (row): headings of the label, the value and each extra column.',
      animate: 'BarList: grows the bars in when they first show.',
      items: 'BarList: the rows, { key?, label, value, display?, values? }; values are the extra columns of the row variant.',
      max: 'BarList: the value of a full bar, the largest value by default. Meter: the whole, 100 by default.',
      value: 'Meter: the amount.',
      'aria-label': 'Meter: names it for assistive technology.',
    },
  },
  tr: {
    description: 'Miktarlar için Pro çubuklar: BarList etiketli değerleri sıralar, örneğin departman başına çalışan sayısı; Meter tek başına bir çubuktur, bir bütünün payı.',
    behavior: 'Davranış',
    behaviorItems: [
      'variant="row" küçük bir tablo yapar: sütun başlıkları, satırın payı kadar uzanan şeffaf bir marka rengi çubuğunun üstünde etiket ve değeri, ardından ek değer sütunları (values). Sayfa başına ziyaret ya da ekip başına çalışan gibi sıralı listelere uyar; başlığı için bir Card içine koyun.',
      'Çubuklar ilk göründüklerinde baştan büyüyerek, sırayla gelir; prefers-reduced-motion’da hemen görünür.',
      'BarList’in her satırı bir etiket, primary dolgulu level-3 bir iz ve değerden oluşur; uzun etiketler üç noktayla kesilir.',
      'Varsayılan olarak dolu çubuk en büyük değerdir; bunun yerine bir toplamla, örneğin tüm çalışanlarla karşılaştırmak için max verin.',
      'display, satırın sonundaki sayının yerine geçer (örneğin bir yüzde); çubuğu yine value belirler.',
      'Meter aynı iz ve dolguyu kullanır; max’ı aşan değer dolu bir çubuk gösterir.',
      'Değerler değişince çubuklar motion-fade-default ile uzar.',
    ],
    usage: 'Kullanım',
    usageText:
      'Öğeleri büyükten küçüğe sıralayın; BarList verdiğiniz sırayı korur. Sekiz satır civarında tutun ve neyin sayıldığını söyleyen bir başlıkla bir Card içine koyun. Katılım ya da izin bakiyesi gibi tek bir pay için metin etiketinin yanında Meter kullanın.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'BarList bir <ul>’dir; her satır etiketini ve değerini okur, çubuğun kendisi yardımcı teknolojilerden gizlenir.',
      'Meter, aria-valuenow, aria-valuemin ve aria-valuemax ile role="meter" taşır; aria-label ya da aria-labelledby ile ad verin.',
      'Çubuklar tek renk kullanır; anlamı renk değil, etiket ve değer taşır.',
    ],
    props: {
      variant: 'BarList: track (etiket, çubuk, değer) ya da row (çubuğun satırın arkasında olduğu tablo).',
      columns: 'BarList (row): etiketin, değerin ve her ek sütunun başlığı.',
      animate: 'BarList: çubukları ilk göründüklerinde büyüterek getirir.',
      items: 'BarList: satırlar, { key?, label, value, display?, values? }; values, row görünümünün ek sütunlarıdır.',
      max: 'BarList: dolu çubuğun değeri, varsayılanı en büyük değer. Meter: bütün, varsayılanı 100.',
      value: 'Meter: miktar.',
      'aria-label': 'Meter: yardımcı teknolojiler için ad verir.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Bar List' };
}

export default async function BarListPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Bar List" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <BarListPlayground />
        <h2 id="behavior">{c.behavior}</h2>
        <ul>
          {c.behaviorItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const rows = departments\n  .map((d) => ({ key: d.id, label: d.name, value: d.headcount }))\n  .sort((a, b) => b.value - a.value);\n\n<Card title="Headcount by department">\n  <BarList items={rows} />\n</Card>\n\n<Meter value={leaveUsed} max={leaveAllowance} aria-label="Annual leave used" />`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['items', 'BarListItem[]', '—'],
              ['max', 'number', 'largest value / 100'],
              ['variant', "'track' | 'row'", "'track'"],
              ['columns', 'ReactNode[]', '—'],
              ['animate', 'boolean', 'true'],
              ['value', 'number', '—'],
              ['aria-label', 'string', '—'],
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
      </DocPage>
    </ViewProvider>
  );
}
