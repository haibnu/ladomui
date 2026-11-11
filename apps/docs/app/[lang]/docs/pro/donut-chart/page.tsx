import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { DonutChartPlayground } from './DonutChartPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Parts of a whole as a ring in the chart colors, with a total in the middle; small ones with a caption read as small multiples. Pair it with a ChartLegend.',
    behavior: 'Behavior',
    behaviorItems: [
      'Segments start at the top and go clockwise in the chart colors (--color-chart-1…6, from the brand), with a small gap between them, on a surface/level-3 track.',
      'small is 64px, medium 96px, large 160px (two, three and five xxlarge spaces). The label and sublabel sit in the middle on medium and large; small shows a caption under the ring instead.',
      'On hover the segment stays and the others fade; a tooltip gives its name, value and share.',
      'The ring sweeps in segment by segment; under prefers-reduced-motion it shows at once.',
    ],
    usage: 'Usage',
    usageText: 'Keep to six parts or fewer; merge the rest into “Other”. Put the names and values in a ChartLegend next to it, in the same order, so the colors match. For a series over time, line up small donuts with a caption each.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: ['The donut is a figure named by title; the ring is hidden and a visually hidden table lists each part with its value and share.', 'Colors alone do not tell the parts apart: always show a legend or the values next to it.'],
    props: {
      title: 'Names the chart and captions its data table.',
      data: '{ name, value, color? }[]: the parts.',
      size: 'small, medium or large.',
      label: 'In the middle (medium, large), e.g. the total.',
      sublabel: 'Under the label, e.g. “Total”.',
      caption: 'Under the ring, e.g. the month.',
      format: 'Formats values in the tooltip and the table.',
      tooltip: 'Shows the hover tooltip.',
      animate: 'Sweeps the ring in.',
      locale: 'Locale of the default formats.',
    },
  },
  tr: {
    description: 'Bir bütünün parçaları, grafik renkleriyle bir halka olarak; ortada toplam. Küçükleri altlarındaki başlıkla küçük çoklu grafik olarak okunur. Bir ChartLegend ile birlikte kullanın.',
    behavior: 'Davranış',
    behaviorItems: [
      'Parçalar tepeden başlayıp saat yönünde, grafik renkleriyle (--color-chart-1…6, marka renginden), aralarında küçük bir boşlukla surface/level-3 bir iz üstünde ilerler.',
      'small 64px, medium 96px, large 160px’tir (iki, üç ve beş xxlarge boşluk). label ve sublabel medium ve large’da ortadadır; small bunun yerine halkanın altında bir caption gösterir.',
      'Hover’da parça kalır, diğerleri soluklaşır; ipucu adını, değerini ve payını verir.',
      'Halka parça parça dönerek gelir; prefers-reduced-motion’da hemen görünür.',
    ],
    usage: 'Kullanım',
    usageText: 'Altıdan az parça kullanın; kalanını “Diğer”de birleştirin. Adları ve değerleri aynı sırayla yanına bir ChartLegend olarak koyun, renkler eşleşsin. Zamana yayılan bir seri için her biri başlıklı küçük halkaları yan yana dizin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: ['Halka grafiği title ile adlandırılan bir figure’dür; halka gizlidir, görsel olarak gizli bir tablo her parçayı değeri ve payıyla listeler.', 'Parçaları yalnızca renk ayırmaz: yanına her zaman bir lejant ya da değerler koyun.'],
    props: {
      title: 'Grafiği adlandırır ve veri tablosunun başlığıdır.',
      data: '{ name, value, color? }[]: parçalar.',
      size: 'small, medium ya da large.',
      label: 'Ortada (medium, large), örneğin toplam.',
      sublabel: 'Label’ın altında, örneğin “Toplam”.',
      caption: 'Halkanın altında, örneğin ay.',
      format: 'İpucundaki ve tablodaki değerleri biçimlendirir.',
      tooltip: 'Hover ipucunu gösterir.',
      animate: 'Halkayı dönerek getirir.',
      locale: 'Varsayılan biçimlerin dili.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Donut Chart' };
}

export default async function DonutChartPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Donut Chart" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <DonutChartPlayground />
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
              ['title', 'string', '—'],
              ['data', 'DonutSegment[]', '—'],
              ['size', "'small' | 'medium' | 'large'", "'medium'"],
              ['label', 'ReactNode', '—'],
              ['sublabel', 'ReactNode', '—'],
              ['caption', 'ReactNode', '—'],
              ['format', '(value: number) => string', 'Intl.NumberFormat'],
              ['tooltip', 'boolean', 'true'],
              ['animate', 'boolean', 'true'],
              ['locale', 'string', '—'],
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
