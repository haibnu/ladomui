import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { SummaryListPlayground } from './SummaryListPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Pairs of labels and values: a payslip with its total, an order summary or the facts on a profile.',
    behavior: 'Behavior',
    behaviorItems: [
      'In rows, each label sits at the start and its value at the end of one line; numbers use tabular figures, so amounts line up.',
      'total is drawn under a line in the lead bold style. It shows only in rows.',
      'In grid, each fact is a small label over a bold value, in two columns; on phones (< 768px) they stack in one.',
      'The list takes the width of its container; put it in a Card or a side panel.',
    ],
    usage: 'Usage',
    usageText:
      'Format values yourself (currency, dates) before passing them; a value can be any element, such as a Badge. Use rows when the values add up or read like a receipt, and grid for unrelated facts about one person or record. Give an item a key when its label is not a plain string.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The pairs are a <dl>: screen readers announce each label with its value and the number of items.',
      'title is plain text above the list; when the list needs a name in a landmark, give the region an aria-labelledby that points to a heading of your own.',
      'Do not rely on the minus sign alone for deductions in long lists; say it in the label too, as in the example.',
    ],
    props: {
      items: 'The label and value pairs, in order.',
      title: 'A caption above the list.',
      layout: 'rows: label and value on one line; grid: two columns of facts.',
      total: 'A last pair under a line, in bold (rows only).',
    },
  },
  tr: {
    description: 'Etiket ve değer çiftleri: toplamıyla bir bordro, bir sipariş özeti ya da bir profilin bilgileri.',
    behavior: 'Davranış',
    behaviorItems: [
      'Satırlar düzeninde etiket satırın başında, değeri sonundadır; rakamlar sabit genişlikte olduğu için tutarlar alt alta hizalanır.',
      'total bir çizginin altında, lead bold stiliyle çizilir. Yalnızca satırlar düzeninde görünür.',
      'Izgara düzeninde her bilgi, kalın bir değerin üstünde küçük bir etikettir ve iki sütuna dizilir; telefonda (< 768px) tek sütuna iner.',
      'Liste kapsayıcısının genişliğini alır; bir Card’ın ya da yan panelin içine koyun.',
    ],
    usage: 'Kullanım',
    usageText:
      'Değerleri (para birimi, tarih) vermeden önce kendiniz biçimlendirin; değer Badge gibi herhangi bir öğe olabilir. Değerler toplanıyorsa ya da bir fiş gibi okunuyorsa satırları, bir kişi ya da kayıtla ilgili birbirinden bağımsız bilgiler için ızgarayı kullanın. Etiketi düz metin olmayan öğelere key verin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Çiftler bir <dl>’dir: ekran okuyucular her etiketi değeriyle ve öğe sayısıyla birlikte okur.',
      'title listenin üstünde düz bir metindir; liste bir bölge içinde ad istiyorsa, bölgeye kendi başlığınızı gösteren aria-labelledby verin.',
      'Uzun listelerde kesintileri yalnızca eksi işaretiyle belirtmeyin; örnekteki gibi etikette de söyleyin.',
    ],
    props: {
      items: 'Sırasıyla etiket ve değer çiftleri.',
      title: 'Listenin üstündeki başlık.',
      layout: 'rows: etiket ve değer tek satırda; grid: iki sütunlu bilgiler.',
      total: 'Çizginin altında kalın son çift (yalnızca rows).',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Summary List' };
}

export default async function SummaryListPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Summary List" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <SummaryListPlayground />
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
            code={`const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'TRY' });\n\n<Card title="October payslip">\n  <SummaryList\n    items={payslip.lines.map((line) => ({\n      key: line.code,\n      label: line.name,\n      value: money.format(line.amount),\n    }))}\n    total={{ label: 'Net pay', value: money.format(payslip.net) }}\n  />\n</Card>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['items', '{ key?: string; label: ReactNode; value: ReactNode }[]', '—'],
              ['title', 'ReactNode', '—'],
              ['layout', "'rows' | 'grid'", "'rows'"],
              ['total', '{ label: ReactNode; value: ReactNode }', '—'],
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
