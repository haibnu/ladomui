import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { FunnelChartPlayground } from './FunnelChartPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A stepped funnel of stages, as candidates → interviewed → offers → hired: each stage’s value and change above, a block as tall as its share of the first stage, and a slanted step down to the next.',
    behavior: 'Behavior',
    behaviorItems: [
      'Stages share the width evenly. Each block is as tall as its value against the first stage; the step to the next stage is a soft tint of the same chart color.',
      'Above each block: the stage name, the value in the H4 style and an optional Delta pill; under it an optional caption.',
      'On hover the stage stays and the others fade; the tooltip gives the value and its share of the first stage and of the stage before.',
      'Blocks rise one after another; under prefers-reduced-motion they show at once.',
    ],
    usage: 'Usage',
    usageText: 'List stages from the widest to the narrowest. Use labels to translate the tooltip shares. Put it in a Card with the funnel’s name as the title.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: ['The funnel is a figure named by title; the drawing is hidden and a visually hidden table lists each stage with its value and its share of the first.'],
    props: {
      title: 'Names the chart and captions its data table.',
      stages: '{ name, value, delta?, caption?, key? }[]: the stages, widest first.',
      height: 'Height of the blocks in px.',
      color: 'A CSS color; the first chart color by default.',
      format: 'Formats the values.',
      tooltip: 'Shows the hover tooltip.',
      animate: 'Raises the blocks in.',
      labels: '{ ofFirst, ofPrevious }: words for the tooltip shares.',
      locale: 'Locale of the default formats.',
    },
  },
  tr: {
    description: 'Aşamalardan oluşan basamaklı bir huni, aday → görüşülen → teklif → işe alınan gibi: her aşamanın değeri ve değişimi üstte, ilk aşamaya göre payı kadar yüksek bir blok ve sonrakine inen eğik bir basamak.',
    behavior: 'Davranış',
    behaviorItems: [
      'Aşamalar genişliği eşit paylaşır. Her blok değerinin ilk aşamaya oranı kadar yüksektir; sonraki aşamaya inen basamak aynı grafik renginin soluk bir tonudur.',
      'Her bloğun üstünde aşamanın adı, H4 stilinde değeri ve isteğe bağlı bir Delta hapı; altında isteğe bağlı bir alt yazı bulunur.',
      'Hover’da aşama kalır, diğerleri soluklaşır; ipucu değeri, ilk aşamanın ve bir önceki aşamanın ne kadarı olduğunu verir.',
      'Bloklar sırayla yükselir; prefers-reduced-motion’da hemen görünür.',
    ],
    usage: 'Kullanım',
    usageText: 'Aşamaları en genişten en dara sıralayın. İpucundaki payları çevirmek için labels kullanın. Başlığı huninin adı olan bir Card içine koyun.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: ['Huni title ile adlandırılan bir figure’dür; çizim gizlidir, görsel olarak gizli bir tablo her aşamayı değeri ve ilk aşamaya oranıyla listeler.'],
    props: {
      title: 'Grafiği adlandırır ve veri tablosunun başlığıdır.',
      stages: '{ name, value, delta?, caption?, key? }[]: aşamalar, en genişten.',
      height: 'Blokların yüksekliği, px.',
      color: 'Bir CSS rengi; varsayılan ilk grafik rengi.',
      format: 'Değerleri biçimlendirir.',
      tooltip: 'Hover ipucunu gösterir.',
      animate: 'Blokları yükselterek getirir.',
      labels: '{ ofFirst, ofPrevious }: ipucundaki paylar için metinler.',
      locale: 'Varsayılan biçimlerin dili.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Funnel Chart' };
}

export default async function FunnelChartPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Funnel Chart" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <FunnelChartPlayground />
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
              ['stages', 'FunnelStage[]', '—'],
              ['height', 'number', '112'],
              ['color', 'string', 'var(--color-chart-1)'],
              ['format', '(value: number) => string', 'Intl.NumberFormat'],
              ['tooltip', 'boolean', 'true'],
              ['animate', 'boolean', 'true'],
              ['labels', '{ ofFirst?, ofPrevious? }', '—'],
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
