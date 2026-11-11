import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { CardPlayground } from './CardPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The Pro surface of a dashboard section: a title with actions at the end, the content and an optional footer.',
    behavior: 'Behavior',
    behaviorItems: [
      'The card is a level-1 surface with the card radius, padding and the card style 1 shadow.',
      'The title row holds the title and the actions at the end, centred on one line, with the description just under it; it shows when the card has a title or actions. Page styles for headings (margins) do not reach it.',
      'titleStyle sets the look: default is the card title, caption small capitals in the low-emphasis color for a section label. headingLevel only sets the HTML tag.',
      'The footer sits at the bottom, so cards of different heights in a row keep their footers aligned.',
      'Without a title the card is a plain surface for any content.',
    ],
    usage: 'Usage',
    usageText:
      'Use one Card per dashboard section and put a StatCard, BarList, table or list inside. Keep actions to one or two ghost Buttons or a Badge. Set headingLevel so the title fits the headings of the page; the default is h2.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The card is a <section> named by its title through aria-labelledby, so it shows up as a region.',
      'The title is a real heading (h2 by default); choose the level that keeps the page outline in order.',
      'Without a title the section has no name; give it an aria-label when it should be a landmark.',
    ],
    props: {
      title: 'The heading of the section; names the card.',
      description: 'A line under the title.',
      titleStyle: 'default: the card title; caption: a small-capitals section label.',
      actions: 'At the end of the title row, e.g. a ghost Button or a Badge.',
      footer: 'Under the content, e.g. a Button.',
      headingLevel: 'The title’s heading level.',
      children: 'The content.',
    },
  },
  tr: {
    description: 'Bir dashboard bölümünün Pro yüzeyi: sonunda aksiyonları olan bir başlık, içerik ve isteğe bağlı bir alt kısım.',
    behavior: 'Davranış',
    behaviorItems: [
      'Kart, kart köşe yarıçapı, iç boşluğu ve card style 1 gölgesiyle level-1 bir yüzeydir.',
      'Başlık satırında başlık ve sonda aksiyonlar tek satırda ortalı durur, açıklama hemen altındadır; kartın başlığı ya da aksiyonu varsa görünür. Sayfanın başlık stilleri (boşluklar) ona ulaşmaz.',
      'titleStyle görünümü belirler: default kart başlığıdır, caption bölüm etiketi için düşük vurgu renginde küçük büyük harflerdir. headingLevel yalnızca HTML etiketini belirler.',
      'Alt kısım en altta durur; böylece aynı satırdaki farklı yükseklikte kartların alt kısımları hizalı kalır.',
      'Başlık verilmezse kart, her türlü içerik için düz bir yüzeydir.',
    ],
    usage: 'Kullanım',
    usageText:
      'Her dashboard bölümü için bir Card kullanın; içine StatCard, BarList, tablo ya da liste koyun. Aksiyonları bir iki ghost Button ya da bir Badge ile sınırlı tutun. Başlığın sayfadaki başlıklarla uyumlu olması için headingLevel verin; varsayılanı h2’dir.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Kart, başlığıyla aria-labelledby üzerinden adlandırılan bir <section>’dır; bu yüzden bir bölge (region) olarak görünür.',
      'Başlık gerçek bir başlık öğesidir (varsayılan h2); sayfanın başlık sırasını bozmayan seviyeyi seçin.',
      'Başlık yoksa bölümün adı da yoktur; landmark olması gerekiyorsa aria-label verin.',
    ],
    props: {
      title: 'Bölümün başlığı; karta adını verir.',
      description: 'Başlığın altındaki satır.',
      titleStyle: 'default: kart başlığı; caption: küçük büyük harfli bölüm etiketi.',
      actions: 'Başlık satırının sonu, örneğin ghost Button ya da Badge.',
      footer: 'İçeriğin altı, örneğin bir Button.',
      headingLevel: 'Başlığın seviyesi.',
      children: 'İçerik.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Card' };
}

export default async function CardPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Card" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <CardPlayground />
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
            code={`import { Button } from '@ladom/ui';\nimport { Card, PersonCell } from '@ladom/ui/pro';\n\n<Card\n  title="New hires"\n  headingLevel={3}\n  actions={<Button variant="ghost" size="small">View all</Button>}\n>\n  {hires.map((p) => (\n    <PersonCell key={p.id} name={p.name} subtitle={p.title} onClick={() => open(p.id)} />\n  ))}\n</Card>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['footer', 'ReactNode', '—'],
              ['headingLevel', '2 | 3 | 4', '2'],
              ['titleStyle', "'default' | 'caption'", "'default'"],
              ['children', 'ReactNode', '—'],
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
