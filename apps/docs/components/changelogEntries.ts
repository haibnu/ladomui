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
  {
    date: '2026-11-11',
    pr: 27,
    en: 'Modal: headerContent puts content such as a Stepper between the title and the close button. On docs pages the title no longer takes the page heading spacing.',
    tr: 'Modal: headerContent, Stepper gibi bir içeriği başlık ile kapatma butonu arasına koyuyor. Doküman sayfalarında başlık artık sayfa başlığı boşluklarını almıyor.',
  },
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
  'color-input': [
    {
      date: '2026-11-11',
      en: 'The swatches are round and lined in a darker shade of their color, the box starts closer to the swatch, and the code shows in capitals.',
      tr: 'Renk kutucukları yuvarlak ve kendi renklerinin koyu bir tonuyla çiziliyor; kutu kutucuğa daha yakın başlıyor, kod büyük harfle yazılıyor.',
    },
    first('2026-11-11'),
  ],
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
  'otp-input': [first('2026-11-11')],
  pagination: [first()],
  popover: [UNCLIPPED({ en: 'panel', tr: 'panel' }), first()],
  radio: [first()],
  'text-motion': [{ ...first('2026-11-12'), en: 'First release: opt-in text animations (roll, blur, flip, wave) for button and link labels.', tr: 'İlk sürüm: buton ve link etiketleri için isteğe bağlı metin animasyonları (roll, blur, flip, wave).' }],
  'scroll-area': [{ ...first('2026-11-11'), en: 'First release: thin, rounded overlay scrollbars over native scrolling.', tr: 'İlk sürüm: yerel kaydırmanın üstünde ince, yuvarlak kaydırma çubukları.' }],
  segment: [{ date: '2026-11-12', en: 'The chosen item’s raised pill slides to the newly chosen item, timed by the motion tokens (still with reduced motion). Items that are not chosen get a slightly darker background on hover.', tr: 'Seçili öğenin kabarık zemini yeni seçilen öğeye kayarak geçiyor; süre animasyon tokenlarından geliyor (hareket azaltma açıkken kaymıyor). Seçili olmayan öğelerin zemini üzerine gelince hafifçe koyulaşıyor.' }, ROLES, first()],
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
  toast: [
    {
      date: '2026-11-11',
      en: 'useOptionalToast returns the ToastProvider’s API or null, for components that bring their own provider when the page has none.',
      tr: 'useOptionalToast, ToastProvider’ın API’sini ya da null döndürür; sayfada provider yoksa kendisininkini getiren bileşenler için.',
    },
    ROLES,
    first(),
  ],
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
  'file-share': [
    {
      date: '2026-11-11',
      en: 'Copy Link keeps its label and reports the result in a Toast; a narrow panel shows the short label (copyShortLabel); less space around the title.',
      tr: 'Bağlantıyı kopyala butonu metnini koruyor ve sonucu bir Toast ile bildiriyor; dar panelde kısa metin (copyShortLabel) görünüyor; başlığın etrafındaki boşluk azaldı.',
    },
    first('2026-11-03'),
  ],
  'app-sidebar': [
    {
      date: '2026-11-11',
      pr: 15,
      en: 'First release: collapses to a rail of icons with Tooltips, and holds nested groups.',
      tr: 'İlk sürüm: Tooltip’li bir ikon şeridine daralıyor ve iç içe gruplar taşıyor.',
    },
  ],
  'app-shell': [{ date: '2026-11-11', en: 'First release: side menu, sticky header and page; on phones the menu moves to a Drawer.', tr: 'İlk sürüm: kenar menüsü, yapışkan başlık ve sayfa; telefonda menü bir Drawer’a geçiyor.' }],
  'bar-list': [
    {
      date: '2026-11-11',
      en: 'Rows of the row variant can start with a leading element (leading), e.g. a flag image or an Avatar.',
      tr: 'Row görünümünün satırları bir öncül öğeyle (leading) başlayabiliyor, örneğin bir bayrak görseli ya da Avatar.',
    },
    {
      date: '2026-11-11',
      en: 'Rows of the row variant can end with a change (delta), drawn as a small Delta pill.',
      tr: 'Row görünümünün satırları bir değişimle (delta) bitebiliyor; küçük bir Delta hapı olarak çiziliyor.',
    },
    {
      date: '2026-11-11',
      en: 'A row variant: a small table with column headings and a see-through brand bar behind each row, as in “visits per page”. Bars grow in when they first show.',
      tr: 'Row görünümü: sütun başlıkları ve her satırın arkasında şeffaf bir marka rengi çubuğu olan küçük bir tablo, “sayfa başına ziyaret” listelerindeki gibi. Çubuklar ilk göründüklerinde büyüyerek gelir.',
    },{ date: '2026-11-11', en: 'First release: labelled bars for amounts, and Meter for a single bar.', tr: 'İlk sürüm: miktarlar için etiketli çubuklar ve tek çubuklu Meter.' }],
  'card': [
    {
      date: '2026-11-11',
      en: 'A tighter header: the title and the actions share one centred line, the description sits just under it, and page heading margins no longer reach it. New titleStyle (default, caption).',
      tr: 'Daha sıkı bir başlık: başlık ve aksiyonlar ortalı tek satırda, açıklama hemen altında; sayfanın başlık boşlukları artık ona ulaşmıyor. Yeni titleStyle (default, caption).',
    },
    { date: '2026-11-11', en: 'First release: a dashboard section with a title, actions and a footer.', tr: 'İlk sürüm: başlıklı, aksiyonlu ve alt kısımlı bir panel bölümü.' },
  ],
  'data-toolbar': [{ date: '2026-11-11', en: 'First release: search, filters and actions above a Table, with bulk actions while rows are selected.', tr: 'İlk sürüm: Table üstünde arama, filtreler ve aksiyonlar; satır seçilince toplu aksiyonlar.' }],
  'person-cell': [{ date: '2026-11-11', en: 'First release: Avatar, name and a line under it, in a table or list; a button with onClick.', tr: 'İlk sürüm: tabloda ya da listede Avatar, isim ve alt satır; onClick ile buton.' }],
  'stat-card': [
    {
      date: '2026-11-11',
      en: 'The change under the number is a Delta now; its success green reaches 4.5:1 in both themes.',
      tr: 'Rakamın altındaki değişim artık bir Delta; success yeşili iki temada da 4.5:1’e ulaşıyor.',
    },
    {
      date: '2026-11-11',
      en: 'A bigger number that counts up, an optional unit, a change with a trend arrow, and a chart that draws in: area, line with points, steps or bars, beside the number or under it, with a hover tooltip.',
      tr: 'Sayarak gelen daha büyük bir rakam, isteğe bağlı birim, eğilimli oklu değişim ve çizilerek beliren bir grafik: alan, noktalı çizgi, basamak ya da çubuk; rakamın yanında ya da altında, hover ipucuyla.',
    },{ date: '2026-11-11', en: 'First release: a dashboard card with a label, a value and a note or trend.', tr: 'İlk sürüm: etiket, değer ve not ya da trend gösteren panel kartı.' }],
  'wizard-modal': [
    {
      date: '2026-11-11',
      pr: 27,
      en: 'First release: a Modal that walks through steps, with the Stepper in the header between the title and the close button, and Back / Next.',
      tr: 'İlk sürüm: adım adım ilerleyen bir Modal; Stepper başlık ile kapatma butonu arasında, altta Geri / İleri.',
    },
  ],
  delta: [
    {
      date: '2026-11-11',
      en: 'First release: a change with a leaning trend arrow, as text or a pill, colored by whether it is good news.',
      tr: 'İlk sürüm: eğik bir trend oklu değişim; metin ya da hap olarak, iyi haber olup olmamasına göre renkli.',
    },
  ],
  'bar-chart': [
    {
      date: '2026-11-11',
      en: 'First release: one series, grouped or stacked bars in the brand-derived chart colors, with a grid, a hover tooltip, a hidden data table and bars that grow in.',
      tr: 'İlk sürüm: marka renginden türeyen grafik renkleriyle tek seri, gruplu ya da yığılmış çubuklar; ızgara, hover ipucu, gizli veri tablosu ve büyüyerek gelen çubuklar.',
    },
  ],
  'donut-chart': [
    {
      date: '2026-11-11',
      en: 'First release: a ring in the chart colors with a total in the middle, three sizes, captions for small multiples, a hover tooltip and a sweep-in.',
      tr: 'İlk sürüm: grafik renkleriyle, ortada toplamı olan bir halka; üç boyut, küçük çoklular için başlık, hover ipucu ve dönerek giriş.',
    },
  ],
  'chart-legend': [
    {
      date: '2026-11-11',
      en: 'First release: a chart key as a small table with series dots, value columns and a Delta.',
      tr: 'İlk sürüm: seri noktaları, değer sütunları ve bir Delta ile küçük bir tablo olarak grafik anahtarı.',
    },
  ],
  'funnel-chart': [
    {
      date: '2026-11-11',
      en: 'First release: a stepped funnel with each stage’s value and Delta, slanted steps in a soft tint, conversion in the tooltip and blocks that rise in.',
      tr: 'İlk sürüm: her aşamanın değeri ve Delta’sıyla basamaklı bir huni; soluk tonda eğik basamaklar, ipucunda dönüşüm ve yükselerek gelen bloklar.',
    },
  ],
};

/** The changelog of a docs path (/en/docs/components/<slug>), or null for other pages. */
export function changelogOf(pathname: string): ChangelogEntry[] | null {
  const m = pathname.match(/\/docs\/(?:components|pro)\/([^/]+)/);
  return (m && CHANGELOG[m[1]!]) ?? null;
}
