'use client';

import { useState } from 'react';
import { Avatar, type AvatarSize } from '@ladom/ui';
import { IconAdd } from '@ladom/icons';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type Kind = 'image' | 'name' | 'icon';
type State = 'default' | 'hover';
const SIZES: AvatarSize[] = ['xlarge', 'medium', 'small', 'tiny', 'micro'];
const FIGMA_STYLE: Record<Kind, string> = { image: 'Image', name: 'Name Surname', icon: 'Icon' };
const FIGMA_SIZE: Record<AvatarSize, string> = { xlarge: 'XLarge', medium: 'Medium', small: 'Small', tiny: 'Tiny', micro: 'Micro' };
const COPY = {
  en: { content: 'Content', size: 'Size', state: 'State', name: 'Name', status: 'Status', notification: 'Notification', figma: 'Figma variant', code: 'Code' },
  tr: { content: 'İçerik', size: 'Boyut', state: 'Durum', name: 'İsim', status: 'Durum noktası', notification: 'Bildirim', figma: 'Figma varyantı', code: 'Kod' },
};

export function AvatarPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [kind, setKind] = useState<Kind>('image');
  const [size, setSize] = useState<AvatarSize>('medium');
  const [state, setState] = useState<State>('default');
  const [name, setName] = useState('Halil Nuroğlu');
  const [status, setStatus] = useState(false);
  const [notification, setNotification] = useState(false);

  const content = kind === 'image' ? { src: '/avatars/1.svg', name } : kind === 'name' ? { name } : { icon: <IconAdd />, 'aria-label': 'Add' };
  const props = [
    size !== 'medium' && `size="${size}"`,
    kind === 'image' && 'src="/avatars/1.svg"',
    kind !== 'icon' && `name="${name}"`,
    kind === 'icon' && 'icon={<IconAdd />} aria-label="Add"',
    status && 'status',
    notification && 'notification={2}',
  ].filter(Boolean);
  const code = `import { Avatar } from '@ladom/ui';\n\n<Avatar${props.map((p) => ` ${p}`).join('')} />`;
  const figma = `💅 Style=${FIGMA_STYLE[kind]}\n👕 Size=${FIGMA_SIZE[size]}\n🕹 State=${state === 'hover' ? 'Hover' : 'Default'}\n🟢 Status=${status ? 'True' : 'False'}\n🔔 Notification=${notification ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Avatar size={size} status={status} notification={notification ? 2 : undefined} data-state={state === 'hover' ? 'hover' : undefined} {...content} />
      </div>
      <div className={styles.controls}>
        <label>
          {c.content}
          <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
            <option>image</option>
            <option>name</option>
            <option>icon</option>
          </select>
        </label>
        <label>
          {c.size}
          <select value={size} onChange={(e) => setSize(e.target.value as AvatarSize)}>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          {c.state}
          <select value={state} onChange={(e) => setState(e.target.value as State)}>
            <option>default</option>
            <option>hover</option>
          </select>
        </label>
        <label>
          {c.name}
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={status} onChange={(e) => setStatus(e.target.checked)} /> {c.status}
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={notification} onChange={(e) => setNotification(e.target.checked)} /> {c.notification}
        </label>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
