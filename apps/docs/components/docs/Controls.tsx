'use client';

import { Checkbox, FormField, Input, NumberInput, Selectbox } from '@ladom/ui';

// Playground controls, built from Ladom UI components.

type Option<T extends string> = T | { value: T; label: string };

export function ControlSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  return (
    <FormField label={label}>
      <Selectbox
        size="small"
        value={value}
        disabled={disabled}
        options={options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))}
        onChange={(v) => onChange(v as T)}
      />
    </FormField>
  );
}

export function ControlCheck({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <Checkbox size="small" label={label} checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />;
}

export function ControlText({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <FormField label={label}>
      <Input size="small" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </FormField>
  );
}

export function ControlNumber({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <FormField label={label}>
      <NumberInput size="small" value={value} min={min} max={max} step={step} onValueChange={(v) => onChange(v ?? min ?? 0)} />
    </FormField>
  );
}
