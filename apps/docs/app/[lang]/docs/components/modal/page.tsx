import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ModalPlayground } from './ModalPlayground';
import { PromptModalDemo } from './PromptModalDemo';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A dialog in the middle of the page, over a dimmed overlay: a confirmation, a short form, a message that needs an answer.',
    sizes: 'Sizes',
    sizesText: 'Small, Medium and Large follow the modal size tokens: 433, 657 and 1105px on desktop, the full width minus a margin on mobile. The header has the title, an optional description and the close button; the footer holds the actions, the main one last.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Keep the open state in the page and close it in onClose. Use a ghost tertiary Button for the secondary action and a solid one for the main action; the error tone for destructive actions.',
    api: 'API reference',
    apiText: 'Modal also accepts every dialog attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'Modal is a native <dialog> opened with showModal(): focus moves inside and stays there, the page behind is inert, and focus returns to the opener when it closes.',
      'The title names the dialog and the description describes it.',
      'Escape and a press on the overlay close it; dismissible={false} turns both off when an answer is required.',
      'Give the close button a translated closeLabel.',
    ],
    mapping: 'Figma to code',
    prompt: {
      title: 'Prompt Modal',
      text: 'PromptModal is a small Modal for a question or a notice: a round tone icon above the title, the title, text and actions centered, and the close button in the top corner. It has no Figma drawing yet; the icon badge follows Empty State Large (64px badge, 32px icon).',
      tones: [
        ['danger', 'Serious, often irreversible steps such as deleting. Red warning icon; pair it with an error-tone main Button.'],
        ['warning', 'Sensitive steps such as changing an owner or a permission. Amber icon.'],
        ['info', 'Notices such as a new version. Blue info icon.'],
        ['default', 'General questions such as leaving a page. A question mark in the brand color.'],
      ] as [string, string][],
      props: { tone: 'The tone: its icon and colors.', icon: 'An icon element in place of the tone’s icon.', rest: 'open, onClose, title, description, children, footer, dismissible and closeLabel work as on Modal; the size is always small.' },
    },
    props: { open: 'Whether it is shown.', onClose: 'Called by the close button, Escape and the overlay.', size: 'Figma 👕 Size.', title: '.Modal Header Title.', description: '.Modal Header Description.', children: 'The body.', footer: 'Figma Footer: the actions.', dismissible: 'Escape and overlay presses close it.', headerContent: 'Between the title and the close button, e.g. a Stepper; the title then keeps one line and the description goes under them. Not in Figma.', closeLabel: 'Name of the close button.' },
  },
  tr: {
    description: 'Kararmış bir overlay üzerinde, sayfanın ortasında bir diyalog: bir onay, kısa bir form, cevap bekleyen bir mesaj.',
    sizes: 'Boyutlar',
    sizesText: 'Small, Medium ve Large modal boyut tokenlarını izler: masaüstünde 433, 657 ve 1105px, mobilde kenar boşluğu bırakan tam genişlik. Başlıkta başlık, isteğe bağlı açıklama ve kapatma butonu; alt bölümde eylemler, ana eylem en sonda.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Açık durumunu sayfada tutun, onClose içinde kapatın. İkincil eylem için ghost tertiary, ana eylem için solid bir Button kullanın; geri alınamaz eylemlerde error tonu.',
    api: 'API',
    apiText: 'Modal tüm dialog özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Modal, showModal() ile açılan yerel bir <dialog>’dur: odak içeri girer ve orada kalır, arkadaki sayfa etkisizleşir, kapanınca odak açan öğeye döner.',
      'Başlık diyaloğu adlandırır, açıklama onu tanımlar.',
      'Escape ve overlay’e basmak onu kapatır; cevap gerektiğinde dismissible={false} ikisini de kapatır.',
      'Kapatma butonuna çevrilmiş bir closeLabel verin.',
    ],
    mapping: 'Figma’dan koda',
    prompt: {
      title: 'Prompt Modal',
      text: 'PromptModal, bir soru ya da bildirim için küçük bir Modal: başlığın üstünde tonun yuvarlak ikonu; başlık, metin ve eylemler ortalı; kapatma butonu üst köşede. Henüz Figma çizimi yok; ikon zemini Empty State Large’ı izler (64px zemin, 32px ikon).',
      tones: [
        ['danger', 'Silme gibi ciddi, çoğu zaman geri alınamaz adımlar. Kırmızı uyarı ikonu; ana eylem için error tonunda bir Button kullanın.'],
        ['warning', 'Sahip ya da yetki değiştirmek gibi hassas adımlar. Turuncu ikon.'],
        ['info', 'Yeni sürüm gibi bildirimler. Mavi bilgi ikonu.'],
        ['default', 'Sayfadan çıkmak gibi genel sorular. Marka renginde soru işareti.'],
      ] as [string, string][],
      props: { tone: 'Ton: ikonu ve renkleri.', icon: 'Tonun ikonu yerine bir ikon öğesi.', rest: 'open, onClose, title, description, children, footer, dismissible ve closeLabel Modal’daki gibi çalışır; boyut her zaman small.' },
    },
    props: { open: 'Gösterilip gösterilmediği.', onClose: 'Kapatma butonu, Escape ve overlay çağırır.', size: 'Figma 👕 Size.', title: '.Modal Header Title.', description: '.Modal Header Description.', children: 'İçerik.', footer: 'Figma Footer: eylemler.', dismissible: 'Escape ve overlay onu kapatır.', headerContent: 'Başlık ile kapatma butonu arasında, örneğin bir Stepper; başlık o zaman tek satırda kalır, açıklama altlarına geçer. Figma’da yok.', closeLabel: 'Kapatma butonunun adı.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Modal' };
}

