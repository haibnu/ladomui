import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, TextMotion, type ButtonSize, type ButtonTone } from '@ladom/ui';
import { IconAdd, IconDownload, IconExternalLink, IconForward, IconSetting } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider, ViewSwitch } from '@/components/docs/ViewSwitch';
import docs from '@/components/docs/docs.module.css';
import { getDictionary, href, type Locale } from '@/i18n';
import { ButtonPlayground } from './ButtonPlayground';
import { buttonCopy } from './content';
import styles from './page.module.css';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: buttonCopy[(await params).lang as Locale].title };
}

const FIGMA_URL = 'https://www.figma.com/design/VCJ6ew9Vk1gAqfnvQ1gfOz/Ladom-UI-Design-System?node-id=1088-22';
const TONES: ButtonTone[] = ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info'];
const GHOST_TONES = TONES.filter((t) => t !== 'info') as Exclude<ButtonTone, 'info'>[];
const SIZES: ButtonSize[] = ['large', 'medium', 'small', 'tiny'];
const STATES = ['default', 'hover', 'pressed', 'focus'] as const;

// Size specs as built (Figma Size -> tokens).
const SIZE_SPECS: Record<ButtonSize, { height: number; padding: string; radius: string; text: string; icon: string }> = {
  large: { height: 48, padding: '--layout-small / --layout-xlarge', radius: '--radius-form-element', text: 'ui/text lead/bold', icon: '20px' },
  medium: { height: 40, padding: '--layout-tiny / --layout-default', radius: '--radius-form-element', text: 'ui/text/bold', icon: '16px' },
  small: { height: 32, padding: '--layout-tiny / --layout-small', radius: '--radius-form-element-small', text: 'ui/text small/bold', icon: '16px' },
  tiny: { height: 24, padding: '--layout-micro / --layout-tiny', radius: '--radius-form-element-small', text: 'ui/text small/bold', icon: '12px' },
};

// Solid tokens per state; X is the tone.
const STATE_TOKENS = [
  ['Default', '--color-X', '--color-on-X', 'Primary, Tertiary: --shadow-button-default · Secondary: --shadow-button-secondary-default'],
  ['Hover', '--color-X-natural', '--color-on-X', '—'],
  ['Pressed', '--color-X-shade', '--color-on-X', '—'],
  ['Focus', '--color-X (Primary: --color-X-tint)', '--color-on-X', 'Primary: --shadow-focus-primary · others: 3px line'],
  ['Disabled', '--color-X-soft', '--color-X-tint', '—'],
  ['Loading', '--color-X-soft', '—', 'Loader: --color-X / --color-on-X'],
];

const PROPS: [string, string, string][] = [
  ['variant', "'solid' | 'ghost'", "'solid'"],
  ['tone', "'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info'", "'primary'"],
  ['size', "'large' | 'medium' | 'small' | 'tiny'", "'medium'"],
  ['children', 'ReactNode', '—'],
  ['icon', 'ComponentType<IconProps>', '—'],
  ['iconLeft', 'ComponentType<IconProps>', '—'],
  ['iconRight', 'ComponentType<IconProps>', '—'],
  ['subtitle', 'ReactNode', '—'],
  ['dropdown', 'boolean', 'false'],
  ['loading', 'boolean', 'false'],
  ['disabled', 'boolean', 'false'],
];

const MAPPING: [string, string][] = [
  ['🎛 Type = Button / Ghost', "variant='solid' / 'ghost'"],
  ['💅 Style = Primary … Information', "tone='primary' … 'info'"],
  ['👕 Size = Large / Medium / Small / Tiny', "size='large' / 'medium' / 'small' / 'tiny'"],
  ['🕹 State = Hover / Pressed / Focus', ':hover / :active / :focus-visible'],
  ['Disable = True', 'disabled'],
  ['Loading = True', 'loading'],
  ['Icon Button = True', 'icon={…} aria-label="…"'],
  ['Show L Icon / Show R Icon', 'iconLeft={…} / iconRight={…}'],
  ['Subtitle = True', 'subtitle="…"'],
  ['Dropdown = True', 'dropdown'],
];

