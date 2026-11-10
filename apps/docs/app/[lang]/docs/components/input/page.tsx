import type { Metadata } from 'next';
import { FormField, Input } from '@ladom/ui';
import { IconProfile } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { InputPlayground } from './InputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A single-line text field, with search and password types, icons, prefix and suffix text, and FormField to pair it with a label and hint.',
    types: 'Types',
    typesText: 'Text is the default. Search has a filled look with the search icon. Password hides the value and adds a show/hide toggle. Prefix and suffix text cover the Leading and Trailing Text types.',
    sizes: 'Sizes',
    states: 'States',
    statesText: 'The border carries the state: neutral at rest, primary tint on hover, primary with the focus ring on focus, low emphasis once filled, error color with an icon on error.',
    formField: 'With label and hint',
    formFieldText: 'Form Input puts the label above or beside the field and the hint below it. Form Spacing adds the form gutter under the whole group.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Large exists only for the Mobile device in Figma; the desktop sizes are Medium and Small.',
      'Both Leading Text and Trailing Text show their extra text after the value. Code offers prefix (before) and suffix (after).',
      'Figma has an Error + Focus variant; code shows the error border with the error focus ring.',
      'Not built yet: Floating Label, File, Drag&Drop, Color Picker, Color Input, Chip and Code types, and Textarea.',
    ],
    usage: 'Usage',
    usageText: 'Put Input inside FormField: the label, hint and error are connected to the field automatically (id, aria-describedby, aria-invalid).',
    examples: 'Examples',
    search: 'Search',
    password: 'Password',
    affix: 'Prefix and suffix',
    error: 'Error',
    horizontal: 'Horizontal label',
    api: 'API reference',
    apiText: 'Input accepts every input attribute (value, onChange, name, …) and forwards its ref to the input element. className styles the outer box.',
    fieldApi: 'FormField',
    a11y: 'Accessibility',
    a11yItems: [
      'Use FormField or a Label with htmlFor; placeholder text is not a label.',
      'Errors set aria-invalid and are announced (role="alert") and connected with aria-describedby.',
      'The password toggle is a real button with aria-pressed and a label you can translate (showPasswordLabel, hidePasswordLabel).',
      'Focus is always visible: the border turns primary and the focus ring appears.',
    ],
    mapping: 'Figma to code',
    sample: { name: 'Name', email: 'Email', ph: 'Your name', hint: 'As on your ID', err: 'Name is required', search: 'Search', pw: 'Password' },
    props: {
      size: 'Figma 👕 Size.',
      error: 'Figma Error. Set by FormField when it has an error.',
      disabled: 'Figma Disable.',
      iconLeft: 'Figma Icon (L).',
      iconRight: 'Figma Icon (R).',
      prefix: 'Text before the value.',
      suffix: 'Text after the value (Leading / Trailing Text).',
      type: 'search = Search look, password = Password with toggle.',
    } as Record<string, string>,
    fieldProps: {
      label: 'The label.',
      hint: 'Helper text under the field.',
      error: 'Error message; replaces the hint and sets the error state.',
      optional: 'Text at the end of the label row.',
      align: 'Figma Align.',
      spacing: 'Figma Form Spacing.',
    } as Record<string, string>,
  },
  tr: {
    description: 'Tek satırlık metin alanı; search ve password tipleri, ikonlar, ön ve son ek metinleri ve label ile hint’e bağlamak için FormField.',
    types: 'Tipler',
    typesText: 'Text varsayılandır. Search, arama ikonlu dolgulu görünümdür. Password değeri gizler ve göster/gizle düğmesi ekler. Ön ve son ek metinleri Leading ve Trailing Text tiplerini karşılar.',
    sizes: 'Boyutlar',
    states: 'Durumlar',
    statesText: 'Durumu kenarlık taşır: dururken nötr, üzerine gelince primary tint, odakta primary ve odak halkası, dolunca low emphasis, hatada hata rengi ve ikon.',
    formField: 'Label ve hint ile',
    formFieldText: 'Form Input label’ı alanın üstüne ya da yanına, hint’i altına koyar. Form Spacing tüm grubun altına form boşluğu ekler.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Large Figma’da sadece Mobile cihaz için var; masaüstü boyutları Medium ve Small.',
      'Leading Text ve Trailing Text tiplerinin ikisi de ek metni değerden sonra gösteriyor. Kodda prefix (önce) ve suffix (sonra) var.',
      'Figma’da Error + Focus varyantı var; kodda hata kenarlığı ve hata odak halkası birlikte gösteriliyor.',
      'Henüz yapılmadı: Floating Label, File, Drag&Drop, Color Picker, Color Input, Chip ve Code tipleri ile Textarea.',
    ],
    usage: 'Kullanım',
    usageText: 'Input’u FormField içine koyun: label, hint ve hata alana kendiliğinden bağlanır (id, aria-describedby, aria-invalid).',
    examples: 'Örnekler',
    search: 'Search',
    password: 'Password',
    affix: 'Ön ve son ek',
    error: 'Hata',
    horizontal: 'Yandaki label',
    api: 'API',
    apiText: 'Input tüm input özniteliklerini (value, onChange, name, …) kabul eder ve ref’ini input öğesine iletir. className dış kutuyu biçimler.',
    fieldApi: 'FormField',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'FormField ya da htmlFor’lu bir Label kullanın; placeholder bir label değildir.',
      'Hatalar aria-invalid ekler, okunur (role="alert") ve aria-describedby ile bağlanır.',
      'Şifre düğmesi aria-pressed’li gerçek bir butondur; etiketleri çevrilebilir (showPasswordLabel, hidePasswordLabel).',
      'Odak her zaman görünür: kenarlık primary olur ve odak halkası çıkar.',
    ],
    mapping: 'Figma’dan koda',
    sample: { name: 'Ad', email: 'E-posta', ph: 'Adınız', hint: 'Kimliğinizdeki gibi', err: 'Ad zorunlu', search: 'Ara', pw: 'Şifre' },
    props: {
      size: 'Figma 👕 Size.',
      error: 'Figma Error. FormField’da hata varsa kendiliğinden gelir.',
      disabled: 'Figma Disable.',
      iconLeft: 'Figma Icon (L).',
      iconRight: 'Figma Icon (R).',
      prefix: 'Değerden önceki metin.',
      suffix: 'Değerden sonraki metin (Leading / Trailing Text).',
      type: 'search = Search görünümü, password = düğmeli Password.',
    } as Record<string, string>,
    fieldProps: {
      label: 'Label.',
      hint: 'Alanın altındaki yardım metni.',
      error: 'Hata mesajı; hint’in yerini alır ve hata durumunu açar.',
      optional: 'Label satırının sonundaki metin.',
      align: 'Figma Align.',
      spacing: 'Figma Form Spacing.',
    } as Record<string, string>,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Input' };
}

