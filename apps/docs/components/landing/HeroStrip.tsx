import { IconAdd, IconSearch, IconSetting } from '@ladom/icons';
import { Avatar, AvatarGroup, Badge, Button, Calendar, Cell, Segment } from '@ladom/ui';
import type { Locale } from '@/i18n';
import styles from './landing.module.css';

const COPY = {
  en: { release: 'Ladom v2.0', new: 'New', high: 'High', medium: 'Medium', men: 'Men', women: 'Women', actions: 'Actions', canEdit: 'Can edit', dropdown: 'Dropdown', button: 'Button', search: 'Search', add: 'Add', settings: 'Settings', countries: ['Turkey', 'United Kingdom', 'Germany', 'Netherlands'] },
  tr: { release: 'Ladom v2.0', new: 'Yeni', high: 'Yüksek', medium: 'Orta', men: 'Erkek', women: 'Kadın', actions: 'İşlemler', canEdit: 'Düzenleyebilir', dropdown: 'Açılır', button: 'Buton', search: 'Ara', add: 'Ekle', settings: 'Ayarlar', countries: ['Türkiye', 'Birleşik Krallık', 'Almanya', 'Hollanda'] },
};

// Real Ladom UI components under the hero, as in the Figma "LadomUI Hero Cover". Decorative only.
export function HeroStrip({ lang }: { lang: Locale }) {
  const c = COPY[lang];
  const day = new Date(2026, 9, 8);
  return (
    <div className={styles.strip} aria-hidden inert>
      <div className={styles.stripCard}>
        <Calendar defaultValue={day} defaultMonth={day} locale={lang === 'tr' ? 'tr-TR' : 'en-US'} weekStartsOn={1} />
      </div>
      <div className={styles.stripColumn}>
        <div className={`${styles.stripCard} ${styles.stripRow}`}>
          <strong>{c.release}</strong>
          <Badge size="small">{c.new}</Badge>
        </div>
        <div className={styles.stripCard}>
          {c.countries.map((country, i) => (
            <Cell key={country} size="small" selected={i === 0} badgeRight={<Badge size="tiny" tone={i === 0 ? 'default' : 'warning'}>{i === 0 ? c.high : c.medium}</Badge>}>
              {country}
            </Cell>
          ))}
        </div>
      </div>
      <div className={styles.stripColumn}>
        <div className={styles.stripRow}>
          <AvatarGroup>
            <Avatar size="small" name="Ada Lovelace" />
            <Avatar size="small" name="Grace Hopper" />
            <Avatar size="small" name="Alan Kay" />
          </AvatarGroup>
          <Button variant="ghost" tone="secondary" size="small" icon={IconAdd} aria-label={c.add} />
        </div>
        <div className={styles.stripRow}>
          <Button tone="secondary" size="small">
            {c.button}
          </Button>
          <Button tone="secondary" size="small" dropdown>
            {c.dropdown}
          </Button>
          <Button tone="secondary" size="small" icon={IconSearch} aria-label={c.search} />
        </div>
      </div>
      <div className={styles.stripColumn}>
        <div className={styles.stripCard}>
          <Cell avatar={<Avatar size="tiny" name="Isabella Nguyen" status />} subtitle="isabella@ladom.co" badgeRight={<Badge size="tiny" tone="success">Pro</Badge>}>
            Isabella Nguyen
          </Cell>
        </div>
        <div className={styles.stripRow}>
          <Segment size="small" options={[{ value: 'men', label: c.men }, { value: 'women', label: c.women }]} defaultValue="men" />
          <Button size="small" dropdown>
            {c.actions}
          </Button>
        </div>
      </div>
      <div className={styles.stripColumn}>
        <div className={styles.stripRow}>
          <Button variant="ghost" tone="secondary" size="small" dropdown>
            {c.canEdit}
          </Button>
          <Button variant="ghost" tone="secondary" size="small" icon={IconSetting} aria-label={c.settings} />
        </div>
      </div>
    </div>
  );
}
