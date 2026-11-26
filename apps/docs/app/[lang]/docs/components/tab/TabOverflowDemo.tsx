'use client';

import { Tabs } from '@ladom/ui';
import { Example } from '@/components/docs/Example';
import { useLocale } from '@/components/useLocale';

const LABELS = {
  en: ['Overview', 'Activity', 'Members', 'Settings', 'Billing', 'Usage', 'Logs', 'Integrations', 'Security', 'Audit Log'],
  tr: ['Genel Bakış', 'Etkinlik', 'Üyeler', 'Ayarlar', 'Fatura', 'Kullanım', 'Kayıtlar', 'Entegrasyonlar', 'Güvenlik', 'Denetim Kaydı'],
};

// A narrow box with more tabs than fit; the active tab is near the end, so the row opens scrolled to it.
export function TabOverflowDemo() {
  const { lang } = useLocale();
  const items = LABELS[lang].map((label, i) => ({ value: String(i), label }));
  return (
    <Example>
      <div style={{ inlineSize: '100%', maxInlineSize: 360 }}>
        <Tabs items={items} defaultValue="8" border aria-label={lang === 'tr' ? 'Proje' : 'Project'} />
      </div>
    </Example>
  );
}
