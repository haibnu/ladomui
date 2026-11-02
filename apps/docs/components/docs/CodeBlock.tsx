'use client';

import { useState } from 'react';
import { IconCheck, IconCopy } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { useLocale } from '../useLocale';
import styles from './docs.module.css';

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the code can still be selected by hand.
    }
  };
  return (
    <div className={[styles.code, className].filter(Boolean).join(' ')}>
      <Button className={styles.copy} variant="ghost" tone="secondary" size="small" icon={copied ? IconCheck : IconCopy} onClick={copy} aria-label={copied ? t.component.copied : t.component.copy} />
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
