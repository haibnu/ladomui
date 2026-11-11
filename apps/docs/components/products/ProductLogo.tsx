import styles from './products.module.css';

// Logos of the made-up companies in the product demos. Each mark is one shape in one color (the
// inner figure is a cut-out), filled with --color-primary, so it takes the brand color from Customize.
const MARKS = {
  // Kuzey ("north"): a north-pointing arrow cut out of a disc.
  hr: 'M12 0a12 12 0 1 0 0 24a12 12 0 1 0 0-24ZM12 4.6l5.4 13.2L12 14.9l-5.4 2.9Z',
} as const;

export type ProductKey = keyof typeof MARKS;

/** A demo product's mark, optionally with its name and a line under it. */
export function ProductLogo({ product, name, sub, size = 32 }: { product: ProductKey; name?: string; sub?: string; size?: number }) {
  const mark = (
    <svg className={styles.logoMark} viewBox="0 0 24 24" width={size} height={size} aria-hidden={name ? true : undefined} role={name ? undefined : 'img'}>
      <path fillRule="evenodd" d={MARKS[product]} />
    </svg>
  );
  if (!name) return mark;
  return (
    <span className={styles.logo}>
      {mark}
      <span className={styles.logoText}>
        <strong>{name}</strong>
        {sub && <span>{sub}</span>}
      </span>
    </span>
  );
}
