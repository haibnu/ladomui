import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { PaginationPlayground } from './PaginationPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Moves between the pages of a list or a table. It shows the first and last pages, the pages next to the current one and an ellipsis between.',
    states: 'States',
    statesText: 'A page item is Default, Hover or Current; Current is the primary color. Previous and Next are small ghost icon buttons and are disabled on the first and last page.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Pages count from 1. Keep the page in state (or in the URL) and load that slice of the data. siblings sets how many pages show on each side of the current one.',
    api: 'API reference',
    apiText: 'Pagination also accepts every nav attribute. paginationRange(page, pageCount, siblings) returns the same list, with 0 for an ellipsis.',
    a11y: 'Accessibility',
    a11yItems: [
      'It is a nav landmark named "Pagination"; pass a translated aria-label.',
      'The current page carries aria-current="page"; every page button has a name from pageLabel.',
      'Translate previousLabel, nextLabel and pageLabel.',
    ],
    mapping: 'Figma to code',
    props: { page: 'The current page, from 1.', pageCount: 'The number of pages.', onPageChange: 'Called with the new page.', siblings: 'Pages on each side of the current one.', previousLabel: 'Name of the Previous button.', nextLabel: 'Name of the Next button.', pageLabel: 'Name of each page button.' },
  },
  tr: {
    description: 'Bir listenin ya da tablonun sayfaları arasında geçiş yapar. İlk ve son sayfayı, geçerli sayfanın yanındakileri ve aradaki boşluk için üç nokta gösterir.',
    states: 'Durumlar',
    statesText: 'Bir sayfa öğesi Default, Hover ya da Current olur; Current birincil renktir. Önceki ve Sonraki küçük ghost ikon butonlardır; ilk ve son sayfada devre dışı kalır.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Sayfalar 1’den başlar. Sayfayı state’te (ya da URL’de) tutun ve verinin o dilimini yükleyin. siblings geçerli sayfanın her iki yanında kaç sayfa görüneceğini belirler.',
    api: 'API',
    apiText: 'Pagination tüm nav özniteliklerini de kabul eder. paginationRange(page, pageCount, siblings) aynı listeyi döndürür; üç nokta için 0.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      '"Pagination" adlı bir nav bölgesidir; çevrilmiş bir aria-label verin.',
      'Geçerli sayfa aria-current="page" taşır; her sayfa butonu adını pageLabel’dan alır.',
      'previousLabel, nextLabel ve pageLabel’ı çevirin.',
    ],
    mapping: 'Figma’dan koda',
    props: { page: 'Geçerli sayfa, 1’den.', pageCount: 'Sayfa sayısı.', onPageChange: 'Yeni sayfayla çağrılır.', siblings: 'Geçerli sayfanın her yanındaki sayfalar.', previousLabel: 'Önceki butonunun adı.', nextLabel: 'Sonraki butonunun adı.', pageLabel: 'Her sayfa butonunun adı.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Pagination' };
}

export default async function PaginationPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Pagination" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4215:13" />

        <h2 id="playground">{t.component.playground}</h2>
        <PaginationPlayground />

        <ForView view="designer">
          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Item', '--space-xxlarge (size), --radius-form-element-small, --text-ui-text-small-bold'],
              ['Default', '--color-foreground-medium-emphasis'],
              ['Hover', '--color-surface-level-2, --color-foreground-high-emphasis'],
              ['Current', '--color-primary, --color-on-primary'],
              ['Gap', '--layout-micro'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock code={`const [page, setPage] = useState(1);\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['page', 'number', '—'],
              ['pageCount', 'number', '—'],
              ['onPageChange', '(page: number) => void', '—'],
              ['siblings', 'number', '1'],
              ['previousLabel', 'string', "'Previous page'"],
              ['nextLabel', 'string', "'Next page'"],
              ['pageLabel', '(page: number) => string', '`Page ${page}`'],
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
            ['.Pagination Item › 🕹 State = Current', 'page={…}'],
            ['.Pagination Item › 🕹 State = Hover', ':hover'],
            ['Previous / Next', 'previousLabel / nextLabel'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
