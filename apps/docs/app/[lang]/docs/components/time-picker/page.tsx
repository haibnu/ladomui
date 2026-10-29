import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { TimePickerPlayground } from './TimePickerPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Picks a time from hour, minute and second columns that scroll.',
    items: 'Items',
    itemsText: 'Default items are high emphasis; hover is surface/level-3; the chosen item is secondary with its on-color; items that cannot be chosen are low emphasis.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The items use the legacy “Paragraph Small / Regular” style (12/16); code uses ui/text small/regular with tabular numbers.',
      'The item radius is a raw 4px; code uses half of --radius-form-element-small.',
      'The scroll bar is a Custom Scroll component; code styles the native scroll bar with surface/level-3 and level-4.',
      'The panel pads 12px on the right only and 0 on the left; code keeps this.',
    ],
    usage: 'Usage',
    usageText: 'TimePicker is a panel: open it under an Input, or show it inline. Its value is { hours, minutes, seconds }.',
    api: 'API reference',
    apiText: 'TimePicker also accepts every div attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'Each column is a listbox reachable with Tab; Arrow Up/Down, Home and End change its value.',
      'Name the columns with labels when the page is not in English.',
    ],
    mapping: 'Figma to code',
    props: {
      value: '{ hours, minutes, seconds }.',
      onChange: 'Called with the new time.',
      showSeconds: 'Shows the seconds column.',
      step: 'Step between minutes and seconds.',
      isDisabled: 'Marks items that cannot be chosen (Property 1=disable).',
      labels: 'Accessible names of the columns.',
    },
  },
  tr: {
    description: 'Kayan saat, dakika ve saniye sütunlarından bir zaman seçtirir.',
    items: 'Öğeler',
    itemsText: 'Varsayılan öğeler high-emphasis’tir; hover surface/level-3’tür; seçili öğe on-rengiyle secondary’dir; seçilemeyen öğeler low-emphasis’tir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Öğeler eski “Paragraph Small / Regular” stilini (12/16) kullanıyor; kod tabular rakamlarla ui/text small/regular kullanır.',
      'Öğe köşesi ham 4px; kod --radius-form-element-small’ın yarısını kullanır.',
      'Kaydırma çubuğu bir Custom Scroll bileşeni; kod yerel kaydırma çubuğunu surface/level-3 ve level-4 ile biçimlendirir.',
      'Panel yalnızca sağda 12px, solda 0 boşluk bırakıyor; kod bunu korur.',
    ],
    usage: 'Kullanım',
    usageText: 'TimePicker bir paneldir: bir Input’un altında açın ya da sayfada gösterin. Değeri { hours, minutes, seconds }’dir.',
    api: 'API',
    apiText: 'TimePicker tüm div özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Her sütun Tab ile ulaşılan bir listbox’tır; Yukarı/Aşağı ok, Home ve End değerini değiştirir.',
      'Sayfa İngilizce değilse sütunları labels ile adlandırın.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      value: '{ hours, minutes, seconds }.',
      onChange: 'Yeni zamanla çağrılır.',
      showSeconds: 'Saniye sütununu gösterir.',
      step: 'Dakika ve saniyeler arasındaki adım.',
      isDisabled: 'Seçilemeyen öğeleri işaretler (Property 1=disable).',
      labels: 'Sütunların erişilebilir adları.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Time Picker' };
}

export default async function TimePickerPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Time Picker" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="6:1395" />

        <h2 id="playground">{t.component.playground}</h2>
        <TimePickerPlayground />

        <ForView view="designer">
          <h2 id="items">{c.items}</h2>
          <p>{c.itemsText}</p>
          <SpecTable
            head={['Item', 'Background', 'Text']}
            rows={[
              ['Default', '—', '--color-foreground-high-emphasis'],
              ['hover', '--color-surface-level-3', '--color-foreground-high-emphasis'],
              ['selected', '--color-secondary', '--color-on-secondary'],
              ['disable', '—', '--color-foreground-low-emphasis'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Panel', '--color-surface-level-1, --radius-layout-base, --shadow-form-level-1'],
              ['Column line', '--border-width --color-surface-level-3'],
              ['Item padding', '--space-micro --space-tiny'],
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
            code={`const [time, setTime] = useState<TimeValue | null>(null);

<TimePicker value={time} onChange={setTime} showSeconds={false} step={15} />`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['value', 'TimeValue | null', '—'],
              ['onChange', '(value: TimeValue) => void', '—'],
              ['showSeconds', 'boolean', 'true'],
              ['step', 'number', '1'],
              ['isDisabled', "(unit, value) => boolean", '—'],
              ['labels', '{ hours, minutes, seconds }', "English"],
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
            ['Time Picker', '<TimePicker />'],
            ['.timepicker item Property 1 = selected', 'value'],
            ['.timepicker item Property 1 = disable', 'isDisabled'],
            ['hours / minutes / seconds columns', 'showSeconds'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
