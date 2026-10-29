import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { DatePickerPlayground } from './DatePickerPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Picks a day or a range of days from a month grid. Calendar is the bare month; DatePicker puts one or two months in a panel, with quick ranges.',
    days: 'Day states',
    daysText: 'Today has a primary ring, the chosen day a primary circle, a hovered day a secondary circle. Days of other months and days that cannot be chosen are medium emphasis. A range draws a primary soft band from its start to its end. An event adds a dot under the number.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The day and month texts use an unbound 12/16 HK Grotesk Medium style; code uses ui/text small/regular.',
      'Figma shows no weekday names; code labels every day with its full date for screen readers instead.',
      'The month grid has five weeks; code shows five or six, as the month needs.',
      'The Recurring End band in Figma sits at y 40 instead of 8; code draws it like Recurring Start, mirrored.',
      'Date Month Type=Hover (a month/year button) has no picker behind it in Figma; code shows the title as text.',
      'The Controls arrows are placeholder icons; code uses arrow-left and arrow-right.',
      'Date Filter uses the deprecated Cell; code uses Cell Small.',
      'The panel shadow is the primitive Depth 2XL effect; code uses --shadow-depth-2xl.',
    ],
    usage: 'Usage',
    usageText: 'Calendar and DatePicker are panels: open DatePicker under an Input or a Selectbox-like button yourself, or show Calendar inline.',
    api: 'API reference',
    apiText: 'Both accept every div attribute. In range mode value is { start, end }; the first click sets start, the second sets end.',
    a11y: 'Accessibility',
    a11yItems: [
      'The month is a grid of day buttons. Arrow keys move by day and week, Home/End to the week’s ends, PageUp/PageDown by month; Enter or Space picks.',
      'Each day is named with its full date; today has aria-current="date" and chosen days aria-selected.',
      'The month title is a polite live region, so changing month is announced.',
    ],
    mapping: 'Figma to code',
    props: {
      mode: "'single' or 'range'.",
      value: 'Date, or { start, end } in range mode.',
      onChange: 'Called with the new value.',
      months: 'Months side by side (Full Control: 2).',
      presets: 'Quick ranges (Date Filter).',
      events: 'Days with an event dot.',
      min: 'Earliest choosable day.',
      max: 'Latest choosable day.',
      isDateDisabled: 'Marks other days that cannot be chosen.',
      weekStartsOn: '0 Sunday or 1 Monday.',
      locale: 'Locale for month names and day labels.',
    },
  },
  tr: {
    description: 'Bir ay ızgarasından bir gün ya da gün aralığı seçtirir. Calendar yalın aydır; DatePicker bir ya da iki ayı, hızlı aralıklarla birlikte bir panele koyar.',
    days: 'Gün durumları',
    daysText: 'Bugünün primary halkası, seçili günün primary dairesi, hover edilen günün secondary dairesi vardır. Diğer ayların günleri ve seçilemeyen günler medium-emphasis’tir. Aralık, başından sonuna primary soft bir bant çizer. Etkinlik, sayının altına bir nokta ekler.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Gün ve ay metinleri bağlı olmayan 12/16 HK Grotesk Medium stilini kullanıyor; kod ui/text small/regular kullanır.',
      'Figma’da gün adları yok; kod bunun yerine her güne ekran okuyucular için tam tarihini label olarak verir.',
      'Ay ızgarası beş hafta; kod, ayın gerektirdiği kadar beş ya da altı hafta gösterir.',
      'Figma’da Recurring End bandı y 8 yerine y 40’ta; kod onu Recurring Start’ın aynası olarak çizer.',
      'Date Month Type=Hover’ın (ay/yıl butonu) Figma’da bir seçicisi yok; kod başlığı metin olarak gösterir.',
      'Controls okları placeholder ikonlar; kod arrow-left ve arrow-right kullanır.',
      'Date Filter kullanımdan kalkmış Cell’i kullanıyor; kod Cell Small kullanır.',
      'Panel gölgesi primitive Depth 2XL efekti; kod --shadow-depth-2xl kullanır.',
    ],
    usage: 'Kullanım',
    usageText: 'Calendar ve DatePicker paneldir: DatePicker’ı bir Input’un ya da Selectbox benzeri bir butonun altında kendiniz açın ya da Calendar’ı sayfada gösterin.',
    api: 'API',
    apiText: 'İkisi de tüm div özniteliklerini kabul eder. Aralık modunda value { start, end }’dir; ilk tıklama start’ı, ikincisi end’i belirler.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Ay, gün butonlarından oluşan bir grid’dir. Ok tuşları gün ve hafta, Home/End haftanın uçlarına, PageUp/PageDown ay ay gezinir; Enter ya da Space seçer.',
      'Her gün tam tarihiyle adlandırılır; bugün aria-current="date", seçili günler aria-selected taşır.',
      'Ay başlığı polite bir live region’dır; ay değişince duyurulur.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      mode: "'single' ya da 'range'.",
      value: 'Date ya da aralık modunda { start, end }.',
      onChange: 'Yeni değerle çağrılır.',
      months: 'Yan yana ay sayısı (Full Control: 2).',
      presets: 'Hızlı aralıklar (Date Filter).',
      events: 'Etkinlik noktası olan günler.',
      min: 'Seçilebilen en erken gün.',
      max: 'Seçilebilen en geç gün.',
      isDateDisabled: 'Seçilemeyen diğer günleri işaretler.',
      weekStartsOn: '0 pazar ya da 1 pazartesi.',
      locale: 'Ay adları ve gün label’ları için dil.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Date Picker' };
}

