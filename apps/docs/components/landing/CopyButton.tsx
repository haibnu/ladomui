'use client';

import { useState } from 'react';
import { IconCheck, IconCopy } from '@ladom/icons';
import styles from './landing.module.css';

/** Copies `text` to the clipboard; the icon turns into a check for a moment. */
export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the text can still be selected by hand.
    }
  };
  return (
    <button type="button" className={styles.copy} onClick={copy} aria-label={copied ? copiedLabel : label}>
      {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
    </button>
  );
}
