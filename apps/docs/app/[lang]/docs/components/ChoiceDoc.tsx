import { Checkbox, ChoiceGroup, Radio, Switch } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ChoicePlayground } from './ChoicePlayground';

// Shared page for Checkbox, Radio and Switch: they share states, form groups and accessibility.
export type ChoiceKind = 'checkbox' | 'radio' | 'switch';

const FIGMA = { checkbox: '1182:0', radio: '1343:0', switch: '1125:0' } as const;
const TITLE = { checkbox: 'Checkbox', radio: 'Radio', switch: 'Switch' } as const;

const COPY = {
  en: {
    description: {
      checkbox: 'Turns an option on or off, alone or in a list where several can be chosen. Supports an indeterminate state for “some selected”.',
      radio: 'Picks exactly one option from a short list.',
      switch: 'Turns a setting on or off with an immediate effect.',
    },
    variants: 'Variants',
    sizes: 'Sizes',
    states: 'States',
    statesText: 'Hover darkens the border to primary, keyboard focus adds the focus ring, error turns the border red, disabled flattens the control.',
    group: 'In a form',
    groupText: 'ChoiceGroup is the Form Checkbox / Radio / Switch pattern: a label, the options 16px apart, and a hint or error.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: {
      checkbox: ['The 6px corner is a raw value in Figma; code adds it as --radius-checkbox.'],
      radio: ['Figma has no focus state for Radio; code uses the Checkbox focus ring so keyboard users can see focus.', 'In the error variant Figma uses Label Type=Hint (a neutral hint); code shows an error Hint, like Checkbox.'],
      switch: [
        'Figma has no focus state for Switch; code uses the focus ring.',
        'The Hover + Active variant moves the thumb back to the start in Figma; code keeps it at the end.',
        'The older “Switch - Deprecated” set uses a 12px label gap; code follows the current set (8px).',
      ],
    },
    usage: 'Usage',
    examples: 'Examples',
    api: 'API reference',
    apiText: 'Accepts every input attribute (checked, defaultChecked, onChange, name, value, …) and forwards its ref to the native input.',
    groupApi: 'ChoiceGroup',
    a11y: 'Accessibility',
    a11yItems: {
      checkbox: ['A native checkbox inside a label: clicking the text toggles it, Space toggles it from the keyboard.', 'indeterminate sets the native indeterminate state, which screen readers announce as “mixed”.', 'ChoiceGroup is a fieldset with a legend, so the group label is read with each option.'],
      radio: ['Native radios with the same name form one group: arrow keys move between them and Tab enters the group once.', 'Wrap the radios in ChoiceGroup so the question is read with each answer.'],
      switch: ['A native checkbox with role="switch": screen readers announce it as on/off and Space toggles it.', 'Use a switch for settings that apply immediately; use a checkbox inside forms that are submitted.'],
    },
    mapping: 'Figma to code',
    sample: { label: 'Remember me', group: 'Notifications', options: ['Email', 'SMS', 'Push'], plan: 'Plan', plans: ['Free', 'Pro', 'Team'], setting: 'Dark mode', error: 'Pick an option' },
    props: {
      label: 'Text next to the control.',
      size: 'Figma Size.',
      checked: 'Controlled state (Checked / Active).',
      indeterminate: 'Figma Indeterminate.',
      error: 'Figma Error; a message is shown under the label (Checkbox, Radio).',
      disabled: 'Figma Disabled.',
      spacing: 'Figma Form Spacing.',
      fluid: 'Figma Fluid: fill the row.',
      labelPosition: 'Figma Label (L) / Label (R).',
    } as Record<string, string>,
    groupProps: { label: 'Group label (legend).', hint: 'Helper text under the options.', error: 'Error message; puts the options in their error state.', orientation: 'Options in a row or a column.', spacing: 'Figma Form Spacing.' } as Record<string, string>,
  },
  tr: {
    description: {
      checkbox: 'Bir seçeneği açar ya da kapatır; tek başına ya da birden çok seçimin yapılabildiği bir listede. “Bazıları seçili” için belirsiz durumu destekler.',
      radio: 'Kısa bir listeden tam olarak bir seçenek seçtirir.',
      switch: 'Bir ayarı anında etkili olacak şekilde açar ya da kapatır.',
    },
    variants: 'Varyantlar',
    sizes: 'Boyutlar',
    states: 'Durumlar',
    statesText: 'Üzerine gelince kenarlık primary’ye döner, klavye odağı odak halkası ekler, hata kenarlığı kırmızı yapar, pasif durum kontrolü sadeleştirir.',
    group: 'Form içinde',
    groupText: 'ChoiceGroup, Form Checkbox / Radio / Switch desenidir: bir label, aralarında 16px olan seçenekler ve bir hint ya da hata.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: {
      checkbox: ['6px köşe Figma’da ham değer; kodda --radius-checkbox olarak eklendi.'],
      radio: ['Figma’da Radio için odak durumu yok; klavye kullanıcıları görebilsin diye kodda Checkbox’ın odak halkası kullanılıyor.', 'Figma’daki hata varyantında Label Type=Hint (nötr bir hint) var; kodda Checkbox’taki gibi hata Hint’i gösteriliyor.'],
      switch: [
        'Figma’da Switch için odak durumu yok; kodda odak halkası kullanılıyor.',
        'Figma’da Hover + Active varyantı topu başa geri alıyor; kodda top sonda kalıyor.',
        'Eski “Switch - Deprecated” setinde label boşluğu 12px; kod güncel seti izliyor (8px).',
      ],
    },
    usage: 'Kullanım',
    examples: 'Örnekler',
    api: 'API',
    apiText: 'Tüm input özniteliklerini (checked, defaultChecked, onChange, name, value, …) kabul eder ve ref’ini yerel input’a iletir.',
    groupApi: 'ChoiceGroup',
    a11y: 'Erişilebilirlik',
    a11yItems: {
      checkbox: ['Label içinde yerel bir checkbox: metne tıklamak işaretler, klavyede Space işaretler.', 'indeterminate yerel belirsiz durumu ayarlar; ekran okuyucular “karışık” olarak okur.', 'ChoiceGroup legend’lı bir fieldset’tir; grup label’ı her seçenekle birlikte okunur.'],
      radio: ['Aynı name’e sahip yerel radio’lar tek grup olur: ok tuşları aralarında gezinir, Tab gruba bir kez girer.', 'Soru her cevapla okunsun diye radio’ları ChoiceGroup içine koyun.'],
      switch: ['role="switch" olan yerel bir checkbox: ekran okuyucular açık/kapalı diye okur, Space değiştirir.', 'Switch’i anında uygulanan ayarlar için kullanın; gönderilen formlarda checkbox kullanın.'],
    },
    mapping: 'Figma’dan koda',
    sample: { label: 'Beni hatırla', group: 'Bildirimler', options: ['E-posta', 'SMS', 'Push'], plan: 'Plan', plans: ['Ücretsiz', 'Pro', 'Ekip'], setting: 'Koyu mod', error: 'Bir seçenek seçin' },
    props: {
      label: 'Kontrolün yanındaki metin.',
      size: 'Figma Size.',
      checked: 'Kontrollü durum (Checked / Active).',
      indeterminate: 'Figma Indeterminate.',
      error: 'Figma Error; label’ın altında mesaj gösterilir (Checkbox, Radio).',
      disabled: 'Figma Disabled.',
      spacing: 'Figma Form Spacing.',
      fluid: 'Figma Fluid: satırı doldurur.',
      labelPosition: 'Figma Label (L) / Label (R).',
    } as Record<string, string>,
    groupProps: { label: 'Grup label’ı (legend).', hint: 'Seçeneklerin altındaki yardım metni.', error: 'Hata mesajı; seçenekleri hata durumuna alır.', orientation: 'Seçenekler satırda ya da sütunda.', spacing: 'Figma Form Spacing.' } as Record<string, string>,
  },
};

