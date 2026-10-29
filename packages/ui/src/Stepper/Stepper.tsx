import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import styles from './Stepper.module.css';

// Figma: Components / Stepper (node 2496:6853) with .Stepper Item (2496:6838). Steps before the
// current one are Success, the current one shows its number and title, the rest are Next.
export type StepperProps = HTMLAttributes<HTMLOListElement> & {
  /** Step titles; the current step shows its title, the others are read by screen readers. */
  steps: ReactNode[];
  /** Index of the current step, from 0. */
  current: number;
};

export const Stepper = forwardRef<HTMLOListElement, StepperProps>(function Stepper({ steps, current, className, ...rest }, ref) {
  return (
    <ol ref={ref} className={[styles.stepper, className].filter(Boolean).join(' ')} {...rest}>
      {steps.map((title, i) => {
        const state = i < current ? 'success' : i === current ? 'current' : 'next';
        return (
          <li key={i} className={styles.step} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className={styles.number}>{i + 1}</span>
            <span className={state === 'current' ? styles.title : styles.visuallyHidden}>{title}</span>
          </li>
        );
      })}
    </ol>
  );
});