export default async function ButtonPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = buttonCopy[lang];

  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title={c.title} description={c.description}>
        <div className={styles.toolbar}>
          <ViewSwitch />
          <a href={FIGMA_URL} target="_blank" rel="noreferrer" className={styles.figmaLink}>
            {t.component.figmaLink} <IconExternalLink size={14} />
          </a>
        </div>

        <h2 id="playground">{t.component.playground}</h2>
        <ButtonPlayground />

        <ForView view="designer">
          <h2 id="anatomy">{c.designer.anatomy}</h2>
          <Example>
            <Button iconLeft={IconAdd} subtitle="Subtitle" iconRight={IconForward} dropdown>
              Button
            </Button>
          </Example>
          <ol>
            {c.designer.anatomyItems.map(([name, text]) => (
              <li key={name}>
                <strong>{name}.</strong> {text}
              </li>
            ))}
          </ol>

          <h2 id="variants">{c.designer.variants}</h2>
          <p>{c.designer.variantsText}</p>
          <Example stack>
            <div className={styles.row}>
              {TONES.map((tone) => (
                <Button key={tone} tone={tone}>
                  {tone}
                </Button>
              ))}
            </div>
            <div className={styles.row}>
              {GHOST_TONES.map((tone) => (
                <Button key={tone} variant="ghost" tone={tone}>
                  {tone}
                </Button>
              ))}
            </div>
          </Example>

          <h2 id="sizes">{c.designer.sizes}</h2>
          <Example>
            {SIZES.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </Example>
          <div className={docs.tableWrap}>
            <table className={docs.table}>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Height</th>
                  <th>Padding (y / x)</th>
                  <th>Radius</th>
                  <th>Text</th>
                  <th>Icon</th>
                </tr>
              </thead>
              <tbody>
                {SIZES.map((s) => (
                  <tr key={s}>
                    <td>{s}</td>
                    <td>{SIZE_SPECS[s].height}px</td>
                    <td>
                      <code>{SIZE_SPECS[s].padding}</code>
                    </td>
                    <td>
                      <code>{SIZE_SPECS[s].radius}</code>
                    </td>
                    <td>{SIZE_SPECS[s].text}</td>
                    <td>{SIZE_SPECS[s].icon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="states">{c.designer.states}</h2>
          <p>{c.designer.statesText}</p>
          <div className={styles.matrixWrap}>
            <table className={styles.matrix}>
              <thead>
                <tr>
                  <th />
                  {[...STATES, 'disabled', 'loading'].map((s) => (
                    <th key={s}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TONES.map((tone) => (
                  <tr key={tone}>
                    <th>{tone}</th>
                    {STATES.map((s) => (
                      <td key={s}>
                        <Button tone={tone} size="small" data-state={s === 'default' ? undefined : s} tabIndex={-1}>
                          Button
                        </Button>
                      </td>
                    ))}
                    <td>
                      <Button tone={tone} size="small" disabled>
                        Button
                      </Button>
                    </td>
                    <td>
                      <Button tone={tone} size="small" loading tabIndex={-1}>
                        Button
                      </Button>
                    </td>
                  </tr>
                ))}
                {GHOST_TONES.map((tone) => (
                  <tr key={`ghost-${tone}`}>
                    <th>ghost {tone}</th>
                    {STATES.map((s) => (
                      <td key={s}>
                        <Button variant="ghost" tone={tone} size="small" data-state={s === 'default' ? undefined : s} tabIndex={-1}>
                          Button
                        </Button>
                      </td>
                    ))}
                    <td>
                      <Button variant="ghost" tone={tone} size="small" disabled>
                        Button
                      </Button>
                    </td>
                    <td>
                      <Button variant="ghost" tone={tone} size="small" loading tabIndex={-1}>
                        Button
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="icon-only">{c.designer.iconOnly}</h2>
          <p>{c.designer.iconOnlyText}</p>
          <Example>
            {SIZES.map((size) => (
              <Button key={size} size={size} icon={IconAdd} aria-label="Add" />
            ))}
            {SIZES.map((size) => (
              <Button key={`g-${size}`} variant="ghost" size={size} icon={IconAdd} aria-label="Add" />
            ))}
          </Example>

          <h2 id="tokens">{c.designer.tokens}</h2>
          <p>{c.designer.tokensText}</p>
          <div className={docs.tableWrap}>
            <table className={docs.table}>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Fill</th>
                  <th>Text</th>
                  <th>Shadow</th>
                </tr>
              </thead>
              <tbody>
                {STATE_TOKENS.map(([state, fill, text, shadow]) => (
                  <tr key={state}>
                    <td>{state}</td>
                    <td>
                      <code>{fill}</code>
                    </td>
                    <td>
                      <code>{text}</code>
                    </td>
                    <td>{shadow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="figma-notes">{c.designer.figmaNotes}</h2>
          <ul>
            {c.designer.figmaNotesItems.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.developer.usage}</h2>
          <CodeBlock
            code={`import { Button } from '@ladom/ui';

<Button onClick={save}>Save</Button>`}
          />

          <h2 id="examples">{c.developer.examples}</h2>
          <h3 id="tones">{c.developer.tones}</h3>
          <Example code={TONES.map((tone) => (tone === 'primary' ? '<Button>primary</Button>' : `<Button tone="${tone}">${tone}</Button>`)).join('\n')}>
            {TONES.map((tone) => (
              <Button key={tone} tone={tone}>
                {tone}
              </Button>
            ))}
          </Example>

          <h3 id="ghost">{c.developer.ghost}</h3>
          <Example code={`<Button variant="ghost">Cancel</Button>\n<Button variant="ghost" tone="error">Delete</Button>`}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="ghost" tone="error">
              Delete
            </Button>
          </Example>

          <h3 id="dev-sizes">{c.developer.sizes}</h3>
          <Example code={SIZES.map((s) => `<Button size="${s}">${s}</Button>`).join('\n')}>
            {SIZES.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </Example>

          <h3 id="with-icons">{c.developer.withIcons}</h3>
          <Example
            code={`import { IconDownload, IconForward } from '@ladom/icons';

<Button iconLeft={IconDownload}>Download</Button>
<Button tone="secondary" iconRight={IconForward}>Next</Button>`}
          >
            <Button iconLeft={IconDownload}>Download</Button>
            <Button tone="secondary" iconRight={IconForward}>
              Next
            </Button>
          </Example>

          <h3 id="dev-icon-only">{c.developer.iconOnly}</h3>
          <p>{c.developer.iconOnlyText}</p>
          <Example code={`<Button icon={IconSetting} aria-label="Settings" />\n<Button variant="ghost" icon={IconSetting} aria-label="Settings" />`}>
            <Button icon={IconSetting} aria-label="Settings" />
            <Button variant="ghost" icon={IconSetting} aria-label="Settings" />
          </Example>

          <h3 id="loading">{c.developer.loading}</h3>
          <p>{c.developer.loadingText}</p>
          <Example code={`<Button loading>Saving</Button>`}>
            <Button loading>Saving</Button>
          </Example>

          <h3 id="disabled">{c.developer.disabled}</h3>
          <Example code={`<Button disabled>Save</Button>`}>
            <Button disabled>Save</Button>
          </Example>

          <h3 id="subtitle-dropdown">{c.developer.subtitleDropdown}</h3>
          <Example code={`<Button tone="tertiary" subtitle="(3)" dropdown>Filters</Button>`}>
            <Button tone="tertiary" subtitle="(3)" dropdown>
              Filters
            </Button>
          </Example>

          <h3 id="text-motion">{lang === 'tr' ? 'İsteğe bağlı: metin animasyonu' : 'Optional: text animation'}</h3>
          <p>
            {lang === 'tr'
              ? 'Butonlar metinlerini varsayılan olarak hareket ettirmez. Ana çağrı butonu gibi yerlerde etiketi TextMotion ile sarabilirsiniz; üzerine gelince ve odaklanınca harfler kayar.'
              : 'Buttons do not animate their text by default. Where it helps, such as the main call to action, wrap the label in TextMotion; the characters roll on hover and focus.'}{' '}
            <Link href={href(lang, '/docs/components/text-motion')}>Text Motion</Link>
          </p>
          <Example code={`<Button>\n  <TextMotion>Get started</TextMotion>\n</Button>`}>
            <Button>
              <TextMotion>Get started</TextMotion>
            </Button>
          </Example>

          <h2 id="api">{c.developer.api}</h2>
          <p>{c.developer.apiText}</p>
          <div className={docs.tableWrap}>
            <table className={docs.table}>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {PROPS.map(([name, type, def]) => (
                  <tr key={name}>
                    <td>
                      <code>{name}</code>
                    </td>
                    <td>
                      <code>{type}</code>
                    </td>
                    <td>
                      <code>{def}</code>
                    </td>
                    <td>{c.props[name as keyof typeof c.props]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 id="accessibility">{c.developer.accessibility}</h2>
          <ul>
            {c.developer.a11y.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ForView>

        <h2 id="figma-to-code">{c.developer.mapping}</h2>
        <div className={docs.tableWrap}>
          <table className={docs.table}>
            <thead>
              <tr>
                <th>Figma</th>
                <th>React</th>
              </tr>
            </thead>
            <tbody>
              {MAPPING.map(([figma, code]) => (
                <tr key={figma}>
                  <td>{figma}</td>
                  <td>
                    <code>{code}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocPage>
    </ViewProvider>
  );
}
