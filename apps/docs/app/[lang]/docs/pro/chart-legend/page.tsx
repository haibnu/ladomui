import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ChartLegendPlayground } from './ChartLegendPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The key of a chart as a small table: a series dot, the name, value columns and an optional change, lined up row by row.',
    behavior: 'Behavior',
    behaviorItems: [
      'Dots take the chart colors in the order of the rows, so they match a BarChart or DonutChart given the same order; a row can set its own color.',
      'Value columns are right-aligned with tabular figures; the change is a small plain Delta.',
      'Columns line up across rows; long names are cut with an ellipsis.',
    ],
    usage: 'Usage',
    usageText: 'List the series in the chart’s order. Pass values already formatted; use columns for headings when there is more than one value.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: ['It is a table (role="table") with rows and cells; the dots are decorative.'],
    props: {
      items: '{ name, color?, values?, delta?, key? }[]: one row per series.',
      columns: 'Headings: the name’s, then one per value column and the change.',
    },
  },
  tr: {
    description: 'Bir grafiğin anahtarı, küçük bir tablo olarak: seri noktası, ad, değer sütunları ve isteğe bağlı bir değişim, satır satır hizalı.',
    behavior: 'Davranış',
    behaviorItems: [
      'Noktalar satır sırasıyla grafik renklerini alır; aynı sırayla verilen bir BarChart ya da DonutChart ile eşleşir. Bir satır kendi rengini verebilir.',
      'Değer sütunları tabular rakamlarla sağa hizalıdır; değişim küçük, düz bir Delta’dır.',
      'Sütunlar satırlar boyunca hizalanır; uzun adlar üç noktayla kesilir.',
    ],
    usage: 'Kullanım',
    usageText: 'Serileri grafikteki sırayla listeleyin. Değerleri biçimlendirilmiş verin; birden çok değerde başlıklar için columns kullanın.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: ['Satır ve hücrelerden oluşan bir tablodur (role="table"); noktalar dekoratiftir.'],
    props: {
      items: '{ name, color?, values?, delta?, key? }[]: seri başına bir satır.',
      columns: 'Başlıklar: adınki, sonra her değer sütunu ve değişim için bir tane.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Chart Legend' };
}

export default async function ChartLegendPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Chart Legend" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <ChartLegendPlayground />
        <h2 id="behavior">{c.behavior}</h2>
        <ul>
          {c.behaviorItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['items', 'ChartLegendItem[]', '—'],
              ['columns', 'ReactNode[]', '—'],
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
