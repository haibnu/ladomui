import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Cell,
  CellHelper,
  DatePicker,
  Dropdown,
  Input,
  Label,
  Segment,
  Selectbox,
  type DateRange,
} from '@ladom/ui';
import { AppHeader, FileShare, PageHeader } from '@ladom/ui/pro';
import {
  IconAdd,
  IconCampaign,
  IconCheck,
  IconDashboard,
  IconData,
  IconDelete,
  IconEdit,
  IconHome,
  IconMap,
  IconMapCurrent,
  IconMapPin,
  IconMenu,
  IconPassword,
  IconProfile,
  IconReport,
  IconSearch,
  IconSetting,
  IconStatistic,
  IconSuccess,
  type IconProps,
} from '@ladom/icons';
import face1 from '../public/avatars/1.svg';
import face2 from '../public/avatars/2.svg';
import face3 from '../public/avatars/3.svg';

const COPY = {
  en: {
    datePicker: 'Date picker',
    datePlaceholder: 'DD/MM/YYYY',
    buttons: 'Buttons',
    button: 'Button',
    dropdownButton: 'Dropdown Button',
    iconButton: 'Icon Button',
    search: 'Search',
    avatar: 'Avatar',
    size: 'Size',
    sizeHint: 'Medium, Small, Tiny etc.',
    sizes: ['Xlarge', 'Large', 'Small', 'Tiny'],
    dimensions: 'Dimensions',
    dimensionsHint: 'Universal image dimensions',
    breadcrumb: 'Breadcrumb',
    navTitle: 'Navigation Title',
    pageTitle: 'Page title',
    path: ['Previous Page 1', 'Previous Page 2', 'Current Page'],
    back: 'Back',
    pathLabel: 'Path',
    icons: 'Icons',
    iconNames: ['Profile', 'Settings', 'Delete', 'Password', 'Statistic', 'Menu', 'Success', 'Check', 'Map', 'Map current', 'Map pin', 'Report'],
    dropdown: 'Dropdown',
    actions: 'Actions',
    edit: 'Edit',
    view: 'View Profile',
    remove: 'Delete',
    label: 'Label',
    selectCity: 'Select City',
    cityOptions: ['Default', 'Hover', 'Default', 'Selected'],
    share: { title: 'Share this file', linkLabel: 'Label', copyLabel: 'Copy Link', copiedLabel: 'Copied', peopleLabel: 'People with access', roleLabel: 'Access level', roles: ['Can Edit', 'Can Comment', 'Can View'] },
    segments: { gender: ['Man', 'Woman'], kind: ['Mail', 'Data'], team: ['Agency', 'Studio'], filter: ['All', 'Open'] },
    version: 'Ladom v2.0',
    new: 'New',
    countries: [['Turkey', 'High'], ['United Kingdom', 'Medium'], ['USA', 'Low']],
    tones: ['Default', 'Primary', 'Success', 'Error', 'Warning'],
    system: 'System',
    ui: 'UI',
    status: 'Status',
    add: 'Add',
  },
  tr: {
    datePicker: 'Tarih seçici',
    datePlaceholder: 'GG/AA/YYYY',
    buttons: 'Butonlar',
    button: 'Buton',
    dropdownButton: 'Dropdown Buton',
    iconButton: 'İkon Buton',
    search: 'Ara',
    avatar: 'Avatar',
    size: 'Boyut',
    sizeHint: 'Medium, Small, Tiny vb.',
    sizes: ['Xlarge', 'Large', 'Small', 'Tiny'],
    dimensions: 'Oranlar',
    dimensionsHint: 'Evrensel görsel oranları',
    breadcrumb: 'Breadcrumb',
    navTitle: 'Gezinme Başlığı',
    pageTitle: 'Sayfa başlığı',
    path: ['Önceki sayfa 1', 'Önceki sayfa 2', 'Geçerli sayfa'],
    back: 'Geri',
    pathLabel: 'Yol',
    icons: 'İkonlar',
    iconNames: ['Profil', 'Ayarlar', 'Sil', 'Şifre', 'İstatistik', 'Menü', 'Başarılı', 'Onay', 'Harita', 'Konumum', 'Konum', 'Rapor'],
    dropdown: 'Dropdown',
    actions: 'İşlemler',
    edit: 'Düzenle',
    view: 'Profili Gör',
    remove: 'Sil',
    label: 'Etiket',
    selectCity: 'Şehir seç',
    cityOptions: ['Varsayılan', 'Hover', 'Varsayılan', 'Seçili'],
    share: { title: 'Bu dosyayı paylaş', linkLabel: 'Etiket', copyLabel: 'Bağlantıyı kopyala', copiedLabel: 'Kopyalandı', peopleLabel: 'Erişimi olanlar', roleLabel: 'Erişim düzeyi', roles: ['Düzenleyebilir', 'Yorum yapabilir', 'Görüntüleyebilir'] },
    segments: { gender: ['Erkek', 'Kadın'], kind: ['Posta', 'Veri'], team: ['Ajans', 'Stüdyo'], filter: ['Tümü', 'Açık'] },
    version: 'Ladom v2.0',
    new: 'Yeni',
    countries: [['Türkiye', 'Yüksek'], ['Birleşik Krallık', 'Orta'], ['ABD', 'Düşük']],
    tones: ['Varsayılan', 'Birincil', 'Başarılı', 'Hata', 'Uyarı'],
    system: 'Sistem',
    ui: 'UI',
    status: 'Durum',
    add: 'Ekle',
  },
};

