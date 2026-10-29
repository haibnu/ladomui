import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AccordionPlayground } from './AccordionPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A card whose content opens and closes under its title, for FAQs, settings groups and long details.',
    states: 'States',
    statesText: 'Collapsed shows the header with the card style 1 shadow; expanded shows the content and raises the card to the card hover shadow. The round tertiary toggle is pressed while open.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The card has no fill; code uses surface/level-1 so the shadow has a surface.',
      'The radius is a raw 12px; code uses --radius-form-element.',
      'The title and texts have no color; code uses high and medium emphasis.',
      'Subtitle and Bodycopy use the legacy “Paragraph Small/Regular” style; code uses ui/text small/regular.',
      'The header is 48px with a raw 129px gap before the Header Slot; code pushes the slot to the end.',
      'The whole header is the toggle in code, not only the round button.',
    ],
    usage: 'Usage',
    usageText: 'Each Accordion is one item; stack several and control open to let only one be open at a time.',
    api: 'API reference',
    apiText: 'Accordion also accepts every div attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'The header is a button with aria-expanded and aria-controls; the content is a region named by the title.',
      'Enter or Space toggles it; closed content is hidden from everyone.',
      'Do not put interactive controls in the header slot inside the toggle; it sits beside it.',
    ],
    mapping: 'Figma to code',
    props: { title: 'Title.', subtitle: 'Figma Subtitle.', bodycopy: 'Figma Bodycopy.', header: 'Figma Header Slot.', children: 'Figma Body Slot.', open: 'Figma State=Expand (controlled).', defaultOpen: 'Initial state.', onOpenChange: 'Called when it opens or closes.' },
  },
  tr: {
    description: 'İçeriği başlığının altında açılıp kapanan bir kart; SSS, ayar grupları ve uzun ayrıntılar için.',
    states: 'Durumlar',
    statesText: 'Kapalıyken başlık card style 1 gölgesiyle görünür; açıkken içerik görünür ve kart card hover gölgesine yükselir. Yuvarlak tertiary düğme açıkken basılıdır.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Kartın dolgusu yok; kod, gölgenin bir yüzeyi olsun diye surface/level-1 kullanır.',
      'Köşe ham 12px; kod --radius-form-element kullanır.',
      'Başlık ve metinlerin rengi yok; kod high ve medium emphasis kullanır.',
      'Subtitle ve Bodycopy eski “Paragraph Small/Regular” stilini kullanıyor; kod ui/text small/regular kullanır.',
      'Başlık 48px; Header Slot’tan önce ham 129px boşluk var; kod slotu sona iter.',
      'Kodda yalnızca yuvarlak buton değil, başlığın tamamı açıp kapatır.',
    ],
    usage: 'Kullanım',
    usageText: 'Her Accordion tek bir öğedir; birkaçını alt alta koyun ve aynı anda yalnızca biri açık olsun diye open’ı kontrol edin.',
    api: 'API',
    apiText: 'Accordion tüm div özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Başlık aria-expanded ve aria-controls taşıyan bir butondur; içerik, başlıkla adlandırılan bir region’dır.',
      'Enter ya da Space açıp kapatır; kapalı içerik herkesten gizlenir.',
      'Başlık slotu butonun içinde değil yanındadır; içine etkileşimli kontrol koyabilirsiniz.',
    ],
    mapping: 'Figma’dan koda',
    props: { title: 'Başlık.', subtitle: 'Figma Subtitle.', bodycopy: 'Figma Bodycopy.', header: 'Figma Header Slot.', children: 'Figma Body Slot.', open: 'Figma State=Expand (kontrollü).', defaultOpen: 'Başlangıç durumu.', onOpenChange: 'Açılınca ya da kapanınca çağrılır.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Accordion' };
}

export default async function AccordionPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Accordion" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2119:50033" />

        <h2 id="playground">{t.component.playground}</h2>
        <AccordionPlayground />

        <ForView view="designer">
          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Card', '--color-surface-level-1, --radius-form-element'],
              ['Shadow (collapsed / expanded)', '--shadow-card-style-1 / --shadow-card-hover'],
              ['Header padding / gap', '--space-tiny --space-medium / --space-form-gutter'],
              ['Toggle', 'Button tertiary small icon (pressed when open)'],
              ['Title / texts', '--text-ui-text-lead-bold / --text-ui-text-small-regular'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="figma-notes">{c.notes}</h2>
          <ul>
            {c.notesItems.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [open, setOpen] = useState('shipping');

<Accordion title="Shipping" open={open === 'shipping'} onOpenChange={(o) => setOpen(o ? 'shipping' : '')}>
  Orders ship within 2 working days.
</Accordion>
<Accordion title="Returns" subtitle="Within 14 days" open={open === 'returns'} onOpenChange={(o) => setOpen(o ? 'returns' : '')}>
  Send items back unused.
</Accordion>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['title', 'ReactNode', '—'],
              ['subtitle', 'ReactNode', '—'],
              ['bodycopy', 'ReactNode', '—'],
              ['header', 'ReactNode', '—'],
              ['children', 'ReactNode', '—'],
              ['open', 'boolean', '—'],
              ['defaultOpen', 'boolean', 'false'],
              ['onOpenChange', '(open: boolean) => void', '—'],
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
            ['State = Expand / Collapse', 'open / defaultOpen'],
            ['Subtitle / Bodycopy', 'subtitle / bodycopy'],
            ['Header Slot + Slot Content (H)', 'header={…}'],
            ['Body Slot', 'children'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
