'use client';

import { useState } from 'react';
import { FormField, NumberInput, type InputSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlNumber, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { size: 'Size', min: 'Min', max: 'Max', step: 'Step', error: 'Error', disabled: 'Disabled', figma: 'Figma variant', code: 'Code', label: 'Quantity', errorText: 'Not enough in stock.', value: 'Value', decrease: 'Decrease', increase: 'Increase' },
  tr: { size: 'Boyut', min: 'En az', max: 'En çok', step: 'Adım', error: 'Hata', disabled: 'Devre dışı', figma: 'Figma varyantı', code: 'Kod', label: 'Adet', errorText: 'Stokta yeterli yok.', value: 'Değer', decrease: 'Azalt', increase: 'Artır' },
};

export function NumberInputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState<number | null>(1);
  const [size, setSize] = useState<InputSize>('medium');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(10);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const code = `import { NumberInput } from '@/components/ladom';\n\n<NumberInput\n  value={value}\n  onValueChange={setValue}\n  min={${min}}\n  max={${max}}${step !== 1 ? `\n  step={${step}}` : ''}${size !== 'medium' ? `\n  size="${size}"` : ''}${disabled ? '\n  disabled' : ''}\n/>`;
  const figma = `Number Input\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🕹 State=${disabled ? 'Disabled' : error ? 'Error' : 'Default'}\nValue=${value ?? ''}`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: size === 'medium' ? 160 : 128 }}>
          <FormField label={c.label} error={error ? c.errorText : undefined}>
            <NumberInput
              value={value}
              onValueChange={setValue}
              min={min}
              max={max}
              step={step}
              size={size}
              disabled={disabled}
              decrementLabel={c.decrease}
              incrementLabel={c.increase}
            />
          </FormField>
        </div>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlNumber label={c.min} value={min} onChange={setMin} />
        <ControlNumber label={c.max} value={max} onChange={setMax} />
        <ControlNumber label={c.step} value={step} min={1} onChange={setStep} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <p style={{ margin: 0 }}>
          {c.value}: <code>{String(value)}</code>
        </p>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
