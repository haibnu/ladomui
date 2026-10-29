import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import meta from '@ladom/tokens/tokens.json';
import { ModeSwitcher } from './ModeSwitcher';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Tokens · Ladom UI' };

type Row = { name: string; figma?: string; source?: string; added?: boolean; description?: string; values: Partial<Record<string, string>> };

function Preview({ group, name }: { group: string; name: string }): ReactNode {
  const v = `var(${name})`;
  switch (group) {
    case 'color':
      return <span className={styles.swatch} style={{ background: v }} />;
    case 'typography':
      if (!name.startsWith('--text-') || name.endsWith('-letter-spacing') || name.endsWith('-text-transform')) return null;
      return (
        <span
          style={{
            font: v,
            letterSpacing: `var(${name}-letter-spacing, normal)`,
            textTransform: `var(${name}-text-transform, none)` as CSSProperties['textTransform'],
          }}
        >
          Çağrı İşığı
        </span>
      );
    case 'space':
    case 'size':
    case 'grid':
      if (/-columns$/.test(name)) return null;
      return <span className={styles.bar} style={{ width: v }} />;
    case 'radius':
      return <span className={styles.box} style={{ borderRadius: v }} />;
    case 'shadow':
      return <span className={styles.box} style={{ boxShadow: v }} />;
    case 'border':
      return name === '--border' || name === '--border-dashed' ? <span className={styles.box} style={{ border: v }} /> : null;
    default:
      return null;
  }
}

function Values({ values }: { values: Row['values'] }) {
  const entries = Object.entries(values).filter((e): e is [string, string] => e[1] !== undefined);
  if (new Set(entries.map(([, value]) => value)).size === 1) return <code>{entries[0]?.[1]}</code>;
  return (
    <ul className={styles.modes}>
      {entries.map(([mode, value]) => (
        <li key={mode}>
          <span className={styles.mode}>{mode}</span> <code>{value}</code>
        </li>
      ))}
    </ul>
  );
}

export default function TokensPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tokens</h1>
        <ModeSwitcher />
      </header>
      <nav className={styles.toc}>
        {meta.groups.map((g) => (
          <a key={g.id} href={`#${g.id}`}>
            {g.title}
          </a>
        ))}
      </nav>
      {meta.groups.map((g) => {
        const rows: Row[] = [...g.variables, ...g.tokens.map((t) => ({ name: t.name, source: t.source, values: { '': t.value } }))];
        return (
          <section key={g.id} id={g.id} className={styles.section}>
            <h2 className={styles.heading}>
              {g.title} <span className={styles.count}>{rows.length}</span>
            </h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name}>
                    <td>
                      <code>{row.name}</code>
                      <div className={styles.source}>
                        {row.figma ?? row.source}
                        {row.added && ' · added in code'}
                      </div>
                      {row.description && <div className={styles.source}>{row.description}</div>}
                    </td>
                    <td>
                      <Values values={row.values} />
                    </td>
                    <td>
                      <Preview group={g.id} name={row.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </main>
  );
}
