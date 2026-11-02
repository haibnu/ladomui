import type { Metadata } from 'next';
import { Button, EmptyState } from '@ladom/ui';
import { IconSearch } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Shows that there is nothing to list, that a search found nothing, or that something failed to load.',
    sizes: 'Sizes',
    sizesText: 'Large fills a page or a large panel. Medium sits in tables, cards and drawers. Small goes inside components: the Selectbox list shows it when a search finds nothing.',
    types: 'Default and error',
    typesText: 'Error uses the error colors for a failed load; offer a way to try again.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Say what is missing in the title and what to do next in the description. Give large and medium an action when there is one; small has none.',
    api: 'API reference',
    apiText: 'EmptyState also accepts every div attribute. Add role="status" when it appears after a search, so the change is announced.',
    mapping: 'Figma to code',
    props: { size: 'Figma 👕 Size.', tone: 'Figma 🎛 Type.', title: 'Figma Title.', description: 'Figma Description.', action: 'Figma Action: a Button.', icon: 'Icon element.' },
    emptyTitle: 'No products yet',
    emptyText: 'Add your first product to start selling.',
    add: 'Add product',
    errorTitle: 'Could not load orders',
    errorText: 'Check your connection and try again.',
    retry: 'Try again',
    search: 'No results',
  },
  tr: {
    description: 'Listelenecek bir şey olmadığını, aramanın sonuç bulamadığını ya da bir şeyin yüklenemediğini gösterir.',
    sizes: 'Boyutlar',
    sizesText: 'Large bir sayfayı ya da büyük bir paneli doldurur. Medium tablolarda, kartlarda ve drawer’larda durur. Small bileşenlerin içine girer: Selectbox listesi arama sonuç bulamayınca onu gösterir.',
    types: 'Default ve hata',
    typesText: 'Error, yüklenemeyen içerik için hata renklerini kullanır; yeniden deneme yolu sunun.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Başlıkta neyin olmadığını, açıklamada ne yapılacağını söyleyin. Bir eylem varsa large ve medium’a verin; small eylemsizdir.',
    api: 'API',
    apiText: 'EmptyState tüm div özniteliklerini de kabul eder. Bir aramadan sonra çıkıyorsa değişiklik duyurulsun diye role="status" ekleyin.',
    mapping: 'Figma’dan koda',
    props: { size: 'Figma 👕 Size.', tone: 'Figma 🎛 Type.', title: 'Figma Title.', description: 'Figma Description.', action: 'Figma Action: bir Button.', icon: 'İkon öğesi.' },
    emptyTitle: 'Henüz ürün yok',
    emptyText: 'Satışa başlamak için ilk ürününüzü ekleyin.',
    add: 'Ürün ekle',
    errorTitle: 'Siparişler yüklenemedi',
    errorText: 'Bağlantınızı kontrol edip yeniden deneyin.',
    retry: 'Yeniden dene',
    search: 'Sonuç yok',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Empty State' };
}

export default async function EmptyStatePage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Empty State" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4239:82" />

        <h2 id="sizes">{c.sizes}</h2>
        <p>{c.sizesText}</p>
        <Example stack>
          <EmptyState size="large" title={c.emptyTitle} description={c.emptyText} action={<Button>{c.add}</Button>} />
          <EmptyState size="medium" title={c.emptyTitle} description={c.emptyText} action={<Button tone="tertiary" size="small">{c.add}</Button>} />
          <EmptyState size="small" icon={<IconSearch />} title={c.search} />
        </Example>

        <h2 id="types">{c.types}</h2>
        <p>{c.typesText}</p>
        <Example>
          <EmptyState size="medium" tone="error" title={c.errorTitle} description={c.errorText} action={<Button tone="tertiary" size="small">{c.retry}</Button>} />
        </Example>

        <ForView view="designer">
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Size', 'Badge / icon', 'Title', 'Padding']}
            rows={[
              ['large', '64 / 32px', '--text-content-h5-bold', '--layout-huge'],
              ['medium', '48 / 24px', '--text-ui-text-lead-bold', '--layout-xlarge'],
              ['small', '32 / 16px', '--text-ui-text-bold', '--layout-default'],
            ].map((r) => r.map((cell, i) => (i > 1 ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`<EmptyState
  size="large"
  title="No products yet"
  description="Add your first product to start selling."
  action={<Button>Add product</Button>}
/>

<Table rows={[]} empty={<EmptyState size="medium" title="No orders" />} … />
<Selectbox searchable noResultsLabel="No results" … />`}
          />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['size', "'large' | 'medium' | 'small'", "'medium'"],
              ['tone', "'default' | 'error'", "'default'"],
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['action', 'ReactNode', '—'],
              ['icon', 'ReactNode', '<IconFolder /> / <IconError />'],
            ]}
            descriptions={c.props}
          />
        </ForView>

        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable
          rows={[
            ['👕 Size = Large / Medium / Small', "size='large' / 'medium' / 'small'"],
            ['🎛 Type = Default / Error', "tone='default' / 'error'"],
            ['Title / Description / Action', 'title / description / action'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
