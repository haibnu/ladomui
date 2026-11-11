import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider, ViewSwitch } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ScrollAreaPlayground } from './ScrollAreaPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A scrolling box with thin, rounded scrollbars that show on hover and while scrolling.',
    notDrawn: 'Not in Figma yet. The look is built from tokens and will follow the Figma drawing once it is made.',
    look: 'Look',
    lookText: 'The native scrollbar is hidden; a thin, rounded thumb is drawn over the edge of the content. It fades in on hover, while scrolling and while dragged, and stays off when nothing overflows.',
    tokens: 'Tokens',
    usedBy: 'Used by',
    usedByText: 'Time Picker columns, Dropdown panels (Selectbox, Breadcrumb and in-box pickers), the Modal and Drawer body, the Table frame and the SidebarNav body.',
    usage: 'Usage',
    usageText: 'Give the ScrollArea a size (or a max size) and put the content in it. Scrolling stays native: wheel, touch, keyboard and scrollIntoView work as before. Style and label the scrolling element with viewportProps; reach it with viewportRef.',
    api: 'API reference',
    apiText: 'ScrollArea also accepts every div attribute; they go on the outer box.',
    a11y: 'Accessibility',
    a11yItems: [
      'The scrollbars are drawn for the pointer only and hidden from assistive tech; the viewport scrolls with the keyboard.',
      'When the content has nothing focusable, make the viewport focusable and name it: viewportProps={{ tabIndex: 0, \'aria-label\': … }}.',
      'With prefers-reduced-motion, the fade and the paging on a track click are instant.',
      'In forced-colors mode the thumb takes the system text color.',
    ],
    props: {
      orientation: 'Which way the content scrolls; the other axis is clipped.',
      scrollbars: 'auto shows the scrollbars on hover and while scrolling; always keeps them on.',
      viewportRef: 'Ref to the scrolling element (scrollTop, scrollIntoView, focus).',
      viewportProps: 'Props for the scrolling element: role, tabIndex, aria-*, onScroll, onKeyDown, className.',
    },
  },
  tr: {
    description: 'Üzerine gelince ve kaydırırken görünen ince, yuvarlak kaydırma çubuklu bir kaydırma kutusu.',
    notDrawn: 'Henüz Figma’da yok. Görünüm tokenlardan kuruldu; Figma çizimi yapılınca ona uyacak.',
    look: 'Görünüm',
    lookText: 'Yerel kaydırma çubuğu gizlenir; içeriğin kenarına ince, yuvarlak bir tutamaç çizilir. Üzerine gelince, kaydırırken ve sürüklerken belirir; taşma yoksa hiç görünmez.',
    tokens: 'Tokenlar',
    usedBy: 'Kullanan bileşenler',
    usedByText: 'Time Picker sütunları, Dropdown panelleri (Selectbox, Breadcrumb ve kutu içi seçiciler), Modal ve Drawer gövdesi, Table çerçevesi ve SidebarNav gövdesi.',
    usage: 'Kullanım',
    usageText: 'ScrollArea’ya bir boyut (ya da en büyük boyut) verin ve içeriği içine koyun. Kaydırma yerel kalır: tekerlek, dokunma, klavye ve scrollIntoView eskisi gibi çalışır. Kaydırılan öğeyi viewportProps ile biçimlendirip adlandırın; viewportRef ile ona ulaşın.',
    api: 'API',
    apiText: 'ScrollArea tüm div özniteliklerini de kabul eder; bunlar dış kutuya gider.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Kaydırma çubukları yalnızca fare için çizilir ve yardımcı teknolojilerden gizlenir; viewport klavyeyle kaydırılır.',
      'İçerikte odaklanabilir bir şey yoksa viewport’u odaklanabilir yapıp adlandırın: viewportProps={{ tabIndex: 0, \'aria-label\': … }}.',
      'prefers-reduced-motion açıkken belirme ve çubuğa tıklayınca sayfa kaydırma anında olur.',
      'Forced-colors modunda tutamaç sistemin metin rengini alır.',
    ],
    props: {
      orientation: 'İçeriğin kaydığı yön; diğer eksen kırpılır.',
      scrollbars: 'auto çubukları üzerine gelince ve kaydırırken gösterir; always hep açık tutar.',
      viewportRef: 'Kaydırılan öğenin ref’i (scrollTop, scrollIntoView, focus).',
      viewportProps: 'Kaydırılan öğenin propları: role, tabIndex, aria-*, onScroll, onKeyDown, className.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Scroll Area' };
}

export default async function ScrollAreaPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Scroll Area" description={c.description}>
        <ViewSwitch />
        <p>{c.notDrawn}</p>

        <h2 id="playground">{t.component.playground}</h2>
        <ScrollAreaPlayground />

        <h2 id="used-by">{c.usedBy}</h2>
        <p>{c.usedByText}</p>

        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Track', '--space-tiny (width), --space-atom (padding)'],
              ['Thumb', '--radius-full, --color-opacity-24, min --space-large'],
              ['Thumb hover / drag', '--color-opacity-32'],
              ['Fade', '--motion-fade-default'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`import { ScrollArea } from '@ladom/ui';

<ScrollArea style={{ maxBlockSize: 320 }} viewportProps={{ tabIndex: 0, 'aria-label': 'Activity' }}>
  {items}
</ScrollArea>

// A listbox that scrolls: the viewport is the listbox.
<ScrollArea viewportRef={listRef} viewportProps={{ role: 'listbox', tabIndex: 0, onKeyDown }}>
  {options}
</ScrollArea>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['orientation', "'vertical' | 'horizontal' | 'both'", "'vertical'"],
              ['scrollbars', "'auto' | 'always'", "'auto'"],
              ['viewportRef', 'Ref<HTMLDivElement>', '—'],
              ['viewportProps', 'HTMLAttributes<HTMLDivElement>', '—'],
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
