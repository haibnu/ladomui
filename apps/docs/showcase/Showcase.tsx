import { useState, type ReactNode } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Cell,
  CellHelper,
  Chip,
  Dropdown,
  Segment,
  Selectbox,
  Tabs,
} from '@ladom/ui';
import { FileShare, PageHeader } from '@ladom/ui/pro';
import {
  IconAdd,
  IconDelete,
  IconEdit,
  IconFolder,
  IconHome,
  IconImage,
  IconNotification,
  IconProfile,
  IconSearch,
  IconSetting,
  IconShare,
  IconStar,
  type IconProps,
} from '@ladom/icons';
import type { ComponentType } from 'react';

const COPY = {
  en: {
    date: 'Date to go',
    buttons: 'Buttons',
    button: 'Button',
    actions: 'Actions',
    edit: 'Edit',
    view: 'View profile',
    remove: 'Delete',
    add: 'Add',
    avatars: 'Avatars',
    navigation: 'Navigation',
    pageTitle: 'Page title',
    tabs: ['Overview', 'Activity', 'Settings'],
    path: ['Home', 'Projects', 'Current page'],
    back: 'Back',
    pathLabel: 'Path',
    icons: 'Icons',
    dropdown: 'Dropdown',
    select: 'Select',
    options: ['Design', 'Development', 'Research', 'Marketing'],
    selectPlaceholder: 'Select teams',
    share: { title: 'Share this file', linkLabel: 'Link', copyLabel: 'Copy Link', copiedLabel: 'Copied', peopleLabel: 'People with access', roleLabel: 'Access level', roles: ['Can Edit', 'Can Comment', 'Can View'] },
    segments: ['Week', 'Month', 'Year'],
    chips: ['Design', 'Code', 'Brand'],
    badges: { primary: 'Primary', success: 'Active', warning: 'Pending', error: 'Failed' },
    status: 'Status',
    system: 'System',
    ui: 'UI colors',
    solid: 'Solid',
    ghost: 'Ghost',
    tones: { primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' },
    more: 'More',
  },
  tr: {
    date: 'Gidilecek tarih',
    buttons: 'Butonlar',
    button: 'Buton',
    actions: 'İşlemler',
    edit: 'Düzenle',
    view: 'Profili gör',
    remove: 'Sil',
    add: 'Ekle',
    avatars: 'Avatarlar',
    navigation: 'Gezinme',
    pageTitle: 'Sayfa başlığı',
    tabs: ['Genel', 'Aktivite', 'Ayarlar'],
    path: ['Ana sayfa', 'Projeler', 'Geçerli sayfa'],
    back: 'Geri',
    pathLabel: 'Yol',
    icons: 'İkonlar',
    dropdown: 'Dropdown',
    select: 'Seçim',
    options: ['Tasarım', 'Geliştirme', 'Araştırma', 'Pazarlama'],
    selectPlaceholder: 'Ekip seçin',
    share: { title: 'Bu dosyayı paylaş', linkLabel: 'Bağlantı', copyLabel: 'Bağlantıyı kopyala', copiedLabel: 'Kopyalandı', peopleLabel: 'Erişimi olanlar', roleLabel: 'Erişim düzeyi', roles: ['Düzenleyebilir', 'Yorum yapabilir', 'Görüntüleyebilir'] },
    segments: ['Hafta', 'Ay', 'Yıl'],
    chips: ['Tasarım', 'Kod', 'Marka'],
    badges: { primary: 'Birincil', success: 'Aktif', warning: 'Bekliyor', error: 'Başarısız' },
    status: 'Durum',
    system: 'Sistem',
    ui: 'UI renkleri',
    solid: 'Dolu',
    ghost: 'Hayalet',
    tones: { primary: 'Birincil', secondary: 'İkincil', tertiary: 'Üçüncül', success: 'Başarılı', error: 'Hata', warning: 'Uyarı', info: 'Bilgi' },
    more: 'Daha fazla',
  },
};

export type Locale = keyof typeof COPY;

const PEOPLE = [
  { id: '1', name: 'Olivia Martin', email: 'o.martin@ladom.co', online: true, role: 'edit' },
  { id: '2', name: 'Isabella Nguyen', email: 'i.nguyen@ladom.co', online: true, role: 'edit' },
  { id: '3', name: 'Sofia Davis', email: 's.davis@ladom.co', role: 'view' },
];

const ICONS: ComponentType<IconProps>[] = [IconProfile, IconSetting, IconSearch, IconNotification, IconHome, IconStar, IconFolder, IconImage, IconShare, IconEdit, IconDelete, IconAdd];

function Card({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <section className={['ls-card', className].filter(Boolean).join(' ')}>
      <h3 className="ls-card-title">{title}</h3>
      {children}
    </section>
  );
}

function ActionMenu({ label, items }: { label: string; items: { label: string; icon?: ReactNode; tone?: 'destructive' }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ls-menu">
      <Button dropdown tone="secondary" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} onBlur={(e) => !e.currentTarget.parentElement?.contains(e.relatedTarget) && setOpen(false)}>
        {label}
      </Button>
      {open && (
        <Dropdown role="menu" className="ls-menu-list" onBlur={(e) => !e.currentTarget.parentElement?.contains(e.relatedTarget) && setOpen(false)}>
          {items.map((i) => (
            <div key={i.label} role="menuitem" tabIndex={0} onClick={() => setOpen(false)} onKeyDown={(e) => e.key === 'Enter' && setOpen(false)} className="ls-menu-item">
              <Cell size="small" iconLeft={i.icon} tone={i.tone}>{i.label}</Cell>
            </div>
          ))}
        </Dropdown>
      )}
    </div>
  );
}

