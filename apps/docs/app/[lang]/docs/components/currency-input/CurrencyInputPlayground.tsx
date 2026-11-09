'use client';

import { useState } from 'react';
import { CurrencyInput, FormField, type InputSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { size: 'Size', locale: 'Locale', select: 'Currency picker', symbol: 'Symbol', error: 'Error', disabled: 'Disabled', figma: 'Variant', code: 'Code', label: 'Amount', errorText: 'Enter an amount above zero.', value: 'Value', currency: 'Currency' },
  tr: { size: 'Boyut', locale: 'Yerel ayar', select: 'Para birimi seçici', symbol: 'Simge', error: 'Hata', disabled: 'Devre dışı', figma: 'Varyant', code: 'Kod', label: 'Tutar', errorText: 'Sıfırdan büyük bir tutar girin.', value: 'Değer', currency: 'Para birimi' },
};

const LOCALES = ['en-US', 'tr-TR', 'de-DE', 'fr-FR'] as const;

export function CurrencyInputPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [value, setValue] = useState<number | null>(1250);
  const [currency, setCurrency] = useState(lang === 'tr' ? 'TRY' : 'USD');
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>(lang === 'tr' ? 'tr-TR' : 'en-US');
  const [size, setSize] = useState<InputSize>('medium');
  const [select, setSelect] = useState(true);
  const [symbol, setSymbol] = useState(true);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const code = `import { CurrencyInput } from '@/components/ladom';\n\n<CurrencyInput\n  value={amount}\n  onValueChange={setAmount}\n  currency={currency}${select ? '\n  onCurrencyChange={setCurrency}' : '\n  currencySelect={false}'}\n  locale="${locale}"${symbol ? '' : '\n  showSymbol={false}'}${size !== 'medium' ? `\n  size="${size}"` : ''}${disabled ? '\n  disabled' : ''}\n/>`;
  const figma = `Currency Input (Input)\n👕 Size=${size === 'medium' ? 'Medium' : 'Small'}\n🕹 State=${disabled ? 'Disabled' : error ? 'Error' : 'Default'}\nLeading Text=${symbol ? 'symbol' : 'off'}\nCurrency picker=${select ? currency : 'off'}`;
  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: size === 'medium' ? 280 : 240 }}>
          <FormField label={c.label} error={error ? c.errorText : undefined}>
            <CurrencyInput
              value={value}
              onValueChange={setValue}
              currency={currency}
              onCurrencyChange={setCurrency}
              currencySelect={select}
              showSymbol={symbol}
              locale={locale}
              size={size}
              disabled={disabled}
              currencyLabel={c.currency}
            />
          </FormField>
        </div>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.size} value={size} options={['medium', 'small'] as const} onChange={setSize} />
        <ControlSelect label={c.locale} value={locale} options={LOCALES} onChange={setLocale} />
        <ControlCheck label={c.select} checked={select} onChange={setSelect} />
        <ControlCheck label={c.symbol} checked={symbol} onChange={setSymbol} />
        <ControlCheck label={c.error} checked={error} onChange={setError} />
        <ControlCheck label={c.disabled} checked={disabled} onChange={setDisabled} />
        <p style={{ margin: 0 }}>
          {c.value}: <code>{String(value)}</code> <code>{currency}</code>
        </p>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
