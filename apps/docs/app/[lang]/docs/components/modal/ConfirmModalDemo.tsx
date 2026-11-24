'use client';

import { useState } from 'react';
import { Button, ConfirmModal, type ConfirmModalTone } from '@ladom/ui';
import { useLocale } from '@/components/useLocale';
import styles from '@/components/docs/docs.module.css';

type Sample = { label: string; title: string; text: string; confirm: string };

const COPY: Record<'en' | 'tr', { cancel: string; close: string; samples: Record<ConfirmModalTone, Sample> }> = {
  en: {
    cancel: 'Cancel',
    close: 'Close',
    samples: {
      danger: { label: 'Danger', title: 'Delete Project?', text: 'The project and its files are removed for everyone. This cannot be undone.', confirm: 'Delete' },
      warning: { label: 'Warning', title: 'Change the Owner?', text: 'The new owner can remove you from the project.', confirm: 'Change Owner' },
      info: { label: 'Info', title: 'New Version Available', text: 'Reload the page to get the latest changes. Your work is saved.', confirm: 'Reload' },
      default: { label: 'General', title: 'Leave This Page?', text: 'You can come back to it from the menu at any time.', confirm: 'Leave' },
    },
  },
  tr: {
    cancel: 'Vazgeç',
    close: 'Kapat',
    samples: {
      danger: { label: 'Dikkat', title: 'Proje Silinsin mi?', text: 'Proje ve dosyaları herkes için kaldırılır. Bu işlem geri alınamaz.', confirm: 'Sil' },
      warning: { label: 'Uyarı', title: 'Sahip Değiştirilsin mi?', text: 'Yeni sahip sizi projeden çıkarabilir.', confirm: 'Sahibi Değiştir' },
      info: { label: 'Bilgilendirme', title: 'Yeni Sürüm Hazır', text: 'Son değişiklikler için sayfayı yenileyin. Çalışmanız kaydedildi.', confirm: 'Yenile' },
      default: { label: 'Genel', title: 'Sayfadan Çıkılsın mı?', text: 'Menüden istediğiniz zaman geri dönebilirsiniz.', confirm: 'Çık' },
    },
  },
};

const TONES: ConfirmModalTone[] = ['danger', 'warning', 'info', 'default'];
const BUTTON_TONE = { danger: 'error', warning: 'warning', info: 'info', default: 'primary' } as const;

export function ConfirmModalDemo() {
  const { lang } = useLocale();
  const c = COPY[lang];
  const [open, setOpen] = useState<ConfirmModalTone | null>(null);
  return (
    <div className={styles.preview}>
      {TONES.map((tone) => (
        <Button key={tone} variant="ghost" tone="tertiary" onClick={() => setOpen(tone)}>
          {c.samples[tone].label}
        </Button>
      ))}
      {TONES.map((tone) => (
        <ConfirmModal
          key={tone}
          tone={tone}
          open={open === tone}
          onClose={() => setOpen(null)}
          closeLabel={c.close}
          title={c.samples[tone].title}
          description={c.samples[tone].text}
          footer={
            <>
              <Button variant="ghost" tone="tertiary" onClick={() => setOpen(null)}>
                {c.cancel}
              </Button>
              <Button tone={BUTTON_TONE[tone]} onClick={() => setOpen(null)}>
                {c.samples[tone].confirm}
              </Button>
            </>
          }
        />
      ))}
    </div>
  );
}
