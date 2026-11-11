'use client';

import { useState } from 'react';
import { PersonCell } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

type Size = 'medium' | 'small' | 'tiny';

const COPY = {
  en: {
    clickable: 'Clickable',
    subtitle: 'Subtitle',
    photos: 'Photos',
    status: 'Status dot',
    size: 'Avatar size',
    code: 'Code',
    opened: 'Opened',
    people: [
      { name: 'Elif Aydın', subtitle: 'CEO' },
      { name: 'Mert Kaya', subtitle: 'Engineering Lead' },
      { name: 'Zeynep Demir', subtitle: 'People Partner' },
    ],
  },
  tr: {
    clickable: 'Tıklanabilir',
    subtitle: 'Alt satır',
    photos: 'Fotoğraflar',
    status: 'Durum noktası',
    size: 'Avatar boyutu',
    code: 'Kod',
    opened: 'Açılan',
    people: [
      { name: 'Elif Aydın', subtitle: 'CEO' },
      { name: 'Mert Kaya', subtitle: 'Mühendislik Lideri' },
      { name: 'Zeynep Demir', subtitle: 'İK İş Ortağı' },
    ],
  },
};

export function PersonCellPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [clickable, setClickable] = useState(true);
  const [subtitle, setSubtitle] = useState(true);
  const [photos, setPhotos] = useState(false);
  const [status, setStatus] = useState(false);
  const [size, setSize] = useState<Size>('small');
  const [opened, setOpened] = useState<string | null>(null);

  const attrs = [
    '  name="Elif Aydın"',
    subtitle && '  subtitle="CEO"',
    photos && '  src="/photos/elif.jpg"',
    size !== 'small' && `  avatarSize="${size}"`,
    status && '  status',
    clickable && '  onClick={() => openProfile(id)}',
  ].filter(Boolean);
  const code = `import { PersonCell } from '@ladom/ui/pro';\n\n<PersonCell\n${attrs.join('\n')}\n/>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-medium)' }}>
          {c.people.map((p, i) => (
            <PersonCell
              key={p.name}
              name={p.name}
              subtitle={subtitle ? p.subtitle : undefined}
              src={photos ? `/avatars/${i + 1}.svg` : undefined}
              avatarSize={size}
              status={status}
              onClick={clickable ? () => setOpened(p.name) : undefined}
            />
          ))}
          {clickable && opened && (
            <p style={{ margin: 0 }}>
              {c.opened}: {opened}
            </p>
          )}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.clickable} checked={clickable} onChange={setClickable} />
        <ControlCheck label={c.subtitle} checked={subtitle} onChange={setSubtitle} />
        <ControlCheck label={c.photos} checked={photos} onChange={setPhotos} />
        <ControlCheck label={c.status} checked={status} onChange={setStatus} />
        <ControlSelect label={c.size} value={size} options={['medium', 'small', 'tiny'] as const} onChange={setSize} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
