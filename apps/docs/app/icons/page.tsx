import type { Metadata } from 'next';
import { IconGallery } from './IconGallery';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Icons · Ladom UI' };

export default function IconsPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Icons</h1>
      <p className={styles.lead}>
        Each icon name maps to exactly one icon: Tabler outline icons, plus custom icons from the Figma file. Use them as
        components, e.g. <code>{'<IconPhone size={20} />'}</code> from <code>@ladom/icons</code>.
      </p>
      <IconGallery />
    </main>
  );
}
