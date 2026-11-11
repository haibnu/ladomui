'use client';

import { useState } from 'react';
import { ScrollArea, type ScrollAreaOrientation } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { orientation: 'Orientation', always: 'Always show the scrollbars', code: 'Code', region: 'Release notes', note: (i: number) => `Release ${i}: a short note about what changed in this version.` },
  tr: { orientation: 'Yön', always: 'Kaydırma çubukları hep görünsün', code: 'Kod', region: 'Sürüm notları', note: (i: number) => `Sürüm ${i}: bu sürümde neyin değiştiğine dair kısa bir not.` },
};

const box = { border: 'var(--border)', borderRadius: 'var(--radius-card)', background: 'var(--color-surface-level-1)' };
const cell = { padding: 'var(--space-tiny) var(--space-small)', font: 'var(--text-ui-text-small-regular)', color: 'var(--color-foreground-high-emphasis)' };

export function ScrollAreaPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [orientation, setOrientation] = useState<ScrollAreaOrientation>('vertical');
  const [always, setAlways] = useState(false);

  const rows = Array.from({ length: 24 }, (_, i) => i + 1);
  const wide = orientation !== 'vertical';
  const tall = orientation !== 'horizontal';

  const props = [orientation !== 'vertical' && `orientation="${orientation}"`, always && 'scrollbars="always"', `viewportProps={{ tabIndex: 0, 'aria-label': '${c.region}' }}`].filter(Boolean);
  const code = `import { ScrollArea } from '@ladom/ui';\n\n<ScrollArea${props.map((p) => `\n  ${p}`).join('')}\n  style={{ maxBlockSize: 240 }}\n>\n  {notes}\n</ScrollArea>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <ScrollArea
          key={orientation}
          orientation={orientation}
          scrollbars={always ? 'always' : 'auto'}
          viewportProps={{ tabIndex: 0, 'aria-label': c.region }}
          style={{ ...box, maxBlockSize: tall ? 240 : undefined, inlineSize: '100%', maxInlineSize: 360 }}
        >
          {wide && !tall ? (
            <div style={{ display: 'flex', gap: 'var(--space-tiny)', padding: 'var(--space-small)', inlineSize: 'max-content' }}>
              {rows.map((i) => (
                <span key={i} style={{ ...cell, flex: 'none', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-level-3)' }}>
                  v1.{i}
                </span>
              ))}
            </div>
          ) : (
            <div style={{ inlineSize: wide ? 640 : undefined }}>
              {rows.map((i) => (
                <div key={i} style={{ ...cell, borderBlockEnd: i < rows.length ? 'var(--border)' : undefined }}>
                  {c.note(i)}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.orientation} value={orientation} options={['vertical', 'horizontal', 'both']} onChange={setOrientation} />
        <ControlCheck label={c.always} checked={always} onChange={setAlways} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
