import type { Locale } from '@/i18n';

// Page copy of the "Ship your design, no handoff" landing, one block per language.
const en = {
  eyebrow: 'Ladom UI · the design system for AI',
  title: ['Ship your design.', 'No', 'handoff.'],
  lead: 'Your design system is code from its first token. Describe a screen to your AI and it builds it with the same components, colors and spacing your designers chose. Nothing to hand over, nothing lost in between.',
  start: 'Get started',
  docs: 'Read the docs',
  copy: 'Copy',
  copied: 'Copied',
  heroPrompt: 'Add a leave request card for Ayşe',
  heroCard: {
    title: 'Leave request',
    name: 'Ayşe Yılmaz',
    detail: 'Annual leave · 18–22 Nov',
    days: '5 days',
    approve: 'Approve',
    decline: 'Decline',
  },
  heroShipped: 'Shipped to production',

  oldTitle: 'Every handoff loses something.',
  oldLead: 'Designers draw it, developers draw it again, QA compares the two. Ladom UI deletes the middle: the Figma file and the React code share one set of tokens, so what you design is what ships.',
  oldWay: 'The old way',
  newWay: 'With Ladom UI',
  oldSteps: ['Design file', 'Redlines', 'Spec doc', 'Handoff meeting', 'Rebuild in code', 'Design QA', '“It looks off”'],
  newSteps: ['Design with tokens', 'Prompt your AI', 'Production'],
  oldTime: '~3 weeks',
  newTime: 'Same afternoon',

  buildTitle: 'From a sentence to a screen.',
  buildLead: 'The Ladom UI skill teaches your AI every component, token and rule. It picks parts, not pixels, so the screen it writes already looks like your product.',
  you: 'You',
  ai: 'Claude',
  buildPrompt: 'Build an HR overview: headcount, who is on leave this week, and payroll by department.',
  buildSteps: ['Added 3 StatCards', 'Added a BarChart for payroll', 'Added a DonutChart for teams', 'Colors from --color-chart-1…6', 'No new styles invented'],
  dash: {
    headcount: 'Headcount',
    onLeave: 'On leave',
    payroll: 'Payroll',
    vsLast: 'vs last month',
    thisWeek: 'this week',
    payrollTitle: 'Payroll by department',
    teamsTitle: 'Teams',
    total: 'people',
    months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
    depts: ['Engineering', 'Design', 'Sales', 'Operations'],
  },

  brandTitle: 'One brand color. Every pixel follows.',
  brandLead: 'Pick your color once. Buttons, charts, focus rings and the darker steps for text are worked out for you, in light and dark.',
  brandCard: { title: 'Notifications', email: 'Email digest', push: 'Push alerts', save: 'Save', week: 'Week', month: 'Month', growth: 'Growth' },

  partsTitle: 'Real components. Not screenshots.',
  partsLead: 'Everything on this page is Ladom UI, running live. Hover it, type in it, copy it into your app.',
  parts: {
    otp: 'Verification code',
    share: 'Share “Q4 launch”',
    hover: 'Hover me',
    filters: ['Design', 'Code', 'AI', 'Tokens'],
    color: 'Brand color',
    toast: 'Deployed to production',
    toastNote: 'ui.ladom.co · 12 s ago',
    revenue: 'Revenue',
  },

  stats: { handoffs: 'handoff meetings', components: 'components', tokens: 'tokens', icons: 'icons' },

  ctaTitle: ['Your design is', 'already in production.'],
  ctaLead: 'One command sets up Ladom UI in your React app. One more teaches your AI to use it.',
  ctaPrompt: 'Or tell Claude: “Set up Ladom UI with npx ladom-ui init --yes and npx ladom-ui skill, then build my screens with it.”',
  footer: '© 2026 Ladom. Free tier under MIT.',
};

export type NewLandingCopy = typeof en;

