// The history of each component and molecule page, shown at the bottom of its page, newest first.
// Keyed by the page slug (/docs/components/<slug>). Add an entry in both languages with every change
// that users of the component can see or need to know; `pr` links a pull request in haibnu/ladomui
// (Pro work in the private repo is linked only through its public docs PR). Pull requests before the repo
// split on 2026-11-03 are not linked either.
export type ChangelogEntry = { date: string; pr?: number; en: string; tr: string };

const FIRST = { en: 'First release.', tr: 'İlk sürüm.' };
const first = (date = '2026-10-29'): ChangelogEntry => ({ date, ...FIRST });

// 2026-11-06, PR #5: components moved their primary text, icons and lines to the primary roles.
const ROLES: ChangelogEntry = {
  date: '2026-11-06',
  pr: 5,
  en: 'Primary text, icons and lines use the primary foreground and line roles, so light brand colors stay readable.',
  tr: 'Primary metin, ikon ve çizgiler primary foreground ve line rollerini kullanıyor; açık marka renkleri de okunur kalıyor.',
};

// 2026-11-06, PR #6: floating panels inside a Modal or Drawer are pinned so the body does not clip them.
const UNCLIPPED = (what: { en: string; tr: string }): ChangelogEntry => ({
  date: '2026-11-06',
  pr: 6,
  en: `Inside a Modal or Drawer, the ${what.en} is no longer cut off at the edge of the scrolling body.`,
  tr: `Modal ya da Drawer içinde ${what.tr} artık kaydırılan gövdenin kenarında kesilmiyor.`,
});

// 2026-11-11: scrolling parts moved to the ScrollArea's thin overlay scrollbars.
const SCROLL = (what: { en: string; tr: string }): ChangelogEntry => ({
  date: '2026-11-11',
  en: `The ${what.en} scrolls with the thin ScrollArea scrollbars that show on hover and while scrolling.`,
  tr: `${what.tr} artık üzerine gelince ve kaydırırken görünen ince ScrollArea çubuklarıyla kayıyor.`,
});

const DIALOG: ChangelogEntry[] = [
  SCROLL({ en: 'body', tr: 'Gövde' }),
  {
    date: '2026-11-10',
    pr: 10,
    en: 'The body leaves room for the shadow and focus ring of the first and last fields.',
    tr: 'Gövde, ilk ve son alanın gölgesi ve odak halkası için yer bırakıyor.',
  },
  {
    date: '2026-11-06',
    pr: 6,
    en: 'A Depth SM shadow under the header while the body is scrolled; menus and lists inside it are no longer clipped.',
    tr: 'Gövde kaydırılınca başlığın altında Depth SM gölgesi var; içindeki menü ve listeler artık kesilmiyor.',
  },
  first(),
];

