import type { Metadata } from 'next';
import { Button, Cell, CellActions, CellHelper, CellSearch, Dropdown, Input } from '@ladom/ui';
import { IconDelete, IconEdit, IconShare } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The floating panel that holds Cells: the list of a Selectbox, a menu, or any content.',
    types: 'Types',
    typesText: 'Default pads its cells 8px on every side. Full Width lets the cells reach the edges. Slot and State hold any content (for example an empty state).',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Cells are 1px apart (a raw itemSpacing); code uses --border-width.',
      'Type=State uses the State component (Empty), which is not built yet; put your own content in the meantime.',
      'Full Width ends with a “Cell Helper/Link” instance that no longer exists in the Cell Helper set.',
      'Figma has no z-index token; the Selectbox list is absolutely positioned under its box without one.',
    ],
    usage: 'Usage',
    usageText: 'Dropdown is only the panel. Selectbox opens and positions one for you; for a menu, place it yourself and give it the menu roles.',
    api: 'API reference',
    apiText: 'Dropdown also accepts every div attribute and forwards its ref.',
    a11y: 'Accessibility',
    a11yItems: [
      'Give the panel the role of its content: listbox for options, menu for actions.',
      'Move focus into it when it opens, close it on Escape and return focus to the button that opened it.',
    ],
    mapping: 'Figma to code',
    props: { fullWidth: 'Figma 🎛 Type=Full Width.' },
    seeAlso: 'See also',
  },
  tr: {
    description: 'Cell’leri taşıyan yüzen panel: Selectbox listesi, bir menü ya da herhangi bir içerik.',
    types: 'Tipler',
    typesText: 'Default hücrelerini her yandan 8px boşlukla sarar. Full Width hücrelerin kenarlara uzanmasına izin verir. Slot ve State herhangi bir içerik taşır (örneğin boş durum).',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Hücreler arasında 1px var (ham itemSpacing); kod --border-width kullanır.',
      'Type=State, henüz yapılmamış State bileşenini (Empty) kullanır; şimdilik kendi içeriğinizi koyun.',
      'Full Width, Cell Helper setinde artık olmayan bir “Cell Helper/Link” örneğiyle bitiyor.',
      'Figma’da z-index tokenı yok; Selectbox listesi kutusunun altına onsuz, absolute olarak yerleşir.',
    ],
    usage: 'Kullanım',
    usageText: 'Dropdown yalnızca paneldir. Selectbox onu sizin için açar ve yerleştirir; bir menü için kendiniz yerleştirin ve menü rollerini verin.',
    api: 'API',
    apiText: 'Dropdown tüm div özniteliklerini de kabul eder ve ref’ini iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Panele içeriğinin rolünü verin: seçenekler için listbox, eylemler için menu.',
      'Açılınca odağı içine taşıyın, Escape ile kapatın ve odağı onu açan butona geri verin.',
    ],
    mapping: 'Figma’dan koda',
    props: { fullWidth: 'Figma 🎛 Type=Full Width.' },
    seeAlso: 'Ayrıca bakın',
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Dropdown' };
}

export default async function DropdownPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const width = { inlineSize: 240 };
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Dropdown" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1145:669" />
        <p>
          {c.seeAlso}: <a href={href(lang, '/docs/components/cell')}>Cell</a>, <a href={href(lang, '/docs/components/selectbox')}>Selectbox</a>
        </p>

        <h2 id="types">{c.types}</h2>
        <p>{c.typesText}</p>
        <Example>
          <Dropdown style={width} role="listbox" aria-label="Default">
            <Cell role="option" aria-selected selected>
              Istanbul
            </Cell>
            <Cell role="option" aria-selected={false} data-state="hover">
              Ankara
            </Cell>
            <Cell role="option" aria-selected={false}>
              Izmir
            </Cell>
          </Dropdown>
          <Dropdown style={width} fullWidth role="menu" aria-label="Full Width">
            <CellSearch style={{ paddingInline: 'var(--space-tiny)' }}>
              <Input type="search" size="small" placeholder="Search" aria-label="Search" />
            </CellSearch>
            <CellHelper>Actions</CellHelper>
            <Cell role="menuitem" iconLeft={<IconEdit />}>
              Edit
            </Cell>
            <Cell role="menuitem" iconLeft={<IconShare />}>
              Share
            </Cell>
            <CellHelper variant="divider" />
            <Cell role="menuitem" tone="destructive" iconLeft={<IconDelete />}>
              Delete
            </Cell>
          </Dropdown>
          <Dropdown style={width}>
            <CellActions>
              <Button variant="ghost" size="small">
                Cancel
              </Button>
              <Button variant="ghost" size="small">
                Apply
              </Button>
            </CellActions>
          </Dropdown>
        </Example>

        <ForView view="designer">
          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Background', '--color-surface-level-1'],
              ['Padding', '--layout-tiny (Full Width: block only)'],
              ['Radius', '--radius-layout-base'],
              ['Shadow', '--shadow-form-level-1'],
              ['Gap between cells', '--border-width'],
              ['Offset under a Selectbox', '--space-form-dropdown-top'],
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
            code={`<Dropdown fullWidth role="menu" aria-label="Actions">
  <Cell role="menuitem" iconLeft={<IconEdit />}>Edit</Cell>
  <CellHelper variant="divider" />
  <Cell role="menuitem" tone="destructive" iconLeft={<IconDelete />}>Delete</Cell>
</Dropdown>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable props={[['fullWidth', 'boolean', 'false']]} descriptions={c.props} />

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
            ['🎛 Type = Default', '<Dropdown>'],
            ['🎛 Type = Full Width', '<Dropdown fullWidth>'],
            ['🎛 Type = Slot / State', '<Dropdown>{content}</Dropdown>'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
