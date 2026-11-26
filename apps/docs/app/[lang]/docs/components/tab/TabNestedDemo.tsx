'use client';

import { Tabs, type TabsItem } from '@ladom/ui';
import { Example } from '@/components/docs/Example';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: { label: 'Project', overview: 'Overview', activity: 'Activity', settings: 'Settings', general: 'General', members: 'Members', billing: 'Billing', notifications: 'Notifications', all: 'All', comments: 'Comments', files: 'Files', content: 'Content of' },
  tr: { label: 'Proje', overview: 'Genel Bakış', activity: 'Etkinlik', settings: 'Ayarlar', general: 'Genel', members: 'Üyeler', billing: 'Fatura', notifications: 'Bildirimler', all: 'Tümü', comments: 'Yorumlar', files: 'Dosyalar', content: 'İçerik:' },
};

// Tabs in tabs: Activity and Settings open a second row of Secondary tabs; each remembers its pick.
export function TabNestedDemo() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const leaf = (value: string, label: string): TabsItem => ({ value, label, content: <p style={{ margin: 0 }}>{`${c.content} ${label}`}</p> });
  const items: TabsItem[] = [
    leaf('overview', c.overview),
    { value: 'activity', label: c.activity, badge: 4, items: [leaf('activity-all', c.all), { ...leaf('activity-comments', c.comments), badge: 4 }, leaf('activity-files', c.files)] },
    { value: 'settings', label: c.settings, items: [leaf('settings-general', c.general), leaf('settings-members', c.members), leaf('settings-billing', c.billing), leaf('settings-notifications', c.notifications)] },
  ];
  return (
    <Example>
      <Tabs items={items} defaultValue="settings" border aria-label={c.label} style={{ inlineSize: '100%' }} />
    </Example>
  );
}
