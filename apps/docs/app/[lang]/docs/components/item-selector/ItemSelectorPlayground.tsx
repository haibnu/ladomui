'use client';

import { useState } from 'react';
import { FormField, ItemSelector } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const FOLDERS = ['/Reports/2026', '/Reports/2026/Q3', '/Invoices', '/Shared/Design'];
const COPY = {
  en: { selected: 'Selected', hover: 'Hover', disabled: 'Disabled', error: 'Error', label: 'Label', hint: 'Hint', spacing: 'Form spacing', figma: 'Figma variant', code: 'Code', fieldLabel: 'Export folder', fieldHint: 'Reports are saved here', errorText: 'Pick a folder', placeholder: 'Select a folder', action: 'Change folder' },
  tr: { selected: 'Seçili', hover: 'Hover', disabled: 'Pasif', error: 'Hata', label: 'Label', hint: 'Hint', spacing: 'Form boşluğu', figma: 'Figma varyantı', code: 'Kod', fieldLabel: 'Dışa aktarma klasörü', fieldHint: 'Raporlar buraya kaydedilir', errorText: 'Bir klasör seçin', placeholder: 'Klasör seçin', action: 'Klasörü değiştir' },
};

export function ItemSelectorPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState('');
  const [flags, setFlags] = useState({ hover: false, disabled: false, error: false, label: false, hint: false, spacing: false });
  const set = (k: keyof typeof flags, v: boolean) => setFlags({ ...flags, [k]: v });
  // The docs "picker" cycles through a few folders.
  const pick = () => setValue(FOLDERS[(FOLDERS.indexOf(value) + 1) % FOLDERS.length]!);

  const selector = (
    <ItemSelector
      value={value}
      placeholder={c.placeholder}
      actionLabel={c.action}
      disabled={flags.disabled}
      error={flags.label || flags.hint ? undefined : flags.error}
      data-state={flags.hover ? 'hover' : undefined}
      aria-label={flags.label ? undefined : c.fieldLabel}
      onClick={pick}
    />
  );
  const withField = flags.label || flags.hint;
  const props = [
    'value={folder}',
    `placeholder="${c.placeholder}"`,
    `actionLabel="${c.action}"`,
    flags.disabled && 'disabled',
    !withField && flags.error && 'error',
    'onClick={openFolderPicker}',
  ].filter(Boolean);
  const tag = `<ItemSelector${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const code = withField
    ? `<FormField label="${c.fieldLabel}"${flags.hint && !flags.error ? ` hint="${c.fieldHint}"` : ''}${flags.error ? ` error="${c.errorText}"` : ''}${flags.spacing ? ' spacing' : ''}>\n  ${tag.replace(/\n/g, '\n  ')}\n</FormField>`
    : tag;
  const figma = `🕹 State=${flags.hover ? 'Hover' : 'Default'}\nSelected=${value ? 'True' : 'False'}\nDisabled=${flags.disabled ? 'True' : 'False'}\nError=${flags.error ? 'True' : 'False'}\nLabel=${flags.label ? 'True' : 'False'}\nHint=${flags.hint ? 'True' : 'False'}\nForm Spacing=${flags.spacing ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: 300 }}>
          {withField ? (
            <FormField
              label={flags.label ? c.fieldLabel : ''}
              hint={flags.hint ? c.fieldHint : undefined}
              error={flags.error ? c.errorText : undefined}
              spacing={flags.spacing}
            >
              {selector}
            </FormField>
          ) : (
            selector
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <label className={styles.check}>
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => setValue(e.target.checked ? FOLDERS[0]! : '')} /> {c.selected}
        </label>
        {(['hover', 'disabled', 'error', 'label', 'hint', 'spacing'] as const).map((k) => (
          <label key={k} className={styles.check}>
            <input type="checkbox" checked={flags[k]} onChange={(e) => set(k, e.target.checked)} /> {c[k]}
          </label>
        ))}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : `import { ItemSelector } from '@ladom/ui';\n\n${code}`} />
      </div>
    </div>
  );
}
