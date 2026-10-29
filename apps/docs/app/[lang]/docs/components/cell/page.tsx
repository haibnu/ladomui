import type { Metadata } from 'next';
import { Avatar, Badge, Button, Cell, CellActions, CellHelper, CellSearch, Input } from '@ladom/ui';
import { IconAdd } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { CellPlayground } from './CellPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A row of a list: the options of Selectbox and the items of a Dropdown. It holds text with optional icons, avatar, badges and a checkbox or radio.',
    types: 'Types',
    typesText: 'Default is a text row; a selected Default row shows a check. Multi Text adds bodycopy, an inline badge and a subtitle. Checkbox and Radio draw the control before the text. Destructive is red. Action holds small ghost buttons and Search holds a search input.',
    states: 'States',
    statesText: 'Hover is surface/level-2. Selected is primary soft with primary text, and surface/level-3 on hover. Destructive uses error soft, tint and natural.',
    helper: 'Cell Helper',
    helperText: 'Captions and dividers that group cells: Caption, Caption + Divider, Divider and Caption No Padding.',
    sizes: 'Sizes',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Small Default Hover has a 10px gap, the other cells 12px; code uses 12px.',
      'Small Checkbox and Radio pad the text with layout-micro, the other Small cells with s-micro; both are 4px.',
      'Figma has no disabled cell; code greys out options with aria-disabled.',
      'The checkbox and radio are drawn by the cell (the cell is the option); they look like the Checkbox and Radio components.',
      'Image cells (.Cell Image, 2145:13023) are a Default cell with an avatar; there is no separate component.',
    ],
    usage: 'Usage',
    usageText: 'Cell is a div; give it the role of its list (option, menuitem) and the matching aria-selected or aria-checked.',
    api: 'API reference',
    apiText: 'Cell also accepts every div attribute and forwards its ref. CellHelper takes variant.',
    a11y: 'Accessibility',
    a11yItems: [
      'In a listbox, give each cell role="option" and aria-selected; Selectbox does this for you.',
      'The control, icons and check are aria-hidden; the state is in aria-selected or aria-checked.',
      'Mark unavailable options with aria-disabled="true".',
    ],
    mapping: 'Figma to code',
    props: {
      size: 'Figma 👕 Size.',
      selected: 'Figma Selected.',
      tone: "Figma 🎛 Type=Destructive: 'destructive'.",
      control: 'Figma 🎛 Type=Checkbox / Radio.',
      iconLeft: 'Figma Icon (L) + Change Icon (L).',
      iconRight: 'Figma Icon (R) + Change Icon (R). Replaces the selected check.',
      avatar: 'Figma Avatar.',
      badgeLeft: 'Figma Badge (L).',
      badgeRight: 'Figma Badge (R).',
      bodycopy: 'Figma Bodycopy (Multi Text).',
      inlineBadge: 'Figma Inline Badge (Multi Text).',
      subtitle: 'Figma Subtitle (Multi Text).',
    },
  },
  tr: {
    description: 'Bir listenin satırı: Selectbox seçenekleri ve Dropdown öğeleri. Metni, isteğe bağlı ikon, avatar, badge ve checkbox ya da radio ile taşır.',
    types: 'Tipler',
    typesText: 'Default bir metin satırıdır; seçili Default satırı bir tik gösterir. Multi Text bodycopy, satır içi badge ve alt başlık ekler. Checkbox ve Radio kontrolü metnin önüne çizer. Destructive kırmızıdır. Action küçük ghost butonlar, Search bir arama alanı taşır.',
    states: 'Durumlar',
    statesText: 'Hover surface/level-2’dir. Seçili hâl primary soft zemin ve primary metindir, hover’da surface/level-3. Destructive error soft, tint ve natural kullanır.',
    helper: 'Cell Helper',
    helperText: 'Hücreleri gruplayan başlık ve ayırıcılar: Caption, Caption + Divider, Divider ve Caption No Padding.',
    sizes: 'Boyutlar',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Small Default Hover’da boşluk 10px, diğer hücrelerde 12px; kod 12px kullanır.',
      'Small Checkbox ve Radio metni layout-micro ile, diğer Small hücreler s-micro ile boşluklar; ikisi de 4px.',
      'Figma’da disabled hücre yok; kod aria-disabled seçenekleri griye çevirir.',
      'Checkbox ve radio’yu hücre çizer (seçenek hücrenin kendisidir); Checkbox ve Radio bileşenleri gibi görünür.',
      'Görselli hücreler (.Cell Image, 2145:13023) avatarlı bir Default hücredir; ayrı bileşen yok.',
    ],
    usage: 'Kullanım',
    usageText: 'Cell bir div’dir; listesinin rolünü (option, menuitem) ve uygun aria-selected ya da aria-checked’i verin.',
    api: 'API',
    apiText: 'Cell tüm div özniteliklerini de kabul eder ve ref’ini iletir. CellHelper variant alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Bir listbox içinde her hücreye role="option" ve aria-selected verin; Selectbox bunu kendisi yapar.',
      'Kontrol, ikonlar ve tik aria-hidden’dır; durum aria-selected ya da aria-checked’dedir.',
      'Kullanılamayan seçenekleri aria-disabled="true" ile işaretleyin.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      size: 'Figma 👕 Size.',
      selected: 'Figma Selected.',
      tone: "Figma 🎛 Type=Destructive: 'destructive'.",
      control: 'Figma 🎛 Type=Checkbox / Radio.',
      iconLeft: 'Figma Icon (L) + Change Icon (L).',
      iconRight: 'Figma Icon (R) + Change Icon (R). Seçili tikin yerine geçer.',
      avatar: 'Figma Avatar.',
      badgeLeft: 'Figma Badge (L).',
      badgeRight: 'Figma Badge (R).',
      bodycopy: 'Figma Bodycopy (Multi Text).',
      inlineBadge: 'Figma Inline Badge (Multi Text).',
      subtitle: 'Figma Subtitle (Multi Text).',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Cell' };
}

