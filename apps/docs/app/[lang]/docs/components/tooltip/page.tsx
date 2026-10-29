import type { Metadata } from 'next';
import { Button, Tooltip, type Placement } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { FIGMA_POSITION } from './positions';
import { TooltipPlayground } from './TooltipPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A short label that appears next to an element on hover and keyboard focus.',
    positions: 'Positions',
    positionsText: 'Twelve positions: above, below, before or after the element, centered or aligned to an edge. The beak points at the element and can be hidden.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      '👉 Position names the side of the beak, so Position=Bottom is a tooltip above the element (placement="top").',
      'The text is an unbound 12px Medium style; code uses ui/text small/regular.',
      'The beak is two vectors (18×8); code draws a 12px square turned 45°, which is the same size.',
      'Hug Content changes the width by 2px only; code always hugs and wraps at 200px.',
      'Type=HTML is a .tooltip html component with a surface/level-2 beak; code takes any content in content.',
      'There is no z-index token; the tooltip is absolutely positioned and can be clipped by a scrolling parent.',
    ],
    usage: 'Usage',
    usageText: 'Wrap one focusable element. Use Popover instead for content people interact with.',
    api: 'API reference',
    apiText: 'Other attributes go to the tooltip bubble.',
    a11y: 'Accessibility',
    a11yItems: [
      'The tooltip has role="tooltip" and the element gets aria-describedby while it shows.',
      'It shows on keyboard focus as well as hover, and Escape hides it.',
      'Do not put links or buttons in a tooltip; it disappears when the pointer leaves.',
    ],
    mapping: 'Figma to code',
    props: { content: 'Text or content.', children: 'The element it describes.', placement: 'Figma 👉 Position, mirrored (see notes).', beak: 'Figma 🤥 Beak.', open: 'Keeps it open.', delay: 'Delay before showing on hover.' },
  },
  tr: {
    description: 'Bir öğenin yanında hover ve klavye odağında görünen kısa bir etiket.',
    positions: 'Konumlar',
    positionsText: 'On iki konum: öğenin üstü, altı, önü ya da arkası; ortalı ya da bir kenara hizalı. Ok öğeyi gösterir ve gizlenebilir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      '👉 Position okun bulunduğu kenarı adlandırır; Position=Bottom öğenin üstündeki tooltip’tir (placement="top").',
      'Metin bağlı olmayan 12px Medium bir stil; kod ui/text small/regular kullanır.',
      'Ok iki vektörden oluşuyor (18×8); kod aynı boyutta, 45° döndürülmüş 12px bir kare çizer.',
      'Hug Content genişliği yalnızca 2px değiştiriyor; kod her zaman içeriğe sarılır ve 200px’te satır kırar.',
      'Type=HTML, surface/level-2 oklu bir .tooltip html bileşeni; kod content içinde herhangi bir içerik alır.',
      'z-index tokenı yok; tooltip absolute konumlanır ve kayan bir üst öğe tarafından kesilebilir.',
    ],
    usage: 'Kullanım',
    usageText: 'Odaklanabilir tek bir öğeyi sarın. Kullanıcının etkileşime gireceği içerik için Popover kullanın.',
    api: 'API',
    apiText: 'Diğer öznitelikler tooltip baloncuğuna gider.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Tooltip role="tooltip" taşır; görünürken öğeye aria-describedby verilir.',
      'Hover’ın yanı sıra klavye odağında da görünür; Escape gizler.',
      'Tooltip’e link ya da buton koymayın; imleç ayrılınca kaybolur.',
    ],
    mapping: 'Figma’dan koda',
    props: { content: 'Metin ya da içerik.', children: 'Açıkladığı öğe.', placement: 'Figma 👉 Position, ters (notlara bakın).', beak: 'Figma 🤥 Beak.', open: 'Açık tutar.', delay: 'Hover’da gösterme gecikmesi.' },
  },
};

const SHOWN: Placement[] = ['top', 'bottom', 'left', 'right'];

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Tooltip' };
}

export default async function TooltipPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Tooltip" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1199:126" />

        <h2 id="playground">{t.component.playground}</h2>
        <TooltipPlayground />

        <ForView view="designer">
          <h2 id="positions">{c.positions}</h2>
          <p>{c.positionsText}</p>
          <Example>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '96px 160px', padding: '56px 96px' }}>
              {SHOWN.map((p) => (
                <Tooltip key={p} content={`Position=${FIGMA_POSITION[p]}`} placement={p} open>
                  <Button variant="ghost" tone="tertiary" size="small">
                    {p}
                  </Button>
                </Tooltip>
              ))}
            </div>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Background', '--color-surface-level-3'],
              ['Line', '--border-width --color-surface-level-4'],
              ['Padding', '--space-tiny --space-small'],
              ['Radius', '--radius-form-element-small'],
              ['Text', '--text-ui-text-small-regular, --color-foreground-high-emphasis'],
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
            code={`<Tooltip content="Copies the link">
  <Button icon={IconShare} aria-label="Share" />
</Tooltip>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['content', 'ReactNode', '—'],
              ['children', 'ReactElement', '—'],
              ['placement', 'Placement', "'top'"],
              ['beak', 'boolean', 'true'],
              ['open', 'boolean', '—'],
              ['delay', 'number', '300'],
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
            ['👉 Position = Bottom / Bottom Left / Bottom Right', "placement='top' / 'top-start' / 'top-end'"],
            ['👉 Position = Top / Top Left / Top Right', "placement='bottom' / 'bottom-start' / 'bottom-end'"],
            ['👉 Position = Left / Left Top / Left Bottom', "placement='right' / 'right-start' / 'right-end'"],
            ['👉 Position = Right / Right Top / Right Bottom', "placement='left' / 'left-start' / 'left-end'"],
            ['🤥 Beak = False', 'beak={false}'],
            ['🎛 Type = HTML', 'content={<…/>}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
