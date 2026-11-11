import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { StatCardPlayground } from './StatCardPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'One number of a Pro dashboard: a big figure with its unit and change, and a small chart beside it or under it that draws in.',
    behavior: 'Behavior',
    behaviorItems: [
      'The number leads: the H2 size in bold with tabular figures, and a unit in a lighter, smaller style. A numeric value counts up from zero when the card appears; give format to shape it.',
      'The change has an arrow that leans up or down. Its color says whether the change is good (success) or bad (error), not its direction: a falling churn is good news.',
      'Four charts: area (a smooth line over a fill that fades down), line with point markers and dotted drops, steps, and bars (a bar that rose since the one before is solid, the others soft). The line never overshoots the data.',
      'Vertical puts the chart under the number, across the card to its edges; horizontal puts it beside the number with the bottoms aligned, and stacks on phones.',
      'On entrance the line draws in, the fill fades in, points pop and bars grow. Under prefers-reduced-motion everything shows at once.',
      'With hover, a dashed guide and a tooltip follow the pointer with the formatted value and its label.',
      'The chart color is primary (the brand color from Customize), success, warning or error, so it follows the theme and dark mode.',
    ],
    usage: 'Usage',
    usageText:
      'Put three or four StatCards in a row at the top of a dashboard, all in the same layout and chart kind unless one figure needs another. Pass the series as data (oldest first) and its names as labels for the tooltip.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The label, value, change and note are read in that order; while counting, screen readers get the final value only.',
      'The chart is decorative and hidden from assistive technology: say what matters in the change and the note.',
      'The arrow is decorative; the change’s text (“+12.4%”, with a label such as “vs last month”) carries the meaning.',
    ],
    props: {
      label: 'What the number is.',
      value: 'A number counts up and is formatted with format; any other node shows as it is.',
      format: 'Formats a numeric value and the count-up.',
      unit: 'Smaller text after the value (“%”, “days”).',
      delta: '{ value, direction: up | down, tone?: success | error | neutral, label? }: the change with an arrow.',
      data: 'Values of the chart, oldest first; none hides the chart.',
      chart: 'area, line, step or bars.',
      tone: 'The chart color: primary, success, warning or error.',
      layout: 'vertical: the chart under the number; horizontal: beside it.',
      labels: 'Names of the points, shown in the tooltip.',
      hover: 'Shows a guide line and a tooltip on hover.',
      animate: 'Plays the count-up and the chart entrance.',
      icon: 'An icon element before the label (16px).',
      note: 'A footnote under the value.',
      trend: 'Next to the value, e.g. a Small Badge.',
    },
  },
  tr: {
    description: 'Pro dashboard’un tek bir sayısı: birimi ve değişimiyle büyük bir rakam, yanında ya da altında çizilerek beliren küçük bir grafik.',
    behavior: 'Davranış',
    behaviorItems: [
      'Öne çıkan rakamdır: tabular rakamlarla kalın H2 boyutu, yanında daha ince ve küçük bir birim. Sayı olarak verilen değer, kart göründüğünde sıfırdan sayarak gelir; biçimi format ile verin.',
      'Değişimin yukarı ya da aşağı eğilen bir oku vardır. Rengi yönü değil, değişimin iyi (success) mi kötü (error) mü olduğunu söyler: düşen ayrılma oranı iyi haberdir.',
      'Dört grafik: alan (aşağı doğru solan dolgunun üstünde yumuşak bir çizgi), noktalı ve kesikli inişli çizgi, basamak ve çubuk (bir öncekine göre yükselen çubuk dolu, diğerleri soluk). Çizgi hiçbir zaman verinin dışına taşmaz.',
      'Dikey düzen grafiği rakamın altına, kartın kenarlarına kadar koyar; yatay düzen rakamın yanına, altları hizalı koyar ve telefonda alt alta geçer.',
      'Girişte çizgi çizilir, dolgu belirir, noktalar açılır, çubuklar uzar. prefers-reduced-motion’da hepsi bir anda görünür.',
      'hover açıkken kesikli bir kılavuz çizgi ve bir ipucu imleci izler; biçimlendirilmiş değeri ve etiketini gösterir.',
      'Grafik rengi primary (Customize’daki marka rengi), success, warning ya da error’dur; tema ve koyu modla birlikte değişir.',
    ],
    usage: 'Kullanım',
    usageText:
      'Dashboard’un üstüne yan yana üç dört StatCard koyun; bir rakam başka türlü gerektirmedikçe hepsi aynı düzen ve grafik türünde olsun. Seriyi data olarak (eskiden yeniye), noktaların adlarını ipucu için labels olarak verin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Etiket, değer, değişim ve not bu sırayla okunur; sayarken ekran okuyucular yalnızca son değeri duyar.',
      'Grafik dekoratiftir ve yardımcı teknolojilerden gizlenir: önemli olanı değişimde ve notta söyleyin.',
      'Ok dekoratiftir; anlamı değişimin metni taşır (“+12,4%”, “geçen aya göre” gibi bir etiketle).',
    ],
    props: {
      label: 'Sayının ne olduğu.',
      value: 'Sayı verilirse sayarak gelir ve format ile biçimlenir; diğer içerik olduğu gibi görünür.',
      format: 'Sayısal değeri ve sayma animasyonunu biçimlendirir.',
      unit: 'Değerden sonraki küçük metin (“%”, “gün”).',
      delta: '{ value, direction: up | down, tone?: success | error | neutral, label? }: oklu değişim.',
      data: 'Grafiğin değerleri, eskiden yeniye; verilmezse grafik görünmez.',
      chart: 'area, line, step ya da bars.',
      tone: 'Grafik rengi: primary, success, warning ya da error.',
      layout: 'vertical: grafik rakamın altında; horizontal: yanında.',
      labels: 'Noktaların adları, ipucunda görünür.',
      hover: 'Üzerine gelince kılavuz çizgi ve ipucu gösterir.',
      animate: 'Sayma ve grafik girişini oynatır.',
      icon: 'Etiketten önceki ikon öğesi (16px).',
      note: 'Değerin altındaki dipnot.',
      trend: 'Değerin yanı, örneğin bir Small Badge.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Stat Card' };
}

export default async function StatCardPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Stat Card" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <StatCardPlayground />
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
            code={`const fmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', notation: 'compact' });\n\n<StatCard\n  label="Monthly payroll"\n  value={payroll}\n  format={(n) => fmt.format(n)}\n  delta={{ value: '+3.2%', direction: 'up', label: 'vs last month' }}\n  data={lastTwelveMonths}\n  labels={monthNames}\n  layout="horizontal"\n  hover\n/>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['label', 'ReactNode', '—'],
              ['value', 'ReactNode | number', '—'],
              ['format', '(value: number) => string', 'Intl.NumberFormat'],
              ['unit', 'ReactNode', '—'],
              ['delta', 'StatCardDelta', '—'],
              ['data', 'number[]', '—'],
              ['chart', "'area' | 'line' | 'step' | 'bars'", "'area'"],
              ['tone', "'primary' | 'success' | 'warning' | 'error'", "'primary'"],
              ['layout', "'vertical' | 'horizontal'", "'vertical'"],
              ['labels', 'string[]', '—'],
              ['hover', 'boolean', 'false'],
              ['animate', 'boolean', 'true'],
              ['icon', 'ReactNode', '—'],
              ['note', 'ReactNode', '—'],
              ['trend', 'ReactNode', '—'],
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
