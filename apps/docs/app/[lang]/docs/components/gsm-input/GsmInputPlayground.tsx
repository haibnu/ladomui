'use client';

import { useState } from 'react';
import { FormField, GsmInput, type InputSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { size: 'Size', select: 'Country picker', error: 'Error', disabled: 'Disabled', figma: 'Variant', code: 'Code', label: 'Phone', errorText: 'Enter a complete phone number.', value: 'Value', country: 'Country', hint: 'Try pasting “+90 0532 123 45 67”.' },
  tr: { size: 'Boyut', select: 'Ülke seçici', error: 'Hata', disabled: 'Devre dışı', figma: 'Varyant', code: 'Kod', label: 'Telefon', errorText: 'Numarayı eksiksiz girin.', value: 'Değer', country: 'Ülke', hint: '“+90 0532 123 45 67” yapıştırmayı deneyin.' },
};

export function GsmInputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState<string | null>(null);
  const [country, setCountry] = useState('TR');
  const [size, setSize] = useState<InputSize>('medium');
  const [select, setSelect] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const code = `import { GsmInput } from '@/components/ladom';\n\n<GsmInput\n  value={phone}\n  onValueChange={setPhone}\n  country={country}${select ? '\n  onCountryChange={setCountry}' : '\n  countrySelect={false}'}\n  locale="${locale}"${size !== 'medium' ? `\n  size="${size}"` : ''}${error ? '\n  error' : ''}${disabled ? '\n  disabled' : ''}\n/>`;
  const figma = `Input\n🎛 Type=GSM\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🕹 State=${value ? 'Typed' : 'Default'}\nError=${error ? 'True' : 'False'}\nDisable=${disabled ? 'True' : 'False'}`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: size === 'medium' ? 280 : 240 }}>
          <FormField label={c.label} hint={error ? undefined : c.hint} error={error ? c.errorText : undefined}>
            <GsmInput
              value={value}
              onValueChange={setValue}
              country={country}
              onCountryChange={setCountry}
              countrySelect={select}
              locale={locale}
              size={size}
              disabled={disabled}
              countryLabel={c.country}
            />
          </FormField>
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlCheck label={c.select} checked={select} onChange={setSelect} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <p style={{ margin: 0 }}>
          {c.value}: <code>{String(value)}</code> <code>{country}</code>
        </p>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
