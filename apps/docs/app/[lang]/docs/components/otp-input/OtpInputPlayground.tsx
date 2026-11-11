'use client';

import { useState } from 'react';
import { FormField, OtpInput, Switch, type InputSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { length: 'Length', size: 'Size', mask: 'Mask', separator: 'Separator', error: 'Error', disabled: 'Disabled', figma: 'Variant', code: 'Code', label: 'Verification code', hint: 'Enter the code we sent to your phone.', errorText: 'The code is not correct.', value: 'Value', complete: 'Complete' },
  tr: { length: 'Uzunluk', size: 'Boyut', mask: 'Maskele', separator: 'Ayraç', error: 'Hata', disabled: 'Devre dışı', figma: 'Varyant', code: 'Kod', label: 'Doğrulama kodu', hint: 'Telefonunuza gönderdiğimiz kodu girin.', errorText: 'Kod doğru değil.', value: 'Değer', complete: 'Tamamlandı' },
};

const LENGTHS = ['4', '6', '8'] as const;

export function OtpInputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState('');
  const [length, setLength] = useState<(typeof LENGTHS)[number]>('6');
  const [size, setSize] = useState<InputSize>('medium');
  const [mask, setMask] = useState(false);
  const [separator, setSeparator] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const n = Number(length);
  const groups = separator ? [n / 2, n / 2] : undefined;
  const code = `import { OtpInput } from '@/components/ladom';\n\n<OtpInput\n  value={code}\n  onValueChange={setCode}\n  onComplete={verify}${n !== 6 ? `\n  length={${n}}` : ''}${groups ? `\n  groups={[${groups.join(', ')}]}` : ''}${mask ? '\n  mask' : ''}${size !== 'medium' ? `\n  size="${size}"` : ''}${error ? '\n  error' : ''}${disabled ? '\n  disabled' : ''}\n/>`;
  const figma = `OTP Input (${n} × Input)\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🕹 State=${disabled ? 'Disabled' : error ? 'Error' : 'Typed'}\nSeparator=${separator ? `Icon/remove after ${n / 2}` : 'None'}\nMask=${mask ? 'True (circle)' : 'False'}`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <FormField label={c.label} hint={error ? undefined : c.hint} error={error ? c.errorText : undefined}>
          <OtpInput key={length} value={value} onValueChange={setValue} length={n} groups={groups} mask={mask} size={size} disabled={disabled} />
        </FormField>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect
          label={c.length}
          value={length}
          options={LENGTHS}
          onChange={(v) => {
            setLength(v);
            setValue((s) => s.slice(0, Number(v)));
          }}
        />
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <Switch label={c.mask} checked={mask} onChange={(e) => setMask(e.target.checked)} />
        <ControlCheck label={c.separator} checked={separator} onChange={setSeparator} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <p style={{ margin: 0 }}>
          {c.value}: <code>{value === '' ? '""' : value}</code>
          {value.length === n && ` · ${c.complete}`}
        </p>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