export function Showcase({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [day, setDay] = useState<Date | null>(new Date());
  const [teams, setTeams] = useState<string[]>(['0']);
  const [tab, setTab] = useState('0');
  const [segment, setSegment] = useState('1');
  const [chip, setChip] = useState(0);
  const tones = ['primary', 'secondary', 'tertiary'] as const;
  const ui = ['success', 'error', 'warning', 'info'] as const;

  return (
    <div className="ls-grid">
      <Card title={c.date} className="ls-calendar">
        <div className="ls-cal">
          <Calendar mode="single" value={day} onChange={setDay} locale={locale} weekStartsOn={1} />
        </div>
      </Card>

      <Card title={c.buttons}>
        <div className="ls-stack">
          <div className="ls-row">
            <Button>{c.button}</Button>
            <Button icon={IconAdd} aria-label={c.add} />
            <Button variant="ghost" tone="primary">{c.button}</Button>
          </div>
          <ActionMenu
            label={c.actions}
            items={[
              { label: c.edit, icon: <IconEdit /> },
              { label: c.view, icon: <IconProfile /> },
              { label: c.remove, icon: <IconDelete />, tone: 'destructive' },
            ]}
          />
        </div>
      </Card>

      <Card title={c.avatars}>
        <div className="ls-stack">
          <AvatarGroup>
            <Avatar size="small" name="Olivia Martin" />
            <Avatar size="small" name="Isabella Nguyen" />
            <Avatar size="small" name="Sofia Davis" />
            <Button icon={IconAdd} size="small" tone="tertiary" aria-label={c.add} />
          </AvatarGroup>
          <div className="ls-row ls-row-end">
            <Avatar size="xlarge" name="Olivia Martin" status />
            <Avatar size="medium" name="Isabella Nguyen" status />
            <Avatar size="small" name="Sofia Davis" notification={3} />
            <Avatar size="tiny" name="Ada" />
            <Avatar size="micro" name="Ece" />
          </div>
        </div>
      </Card>

      <Card title={c.navigation} className="ls-wide">
        <div className="ls-nav">
          <PageHeader
            title={c.pageTitle}
            onBack={() => {}}
            backLabel={c.back}
            breadcrumb={<Breadcrumb menuLabel={c.pathLabel} backLabel={c.back} items={c.path.map((label) => ({ label }))} />}
          />
          <Tabs aria-label={c.navigation} value={tab} onChange={setTab} border items={c.tabs.map((label, i) => ({ value: String(i), label }))} />
        </div>
      </Card>

      <Card title={c.icons}>
        <div className="ls-icons">
          {ICONS.map((Icon, i) => (
            <span key={i} className="ls-icon">
              <Icon size={20} aria-hidden="true" />
            </span>
          ))}
        </div>
      </Card>

      <Card title={`${c.dropdown} · ${c.select}`}>
        <div className="ls-stack">
          <Dropdown className="ls-dropdown">
            <Cell size="small" iconLeft={<IconEdit />}>{c.edit}</Cell>
            <Cell size="small" iconLeft={<IconProfile />} selected>{c.view}</Cell>
            <CellHelper variant="divider" />
            <Cell size="small" iconLeft={<IconDelete />} tone="destructive">{c.remove}</Cell>
          </Dropdown>
          <Selectbox
            fluid
            multiple
            display="chips"
            size="medium"
            placeholder={c.selectPlaceholder}
            aria-label={c.select}
            value={teams}
            onChange={setTeams}
            options={c.options.map((label, i) => ({ value: String(i), label }))}
          />
        </div>
      </Card>

      <div className="ls-wide ls-share">
        <FileShare
          title={c.share.title}
          linkLabel={c.share.linkLabel}
          copyLabel={c.share.copyLabel}
          copiedLabel={c.share.copiedLabel}
          peopleLabel={c.share.peopleLabel}
          roleLabel={c.share.roleLabel}
          roles={[{ value: 'edit', label: c.share.roles[0]! }, { value: 'comment', label: c.share.roles[1]! }, { value: 'view', label: c.share.roles[2]! }]}
          link="https://ladom.co/files/brand-guide"
          people={PEOPLE}
        />
      </div>

      <Card title={`${c.status} · Segment · Chip · Badge`}>
        <div className="ls-stack">
          <Segment fluid aria-label="Segment" value={segment} onChange={setSegment} options={c.segments.map((label, i) => ({ value: String(i), label }))} />
          <div className="ls-row">
            {c.chips.map((label, i) => (
              <Chip key={label} selected={chip === i} onClick={() => setChip(i)} tone={chip === i ? 'primary' : 'default'}>
                {label}
              </Chip>
            ))}
          </div>
          <div className="ls-row">
            <Badge tone="primary" filled>{c.badges.primary}</Badge>
            <Badge tone="success">{c.badges.success}</Badge>
            <Badge tone="warning">{c.badges.warning}</Badge>
            <Badge tone="error" filled>{c.badges.error}</Badge>
          </div>
        </div>
      </Card>

      <Card title={`${c.buttons} · ${c.system} / ${c.ui}`} className="ls-wide">
        <div className="ls-variants">
          {[
            { name: c.system, list: tones },
            { name: c.ui, list: ui },
          ].map((group) => (
            <div key={group.name} className="ls-stack">
              <p className="ls-caption">{group.name}</p>
              {group.list.map((tone) => (
                <div key={tone} className="ls-row">
                  <Button tone={tone}>{c.tones[tone]}</Button>
                  {tone !== 'info' && <Button variant="ghost" tone={tone}>{c.tones[tone]}</Button>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
