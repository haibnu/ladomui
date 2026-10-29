import type { ReactNode } from 'react';
import { IconExternalLink } from '@ladom/icons';
import { getDictionary, type Locale } from '@/i18n';
import { ViewSwitch } from './ViewSwitch';
import styles from './docs.module.css';

const FIGMA_FILE = 'https://www.figma.com/design/VCJ6ew9Vk1gAqfnvQ1gfOz/Ladom-UI-Design-System';
export const figmaUrl = (nodeId: string) => `${FIGMA_FILE}?node-id=${nodeId.replace(':', '-')}`;

/** Designer/developer switch and the link to the component's Figma page. */
export function ComponentToolbar({ lang, figmaNode }: { lang: Locale; figmaNode: string }) {
  const t = getDictionary(lang);
  return (
    <div className={styles.toolbar}>
      <ViewSwitch />
      <a href={figmaUrl(figmaNode)} target="_blank" rel="noreferrer" className={styles.figmaLink}>
        {t.component.figmaLink} <IconExternalLink size={14} />
      </a>
    </div>
  );
}

/** A plain table; cells may hold code or text. */
export function SpecTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** API reference: [name, type, default] plus a description per prop. */
export function PropsTable({ props, descriptions }: { props: [string, string, string][]; descriptions: Record<string, string> }) {
  return (
    <SpecTable
      head={['Prop', 'Type', 'Default', '']}
      rows={props.map(([name, type, def]) => [<code key="n">{name}</code>, <code key="t">{type}</code>, <code key="d">{def}</code>, descriptions[name]])}
    />
  );
}

/** Figma property -> React prop. */
export function MappingTable({ rows }: { rows: [string, string][] }) {
  return <SpecTable head={['Figma', 'React']} rows={rows.map(([f, r]) => [f, <code key="r">{r}</code>])} />;
}