export const CHANGELOG: Record<string, ChangelogEntry[]> = {
  alert: [ROLES, first()],
  avatar: [first()],
  badge: [ROLES, first()],
  breadcrumb: [SCROLL({ en: 'path menu', tr: 'Yol menüsü' }), UNCLIPPED({ en: 'path menu', tr: 'yol menüsü' }), ROLES, first()],
  button: [ROLES, first()],
  cell: [ROLES, first()],
  checkbox: [ROLES, first()],
  chips: [ROLES, first()],
  'color-input': [first('2026-11-11')],
  'currency-input': [
    {
      date: '2026-11-10',
      pr: 11,
      en: 'The currency picker is the shared in-box picker that GSM Input also uses.',
      tr: 'Para birimi seçici, GSM Input’un da kullandığı ortak kutu içi seçici oldu.',
    },
    { ...first('2026-11-10'), pr: 8 },
  ],
  'date-picker': [ROLES, first()],
  drawer: DIALOG,
  dropdown: [SCROLL({ en: 'panel', tr: 'Panel' }), first()],
  'empty-state': [
    {
      date: '2026-11-02',
      en: 'First release; Selectbox shows it when a search finds nothing.',
      tr: 'İlk sürüm; Selectbox’ta arama sonuç bulmayınca görünüyor.',
    },
  ],
  'gsm-input': [
    {
      date: '2026-11-11',
      pr: 14,
      en: 'Every country, with its flag, dial code and number format. Without the country picker, no flag is shown.',
      tr: 'Tüm ülkeler; bayrağı, ülke kodu ve numara biçimiyle. Ülke seçici kapalıyken bayrak görünmüyor.',
    },
    { ...first('2026-11-10'), pr: 11, en: 'First release, with paste cleanup of a leading 0 or country code.', tr: 'İlk sürüm; yapıştırırken baştaki 0 ya da ülke kodu siliniyor.' },
  ],
  hint: [first()],
  input: [
    ROLES,
    {
      date: '2026-11-02',
      en: 'Search inputs have a clear button.',
      tr: 'Arama alanlarında temizleme butonu var.',
    },
    first(),
  ],
  'item-selector': [ROLES, first()],
  label: [first()],
  loader: [ROLES, first()],
  modal: DIALOG,
  'nav-menu': [
    SCROLL({ en: 'SidebarNav body', tr: 'SidebarNav gövdesi' }),
    {
      date: '2026-11-10',
      pr: 12,
      en: 'First release: SidebarNav and TopNav, with Tiny badges that keep the row height.',
      tr: 'İlk sürüm: SidebarNav ve TopNav; satır yüksekliğini değiştirmeyen Tiny badge’lerle.',
    },
  ],
  'number-input': [first('2026-11-02')],
  pagination: [first()],
  popover: [UNCLIPPED({ en: 'panel', tr: 'panel' }), first()],
  radio: [first()],
  'scroll-area': [{ ...first('2026-11-11'), en: 'First release: thin, rounded overlay scrollbars over native scrolling.', tr: 'İlk sürüm: yerel kaydırmanın üstünde ince, yuvarlak kaydırma çubukları.' }],
  segment: [ROLES, first()],
  selectbox: [
    SCROLL({ en: 'list', tr: 'Liste' }),
    UNCLIPPED({ en: 'list', tr: 'liste' }),
    ROLES,
    {
      date: '2026-11-02',
      en: 'An open list stays above the boxes that follow; a search that finds nothing shows an Empty State.',
      tr: 'Açık liste sonraki kutuların üstünde kalıyor; sonuç bulmayan arama Empty State gösteriyor.',
    },
    first(),
  ],
  stepper: [ROLES, first()],
  switch: [first()],
  tab: [
    {
      date: '2026-11-10',
      pr: 7,
      en: 'Items take badgeTone for the color of their badge.',
      tr: 'Öğeler badge rengi için badgeTone alıyor.',
    },
    ROLES,
    first(),
  ],
  table: [
    SCROLL({ en: 'wide table', tr: 'Geniş tablo' }),
    {
      date: '2026-11-10',
      pr: 13,
      en: 'The header has the same line as the rows, and checking a row no longer moves the checkbox.',
      tr: 'Başlıkta satırlarla aynı çizgi var; satır işaretlenince checkbox artık kaymıyor.',
    },
    first(),
  ],
  textarea: [first('2026-11-02')],
  'time-picker': [SCROLL({ en: 'hour, minute and second columns', tr: 'Saat, dakika ve saniye sütunları' }), first()],
  toast: [ROLES, first()],
  tooltip: [
    {
      date: '2026-11-11',
      pr: 15,
      en: 'Inside a scrolling side menu (App Sidebar), it is no longer cut off at the menu’s edge.',
      tr: 'Kaydırılan bir kenar menüsünde (App Sidebar) artık menünün kenarında kesilmiyor.',
    },
    UNCLIPPED({ en: 'tooltip', tr: 'tooltip' }),
    first(),
  ],
  uploader: [
    {
      date: '2026-11-10',
      pr: 9,
      en: 'The whole area opens the file dialog, with the same hover radius everywhere.',
      tr: 'Alanın tamamı dosya penceresini açıyor; hover köşe yarıçapı her yerde aynı.',
    },
    ROLES,
    first(),
  ],
  accordion: [first()],
  navigation: [first()],
  'file-share': [first('2026-11-03')],
  'app-sidebar': [
    {
      date: '2026-11-11',
      pr: 15,
      en: 'First release: collapses to a rail of icons with Tooltips, and holds nested groups.',
      tr: 'İlk sürüm: Tooltip’li bir ikon şeridine daralıyor ve iç içe gruplar taşıyor.',
    },
  ],
  'app-shell': [{ date: '2026-11-11', en: 'First release: side menu, sticky header and page; on phones the menu moves to a Drawer.', tr: 'İlk sürüm: kenar menüsü, yapışkan başlık ve sayfa; telefonda menü bir Drawer’a geçiyor.' }],
  'bar-list': [{ date: '2026-11-11', en: 'First release: labelled bars for amounts, and Meter for a single bar.', tr: 'İlk sürüm: miktarlar için etiketli çubuklar ve tek çubuklu Meter.' }],
  'card': [{ date: '2026-11-11', en: 'First release: a dashboard section with a title, actions and a footer.', tr: 'İlk sürüm: başlıklı, aksiyonlu ve alt kısımlı bir panel bölümü.' }],
  'data-toolbar': [{ date: '2026-11-11', en: 'First release: search, filters and actions above a Table, with bulk actions while rows are selected.', tr: 'İlk sürüm: Table üstünde arama, filtreler ve aksiyonlar; satır seçilince toplu aksiyonlar.' }],
  'person-cell': [{ date: '2026-11-11', en: 'First release: Avatar, name and a line under it, in a table or list; a button with onClick.', tr: 'İlk sürüm: tabloda ya da listede Avatar, isim ve alt satır; onClick ile buton.' }],
  'stat-card': [{ date: '2026-11-11', en: 'First release: a dashboard card with a label, a value and a note or trend.', tr: 'İlk sürüm: etiket, değer ve not ya da trend gösteren panel kartı.' }],
  'summary-list': [{ date: '2026-11-11', en: 'First release: label and value pairs as rows with a total or as a grid of facts.', tr: 'İlk sürüm: toplamlı satırlar ya da bilgi ızgarası olarak etiket-değer çiftleri.' }],
  'wizard-modal': [{ date: '2026-11-11', en: 'First release: a Modal that walks through steps with a Stepper and Back / Next.', tr: 'İlk sürüm: Stepper ve Geri / İleri ile adım adım ilerleyen Modal.' }],
};

/** The changelog of a docs path (/en/docs/components/<slug>), or null for other pages. */
export function changelogOf(pathname: string): ChangelogEntry[] | null {
  const m = pathname.match(/\/docs\/(?:components|molecules)\/([^/]+)/);
  return (m && CHANGELOG[m[1]!]) ?? null;
}
