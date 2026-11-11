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
    description: 'One number of a Pro dashboard: a small label with an icon, the value and a note or a trend.',
    behavior: 'Behavior',
    behaviorItems: [
      'It is the Card surface: level 1, the card radius, padding and the card style 1 shadow.',
      'The value uses the H4 content style with tabular figures, so numbers in a row line up as they change.',
      'The trend sits next to the value and wraps under it when the card is narrow.',
      'The note is a footnote under the value in the low-emphasis color.',
    ],
    usage: 'Usage',
    usageText:
      'Put three or four StatCards in a row at the top of a dashboard. Pass the value already formatted (Intl.NumberFormat, units, currency). For a change, use a Small Badge as the trend: success for good news, default when it is neutral.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The label, value, trend and note are read in that order; keep the label short and clear on its own.',
      'The icon is decorative and hidden from assistive technology.',
      'A trend that is only a sign or an arrow needs words for screen readers, e.g. a visually hidden “up 2 from last month”.',
    ],
    props: {
      label: 'What the number is.',
      value: 'The number, already formatted.',
      icon: 'An icon element before the label (16px).',
      note: 'A footnote under the value.',
      trend: 'Next to the value, e.g. a Small Badge with a change (“+4%”).',
    },
  },
  tr: {
    description: 'Pro dashboard’un tek bir sayısı: ikonlu küçük bir etiket, değer ve bir not ya da değişim.',
    behavior: 'Davranış',
    behaviorItems: [
      'Card yüzeyidir: level 1, kart köşe yarıçapı, iç boşluğu ve card style 1 gölgesi.',
      'Değer, tabular rakamlarla H4 içerik stilini kullanır; böylece yan yana sayılar değiştikçe hizalı kalır.',
      'Değişim değerin yanında durur, kart darsa altına geçer.',
      'Not, değerin altında düşük vurgu renginde bir dipnottur.',
    ],
    usage: 'Kullanım',
    usageText:
      'Dashboard’un üstüne yan yana üç dört StatCard koyun. Değeri biçimlendirilmiş olarak verin (Intl.NumberFormat, birim, para birimi). Bir değişimi göstermek için trend olarak Small Badge kullanın: iyi haberde success, nötr durumda default.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Etiket, değer, değişim ve not bu sırayla okunur; etiketi kısa ve tek başına anlaşılır tutun.',
      'İkon dekoratiftir, yardımcı teknolojilerden gizlenir.',
      'Yalnızca işaret ya da oktan oluşan bir değişim ekran okuyucular için metin ister, örneğin görsel olarak gizli “geçen aya göre 2 artış”.',
    ],
    props: {
      label: 'Sayının ne olduğu.',
      value: 'Biçimlendirilmiş sayı.',
      icon: 'Etiketten önceki ikon öğesi (16px).',
      note: 'Değerin altındaki dipnot.',
      trend: 'Değerin yanı, örneğin değişimi gösteren bir Small Badge (“+%4”).',
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
            code={`const fmt = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD', notation: 'compact' });\n\n<StatCard\n  label="Monthly payroll"\n  icon={<IconCurrencyDollar />}\n  value={fmt.format(payroll)}\n  trend={<Badge size="small">+3%</Badge>}\n  note="Paid on the 28th"\n/>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['label', 'ReactNode', '—'],
              ['value', 'ReactNode', '—'],
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
