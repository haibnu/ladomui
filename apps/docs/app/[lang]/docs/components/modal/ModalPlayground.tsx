'use client';

import { useState } from 'react';
import { Button, Drawer, Modal, type ModalSize } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const SIZES: ModalSize[] = ['small', 'medium', 'large'];
const COPY = {
  en: { open: 'Open', size: 'Size', side: 'Side', description: 'Description', footer: 'Footer', dismissible: 'Close on Esc and overlay', figma: 'Figma variant', code: 'Code', title: 'Delete project', text: 'The project and its files are removed for everyone.', body: 'You can restore it from the trash for 30 days.', cancel: 'Cancel', confirm: 'Delete', close: 'Close', drawerTitle: 'Filters', drawerText: 'Narrow the list down.', drawerBody: 'Put the filter fields here.', apply: 'Apply' },
  tr: { open: 'Aç', size: 'Boyut', side: 'Taraf', description: 'Açıklama', footer: 'Alt bölüm', dismissible: 'Esc ve overlay ile kapansın', figma: 'Figma varyantı', code: 'Kod', title: 'Projeyi sil', text: 'Proje ve dosyaları herkes için kaldırılır.', body: '30 gün boyunca çöp kutusundan geri yükleyebilirsiniz.', cancel: 'Vazgeç', confirm: 'Sil', close: 'Kapat', drawerTitle: 'Filtreler', drawerText: 'Listeyi daraltın.', drawerBody: 'Filtre alanlarını buraya koyun.', apply: 'Uygula' },
};

export function ModalPlayground({ kind = 'modal' }: { kind?: 'modal' | 'drawer' }) {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>('medium');
  const [side, setSide] = useState<'right' | 'left'>('right');
  const [description, setDescription] = useState(true);
  const [footer, setFooter] = useState(true);
  const [dismissible, setDismissible] = useState(true);
  const drawer = kind === 'drawer';
  const title = drawer ? c.drawerTitle : c.title;
  const text = drawer ? c.drawerText : c.text;
  const actions = (
    <>
      <Button variant="ghost" tone="tertiary" onClick={() => setOpen(false)}>
        {c.cancel}
      </Button>
      <Button tone={drawer ? 'primary' : 'error'} onClick={() => setOpen(false)}>
        {drawer ? c.apply : c.confirm}
      </Button>
    </>
  );
  const shared = {
    open,
    onClose: () => setOpen(false),
    title,
    description: description ? text : undefined,
    footer: footer ? actions : undefined,
    dismissible,
    closeLabel: c.close,
    children: <p style={{ margin: 0 }}>{drawer ? c.drawerBody : c.body}</p>,
  };
  const Name = drawer ? 'Drawer' : 'Modal';
  const props = [
    'open={open}',
    'onClose={() => setOpen(false)}',
    !drawer && size !== 'medium' && `size="${size}"`,
    drawer && side !== 'right' && `side="${side}"`,
    `title="${title}"`,
    description && `description="${text}"`,
    footer && 'footer={<>…</>}',
    !dismissible && 'dismissible={false}',
  ].filter(Boolean);
  const code = `import { ${Name} } from '@/components/ladom';\n\n<${Name}${props.map((p) => `\n  ${p}`).join('')}\n>\n  …\n</${Name}>`;
  const figma = drawer
    ? `👉 Position=${side === 'right' ? 'Right' : 'Left'}\nFooter=${footer ? 'True' : 'False'}\n.Modal Header › Description=${description ? 'True' : 'False'}`
    : `👕 Size=${size.charAt(0).toUpperCase() + size.slice(1)}\nFooter=${footer ? 'True' : 'False'}\n.Modal Header › Description=${description ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Button onClick={() => setOpen(true)}>
          {c.open} {Name}
        </Button>
        {drawer ? <Drawer side={side} {...shared} /> : <Modal size={size} {...shared} />}
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        {drawer ? (
          <ControlSelect label={c.side} value={side} options={['right', 'left'] as const} onChange={setSide} />
        ) : (
          <ControlSelect label={c.size} value={size} options={SIZES} onChange={setSize} />
        )}
        <ControlCheck label={c.description} checked={description} onChange={setDescription} />
        <ControlCheck label={c.footer} checked={footer} onChange={setFooter} />
        <ControlCheck label={c.dismissible} checked={dismissible} onChange={setDismissible} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
