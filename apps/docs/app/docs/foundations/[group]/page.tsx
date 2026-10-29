import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { notFound } from 'next/navigation';
import meta from '@ladom/tokens/tokens.json';
import { DocPage } from '../../../../components/DocPage';
import { ModeSwitcher } from './ModeSwitcher';
import styles from './page.module.css';

type Group = (typeof meta.groups)[number];
type Row = { name: string; figma?: string; source?: string; added?: boolean; description?: string; values: Partial<Record<string, string>> };

const DESCRIPTIONS: Record<string, string> = {
  color: 'Theme colors from the Figma 02 Theme collection. Light is the default; Dark is opt-in.',
  typography: 'Font, sizes, weights and line heights, and every Figma text style as a font shorthand.',
  space: 'Spacing scale, semantic spacing and the layout density scale (Comfort / Narrow).',
  radius: 'Corner radius for layouts, cards and form elements.',
  size: 'Modal widths and page content widths.',
  grid: 'Column widths and the column grids used in Figma.',
  border: 'The default line and its color.',
  shadow: 'Depth, focus rings and lines from the Figma effect styles.',
  motion: 'Durations and transitions from the Figma Animation page.',
};

export function generateStaticParams() {
  return meta.groups.map((g) => ({ group: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }): Promise<Metadata> {
  const { group: id } = await params;
  return { title: meta.groups.find((g) => g.id === id)?.title };
}

// Color sections in the order of the Figma Colors page; other groups keep their natural order.
const COLOR_ORDER = ['surface', 'foreground', 'primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'error', 'static', 'opacity'];
const sectionRank = (group: Group, section: string) => {
  const i = group.id === 'color' ? COLOR_ORDER.indexOf(section) : -1;
  return i === -1 ? COLOR_ORDER.length : i;
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Section of a row: the Figma folder of a variable (surface, radius, size...), or the style folder of a token.
function sectionOf(group: Group, row: Row): string {
  if (row.figma) {
    const path = row.figma.split(' / ')[1]!.split('/');
    return path.length > 1 ? path[path.length - 2]! : group.title;
  }
  const source = row.source ?? '';
  if (group.id === 'typography') return `Text styles: ${source.split('/')[0]}`;
  if (group.id === 'shadow') return source.split('/')[0] ?? 'Effects';
  if (group.id === 'grid') return `${source}`;
  return group.title;
}

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

export default async function FoundationPage({ params }: { params: Promise<{ group: string }> }) {
  const { group: id } = await params;
  const group = meta.groups.find((g) => g.id === id);
  if (!group) notFound();

  const rows: Row[] = [...group.variables, ...group.tokens.map((t) => ({ name: t.name, source: t.source, values: { '': t.value } }))];
  const sections = new Map<string, Row[]>();
  for (const row of rows) {
    const s = sectionOf(group, row);
    sections.set(s, [...(sections.get(s) ?? []), row]);
  }

  return (
    <DocPage eyebrow="Foundations" title={group.title} description={DESCRIPTIONS[group.id]}>
      <ModeSwitcher />
      {[...sections].sort(([a], [b]) => sectionRank(group, a) - sectionRank(group, b)).map(([section, list]) => (
        <section key={section}>
          <h2 id={slug(section)} className={styles.sectionTitle}>
            {section} <span className={styles.count}>{list.length}</span>
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
              {list.map((row) => (
                <tr key={row.name} id={row.name.slice(2)}>
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
                    <Preview group={group.id} name={row.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </DocPage>
  );
}