const PROPS: Record<ChoiceKind, [string, string, string][]> = {
  checkbox: [
    ['label', 'ReactNode', '—'],
    ['size', "'medium' | 'small'", "'medium'"],
    ['checked', 'boolean', '—'],
    ['indeterminate', 'boolean', 'false'],
    ['error', 'boolean | ReactNode', '—'],
    ['disabled', 'boolean', 'false'],
    ['spacing', 'boolean', 'false'],
  ],
  radio: [
    ['label', 'ReactNode', '—'],
    ['size', "'medium' | 'small'", "'medium'"],
    ['checked', 'boolean', '—'],
    ['error', 'boolean | ReactNode', '—'],
    ['disabled', 'boolean', 'false'],
    ['fluid', 'boolean', 'false'],
    ['spacing', 'boolean', 'false'],
  ],
  switch: [
    ['label', 'ReactNode', '—'],
    ['labelPosition', "'start' | 'end'", "'end'"],
    ['size', "'medium' | 'large'", "'medium'"],
    ['checked', 'boolean', '—'],
    ['error', 'boolean', 'false'],
    ['disabled', 'boolean', 'false'],
  ],
};

const MAPPING: Record<ChoiceKind, [string, string][]> = {
  checkbox: [
    ['Size = Medium / Small', "size='medium' / 'small'"],
    ['Checked / Indeterminate', 'checked / indeterminate'],
    ['with Label = True', 'label="…"'],
    ['Error / Disabled', 'error / disabled'],
    ['🕹 State = Hover / Focus', ':hover / :focus-visible'],
    ['Form Spacing = True', 'spacing'],
    ['Form Checkbox', '<ChoiceGroup label hint>'],
  ],
  radio: [
    ['👕 Size = Medium / Small', "size='medium' / 'small'"],
    ['Checked = True', 'checked'],
    ['with Text = True', 'label="…"'],
    ['Error / Disabled', 'error / disabled'],
    ['Fluid = True', 'fluid'],
    ['Form Spacing = True', 'spacing'],
    ['Form Radio Button', '<ChoiceGroup label hint>'],
  ],
  switch: [
    ['👕 Size = Medium / Large', "size='medium' / 'large'"],
    ['Active = True', 'checked'],
    ['Label (L) / Label (R)', "label=\"…\" labelPosition='start' / 'end'"],
    ['Error / Disabled', 'error / disabled'],
    ['🕹 State = Hover', ':hover'],
    ['Form Switch', '<ChoiceGroup label hint>'],
  ],
};