export type Locale = keyof typeof COPY;

const PEOPLE = [
  { id: '1', name: 'Olivia Martin', email: 'o.martin@ladom.co', online: true, role: 'edit' },
  { id: '2', name: 'Isabella Nguyen', email: 'o.nguyen@ladom.co', avatar: face2, online: true, role: 'edit' },
  { id: '3', name: 'Sofia Davis', email: 's.davis@ladom.co', avatar: face3, role: 'edit' },
];

const ICONS: ComponentType<IconProps>[] = [IconProfile, IconSetting, IconDelete, IconPassword, IconStatistic, IconMenu, IconSuccess, IconCheck, IconMap, IconMapCurrent, IconMapPin, IconReport];

// Every card clips its content like the Figma frames; a card with an open menu stops clipping (showcase.css).
function Card({ title, className, children }: { title?: string; className?: string; children: ReactNode }) {
  return (
    <section className={['ls-card', className].filter(Boolean).join(' ')}>
      {title && <h3 className="ls-card-title">{title}</h3>}
      {children}
    </section>
  );
}

export function Showcase({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const [range, setRange] = useState<DateRange>({ start: new Date(2021, 0, 8), end: new Date(2021, 0, 14) });
  const [cities, setCities] = useState([false, true, false, false]);
  // The Breadcrumb menu is shown open, as in Figma. Clicking elsewhere closes it (as it should), so it is
  // opened again; clicking the breadcrumb itself still toggles it.
  const [navKey, setNavKey] = useState(0);
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.('.ls-app nav')) return;
      setTimeout(() => setNavKey((k) => k + 1), 0);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  return (
    <div className="ls-stage">
      <div className="ls-canvas">
        <Card title={c.datePicker} className="c-date">
          <div className="ls-stack">
            <Input className="ls-date-input" iconLeft={<IconProfile />} placeholder={c.datePlaceholder} aria-label={c.datePicker} />
            <div className="ls-cal">
              <DatePicker mode="range" value={range} onChange={setRange} defaultMonth={new Date(2021, 0, 1)} locale={locale} weekStartsOn={1} />
            </div>
          </div>
        </Card>

        <Card className="c-buttons">
          <div className="ls-btn-groups">
            <div className="ls-btn-group">
              <p className="ls-caption">{c.button}</p>
              <Button>{c.button}</Button>
            </div>
            <div className="ls-btn-group">
              <p className="ls-caption">{c.dropdownButton}</p>
              <Button dropdown>{c.button}</Button>
            </div>
            <div className="ls-btn-group">
              <p className="ls-caption">{c.iconButton}</p>
              <Button icon={IconSearch} aria-label={c.search} className="ls-round" />
            </div>
          </div>
        </Card>

        <Card title={c.avatar} className="c-avatar">
          <div className="ls-stack">
            <AvatarGroup>
              <Avatar size="small" src={face1} name="Olivia Martin" />
              <Avatar size="small" src={face2} name="Isabella Nguyen" />
              <Avatar size="small" src={face3} name="Sofia Davis" />
              <Button icon={IconAdd} size="small" tone="tertiary" aria-label={c.add} className="ls-round" />
            </AvatarGroup>
            <div className="ls-row">
              <Avatar size="medium" src={face1} name="Olivia Martin" status />
              <Avatar size="medium" src={face2} name="Isabella Nguyen" status notification={2} />
            </div>
          </div>
        </Card>

        <Card title={c.breadcrumb} className="c-nav">
          <div className="ls-app">
            <nav className="ls-rail" aria-hidden="true">
              <Button icon={IconCampaign} tabIndex={-1} className="ls-round ls-logo" aria-label="Logo" />
              <Button variant="ghost" tone="primary" icon={IconHome} tabIndex={-1} aria-label="Home" data-state="pressed" />
              <Button variant="ghost" tone="primary" icon={IconDashboard} tabIndex={-1} aria-label="Dashboard" />
              <Button variant="ghost" tone="primary" icon={IconStatistic} tabIndex={-1} aria-label="Statistic" />
              <Button variant="ghost" tone="primary" icon={IconReport} tabIndex={-1} aria-label="Report" />
            </nav>
            <div className="ls-app-main">
              <AppHeader
                border
                start={<span className="ls-nav-title">{c.navTitle}</span>}
                center={<Input type="search" size="small" placeholder={c.search} aria-label={c.search} />}
              />
              <PageHeader
                title={c.pageTitle}
                onBack={() => {}}
                backLabel={c.back}
                breadcrumb={<Breadcrumb key={navKey} defaultOpen menuLabel={c.pathLabel} backLabel={c.back} items={c.path.map((label) => ({ label }))} />}
              />
            </div>
          </div>
        </Card>

        <Card title={c.avatar} className="c-sizes">
          <div className="ls-sizes">
            <div>
              <p className="ls-subtitle">{c.size}</p>
              <p className="ls-hint">{c.sizeHint}</p>
            </div>
            <div className="ls-size-rows">
              {(['xlarge', 'medium', 'small', 'tiny'] as const).map((size, i) => (
                <div key={size} className="ls-size-row">
                  <span className="ls-hint">{c.sizes[i]}</span>
                  <Avatar size={size} src={face1} name="Olivia Martin" />
                </div>
              ))}
            </div>
            <div>
              <p className="ls-subtitle">{c.dimensions}</p>
              <p className="ls-hint">{c.dimensionsHint}</p>
            </div>
            <div className="ls-ratios">
              <span style={{ aspectRatio: '1 / 1' }}>1:1</span>
              <span style={{ aspectRatio: '16 / 9' }}>16:9</span>
              <span style={{ aspectRatio: '4 / 3' }}>4:3</span>
            </div>
          </div>
        </Card>

        <Card className="c-segment">
          <div className="ls-stack ls-segments">
            <Segment size="small" aria-label={c.segments.gender.join(' / ')} defaultValue="0" options={c.segments.gender.map((label, i) => ({ value: String(i), label }))} />
            <Segment
              size="small"
              aria-label={c.segments.kind.join(' / ')}
              defaultValue="0"
              options={[
                { value: '0', label: c.segments.kind[0], icon: <IconCampaign /> },
                { value: '1', label: c.segments.kind[1], icon: <IconData /> },
              ]}
            />
            <Segment size="small" aria-label={c.segments.team.join(' / ')} defaultValue="0" options={c.segments.team.map((label, i) => ({ value: String(i), label, info: true }))} />
            <Segment
              size="small"
              aria-label={c.segments.filter.join(' / ')}
              defaultValue="0"
              options={[
                { value: '0', label: c.segments.filter[0], badge: '9+' },
                { value: '1', label: c.segments.filter[1], badge: '3' },
              ]}
            />
          </div>
        </Card>

        <Card className="c-system">
          <div className="ls-system">
            <div className="ls-stack">
              <p className="ls-subtitle">{c.system}</p>
              <Button size="small" tone="primary">{c.button}</Button>
              <Button size="small" tone="secondary">{c.button}</Button>
              <Button size="small" tone="tertiary">{c.button}</Button>
            </div>
            <div className="ls-stack">
              <p className="ls-subtitle">{c.ui}</p>
              <Button size="small" tone="success">{c.button}</Button>
              <Button size="small" tone="warning">{c.button}</Button>
              <Button size="small" tone="error">{c.button}</Button>
            </div>
          </div>
        </Card>

        <Card title={c.icons} className="c-icons">
          <div className="ls-icons">
            {ICONS.map((Icon, i) => (
              <span key={i} className="ls-icon">
                <Icon size={24} aria-hidden="true" />
                <span className="ls-pill">{c.iconNames[i]}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card title={c.dropdown} className="c-dropdown">
          <div className="ls-dropdown-card">
            <div className="ls-stack ls-actions">
              <Button dropdown>{c.actions}</Button>
              <Dropdown>
                <Cell size="small" iconLeft={<IconEdit />}>{c.edit}</Cell>
                <Cell size="small" iconLeft={<IconProfile />}>{c.view}</Cell>
                <Cell size="small" iconLeft={<IconDelete />} tone="destructive">{c.remove}</Cell>
              </Dropdown>
            </div>
            <div className="ls-stack ls-select">
              <Label>{c.label}</Label>
              <Selectbox fluid placeholder={c.selectCity} aria-label={c.selectCity} data-state="active" options={[]} />
              <Dropdown>
                {c.cityOptions.slice(0, 3).map((label, i) => (
                  <div key={i} role="checkbox" aria-checked={cities[i]} tabIndex={0} className="ls-option" onClick={() => setCities(cities.map((v, j) => (j === i ? !v : v)))} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), setCities(cities.map((v, j) => (j === i ? !v : v))))}>
                    <Cell size="small" control="checkbox" selected={cities[i]}>{label}</Cell>
                  </div>
                ))}
              </Dropdown>
            </div>
          </div>
        </Card>

        <Card className="c-share">
          <FileShare
            className="ls-share"
            title={c.share.title}
            linkLabel={c.share.linkLabel}
            copyLabel={c.share.copyLabel}
            copiedLabel={c.share.copiedLabel}
            peopleLabel={c.share.peopleLabel}
            roleLabel={c.share.roleLabel}
            roles={[{ value: 'edit', label: c.share.roles[0]! }, { value: 'comment', label: c.share.roles[1]! }, { value: 'view', label: c.share.roles[2]! }]}
            link="https://ladom.co/files/brand-guide"
            people={PEOPLE.slice(0, 2).map((p, i) => ({ ...p, avatar: i === 0 ? undefined : p.avatar }))}
          />
        </Card>

        <Card title={c.status} className="c-status">
          <div className="ls-status">
            <div className="ls-plate">
              <span className="ls-plate-title">{c.version}</span>
              <Badge tone="default" size="small">{c.new}</Badge>
            </div>
            <div className="ls-tones">
              {c.tones.map((label, i) => (
                <Badge key={label} size="small" tone={(['default', 'primary', 'success', 'error', 'warning'] as const)[i]}>{label}</Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
