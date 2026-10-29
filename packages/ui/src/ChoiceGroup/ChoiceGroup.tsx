'use client';

import { createContext, useContext, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { Hint } from '../Hint/Hint';
import labelStyles from '../Label/Label.module.css';
import styles from './ChoiceGroup.module.css';

// Figma: Form Checkbox (6089:25438), Form Radio Button (6089:25218), Form Switch (151:11745):
// a label, the options in a row (16px apart, 8px above and below), and a hint.
// Options inside take the group's error state.
type GroupContextValue = { invalid: boolean; describedBy?: string };
const GroupContext = createContext<GroupContextValue | null>(null);
export const useChoiceGroup = () => useContext(GroupContext);

export type ChoiceGroupProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> & {
  label?: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  /** Error message; replaces the hint and puts the options in their error state. */
  error?: ReactNode;
  /** Options side by side (Figma) or stacked. */
  orientation?: 'horizontal' | 'vertical';
  /** Adds the form gutter below the group (Figma Form Spacing=True). */
  spacing?: boolean;
};

export function ChoiceGroup({ label, children, hint, error, orientation = 'horizontal', spacing = false, className, ...rest }: ChoiceGroupProps) {
  const id = useId();
  const message = error ?? hint;
  const messageId = message != null ? `${id}-message` : undefined;
  return (
    <GroupContext.Provider value={{ invalid: error != null, describedBy: messageId }}>
      <fieldset className={[styles.group, className].filter(Boolean).join(' ')} data-spacing={spacing || undefined} aria-describedby={messageId} {...rest}>
        {label != null && (
          <legend className={styles.legend}>
            <span className={labelStyles.label}>{label}</span>
          </legend>
        )}
        <div className={styles.options} data-orientation={orientation}>
          {children}
        </div>
        {message != null && (
          <Hint id={messageId} tone={error != null ? 'error' : 'default'} withForm role={error != null ? 'alert' : undefined}>
            {message}
          </Hint>
        )}
      </fieldset>
    </GroupContext.Provider>
  );
}