const TOKENS: Record<ChoiceKind, string[][]> = {
  checkbox: [
    ['Off', '--color-surface-level-1', '--color-surface-level-4'],
    ['Hover / Focus', '--color-surface-level-1', '--color-primary (+ --shadow-focus-primary)'],
    ['On / Indeterminate', '--color-primary', '—', '--color-on-primary'],
    ['Error', '--color-surface-level-1', '--color-error (+ --shadow-focus-error)'],
    ['Disabled off / on', '--color-surface-level-2 / --color-primary-tint', '--color-surface-level-4'],
  ],
  radio: [
    ['Off', '--color-surface-level-1', '--color-foreground-medium-emphasis'],
    ['Hover', '--color-surface-level-1', '--color-primary'],
    ['On', '--color-primary', '—', '--color-on-primary + --shadow-depth-md'],
    ['Error', '--color-surface-level-1', '--color-error'],
    ['Disabled', '--color-surface-level-3', '--color-surface-level-4', '--color-foreground-low-emphasis'],
  ],
  switch: [
    ['Off', '--color-surface-level-3', '—', '--color-on-primary'],
    ['Hover', '--color-primary-soft', '—', '--color-on-primary'],
    ['On', '--color-primary', '—', '--color-on-primary'],
    ['Error off / on', '--color-error-soft / --color-error', '—', '--color-on-error'],
    ['Disabled', '--color-surface-level-1', '--color-surface-level-3', '--color-surface-level-3'],
  ],
};

