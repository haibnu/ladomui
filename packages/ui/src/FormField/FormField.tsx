'use client';

import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Hint } from '../Hint/Hint';
import { Label } from '../Label/Label';
import styles from './FormField.module.css';

// Figma: Components / Input / Form Input (node 2521:468): Label + form element + Hint.
// align = Align, spacing = Form Spacing. The field inside gets its id, aria-describedby and
// error state from this context, so <FormField><Input /></FormField> is wired up as is. A field
// can put a count at the end of the hint row with setCount (Textarea's character count).
type FieldContextValue = { id: string; describedBy?: string; invalid: boolean; setCount: (count: ReactNode) => void };
const FieldContext = createContext<FieldContextValue | null>(null);
export const useFieldContext = () => useContext(FieldContext);

export type FormFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  label: ReactNode;
  children: ReactNode;
  /** Helper text under the field. */
  hint?: ReactNode;
  /** Error message; replaces the hint and puts the field in its error state. */
  error?: ReactNode;
  /** Text at the end of the label row, e.g. "Optional". */
  optional?: ReactNode;
  /** Label above (vertical) or beside (horizontal) the field. */
  align?: 'vertical' | 'horizontal';
  /** Adds the form gutter below the field (Figma Form Spacing=True). */
  spacing?: boolean;
  /** Id for the field; generated when omitted. */
  fieldId?: string;
};

export function FormField({ label, children, hint, error, optional, align = 'vertical', spacing = false, fieldId, className, ...rest }: FormFieldProps) {
  const generated = useId();
  const id = fieldId ?? `field-${generated}`;
  const [count, setCount] = useState<ReactNode>(null);
  const message = error ?? hint;
  const messageId = message != null ? `${id}-message` : undefined;
  const hintEl =
    message != null ? (
      <Hint id={messageId} tone={error != null ? 'error' : 'default'} withForm={count == null} role={error != null ? 'alert' : undefined}>
        {message}
      </Hint>
    ) : null;
  return (
    <FieldContext.Provider value={{ id, describedBy: messageId, invalid: error != null, setCount }}>
      <div className={[styles.field, className].filter(Boolean).join(' ')} data-align={align} data-spacing={spacing || undefined} {...rest}>
        <div className={styles.labelCell}>
          <Label htmlFor={id} withFormElement optional={optional}>
            {label}
          </Label>
        </div>
        <div className={styles.control}>
          {children}
          {count != null ? (
            <div className={styles.messageRow}>
              {hintEl}
              {count}
            </div>
          ) : (
            hintEl
          )}
        </div>
      </div>
    </FieldContext.Provider>
  );
}
