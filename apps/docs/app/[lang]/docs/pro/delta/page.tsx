import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { DeltaPlayground } from './DeltaPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A change with a trend arrow, as text or a pill: green when it is good news, red when it is bad. StatCard, BarList and the charts use it.',
    behavior: 'Behavior',
    behaviorItems: [
      'The arrow leans up and right for a rise, down and right for a fall, and lies flat for no change.',
      'The color says whether the change is good, not which way it went: a falling churn is success. Up is success and down is error unless you set tone.',
      'Its text reaches 4.5:1 on the surfaces in both themes: the success shade is darkened in Light and the brighter success is used in Dark. The pill is a see-through fill of the same tone.',
      'The six chart colors under it (--color-chart-1…6) come from the brand color: change it with Customize and they follow. Not in Figma yet.',
    ],
    usage: 'Usage',
    usageText: 'Pass the change already formatted, with its sign. Use the pill in tables and lists, plain text under a big number; add label for the comparison (“vs last month”).',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: ['The arrow is decorative; the value and the label carry the meaning, so keep the sign in the value.', 'Do not rely on the color alone: the arrow and the sign say the direction.'],
    props: {
      value: 'The change, already formatted.',
      direction: 'up, down or flat; turns the arrow.',
      tone: 'success, error or neutral; by default up is success, down is error.',
      variant: 'pill: on a soft fill of its tone; plain: text only.',
      size: 'medium or small.',
      label: 'Words after it, outside the pill.',
    },
  },
  tr: {
    description: 'Trend oklu bir değişim, metin ya da hap olarak: iyi haberse yeşil, kötü haberse kırmızı. StatCard, BarList ve grafikler bunu kullanır.',
    behavior: 'Davranış',
    behaviorItems: [
      'Ok, artışta sağ yukarı, düşüşte sağ aşağı eğilir; değişim yoksa yatay durur.',
      'Renk değişimin yönünü değil, iyi olup olmadığını söyler: düşen ayrılma oranı success’tir. tone verilmezse yukarı success, aşağı error olur.',
      'Metni iki temada da yüzeylerde 4.5:1’e ulaşır: Light’ta success tonu koyulaştırılır, Dark’ta daha parlak success kullanılır. Hap, aynı tonun şeffaf bir dolgusudur.',
      'Altındaki altı grafik rengi (--color-chart-1…6) marka renginden türetilir: Customize ile değiştirin, onlar da değişir. Henüz Figma’da yok.',
    ],
    usage: 'Kullanım',
    usageText: 'Değişimi işaretiyle birlikte biçimlendirilmiş verin. Tablo ve listelerde hap, büyük bir rakamın altında düz metin kullanın; karşılaştırma için label ekleyin (“geçen aya göre”).',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: ['Ok dekoratiftir; anlamı değer ve etiket taşır, bu yüzden işareti değerde tutun.', 'Yalnızca renge güvenmeyin: yönü ok ve işaret söyler.'],
    props: {
      value: 'Biçimlendirilmiş değişim.',
      direction: 'up, down ya da flat; oku çevirir.',
      tone: 'success, error ya da neutral; varsayılanda yukarı success, aşağı error.',
      variant: 'pill: tonunun soluk dolgusunda; plain: yalnızca metin.',
      size: 'medium ya da small.',
      label: 'Hapın dışında, sonrasındaki metin.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Delta' };
}

export default async function DeltaPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Delta" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <DeltaPlayground />
        <h2 id="behavior">{c.behavior}</h2>
        <ul>
          {c.behaviorItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock code={`<Delta value="+12.4%" direction="up" label="vs last month" />\n<Delta value="−31.7%" direction="down" variant="pill" size="small" />`} />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['value', 'ReactNode', '—'],
              ['direction', "'up' | 'down' | 'flat'", '—'],
              ['tone', "'success' | 'error' | 'neutral'", 'from direction'],
              ['variant', "'pill' | 'plain'", "'plain'"],
              ['size', "'medium' | 'small'", "'medium'"],
              ['label', 'ReactNode', '—'],
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