export default async function DatePickerPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Date Picker" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2037:6346" />

        <h2 id="playground">{t.component.playground}</h2>
        <DatePickerPlayground />

        <ForView view="designer">
          <h2 id="days">{c.days}</h2>
          <p>{c.daysText}</p>
          <SpecTable
            head={['Day', 'Circle', 'Text']}
            rows={[
              ['default', '—', '--color-foreground-level-1'],
              ['today', '--color-primary ring', '--color-primary'],
              ['hover', '--color-secondary', '--color-on-secondary'],
              ['selected', '--color-primary', '--color-on-primary'],
              ['range middle', '--color-primary-soft band', '--color-foreground-high-emphasis'],
              ['disabled / other month', '—', '--color-foreground-medium-emphasis'],
              ['disabled selected', '--color-surface-level-3', '--color-foreground-medium-emphasis'],
              ['event dot', '--color-primary (selected: --color-on-primary)', '—'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Day cell / circle', '48px / 32px (--space-xxlarge)'],
              ['Panel', '--color-surface-level-1, --radius-layout-base, --shadow-depth-2xl'],
              ['Panel padding', '--space-medium + --space-tiny'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="figma-notes">{c.notes}</h2>
          <ul>
            {c.notesItems.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [day, setDay] = useState<Date | null>(null);
<DatePicker value={day} onChange={setDay} min={new Date()} />

const [range, setRange] = useState<DateRange>({ start: null, end: null });
<DatePicker mode="range" months={2} presets={presets} value={range} onChange={setRange} />`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['mode', "'single' | 'range'", "'single'"],
              ['value', 'Date | DateRange', '—'],
              ['onChange', '(value) => void', '—'],
              ['months', '1 | 2', '1'],
              ['presets', 'DatePreset[]', '—'],
              ['events', 'Date[]', '—'],
              ['min', 'Date', '—'],
              ['max', 'Date', '—'],
              ['isDateDisabled', '(date: Date) => boolean', '—'],
              ['weekStartsOn', '0 | 1', '1'],
              ['locale', 'string', 'browser'],
            ]}
            descriptions={c.props}
          />

          <h2 id="accessibility">{c.a11y}</h2>
          <ul>
            {c.a11yItems.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ForView>

        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable
          rows={[
            ['Date Picker 🎛 Type = Basic', '<Calendar />'],
            ['Date Picker 🎛 Type = Default', '<DatePicker />'],
            ['Date Picker 🎛 Type = Full Control', '<DatePicker mode="range" months={2} presets={…} />'],
            ['Date Day Type = Today / Event', 'today / events={[…]}'],
            ['Date Day Type = Recurring Start / Recurring / Recurring End', 'mode="range"'],
            ['Date Day Disabled', 'min / max / isDateDisabled'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
