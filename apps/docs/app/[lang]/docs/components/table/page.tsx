import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { TablePlayground } from './TablePlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Rows of data in columns, with optional sorting and row selection. Pair it with Pagination for long lists.',
    parts: 'Parts',
    partsText: 'A header cell (text, with a sort arrow when sorted, or the select-all checkbox), a body cell (text that truncates, or a row checkbox) and a row with Default, Hover and Selected states, inside a card with a line around it.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Describe the columns; each cell shows row[key] unless cell renders something else. Sortable columns sort by row[key] (numbers numerically, text by locale); pass onSortChange to sort yourself, e.g. on the server. Selection is controlled with selected and onSelectedChange, or left to the table with defaultSelected.',
    api: 'API reference',
    apiText: 'Table also accepts every table attribute. Columns take key, header, cell, sortable, align and width.',
    a11y: 'Accessibility',
    a11yItems: [
      'It is a real <table> with column headers; caption names it for screen readers.',
      'Sortable headers are buttons, and the header carries aria-sort.',
      'Selected rows carry aria-selected; give the checkboxes translated selectAllLabel and selectRowLabel.',
      'Wide tables scroll sideways inside their frame instead of the page.',
    ],
    mapping: 'Figma to code',
    props: { columns: 'The columns.', rows: 'The data.', rowKey: 'A stable key per row.', sort: 'Controlled sort, or null.', defaultSort: 'The first sort.', onSortChange: 'Called on a header press; sort the rows yourself.', selectable: 'Adds the checkbox column.', selected: 'Controlled selected keys.', onSelectedChange: 'Called with the new keys.', empty: 'Shown when there are no rows.', caption: 'Name for screen readers.' },
  },
  tr: {
    description: 'Sütunlarda veri satırları; isteğe bağlı sıralama ve satır seçimi. Uzun listeler için Pagination ile kullanın.',
    parts: 'Parçalar',
    partsText: 'Bir başlık hücresi (metin, sıralıysa ok; ya da tümünü seçen checkbox), bir gövde hücresi (kesilen metin ya da satır checkbox’ı) ve Default, Hover, Selected durumlu bir satır; hepsi çevresinde çizgi olan bir kartın içinde.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Sütunları tanımlayın; cell başka bir şey çizmedikçe her hücre row[key] gösterir. Sıralanabilir sütunlar row[key]’e göre sıralar (sayılar sayısal, metin dile göre); kendiniz sıralamak için, örneğin sunucuda, onSortChange verin. Seçim selected ve onSelectedChange ile kontrol edilir ya da defaultSelected ile tabloya bırakılır.',
    api: 'API',
    apiText: 'Table tüm table özniteliklerini de kabul eder. Sütunlar key, header, cell, sortable, align ve width alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Sütun başlıkları olan gerçek bir <table>’dır; caption onu ekran okuyucular için adlandırır.',
      'Sıralanabilir başlıklar butondur ve başlık aria-sort taşır.',
      'Seçili satırlar aria-selected taşır; checkbox’lara çevrilmiş selectAllLabel ve selectRowLabel verin.',
      'Geniş tablolar sayfayı değil kendi çerçevelerini yana kaydırır.',
    ],
    mapping: 'Figma’dan koda',
    props: { columns: 'Sütunlar.', rows: 'Veri.', rowKey: 'Her satır için sabit bir anahtar.', sort: 'Kontrollü sıralama ya da null.', defaultSort: 'İlk sıralama.', onSortChange: 'Başlığa basınca çağrılır; satırları siz sıralayın.', selectable: 'Checkbox sütununu ekler.', selected: 'Kontrollü seçili anahtarlar.', onSelectedChange: 'Yeni anahtarlarla çağrılır.', empty: 'Satır yokken gösterilir.', caption: 'Ekran okuyucular için ad.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Table' };
}

export default async function TablePage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Table" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4214:61" />

        <h2 id="playground">{t.component.playground}</h2>
        <TablePlayground />

        <ForView view="designer">
          <h2 id="parts">{c.parts}</h2>
          <p>{c.partsText}</p>
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Frame', '--color-surface-level-1, --border, --radius-card'],
              ['Header cell', '--color-surface-level-2, --text-ui-text-small-bold, --color-foreground-medium-emphasis'],
              ['Body cell', '--text-ui-text-regular, --color-foreground-high-emphasis'],
              ['Cell padding', '--layout-small --layout-default'],
              ['Row hover / selected', '--color-surface-level-2 / --color-primary-soft'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`<Table
  caption="Invoices"
  columns={[
    { key: 'number', header: 'Invoice', sortable: true },
    { key: 'customer', header: 'Customer' },
    { key: 'total', header: 'Total', align: 'end', sortable: true, cell: (i) => formatMoney(i.total) },
  ]}
  rows={invoices}
  rowKey={(i) => i.id}
  selectable
  selected={selected}
  onSelectedChange={setSelected}
  empty={<EmptyState size="medium" title="No invoices yet" description="Invoices you send show up here." />}
/>`}
          />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['columns', 'TableColumn<T>[]', '—'],
              ['rows', 'T[]', '—'],
              ['rowKey', '(row: T) => string', '—'],
              ['sort', "{ key, direction: 'ascending' | 'descending' } | null", '—'],
              ['defaultSort', 'TableSort | null', 'null'],
              ['onSortChange', '(sort: TableSort | null) => void', '—'],
              ['selectable', 'boolean', 'false'],
              ['selected', 'string[]', '—'],
              ['onSelectedChange', '(keys: string[]) => void', '—'],
              ['empty', 'ReactNode', '—'],
              ['caption', 'ReactNode', '—'],
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

        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable
          rows={[
            ['.Table Header Cell › ↕ Sort = None / Ascending / Descending', "column.sortable + sort.direction = 'ascending' / 'descending'"],
            ['.Table Header Cell › 🎛 Type = Checkbox', 'selectable'],
            ['.Table Cell › 🎛 Type = Text / Checkbox', 'column.cell / selectable'],
            ['.Table Row › 🕹 State = Hover / Selected', ':hover / selected={[…]}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
