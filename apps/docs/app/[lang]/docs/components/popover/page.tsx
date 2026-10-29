import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { PopoverPlayground } from './PopoverPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A small panel that opens from a button with extra information or controls. Unlike a tooltip it stays open until it is closed.',
    types: 'Types',
    typesText: 'Default has a title with a close button and a line of text. HTML holds any content, such as a profile card. Both come in twelve positions with a beak.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      '👉 Position names the side of the beak, so Position=Bottom is a popover above its button (placement="top"). The default placement in code is below the button.',
      'The title is Neue Haas 14 Medium, outside the type scale; code uses ui/text/bold.',
      'The beak is two vectors (18×8); code draws a 12px square turned 45°.',
      'There is no z-index token; the popover is absolutely positioned and can be clipped by a scrolling parent.',
    ],
    usage: 'Usage',
    usageText: 'Pass the opening element as trigger; Popover adds the toggle and the ARIA attributes.',
    api: 'API reference',
    apiText: 'Other attributes go to the popover panel.',
    a11y: 'Accessibility',
    a11yItems: [
      'The panel is a non-modal dialog named by its title; the trigger gets aria-haspopup, aria-expanded and aria-controls.',
      'Escape closes it and returns focus to the trigger; a press outside closes it too.',
      'Give the close button a translated closeLabel.',
    ],
    mapping: 'Figma to code',
    props: { trigger: 'The element that opens it.', title: 'Figma Type=Default title.', children: 'Text or content (Type=HTML).', placement: 'Figma 👉 Position, mirrored.', open: 'Controlled open state.', defaultOpen: 'Initial open state.', onOpenChange: 'Called when it opens or closes.', closable: 'Shows the close button.', closeLabel: 'Name of the close button.' },
  },
  tr: {
    description: 'Bir butondan açılan, ek bilgi ya da kontrol taşıyan küçük panel. Tooltip’ten farklı olarak kapatılana kadar açık kalır.',
    types: 'Tipler',
    typesText: 'Default, kapatma butonlu bir başlık ve bir satır metin taşır. HTML, profil kartı gibi herhangi bir içerik taşır. İkisi de oklu on iki konumda gelir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      '👉 Position okun kenarını adlandırır; Position=Bottom butonunun üstündeki popover’dır (placement="top"). Kodda varsayılan konum butonun altıdır.',
      'Başlık tip ölçeğinin dışındaki Neue Haas 14 Medium; kod ui/text/bold kullanır.',
      'Ok iki vektörden oluşuyor (18×8); kod 45° döndürülmüş 12px bir kare çizer.',
      'z-index tokenı yok; popover absolute konumlanır ve kayan bir üst öğe tarafından kesilebilir.',
    ],
    usage: 'Kullanım',
    usageText: 'Açan öğeyi trigger olarak verin; Popover açma/kapama ve ARIA özniteliklerini ekler.',
    api: 'API',
    apiText: 'Diğer öznitelikler popover paneline gider.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Panel, başlığıyla adlandırılan modal olmayan bir dialog’dur; trigger’a aria-haspopup, aria-expanded ve aria-controls verilir.',
      'Escape kapatır ve odağı trigger’a geri verir; dışarıya basmak da kapatır.',
      'Kapatma butonuna çevrilmiş bir closeLabel verin.',
    ],
    mapping: 'Figma’dan koda',
    props: { trigger: 'Açan öğe.', title: 'Figma Type=Default başlığı.', children: 'Metin ya da içerik (Type=HTML).', placement: 'Figma 👉 Position, ters.', open: 'Kontrollü açık durumu.', defaultOpen: 'Başlangıçtaki açık durumu.', onOpenChange: 'Açılınca ya da kapanınca çağrılır.', closable: 'Kapatma butonunu gösterir.', closeLabel: 'Kapatma butonunun adı.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Popover' };
}

export default async function PopoverPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Popover" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4201:12502" />

        <h2 id="playground">{t.component.playground}</h2>
        <PopoverPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Background', '--color-surface-level-1'],
              ['Line', '--border-width --color-surface-level-4'],
              ['Shadow', '--shadow-form-level-1'],
              ['Padding', '--space-medium'],
              ['Radius', '--radius-form-element-small'],
              ['Title / text', '--text-ui-text-bold / --text-ui-text-small-regular'],
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
            code={`<Popover trigger={<Button>Details</Button>} title="Shared with 3 people">
  Everyone with the link can view this report.
</Popover>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['trigger', 'ReactElement', '—'],
              ['title', 'ReactNode', '—'],
              ['children', 'ReactNode', '—'],
              ['placement', 'Placement', "'bottom'"],
              ['open', 'boolean', '—'],
              ['defaultOpen', 'boolean', 'false'],
              ['onOpenChange', '(open: boolean) => void', '—'],
              ['closable', 'boolean', 'true'],
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
            ['🎛 Type = Default', 'title="…" + children'],
            ['🎛 Type = HTML', 'children={<…/>}'],
            ['👉 Position = Top / Bottom / Left / Right (+ edges)', "placement='bottom' / 'top' / 'right' / 'left' (+ -start / -end)"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