export default async function ModalPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Modal" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4212:111" />

        <h2 id="playground">{t.component.playground}</h2>
        <ModalPlayground />

        <h2 id="prompt-modal">{c.prompt.title}</h2>
        <p>{c.prompt.text}</p>
        <PromptModalDemo />
        <SpecTable head={['tone', '']} rows={c.prompt.tones.map(([tone, text]) => [<code key="t">{tone}</code>, text])} />
        <ForView view="designer">
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Badge / Icon', 'calc(2 * --space-xxlarge) / --space-xxlarge'],
              ['danger', '--color-error / --color-error-soft'],
              ['warning', '--color-warning / --color-warning-soft'],
              ['info', '--color-info / --color-info-soft'],
              ['default', '--color-primary-foreground / --color-primary-soft'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>
        <ForView view="developer">
          <CodeBlock
            code={`<PromptModal
  open={open}
  onClose={() => setOpen(false)}
  tone="danger"
  title="Delete Project?"
  description="The project and its files are removed for everyone. This cannot be undone."
  footer={
    <>
      <Button variant="ghost" tone="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button tone="error" onClick={remove}>Delete</Button>
    </>
  }
/>`}
          />
          <PropsTable
            props={[
              ['tone', "'danger' | 'warning' | 'info' | 'default'", "'default'"],
              ['icon', 'ReactNode', '—'],
              ['…', 'ModalProps', '—'],
            ]}
            descriptions={{ tone: c.prompt.props.tone, icon: c.prompt.props.icon, '…': c.prompt.props.rest }}
          />
        </ForView>

        <ForView view="designer">
          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Width', '--modal-small-size / --modal-medium-size / --modal-large-size'],
              ['Surface', '--color-surface-level-1'],
              ['Overlay', '--color-component-modal-overlay'],
              ['Shadow', '--shadow-depth-xl'],
              ['Radius', '--radius-card'],
              ['Padding', '--space-modal (body top: --space-modal-horizontal)'],
              ['Title / description', '--text-ui-page-title / --text-ui-text-regular'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete project</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  size="small"
  title="Delete project"
  description="The project and its files are removed for everyone."
  footer={
    <>
      <Button variant="ghost" tone="tertiary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button tone="error" onClick={remove}>Delete</Button>
    </>
  }
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['open', 'boolean', '—'],
              ['onClose', '() => void', '—'],
              ['size', "'small' | 'medium' | 'large'", "'medium'"],
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['children', 'ReactNode', '—'],
              ['footer', 'ReactNode', '—'],
              ['dismissible', 'boolean', 'true'],
              ['headerContent', 'ReactNode', '—'],
              ['closeLabel', 'string', "'Close'"],
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
            ['👕 Size = Small / Medium / Large', "size='small' / 'medium' / 'large'"],
            ['.Modal Header › Title', 'title="…"'],
            ['.Modal Header › Description', 'description="…"'],
            ['Footer (.Modal Footer)', 'footer={<>…</>}'],
            ['Body › Content', 'children'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
