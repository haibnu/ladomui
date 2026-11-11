import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { BarChartPlayground } from './BarChartPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Values per category as vertical bars: one series, several side by side, or stacked. Hand-built SVG in the chart colors, with a grid, a hover tooltip and bars that grow in.',
    behavior: 'Behavior',
    behaviorItems: [
      'Series take the chart colors in order (--color-chart-1…6, derived from the brand color), so they follow Customize and the dark theme; give a series its own color when it means something.',
      'The grid has about four nice steps (1, 2, 2.5 or 5 times a power of ten) from zero, labelled with compact numbers (1.5K); negative values go below the zero line.',
      'grouped puts the series side by side in each band; stacked puts them on top of each other, with the top one rounded.',
      'On hover the band is highlighted and a tooltip lists every series for that category. When bands get narrow, every other category label is shown.',
      'Bars grow from the baseline one band after another; under prefers-reduced-motion they show at once.',
    ],
    usage: 'Usage',
    usageText: 'Give the chart a title (it names the figure and captions its data table) and pass format for the tooltip, e.g. currency. Use a legend only with more than one series. Put it in a Card with the title as the card title.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The chart is a figure named by title; the drawing is hidden from assistive technology and a visually hidden table holds the same data.',
      'Series are told apart by color and order; with more than three series, add the values to a list or table next to the chart.',
    ],
    props: {
      title: 'Names the chart and captions its data table.',
      categories: 'Names of the bands, e.g. months.',
      series: '{ name, data, color? }[]: the values per category.',
      mode: 'grouped: side by side; stacked: on top of each other.',
      height: 'Height of the plot in px.',
      format: 'Formats values in the tooltip and the table.',
      axisFormat: 'Formats the grid labels; compact numbers by default.',
      legend: 'Shows the series names above the plot.',
      tooltip: 'Shows the hover tooltip and band highlight.',
      animate: 'Grows the bars in.',
      locale: 'Locale of the default number formats.',
    },
  },
  tr: {
    description: 'Kategori başına değerler dikey çubuklar olarak: tek seri, yan yana birkaç seri ya da yığılmış. Grafik renkleriyle elde çizilmiş SVG; ızgara, hover ipucu ve büyüyerek gelen çubuklar.',
    behavior: 'Davranış',
    behaviorItems: [
      'Seriler sırayla grafik renklerini alır (--color-chart-1…6, marka renginden türer); Customize ve koyu temayla değişir. Bir seri bir şey ifade ediyorsa ona kendi rengini verin.',
      'Izgara sıfırdan başlayan dört kadar düzgün adımdan oluşur (10’un kuvvetinin 1, 2, 2,5 ya da 5 katı) ve kısa sayılarla etiketlenir (1,5 B); negatif değerler sıfır çizgisinin altına iner.',
      'grouped serileri her bantta yan yana, stacked üst üste koyar; en üstteki yuvarlatılır.',
      'Hover’da bant vurgulanır ve bir ipucu o kategorideki tüm serileri listeler. Bantlar daraldığında kategori etiketleri birer atlayarak gösterilir.',
      'Çubuklar taban çizgisinden bant bant büyüyerek gelir; prefers-reduced-motion’da hemen görünür.',
    ],
    usage: 'Kullanım',
    usageText: 'Grafiğe bir title verin (figürü adlandırır ve veri tablosunun başlığı olur), ipucu için format verin, örneğin para birimi. Lejantı yalnızca birden çok seride kullanın. Başlığı kart başlığı olarak bir Card içine koyun.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Grafik title ile adlandırılan bir figure’dür; çizim yardımcı teknolojilerden gizlenir, aynı veriyi görsel olarak gizli bir tablo taşır.',
      'Seriler renk ve sırayla ayrılır; üçten fazla seride değerleri grafiğin yanına bir liste ya da tablo olarak da ekleyin.',
    ],
    props: {
      title: 'Grafiği adlandırır ve veri tablosunun başlığıdır.',
      categories: 'Bantların adları, örneğin aylar.',
      series: '{ name, data, color? }[]: kategori başına değerler.',
      mode: 'grouped: yan yana; stacked: üst üste.',
      height: 'Çizim alanının yüksekliği, px.',
      format: 'İpucundaki ve tablodaki değerleri biçimlendirir.',
      axisFormat: 'Izgara etiketlerini biçimlendirir; varsayılan kısa sayılar.',
      legend: 'Seri adlarını çizimin üstünde gösterir.',
      tooltip: 'Hover ipucunu ve bant vurgusunu gösterir.',
      animate: 'Çubukları büyüterek getirir.',
      locale: 'Varsayılan sayı biçimlerinin dili.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Bar Chart' };
}

export default async function BarChartPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Bar Chart" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <BarChartPlayground />
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
            code={`<Card title="Hires and exits">\n  <BarChart\n    title="Hires and exits per month"\n    categories={['Jan', 'Feb', 'Mar']}\n    series={[\n      { name: 'Hires', data: [8, 12, 6] },\n      { name: 'Exits', data: [3, 5, 4] },\n    ]}\n  />\n</Card>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['title', 'string', '—'],
              ['categories', 'ReactNode[]', '—'],
              ['series', 'BarChartSeries[]', '—'],
              ['mode', "'grouped' | 'stacked'", "'grouped'"],
              ['height', 'number', '200'],
              ['format', '(value: number) => string', 'Intl.NumberFormat'],
              ['axisFormat', '(value: number) => string', 'compact'],
              ['legend', 'boolean', 'true'],
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
