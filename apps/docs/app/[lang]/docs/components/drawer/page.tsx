import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ModalPlayground } from '../modal/ModalPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A panel that slides in from the side and fills the height of the window: filters, the details of a row, a settings form.',
    sides: 'Sides',
    sidesText: 'Right is the default; Left suits navigation. The width is the small modal size and the full width on mobile. It shares the Modal header and footer.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Drawer comes with Modal: npx ladom-ui add modal adds both. It works like Modal; the body scrolls when the content is taller than the window.',
    api: 'API reference',
    apiText: 'Drawer takes every Modal prop except size, plus side.',
    a11y: 'Accessibility',
    a11yItems: [
      'Like Modal it is a native <dialog>: focus stays inside, the page behind is inert, Escape and the overlay close it.',
      'Give the close button a translated closeLabel.',
    ],
    mapping: 'Figma to code',
    props: { side: 'Figma 👉 Position.', open: 'Whether it is shown.', onClose: 'Called by the close button, Escape and the overlay.', title: '.Modal Header Title.', footer: 'Figma Footer: the actions.' },
  },
  tr: {
    description: 'Yandan kayarak açılan ve pencerenin yüksekliğini dolduran bir panel: filtreler, bir satırın detayı, bir ayar formu.',
    sides: 'Taraflar',
    sidesText: 'Varsayılan sağdır; sol gezinme için uygundur. Genişlik küçük modal boyutudur, mobilde tam genişlik. Modal’ın başlık ve alt bölümünü paylaşır.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Drawer, Modal ile gelir: npx ladom-ui add modal ikisini de ekler. Modal gibi çalışır; içerik pencereden uzunsa gövde kayar.',
    api: 'API',
    apiText: 'Drawer, size dışındaki tüm Modal prop’larını ve side’ı alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Modal gibi yerel bir <dialog>’dur: odak içeride kalır, arkadaki sayfa etkisizleşir, Escape ve overlay onu kapatır.',
      'Kapatma butonuna çevrilmiş bir closeLabel verin.',
    ],
    mapping: 'Figma’dan koda',
    props: { side: 'Figma 👉 Position.', open: 'Gösterilip gösterilmediği.', onClose: 'Kapatma butonu, Escape ve overlay çağırır.', title: '.Modal Header Title.', footer: 'Figma Footer: eylemler.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Drawer' };
}

export default async function DrawerPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Drawer" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4212:199" />

        <h2 id="playground">{t.component.playground}</h2>
        <ModalPlayground kind="drawer" />

        <ForView view="designer">
          <h2 id="sides">{c.sides}</h2>
          <p>{c.sidesText}</p>
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Width', '--modal-small-size'],
              ['Surface', '--color-surface-level-1'],
              ['Overlay', '--color-component-modal-overlay'],
              ['Shadow', '--shadow-depth-xl'],
              ['Motion', '--motion-swipe-y'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`<Drawer
  open={open}
  onClose={() => setOpen(false)}
  title="Filters"
  footer={<Button onClick={apply}>Apply</Button>}
>
  <FormField label="Status">…</FormField>
</Drawer>`}
          />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['side', "'right' | 'left'", "'right'"],
              ['open', 'boolean', '—'],
              ['onClose', '() => void', '—'],
              ['title', 'ReactNode', '—'],
              ['footer', 'ReactNode', '—'],
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
            ['👉 Position = Right / Left', "side='right' / 'left'"],
            ['Footer (.Modal Footer)', 'footer={…}'],
            ['.Modal Header › Title / Description', 'title / description'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