export function ChoiceDoc({ kind, lang }: { kind: ChoiceKind; lang: Locale }) {
  const t = getDictionary(lang);
  const c = COPY[lang];
  const s = c.sample;
  const Control = (props: { label: string; checked?: boolean; disabled?: boolean; error?: boolean; size?: string; indeterminate?: boolean; state?: 'hover' | 'focus'; name?: string }) => {
    const { state, size, ...rest } = props;
    if (kind === 'checkbox') return <Checkbox {...rest} size={size as 'medium'} data-state={state} readOnly tabIndex={state ? -1 : undefined} />;
    if (kind === 'radio') return <Radio {...rest} name={props.name ?? 'demo'} size={size as 'medium'} data-state={state} readOnly tabIndex={state ? -1 : undefined} />;
    return <Switch {...rest} size={size as 'medium'} data-state={state} readOnly tabIndex={state ? -1 : undefined} />;
  };
  const sizes = kind === 'switch' ? ['medium', 'large'] : ['medium', 'small'];
  const options = kind === 'radio' ? s.plans : s.options;
  const groupLabel = kind === 'radio' ? s.plan : s.group;
  const singleLabel = kind === 'switch' ? s.setting : s.label;
  const Name = TITLE[kind];

  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title={Name} description={c.description[kind]}>
        <ComponentToolbar lang={lang} figmaNode={FIGMA[kind]} />

        <h2 id="playground">{t.component.playground}</h2>
        <ChoicePlayground kind={kind} />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <Example>
            <Control label="Off" name="v" />
            <Control label="On" checked name="v" />
            {kind === 'checkbox' && <Control label="Indeterminate" indeterminate />}
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <Example>
            {sizes.map((size) => (
              <Control key={size} label={size} size={size} checked name={`s-${size}`} />
            ))}
          </Example>

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example>
            <Control label="Default" name="st1" />
            <Control label="Hover" state="hover" name="st2" />
            <Control label="Focus" state="focus" name="st3" />
            <Control label="Error" error name="st4" />
            <Control label="Disabled" disabled name="st5" />
            <Control label="Disabled" disabled checked name="st6" />
          </Example>

          <h2 id="group">{c.group}</h2>
          <p>{c.groupText}</p>
          <Example stack>
            <ChoiceGroup label={groupLabel} hint={kind === 'radio' ? undefined : s.label}>
              {options.map((o, i) => (
                <Control key={o} label={o} checked={i === 0} name="g1" />
              ))}
            </ChoiceGroup>
            <ChoiceGroup label={groupLabel} error={s.error}>
              {options.map((o) => (
                <Control key={o} label={o} name="g2" />
              ))}
            </ChoiceGroup>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', kind === 'switch' ? 'Track' : 'Fill', 'Border', kind === 'switch' ? 'Thumb' : 'Mark']}
            rows={TOKENS[kind].map((r) => r.map((cell, i) => (i && cell && cell !== '—' ? <code key={i}>{cell}</code> : (cell ?? '—'))))}
          />

          <h2 id="figma-notes">{c.notes}</h2>
          <ul>
            {c.notesItems[kind].map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <Example code={`import { ${Name} } from '@ladom/ui';\n\n<${Name} label="${singleLabel}" ${kind === 'radio' ? 'name="plan" value="pro" ' : ''}defaultChecked />`}>
            <Control label={singleLabel} checked name="u" />
          </Example>

          <h2 id="examples">{c.examples}</h2>
          <Example
            stack
            code={`import { ${Name}, ChoiceGroup } from '@ladom/ui';

<ChoiceGroup label="${groupLabel}" error={error}>
${options.map((o, i) => `  <${Name} label="${o}"${kind === 'radio' ? ` name="plan" value="${i}"` : ''} />`).join('\n')}
</ChoiceGroup>`}
          >
            <ChoiceGroup label={groupLabel} error={s.error}>
              {options.map((o) => (
                <Control key={o} label={o} name="d1" />
              ))}
            </ChoiceGroup>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable props={PROPS[kind]} descriptions={c.props} />
          <h3 id="choice-group-api">{c.groupApi}</h3>
          <PropsTable
            props={[
              ['label', 'ReactNode', '—'],
              ['hint', 'ReactNode', '—'],
              ['error', 'ReactNode', '—'],
              ['orientation', "'horizontal' | 'vertical'", "'horizontal'"],
              ['spacing', 'boolean', 'false'],
            ]}
            descriptions={c.groupProps}
          />

          <h2 id="accessibility">{c.a11y}</h2>
          <ul>
            {c.a11yItems[kind].map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ForView>

        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable rows={MAPPING[kind]} />
      </DocPage>
    </ViewProvider>
  );
}
