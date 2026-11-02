'use client';

import { useState } from 'react';
import { Button, Tooltip, type Placement } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { FIGMA_POSITION } from './positions';

const PLACEMENTS: Placement[] = ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'];
const COPY = {
  en: { placement: 'Placement', beak: 'Beak', pinned: 'Keep open', text: 'Text', figma: 'Figma variant', code: 'Code', sample: 'Copies the link', button: 'Share' },
  tr: { placement: 'Konum', beak: 'Ok', pinned: 'Açık tut', text: 'Metin', figma: 'Figma varyantı', code: 'Kod', sample: 'Bağlantıyı kopyalar', button: 'Paylaş' },
};

export function TooltipPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [placement, setPlacement] = useState<Placement>('top');
  const [beak, setBeak] = useState(true);
  const [pinned, setPinned] = useState(true);
  const [text, setText] = useState(c.sample);

  const props = [`content="${text}"`, placement !== 'top' && `placement="${placement}"`, !beak && 'beak={false}'].filter(Boolean);
  const code = `import { Button, Tooltip } from '@ladom/ui';\n\n<Tooltip${props.map((p) => ` ${p}`).join('')}>\n  <Button>${c.button}</Button>\n</Tooltip>`;
  const figma = `👉 Position=${FIGMA_POSITION[placement]}\n🤥 Beak=${beak ? 'True' : 'False'}\n🎛 Type=Default`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage} style={{ minBlockSize: 240 }}>
        <Tooltip content={text} placement={placement} beak={beak} open={pinned || undefined}>
          <Button tone="secondary">{c.button}</Button>
        </Tooltip>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.placement} value={placement} options={PLACEMENTS} onChange={setPlacement} />
        <ControlText label={c.text} value={text} onChange={setText} />
        <ControlCheck label={c.beak} checked={beak} onChange={setBeak} />
        <ControlCheck label={c.pinned} checked={pinned} onChange={setPinned} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
