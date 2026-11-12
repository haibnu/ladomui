'use client';

import { useEffect, useState } from 'react';
import { IconCheck, IconCopy } from '@ladom/icons';
import { Button, ScrollArea } from '@ladom/ui';
import { useLocale } from '../useLocale';
import { detectLanguage, forPackageManager, hasPackageManagerTabs, highlight, PACKAGE_MANAGERS, type Language, type PackageManager } from './highlight';
import styles from './CodeBlock.module.css';

// The package manager picked on one block applies to every block on the site.
const PM_KEY = 'ladom-docs-pm';
const PM_EVENT = 'ladom-docs-pm';
const readPm = (): PackageManager => {
  try {
    const v = localStorage.getItem(PM_KEY);
    return PACKAGE_MANAGERS.includes(v as PackageManager) ? (v as PackageManager) : 'npm';
  } catch {
    return 'npm';
  }
};

const LABELS: Record<Language, string> = { bash: 'terminal', tsx: 'tsx', css: 'css', text: 'text' };

/** A code sample: a grey shell with a header (package-manager tabs, a label, copy) around a card
 *  with numbered, highlighted lines. */
export function CodeBlock({
  code,
  className,
  language,
  title,
  lineNumbers,
  wrap,
}: {
  code: string;
  className?: string;
  /** Detected from the code when omitted. */
  language?: Language;
  /** The header label; the language name by default ("terminal" for shell commands). */
  title?: string;
  /** Defaults to on for code of two or more lines, off for shell commands and text. */
  lineNumbers?: boolean;
  /** Wraps long lines instead of scrolling them (prose such as prompts). */
  wrap?: boolean;
}) {
  const { t } = useLocale();
  const lang = language ?? detectLanguage(code);
  const tabs = lang === 'bash' && hasPackageManagerTabs(code);
  const [pm, setPm] = useState<PackageManager>('npm');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tabs) return;
    setPm(readPm());
    const sync = () => setPm(readPm());
    window.addEventListener(PM_EVENT, sync);
    return () => window.removeEventListener(PM_EVENT, sync);
  }, [tabs]);

  const pick = (next: PackageManager) => {
    setPm(next);
    try {
      localStorage.setItem(PM_KEY, next);
    } catch {
      // Storage unavailable; only this block switches.
    }
    window.dispatchEvent(new Event(PM_EVENT));
  };

  const shown = tabs ? forPackageManager(code, pm) : code;
  const lines = highlight(shown.replace(/\n$/, ''), lang);
  const numbered = lineNumbers ?? (lang !== 'bash' && lang !== 'text' && lines.length > 1);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked; the code can still be selected by hand.
    }
  };

  return (
    <div className={[styles.block, className].filter(Boolean).join(' ')} data-lang={lang}>
      {tabs && (
        <div className={styles.tabs} role="tablist" aria-label="Package manager">
          {PACKAGE_MANAGERS.map((name) => (
            <button key={name} type="button" role="tab" aria-selected={pm === name} className={styles.tab} onClick={() => pick(name)}>
              {name}
            </button>
          ))}
        </div>
      )}
      <div className={styles.header}>
        <span className={styles.label}>{title ?? LABELS[lang]}</span>
        <Button variant="ghost" tone="secondary" size="small" icon={copied ? IconCheck : IconCopy} onClick={copy} aria-label={copied ? t.component.copied : t.component.copy} />
      </div>
      <div className={styles.card}>
        <ScrollArea orientation={wrap ? 'vertical' : 'horizontal'} className={styles.scroll}>
          <pre className={styles.pre} data-wrap={wrap || undefined}>
            <code>
              {lines.map((line, n) => (
                <span key={n} className={styles.line}>
                  {numbered && (
                    <span className={styles.number} aria-hidden>
                      {n + 1}
                    </span>
                  )}
                  <span className={styles.text}>
                    {line.length
                      ? line.map((tok, i) => (
                          <span key={i} data-tok={tok.kind}>
                            {tok.text}
                          </span>
                        ))
                      : '​'}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
}