const STATES = ['default', 'hover', 'focus', 'typed'] as const;

export default async function InputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const s = c.sample;
  const width = { inlineSize: 'var(--grid-column-3)' };
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1133:300" />

        <h2 id="playground">{t.component.playground}</h2>
        <InputPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            <div style={width}>
              <Input placeholder={s.ph} />
            </div>
            <div style={width}>
              <Input type="search" placeholder={s.search} />
            </div>
            <div style={width}>
              <Input type="password" defaultValue="secret12" />
            </div>
            <div style={width}>
              <Input placeholder="ladom" suffix=".ladom.co" />
            </div>
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <Example stack>
            <div style={width}>
              <Input size="medium" placeholder="Medium" />
            </div>
            <div style={width}>
              <Input size="small" placeholder="Small" />
            </div>
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Padding (y / x)', 'Radius', 'Text', 'Icon']}
            rows={[
              ['medium', '40px', <code key="p">--layout-tiny / --layout-default</code>, <code key="r">--radius-form-element</code>, 'ui/text/regular', '16px'],
              ['small', '32px', <code key="p">--layout-tiny / --layout-small</code>, <code key="r">--radius-form-element-small</code>, 'ui/text small/regular', '16px'],
            ]}
          />

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            {STATES.map((st) => (
              <div key={st} style={width}>
                <Input placeholder={st} defaultValue={st === 'typed' ? 'Typed' : undefined} data-state={st === 'default' ? undefined : st} tabIndex={-1} />
              </div>
            ))}
            <div style={width}>
              <Input placeholder="error" error tabIndex={-1} />
            </div>
            <div style={width}>
              <Input placeholder="disabled" disabled />
            </div>
          </Example>

          <h2 id="form-field">{c.formField}</h2>
          <p>{c.formFieldText}</p>
          <Example stack>
            <div style={width}>
              <FormField label={s.name} hint={s.hint}>
                <Input placeholder={s.ph} />
              </FormField>
            </div>
            <div style={{ inlineSize: 'var(--grid-column-5)' }}>
              <FormField label={s.name} align="horizontal">
                <Input placeholder={s.ph} />
              </FormField>
            </div>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', 'Border', 'Fill', 'Ring']}
            rows={[
              ['Default', '--color-surface-level-4', '--color-surface-level-1', '—'],
              ['Hover', '--color-primary-tint', '--color-surface-level-1', '—'],
              ['Focus', '--color-primary', '--color-surface-level-1', '--shadow-focus-primary'],
              ['Typed', '--color-foreground-low-emphasis', '--color-surface-level-1', '—'],
              ['Error', '--color-error', '--color-surface-level-1', 'focus: --shadow-focus-error'],
              ['Disabled', '--color-surface-level-4', '--color-surface-level-2', '—'],
              ['Search', '--color-surface-level-2', '--color-surface-level-2', '—'],
            ].map((r) => r.map((cell, i) => (i && cell !== '—' ? <code key={i}>{cell}</code> : cell)))}
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
          <Example
            stack
            code={`import { FormField, Input } from '@ladom/ui';

<FormField label="${s.email}" hint="${s.hint}">
  <Input type="email" placeholder="you@ladom.co" />
</FormField>`}
          >
            <div style={width}>
              <FormField label={s.email} hint={s.hint}>
                <Input type="email" placeholder="you@ladom.co" />
              </FormField>
            </div>
          </Example>

          <h2 id="examples">{c.examples}</h2>
          <h3 id="search">{c.search}</h3>
          <Example code={`<Input type="search" placeholder="${s.search}" aria-label="${s.search}" />`}>
            <div style={width}>
              <Input type="search" placeholder={s.search} aria-label={s.search} />
            </div>
          </Example>
          <h3 id="password">{c.password}</h3>
          <Example code={`<FormField label="${s.pw}">\n  <Input type="password" />\n</FormField>`}>
            <div style={width}>
              <FormField label={s.pw}>
                <Input type="password" />
              </FormField>
            </div>
          </Example>
          <h3 id="affix">{c.affix}</h3>
          <Example code={`<Input prefix="https://" placeholder="ladom.co" />\n<Input suffix="@gmail.com" placeholder="name" />\n<Input iconLeft={<IconProfile />} placeholder="${s.ph}" />`} stack>
            <div style={width}>
              <Input prefix="https://" placeholder="ladom.co" />
            </div>
            <div style={width}>
              <Input suffix="@gmail.com" placeholder="name" />
            </div>
            <div style={width}>
              <Input iconLeft={<IconProfile />} placeholder={s.ph} />
            </div>
          </Example>
          <h3 id="error">{c.error}</h3>
          <Example code={`<FormField label="${s.name}" error="${s.err}">\n  <Input />\n</FormField>`}>
            <div style={width}>
              <FormField label={s.name} error={s.err}>
                <Input />
              </FormField>
            </div>
          </Example>
          <h3 id="horizontal">{c.horizontal}</h3>
          <Example code={`<FormField label="${s.name}" align="horizontal" spacing>\n  <Input />\n</FormField>`}>
            <div style={{ inlineSize: 'var(--grid-column-5)' }}>
              <FormField label={s.name} align="horizontal" spacing>
                <Input />
              </FormField>
            </div>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['size', "'medium' | 'small'", "'medium'"],
              ['type', "'text' | 'search' | 'password' | …", "'text'"],
              ['error', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
              ['iconLeft', 'ReactNode', '—'],
              ['iconRight', 'ReactNode', '—'],
              ['prefix', 'ReactNode', '—'],
              ['suffix', 'ReactNode', '—'],
            ]}
            descriptions={c.props}
          />
          <h3 id="form-field-api">{c.fieldApi}</h3>
          <PropsTable
            props={[
              ['label', 'ReactNode', '—'],
              ['hint', 'ReactNode', '—'],
              ['error', 'ReactNode', '—'],
              ['optional', 'ReactNode', '—'],
              ['align', "'vertical' | 'horizontal'", "'vertical'"],
              ['spacing', 'boolean', 'false'],
            ]}
            descriptions={c.fieldProps}
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
            ['🎛 Type = Text / Search / Password', "type='text' / 'search' / 'password'"],
            ['🎛 Type = Leading Text / Trailing Text', 'prefix="…" / suffix="…"'],
            ['👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['🕹 State = Hover / Focus / Typed', ':hover / :focus-within / filled value'],
            ['Icon (L) / Icon (R)', 'iconLeft={…} / iconRight={…}'],
            ['Error = True', 'error (or FormField error)'],
            ['Disable = True', 'disabled'],
            ['Form Input: Align / Form Spacing', "<FormField align='…' spacing>"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
