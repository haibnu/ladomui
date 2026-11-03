'use client';

import { useState } from 'react';
import { FileShare, type FileSharePerson } from '@ladom/ui/pro';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

const COPY = {
  en: {
    pictures: 'Pictures',
    online: 'Online dots',
    figma: 'Figma variant',
    code: 'Code',
    roles: [{ value: 'edit', label: 'Can Edit' }, { value: 'comment', label: 'Can Comment' }, { value: 'view', label: 'Can View' }],
    strings: { title: 'Share this file', linkLabel: 'Link', copyLabel: 'Copy Link', copiedLabel: 'Copied', peopleLabel: 'People with access', roleLabel: 'Access level' },
  },
  tr: {
    pictures: 'Görseller',
    online: 'Çevrimiçi noktası',
    figma: 'Figma varyantı',
    code: 'Kod',
    roles: [{ value: 'edit', label: 'Düzenleyebilir' }, { value: 'comment', label: 'Yorum yapabilir' }, { value: 'view', label: 'Görüntüleyebilir' }],
    strings: { title: 'Bu dosyayı paylaş', linkLabel: 'Bağlantı', copyLabel: 'Bağlantıyı kopyala', copiedLabel: 'Kopyalandı', peopleLabel: 'Erişimi olanlar', roleLabel: 'Erişim düzeyi' },
  },
};

const PEOPLE: Omit<FileSharePerson, 'avatar' | 'online'>[] = [
  { id: '1', name: 'Olivia Martin', email: 'o.martin@ladom.co', role: 'edit' },
  { id: '2', name: 'Isabella Nguyen', email: 'o.nguyen@ladom.co', role: 'edit' },
  { id: '3', name: 'Sofia Davis', email: 's.davis@ladom.co', role: 'view' },
];

export function FileSharePlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [pictures, setPictures] = useState(true);
  const [online, setOnline] = useState(true);
  const people = PEOPLE.map((p, i) => ({ ...p, avatar: pictures && i > 0 ? `/avatars/${i}.svg` : undefined, online }));

  const code = `import { FileShare } from '@ladom/ui/pro';\n\n<FileShare\n  link="https://ladom.co/files/brand-guide"\n  people={[\n    { id: '1', name: 'Olivia Martin', email: 'o.martin@ladom.co'${online ? ', online: true' : ''} },\n    // …\n  ]}\n  onRoleChange={(person, role) => save(person.id, role)}\n/>`;
  const figma = `Share this file\nLink=${'http://example.com/link/to/document'}\nPeople=${PEOPLE.length}\nAvatar=${pictures ? 'Image' : 'Name Surname'}\nStatus=${online ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: '100%', maxInlineSize: 480 }}>
          <FileShare {...c.strings} roles={c.roles} link="https://ladom.co/files/brand-guide" people={people} />
        </div>
      </div>
      <div className={styles.controls}>
        <ControlCheck label={c.pictures} checked={pictures} onChange={setPictures} />
        <ControlCheck label={c.online} checked={online} onChange={setOnline} />
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
