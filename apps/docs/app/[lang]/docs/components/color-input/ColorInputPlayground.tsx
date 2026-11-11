'use client';

import { useState } from 'react';
import { ColorInput, FormField, type InputSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { size: 'Size', presets: 'Presets', error: 'Error', disabled: 'Disabled', figma: 'Variant', code: 'Code', label: 'Brand color', errorText: 'Pick a darker color.', value: 'Value', picker: 'Pick a color', custom: 'Custom color', colors: 'Colors' },
  tr: { size: 'Boyut', presets: 'Hazır renkler', error: 'Hata', disabled: 'Devre dışı', figma: 'Varyant', code: 'Kod', label: 'Marka rengi', errorText: 'Daha koyu bir renk seçin.', value: 'Değer', picker: 'Renk seç', custom: 'Özel renk', colors: 'Renkler' },
};

const PRESETS = ['#4f46e5', '#2563eb', '#0891b2', '#059669', '#65a30d', '#d97706', '#dc2626', '#db2777', '#9333ea', '#475569', '#111827'];

export function ColorInputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState('#4f46e5');
  const [size, setSize] = useState<InputSize>('medium');
  const [presets, setPresets] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const code = `import { ColorInput } from '@/components/ladom';\n\n<ColorInput\n  value={color}\n  onValueChange={setColor}${presets ? `\n  presets={['#4f46e5', '#2563eb', '#0891b2', …]}` : ''}${size !== 'medium' ? `\n  size="${size}"` : ''}${error ? '\n  error' : ''}${disabled ? '\n  disabled' : ''}\n/>`;
  const figma = `Color Input (Input)\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🕹 State=${disabled ? 'Disabled' : error ? 'Error' : 'Typed'}\nSwatch=${presets ? 'Popover with presets' : 'Color picker'}\nLeading Text=#`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: size === 'medium' ? 240 : 200 }}>
          <FormField label={c.label} error={error ? c.errorText : undefined}>
            <ColorInput
              value={value}
              onValueChange={setValue}
              presets={presets ? PRESETS : undefined}
              size={size}
              disabled={disabled}
              pickerLabel={c.picker}
              customLabel={c.custom}
              presetsLabel={c.colors}
            />
          </FormField>
        </div>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlCheck label={c.presets} checked={presets} onChange={setPresets} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <p style={{ margin: 0 }}>
          {c.value}: <code>{value}</code>
        </p>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
