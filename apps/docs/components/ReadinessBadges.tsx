'use client';

import { usePathname } from 'next/navigation';
import { Badge } from '@ladom/ui';
import { readinessOf } from './readiness';
import { useLocale } from './useLocale';
import styles from './shell.module.css';

/** Figma ready / not ready and Code ready / not ready on component and molecule pages. */
export function ReadinessBadges() {
  const pathname = usePathname();
  const { t } = useLocale();
  const status = readinessOf(pathname);
  if (!status) return null;
  const item = (name: string, ready: boolean) => (
    <Badge size="micro" tone={ready ? 'success' : 'warning'}>
      {name}: {ready ? t.readiness.ready : t.readiness.notReady}
    </Badge>
  );
  return (
    <div className={styles.readiness} role="group" aria-label={t.readiness.label}>
      {item(t.readiness.figma, status.figma)}
      {item(t.readiness.code, status.code)}
    </div>
  );
}
