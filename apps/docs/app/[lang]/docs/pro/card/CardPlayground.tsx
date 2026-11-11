'use client';

import { useState } from 'react';
import { IconAdd, IconArrowRight } from '@ladom/icons';
import { Button } from '@ladom/ui';
import { BarList, Card } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';
import { ThemeRow } from '@/components/customize/ThemeRow';

const COPY = {
  en: {
    title: 'Title',
    description: 'Description',
    actions: 'Actions',
    footer: 'Footer',
    heading: 'Heading level',
    titleStyle: 'Title style',
    titleStyles: { default: 'Default', caption: 'Caption' },
    code: 'Code',
    cardTitle: 'Headcount by department',
    cardDescription: '16 employees in 4 departments',
    viewAll: 'View all',
    add: 'Add employee',
    departments: ['Engineering', 'Sales', 'Operations', 'People'],
  },
  tr: {
    title: 'Başlık',
    description: 'Açıklama',
    actions: 'Aksiyonlar',
    footer: 'Alt kısım',
    heading: 'Başlık seviyesi',
    titleStyle: 'Başlık stili',
    titleStyles: { default: 'Varsayılan', caption: 'Caption' },
    code: 'Kod',
    cardTitle: 'Departmanlara göre çalışanlar',
    cardDescription: '4 departmanda 16 çalışan',
    viewAll: 'Tümünü gör',
    add: 'Çalışan ekle',
    departments: ['Mühendislik', 'Satış', 'Operasyon', 'İnsan Kaynakları'],
  },
};

const COUNTS = [7, 4, 3, 2];

export function CardPlayground() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [title, setTitle] = useState(true);
  const [description, setDescription] = useState(true);
  const [actions, setActions] = useState(true);
  const [footer, setFooter] = useState(true);
  const [level, setLevel] = useState<'2' | '3' | '4'>('2');
  const [titleStyle, setTitleStyle] = useState<'default' | 'caption'>('default');

  const attrs = [
    title && '  title="Headcount by department"',
    title && description && '  description="16 employees in 4 departments"',
    actions && '  actions={<Button variant="ghost" size="small" iconRight={IconArrowRight}>View all</Button>}',
    footer && '  footer={<Button variant="ghost" size="small" iconLeft={IconAdd}>Add employee</Button>}',
    level !== '2' && `  headingLevel={${level}}`,
    titleStyle !== 'default' && '  titleStyle="caption"',
  ].filter(Boolean);
  const code = `import { BarList, Card } from '@ladom/ui/pro';\n\n<Card${attrs.length ? `\n${attrs.join('\n')}\n` : ''}>\n  <BarList items={departments} />\n</Card>`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <Card
          style={{ inlineSize: '100%', maxInlineSize: 'var(--grid-column-4)' }}
          title={title ? c.cardTitle : undefined}
          description={title && description ? c.cardDescription : undefined}
          headingLevel={Number(level) as 2 | 3 | 4}
          titleStyle={titleStyle}
          actions={
            actions ? (
              <Button variant="ghost" size="small" iconRight={IconArrowRight}>
                {c.viewAll}
              </Button>
            ) : undefined
          }
          footer={
            footer ? (
              <Button variant="ghost" size="small" iconLeft={IconAdd}>
                {c.add}
              </Button>
            ) : undefined
          }
        >
          <BarList items={c.departments.map((label, i) => ({ key: label, label, value: COUNTS[i] ?? 0 }))} />
        </Card>
      </div>
      <div className={styles.controls}>
        <ThemeRow />
        <ControlCheck label={c.title} checked={title} onChange={setTitle} />
        <ControlCheck label={c.description} checked={description} onChange={setDescription} disabled={!title} />
        <ControlCheck label={c.actions} checked={actions} onChange={setActions} />
        <ControlCheck label={c.footer} checked={footer} onChange={setFooter} />
        <ControlSelect label={c.heading} value={level} options={['2', '3', '4'] as const} onChange={setLevel} />
        <ControlSelect
          label={c.titleStyle}
          value={titleStyle}
          onChange={setTitleStyle}
          options={[
            { value: 'default', label: c.titleStyles.default },
            { value: 'caption', label: c.titleStyles.caption },
          ]}
        />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{c.code}</p>
        <CodeBlock code={code} />
      </div>
    </div>
  );
}
