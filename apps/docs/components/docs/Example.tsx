import type { ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import styles from './docs.module.css';

/** A live preview with the code that produces it. */
export function Example({ children, code, stack }: { children: ReactNode; code?: string; stack?: boolean }) {
  return (
    <div className={styles.example}>
      <div className={styles.preview} data-stack={stack || undefined}>
        {children}
      </div>
      {code && <CodeBlock code={code} className={styles.exampleCode} />}
    </div>
  );
}