const tr: NewLandingCopy = {
  eyebrow: 'Ladom UI · yapay zekâ için tasarım sistemi',
  title: ['Tasarımın yayında.', 'Teslim', 'yok.'],
  lead: 'Tasarım sisteminiz ilk tokenından itibaren kod. Yapay zekânıza ekranı anlatın; tasarımcınızın seçtiği bileşenler, renkler ve boşluklarla kursun. Ortada devredilecek dosya da arada kaybolan detay da kalmaz.',
  start: 'Başlayın',
  docs: 'Dokümanları okuyun',
  copy: 'Kopyala',
  copied: 'Kopyalandı',
  heroPrompt: 'Ayşe için bir izin talebi kartı ekle',
  heroCard: {
    title: 'İzin talebi',
    name: 'Ayşe Yılmaz',
    detail: 'Yıllık izin · 18–22 Kasım',
    days: '5 gün',
    approve: 'Onayla',
    decline: 'Reddet',
  },
  heroShipped: 'Yayına alındı',

  oldTitle: 'Her teslimde bir şey kaybolur.',
  oldLead: 'Tasarımcı çizer, geliştirici yeniden çizer, test ekibi ikisini karşılaştırır. Ladom UI aradaki adımları siler: Figma dosyası ile React kodu aynı tokenları kullanır, ne tasarlarsanız o yayına çıkar.',
  oldWay: 'Eski yol',
  newWay: 'Ladom UI ile',
  oldSteps: ['Tasarım dosyası', 'Ölçüler', 'Spec dokümanı', 'Teslim toplantısı', 'Kodda yeniden', 'Tasarım kontrolü', '“Bir şey farklı”'],
  newSteps: ['Tokenlarla tasarla', 'Yapay zekâya anlat', 'Yayında'],
  oldTime: '~3 hafta',
  newTime: 'Aynı öğleden sonra',

  buildTitle: 'Bir cümleden bir ekrana.',
  buildLead: 'Ladom UI skill’i yapay zekânıza her bileşeni, tokenı ve kuralı öğretir. Piksel değil parça seçer; yazdığı ekran baştan ürününüze benzer.',
  you: 'Siz',
  ai: 'Claude',
  buildPrompt: 'Bir İK özeti hazırla: çalışan sayısı, bu hafta izinde olanlar ve departmanlara göre bordro.',
  buildSteps: ['3 StatCard eklendi', 'Bordro için BarChart eklendi', 'Ekipler için DonutChart eklendi', 'Renkler --color-chart-1…6’dan', 'Yeni stil uydurulmadı'],
  dash: {
    headcount: 'Çalışan',
    onLeave: 'İzinde',
    payroll: 'Bordro',
    vsLast: 'geçen aya göre',
    thisWeek: 'bu hafta',
    payrollTitle: 'Departmanlara göre bordro',
    teamsTitle: 'Ekipler',
    total: 'kişi',
    months: ['Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas'],
    depts: ['Yazılım', 'Tasarım', 'Satış', 'Operasyon'],
  },

  brandTitle: 'Bir marka rengi. Her piksel ona uyar.',
  brandLead: 'Renginizi bir kez seçin. Butonlar, grafikler, odak halkaları ve metin için koyu tonlar açık ve koyu temada sizin için hesaplanır.',
  brandCard: { title: 'Bildirimler', email: 'E-posta özeti', push: 'Anlık bildirim', save: 'Kaydet', week: 'Hafta', month: 'Ay', growth: 'Büyüme' },

  partsTitle: 'Gerçek bileşenler. Ekran görüntüsü değil.',
  partsLead: 'Bu sayfadaki her şey canlı çalışan Ladom UI. Üzerine gelin, yazın, uygulamanıza kopyalayın.',
  parts: {
    otp: 'Doğrulama kodu',
    share: '“Q4 lansmanı”nı paylaş',
    hover: 'Üzerime gel',
    filters: ['Tasarım', 'Kod', 'Yapay zekâ', 'Token'],
    color: 'Marka rengi',
    toast: 'Yayına alındı',
    toastNote: 'ui.ladom.co · 12 sn önce',
    revenue: 'Gelir',
  },

  stats: { handoffs: 'teslim toplantısı', components: 'bileşen', tokens: 'token', icons: 'ikon' },

  ctaTitle: ['Tasarımınız', 'zaten yayında.'],
  ctaLead: 'Tek komut Ladom UI’ı React uygulamanıza kurar. Bir komut daha yapay zekânıza nasıl kullanacağını öğretir.',
  ctaPrompt: 'Ya da Claude’a söyleyin: “npx ladom-ui init --yes ve npx ladom-ui skill ile Ladom UI’ı kur, ekranlarımı onunla yap.”',
  footer: '© 2026 Ladom. Ücretsiz sürüm MIT lisanslı.',
};

export const NEW_LANDING_COPY: Record<Locale, NewLandingCopy> = { en, tr };
