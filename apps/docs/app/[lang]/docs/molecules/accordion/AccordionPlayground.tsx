'use client';

import { useState } from 'react';
import { Badge } from '@ladom/ui';
import { Accordion } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: { subtitle: 'Subtitle', bodycopy: 'Bodycopy', header: 'Header slot', figma: 'Figma variant', code: 'Code', items: [['Shipping', 'Delivery times and costs', 'Orders ship within 2 working days. Shipping is free over 500 TL.'], ['Returns', 'Within 14 days', 'Send items back unused, in their box, within 14 days of delivery.'], ['Payment', 'Cards and bank transfer', 'We take all major cards and bank transfers.']], extra: '2 min read', badge: 'New' },
  tr: { subtitle: 'Alt başlık', bodycopy: 'Bodycopy', header: 'Başlık slotu', figma: 'Figma varyantı', code: 'Kod', items: [['Kargo', 'Teslim süreleri ve ücretler', 'Siparişler 2 iş günü içinde kargolanır. 500 TL üzeri kargo ücretsizdir.'], ['İade', '14 gün içinde', 'Ürünleri kullanılmamış ve kutusunda, teslimattan sonraki 14 gün içinde geri gönderin.'], ['Ödeme', 'Kart ve havale', 'Tüm yaygın kartları ve havaleyi kabul ediyoruz.']], extra: '2 dk okuma', badge: 'Yeni' },
};

export function AccordionPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [subtitle, setSubtitle] = useState(true);
  const [bodycopy, setBodycopy] = useState(false);
  const [header, setHeader] = useState(false);
  const [open, setOpen] = useState(0);

  const props = [`title="${c.items[0]![0]}"`, subtitle && `subtitle="${c.items[0]![1]}"`, bodycopy && `bodycopy="${c.extra}"`, header && `header={<Badge size="tiny" tone="primary">${c.badge}</Badge>}`, 'open={open}', 'onOpenChange={setOpen}'].filter(Boolean);
  const code = `import { Accordion } from '@ladom/ui';\n\n<Accordion${props.map((p) => `\n  ${p}`).join('')}\n>\n  ${c.items[0]![2]}\n</Accordion>`;
  const figma = `State=${open === 0 ? 'Expand' : 'Collapse'}\nSubtitle=${subtitle ? 'True' : 'False'}\nBodycopy=${bodycopy ? 'True' : 'False'}\nHeader Slot=${header ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-small)', inlineSize: '100%' }}>
        {c.items.map(([title, sub, body], i) => (
          <Accordion
            key={title}
            title={title}
            subtitle={subtitle ? sub : undefined}
            bodycopy={bodycopy ? c.extra : undefined}
            header={header ? <Badge size="tiny" tone="primary">{c.badge}</Badge> : undefined}
            open={open === i}
            onOpenChange={(o) => setOpen(o ? i : -1)}
          >
            {body}
          </Accordion>
        ))}
        </div>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.subtitle} checked={subtitle} onChange={setSubtitle} />
        <ControlCheck label={c.bodycopy} checked={bodycopy} onChange={setBodycopy} />
        <ControlCheck label={c.header} checked={header} onChange={setHeader} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
