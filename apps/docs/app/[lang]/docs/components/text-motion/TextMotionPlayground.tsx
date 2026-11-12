'use client';

import { useState } from 'react';
import { Button, Cell, Dropdown, TextMotion, type ButtonTone, type TextMotionDirection, type TextMotionEffect, type TextMotionTrigger } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect, ControlText } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { effect: 'Effect', label: 'Label', direction: 'Direction', trigger: 'Trigger', stagger: 'One character after another', host: 'Inside', tone: 'Button tone', code: 'Code', text: 'Get started', hint: 'Hover or focus the button.' },
  tr: { effect: 'Efekt', label: 'Etiket', direction: 'Yön', trigger: 'Tetikleyici', stagger: 'Harfler sırayla', host: 'İçinde', tone: 'Buton tonu', code: 'Kod', text: 'Hemen başlayın', hint: 'Butonun üzerine gelin ya da odaklanın.' },
};

type Host = 'button' | 'ghost' | 'link' | 'cell';

export function TextMotionPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [text, setText] = useState(c.text);
  const [effect, setEffect] = useState<TextMotionEffect>('roll');
  const [direction, setDirection] = useState<TextMotionDirection>('up');
  const [trigger, setTrigger] = useState<TextMotionTrigger>('parent');
  const [stagger, setStagger] = useState(true);
  const [host, setHost] = useState<Host>('button');
  const [tone, setTone] = useState<ButtonTone>('primary');

  const motion = (
    <TextMotion effect={effect} direction={direction} trigger={trigger} stagger={stagger}>
      {text}
    </TextMotion>
  );
  const props = [effect !== 'roll' && `effect="${effect}"`, direction !== 'up' && `direction="${direction}"`, trigger !== 'parent' && `trigger="${trigger}"`, !stagger && 'stagger={false}'].filter(Boolean);
  const inner = `<TextMotion${props.length ? ' ' + props.join(' ') : ''}>${text}</TextMotion>`;
  const wrapped =
    host === 'link'
      ? `<a href="/start">\n  ${inner}\n</a>`
      : host === 'cell'
        ? `<Dropdown role="listbox">\n  <Cell role="option" aria-selected={false}>\n    ${inner}\n  </Cell>\n</Dropdown>`
        : `<Button${host === 'ghost' ? ' variant="ghost"' : ''}${tone !== 'primary' ? ` tone="${tone}"` : ''}>\n  ${inner}\n</Button>`;
  const code = `import { ${host === 'link' ? '' : host === 'cell' ? 'Cell, Dropdown, ' : 'Button, '}TextMotion } from '@ladom/ui';\n\n${wrapped}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        {host === 'cell' ? (
          <Dropdown role="listbox" aria-label={c.label} style={{ inlineSize: '100%', maxInlineSize: 280 }}>
            {[0, 1, 2].map((i) => (
              <Cell key={i} role="option" aria-selected={i === 0} selected={i === 0} tabIndex={0}>
                <TextMotion effect={effect} direction={direction} trigger={trigger} stagger={stagger}>{`${text} ${i + 1}`}</TextMotion>
              </Cell>
            ))}
          </Dropdown>
        ) : host === 'link' ? (
          <a href="#text-motion" onClick={(e) => e.preventDefault()} style={{ font: 'var(--text-ui-text-lead-bold)', color: 'var(--color-link-color)' }}>
            {motion}
          </a>
        ) : host === 'ghost' ? (
          <Button variant="ghost" tone={tone === 'info' ? 'primary' : (tone as Exclude<ButtonTone, 'info'>)} size="large">
            {motion}
          </Button>
        ) : (
          <Button tone={tone} size="large">
            {motion}
          </Button>
        )}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlSelect label={c.effect} value={effect} options={['roll', 'blur', 'flip', 'wave']} onChange={setEffect} />
        <ControlText label={c.label} value={text} onChange={setText} />
        <ControlSelect label={c.direction} value={direction} options={['up', 'down']} onChange={setDirection} />
        <ControlSelect label={c.trigger} value={trigger} options={['parent', 'self']} onChange={setTrigger} />
        <ControlCheck label={c.stagger} checked={stagger} onChange={setStagger} />
        <ControlSelect label={c.host} value={host} options={['button', 'ghost', 'link', 'cell']} onChange={setHost} />
        {(host === 'button' || host === 'ghost') && <ControlSelect label={c.tone} value={tone} options={['primary', 'secondary', 'tertiary', 'success', 'error']} onChange={setTone} />}
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
