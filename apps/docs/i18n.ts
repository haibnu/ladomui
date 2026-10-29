// Languages of the docs site. Every page exists under /en and /tr; token and icon names stay in English.
export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Prefixes a site path with the language: href('tr', '/docs/introduction') -> '/tr/docs/introduction'. */
export const href = (lang: Locale, path: string) => `/${lang}${path === '/' ? '' : path}`;

const en = {
  meta: {
    description: 'The Ladom design system: design tokens, icons and React components, aligned 1:1 with Figma.',
  },
  topBar: {
    docs: 'Docs',
    search: 'Quick search…',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    menu: 'Menu',
    toDark: 'Switch to dark theme',
    toLight: 'Switch to light theme',
    otherLanguage: 'Türkçe',
  },
  search: {
    placeholder: 'Search pages, tokens and icons',
    empty: 'No results for',
    label: 'Search',
    kinds: { Page: 'Page', Token: 'Token', Icon: 'Icon' },
  },
  nav: {
    gettingStarted: 'Getting Started',
    foundations: 'Foundations',
    components: 'Components',
    molecules: 'Molecules',
    introduction: 'Introduction',
    installation: 'Installation',
    icons: 'Icons',
    soon: 'Soon',
    onThisPage: 'On this page',
  },
  groups: {
    color: { title: 'Colors', description: 'Theme colors from the Figma 02 Theme collection. Light is the default; Dark is opt-in.' },
    typography: { title: 'Typography', description: 'Font, sizes, weights and line heights, and every Figma text style as a font shorthand.' },
    space: { title: 'Spacing', description: 'Spacing scale, semantic spacing and the layout density scale (Comfort / Narrow).' },
    radius: { title: 'Radius', description: 'Corner radius for layouts, cards and form elements.' },
    size: { title: 'Sizes', description: 'Modal widths and page content widths.' },
    grid: { title: 'Grid', description: 'Column widths and the column grids used in Figma.' },
    border: { title: 'Border', description: 'The default line and its color.' },
    shadow: { title: 'Depth', description: 'Depth, focus rings and lines from the Figma effect styles.' },
    motion: { title: 'Animation', description: 'Durations and transitions from the Figma Animation page.' },
  } as Record<string, { title: string; description: string }>,
  foundations: {
    device: 'Device',
    density: 'Density',
    auto: 'auto',
    token: 'Token',
    value: 'Value',
    preview: 'Preview',
    addedInCode: 'added in code',
    textStyles: 'Text styles',
  },
  icons: {
    title: 'Icons',
    description: 'Each icon name maps to exactly one icon: Tabler outline icons, plus custom icons from the Figma file. Use them as components from @ladom/icons, e.g.',
    search: (n: number) => `Search ${n} icons`,
    searchLabel: 'Search icons',
    empty: 'No icons match',
    custom: 'custom',
    categories: { common: 'Common', direction: 'Direction', electric: 'Electric' } as Record<string, string>,
  },
  landing: {
    eyebrow: 'Ladom Design System',
    title: 'One source of truth, from Figma to production.',
    lead: 'Design tokens, icons and React components for every Ladom product, built 1:1 from the Ladom UI Figma file.',
    getStarted: 'Get started',
    browse: 'Browse foundations',
    tokens: 'Design tokens',
    iconCount: 'Icons',
    themes: 'Themes',
    themesValue: 'Light · Dark',
    showcase: 'Showcase',
  },
};

export type Dictionary = typeof en;

const tr: Dictionary = {
  meta: {
    description: 'Ladom tasarım sistemi: Figma ile birebir uyumlu tasarım tokenları, ikonlar ve React bileşenleri.',
  },
  topBar: {
    docs: 'Dokümanlar',
    search: 'Hızlı ara…',
    openNav: 'Menüyü aç',
    closeNav: 'Menüyü kapat',
    menu: 'Menü',
    toDark: 'Koyu temaya geç',
    toLight: 'Açık temaya geç',
    otherLanguage: 'English',
  },
  search: {
    placeholder: 'Sayfa, token ve ikon ara',
    empty: 'Sonuç bulunamadı:',
    label: 'Ara',
    kinds: { Page: 'Sayfa', Token: 'Token', Icon: 'İkon' },
  },
  nav: {
    gettingStarted: 'Başlarken',
    foundations: 'Temeller',
    components: 'Bileşenler',
    molecules: 'Moleküller',
    introduction: 'Giriş',
    installation: 'Kurulum',
    icons: 'İkonlar',
    soon: 'Yakında',
    onThisPage: 'Bu sayfada',
  },
  groups: {
    color: { title: 'Renkler', description: 'Figma 02 Theme koleksiyonundaki tema renkleri. Varsayılan tema açık; koyu tema isteğe bağlı.' },
    typography: { title: 'Tipografi', description: 'Font, boyutlar, kalınlıklar ve satır yükseklikleri; Figma’daki her yazı stili tek bir font kısaltması olarak.' },
    space: { title: 'Boşluklar', description: 'Boşluk ölçeği, anlamsal boşluklar ve yerleşim yoğunluğu ölçeği (Comfort / Narrow).' },
    radius: { title: 'Köşe yarıçapı', description: 'Yerleşimler, kartlar ve form öğeleri için köşe yarıçapları.' },
    size: { title: 'Boyutlar', description: 'Modal genişlikleri ve sayfa içerik genişlikleri.' },
    grid: { title: 'Grid', description: 'Kolon genişlikleri ve Figma’da kullanılan kolon gridleri.' },
    border: { title: 'Kenarlık', description: 'Varsayılan çizgi ve rengi.' },
    shadow: { title: 'Derinlik', description: 'Figma efekt stillerinden derinlik, odak halkaları ve çizgiler.' },
    motion: { title: 'Animasyon', description: 'Figma Animation sayfasındaki süreler ve geçişler.' },
  },
  foundations: {
    device: 'Cihaz',
    density: 'Yoğunluk',
    auto: 'otomatik',
    token: 'Token',
    value: 'Değer',
    preview: 'Önizleme',
    addedInCode: 'kodda eklendi',
    textStyles: 'Yazı stilleri',
  },
  icons: {
    title: 'İkonlar',
    description: 'Her ikon adı tek bir ikona karşılık gelir: Tabler outline ikonları ve Figma dosyasındaki özel ikonlar. @ladom/icons paketinden bileşen olarak kullanılır, ör.',
    search: (n: number) => `${n} ikon içinde ara`,
    searchLabel: 'İkon ara',
    empty: 'Eşleşen ikon yok:',
    custom: 'özel',
    categories: { common: 'Genel', direction: 'Yön', electric: 'Elektrik' },
  },
  landing: {
    eyebrow: 'Ladom Tasarım Sistemi',
    title: 'Figma’dan canlıya, tek bir doğruluk kaynağı.',
    lead: 'Tüm Ladom ürünleri için tasarım tokenları, ikonlar ve React bileşenleri; Ladom UI Figma dosyasıyla birebir.',
    getStarted: 'Başla',
    browse: 'Temellere göz at',
    tokens: 'Tasarım tokenı',
    iconCount: 'İkon',
    themes: 'Tema',
    themesValue: 'Açık · Koyu',
    showcase: 'Vitrin',
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, tr };
export const getDictionary = (lang: Locale) => dictionaries[lang];