export default async function CellPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Cell" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="87:46114" />

        <h2 id="playground">{t.component.playground}</h2>
        <CellPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            <Cell>Default</Cell>
            <Cell selected>Default selected</Cell>
            <Cell bodycopy="Bodycopy" inlineBadge={<Badge size="tiny" tone="primary">New</Badge>} subtitle="Subtitle">
              Multi Text
            </Cell>
            <Cell avatar={<Avatar size="tiny" name="Halil Nuroğlu" />} badgeRight={<Badge size="tiny" tone="primary">Admin</Badge>}>
              Avatar and badge
            </Cell>
            <Cell control="checkbox" selected>
              Checkbox
            </Cell>
            <Cell control="radio">Radio</Cell>
            <Cell tone="destructive">Destructive</Cell>
            <CellActions>
              <Button variant="ghost" size="small">
                Edit
              </Button>
              <Button variant="ghost" size="small">
                Share
              </Button>
            </CellActions>
            <CellSearch>
              <Input type="search" size="small" placeholder="Search" aria-label="Search" />
            </CellSearch>
          </Example>

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            <Cell data-state="hover">Hover</Cell>
            <Cell selected>Selected</Cell>
            <Cell selected data-state="hover">
              Selected hover
            </Cell>
            <Cell tone="destructive" data-state="hover">
              Destructive hover
            </Cell>
            <Cell tone="destructive" selected>
              Destructive selected
            </Cell>
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <Example stack>
            <Cell iconLeft={<IconAdd />}>Medium</Cell>
            <Cell size="small" iconLeft={<IconAdd />}>
              Small
            </Cell>
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Padding', 'Radius', 'Text', 'Icon', 'Avatar / Badge']}
            rows={[
              ['medium', '40px', <code key="p">--space-tiny --space-medium</code>, <code key="r">--radius-form-element</code>, 'ui/text/regular', '20px', 'Tiny'],
              ['small', '32px', <code key="p">--space-micro --space-small</code>, <code key="r">--radius-form-element-small</code>, 'ui/text small/regular', '16px', 'Micro'],
            ]}
          />

          <h2 id="helper">{c.helper}</h2>
          <p>{c.helperText}</p>
          <Example stack>
            <CellHelper>Caption</CellHelper>
            <Cell>Cell</Cell>
            <CellHelper variant="caption-divider">Caption + Divider</CellHelper>
            <Cell>Cell</Cell>
            <CellHelper variant="divider" />
            <Cell>Cell</Cell>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', 'Background', 'Text']}
            rows={[
              ['default', 'transparent', '--color-foreground-high-emphasis'],
              ['hover', '--color-surface-level-2', '--color-foreground-high-emphasis'],
              ['selected', '--color-primary-soft', '--color-primary'],
              ['selected hover', '--color-surface-level-3', '--color-primary'],
              ['destructive', 'transparent / --color-error-soft (hover)', '--color-error'],
              ['destructive selected', '--color-error-tint / --color-error-natural (hover)', '--color-error'],
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
            code={`<Dropdown role="listbox" aria-label="Cities">
  <CellHelper>Popular</CellHelper>
  <Cell role="option" aria-selected selected>Istanbul</Cell>
  <Cell role="option" aria-selected={false}>Ankara</Cell>
  <CellHelper variant="divider" />
  <Cell role="option" aria-selected={false} subtitle="Aegean">Izmir</Cell>
</Dropdown>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['size', "'medium' | 'small'", "'medium'"],
              ['selected', 'boolean', 'false'],
              ['tone', "'default' | 'destructive'", "'default'"],
              ['control', "'checkbox' | 'radio'", '—'],
              ['iconLeft', 'ReactNode', '—'],
              ['iconRight', 'ReactNode', '—'],
              ['avatar', 'ReactNode', '—'],
              ['badgeLeft', 'ReactNode', '—'],
              ['badgeRight', 'ReactNode', '—'],
              ['bodycopy', 'ReactNode', '—'],
              ['inlineBadge', 'ReactNode', '—'],
              ['subtitle', 'ReactNode', '—'],
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
            ['🎛 Type = Default / Multi Text', '<Cell> (+ bodycopy, inlineBadge, subtitle)'],
            ['🎛 Type = Checkbox / Radio', "control='checkbox' / 'radio'"],
            ['🎛 Type = Destructive', "tone='destructive'"],
            ['🎛 Type = Action', '<CellActions>'],
            ['🎛 Type = Search', '<CellSearch><Input type="search" size="small" /></CellSearch>'],
            ['👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['Selected = True', 'selected'],
            ['Cell Helper / Type', "<CellHelper variant='caption' | 'caption-divider' | 'divider' | 'caption-flush'>"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
