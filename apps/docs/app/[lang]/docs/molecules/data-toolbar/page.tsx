import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { DataToolbarPlayground } from './DataToolbarPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The row above a Table: a search field, filters and actions, which turn into bulk actions while rows are selected.',
    behavior: 'Behavior',
    behaviorItems: [
      'The search Input grows to fill the space; filters follow it and the actions sit at the end.',
      'While selectedCount is above 0, the end shows the selection count and bulkActions instead of actions. Select rows in the table above to see it.',
      'The row wraps when it runs out of space; on phones (< 768px) the search and each filter take a full line.',
      'The toolbar does not filter anything itself: it reports the search text, and you filter the rows.',
    ],
    usage: 'Usage',
    usageText:
      'Keep the search text, filters and selection in state next to the Table, and pass the Table’s selection length as selectedCount. Use Selectboxes with fluid={false} and a Segment as filters, ghost Buttons for bulk actions, and add a way to clear the selection. Translate the count with selectionLabel.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The row has role="toolbar"; name it with aria-label, e.g. after the table.',
      'The search field is type="search" and takes its accessible name from search.label; give each filter an aria-label too.',
      'The selection count is in a polite live region, so screen readers announce it when rows are selected.',
    ],
    props: {
      search: 'The search field: value, onChange, label and an optional placeholder.',
      filters: 'Filters after the search, e.g. Selectboxes and a Segment.',
      actions: 'At the end while nothing is selected, e.g. Export.',
      selectedCount: 'The number of selected rows; above 0 shows the bulk actions.',
      selectionLabel: 'The count text, e.g. (n) => `${n} selected`.',
      bulkActions: 'Shown at the end while rows are selected.',
    },
  },
  tr: {
    description: 'Bir Table’ın üstündeki satır: arama alanı, filtreler ve eylemler; satırlar seçiliyken eylemler toplu eylemlere dönüşür.',
    behavior: 'Davranış',
    behaviorItems: [
      'Arama Input’u boş alanı doldurmak için genişler; filtreler onu izler, eylemler sonda durur.',
      'selectedCount 0’dan büyükken sonda actions yerine seçim sayısı ve bulkActions görünür. Görmek için yukarıdaki tabloda satır seçin.',
      'Yer kalmadığında satır alta kayar; telefonda (< 768px) arama ve her filtre tam bir satır kaplar.',
      'Araç çubuğu kendisi bir şey filtrelemez: arama metnini bildirir, satırları siz filtrelersiniz.',
    ],
    usage: 'Kullanım',
    usageText:
      'Arama metnini, filtreleri ve seçimi Table’ın yanında state’te tutun; Table’daki seçimin uzunluğunu selectedCount olarak verin. Filtre olarak fluid={false} Selectbox’lar ve bir Segment, toplu eylemler için ghost Button’lar kullanın ve seçimi temizlemenin bir yolunu ekleyin. Sayıyı selectionLabel ile çevirin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Satır role="toolbar" taşır; aria-label ile, örneğin tablonun adıyla, ad verin.',
      'Arama alanı type="search"’tür ve erişilebilir adını search.label’dan alır; her filtreye de aria-label verin.',
      'Seçim sayısı nazik (polite) bir canlı bölgededir; satır seçildiğinde ekran okuyucular okur.',
    ],
    props: {
      search: 'Arama alanı: value, onChange, label ve isteğe bağlı placeholder.',
      filters: 'Aramadan sonraki filtreler, örneğin Selectbox’lar ve bir Segment.',
      actions: 'Hiçbir şey seçili değilken sonda, örneğin Dışa aktar.',
      selectedCount: 'Seçili satır sayısı; 0’dan büyükse toplu eylemleri gösterir.',
      selectionLabel: 'Sayı metni, örneğin (n) => `${n} seçili`.',
      bulkActions: 'Satırlar seçiliyken sonda görünür.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Data Toolbar' };
}

export default async function DataToolbarPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Data Toolbar" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <DataToolbarPlayground />
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
            code={`const [query, setQuery] = useState('');\nconst [selected, setSelected] = useState<string[]>([]);\nconst rows = employees.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));\n\n<DataToolbar\n  aria-label="Employees"\n  search={{ value: query, onChange: setQuery, label: 'Search employees' }}\n  actions={<Button iconLeft={IconAdd}>Add employee</Button>}\n  selectedCount={selected.length}\n  bulkActions={<Button variant="ghost" tone="secondary" iconLeft={IconDataExport}>Export</Button>}\n/>\n<Table columns={columns} rows={rows} rowKey={(e) => e.id} selectable selected={selected} onSelectedChange={setSelected} />`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['search', '{ value: string; onChange: (value: string) => void; label: string; placeholder?: string }', '—'],
              ['filters', 'ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['selectedCount', 'number', '0'],
              ['selectionLabel', '(count: number) => ReactNode', '`${n} selected`'],
              ['bulkActions', 'ReactNode', '—'],
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
