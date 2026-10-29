import type { Metadata } from 'next';
import { Alert, type AlertTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AlertPlayground } from './AlertPlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: AlertTone[] = ['default', 'info', 'success', 'error', 'warning'];

const COPY = {
  en: {
    description: 'An inline message in the page about its state: a warning before an action, the result of a save, a limit reached.',
    types: 'Styles and directions',
    typesText: 'Five styles on the tone’s soft color. Vertical stacks the description and buttons under the title; Horizontal is a pill with everything on one line.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Every style uses the info icon; code does too, and takes another icon with icon.',
      'The Information icon is info/on-info, which is light on the light info-soft background; code uses info/info, as Toast does.',
      'The title and description texts have no color; code uses high and medium emphasis, as in Toast.',
      'Vertical CTA buttons are the tone’s solid small Button plus a tertiary one; Horizontal uses a ghost primary small Button.',
    ],
    usage: 'Usage',
    usageText: 'Put actions as small Buttons. Add role="alert" only for urgent messages that appear after the page loads.',
    api: 'API reference',
    apiText: 'Alert also accepts every div attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'An alert shown with the page needs no role; one that appears later should be in a live region (role="status", or role="alert" if urgent).',
      'The icon is decorative; the title carries the meaning, not the color.',
      'Give the close button a translated closeLabel.',
    ],
    mapping: 'Figma to code',
    props: { tone: 'Figma Style (Information → info).', direction: 'Figma ✈️ Direction.', title: 'Title.', description: 'Figma Description.', actions: 'Figma CTA Buttons.', onClose: 'Figma Close Button.', closeLabel: 'Name of the close button.', icon: 'Icon element.' },
  },
  tr: {
    description: 'Sayfanın içinde, durumu hakkında bir mesaj: bir işlemden önce uyarı, bir kaydın sonucu, aşılan bir sınır.',
    types: 'Stiller ve yönler',
    typesText: 'Tonun soft rengi üzerinde beş stil. Vertical açıklamayı ve butonları başlığın altına dizer; Horizontal her şeyi tek satırda taşıyan bir haptır.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Her stil info ikonunu kullanıyor; kod da öyle, başka bir ikonu icon ile alır.',
      'Information ikonu info/on-info; açık info-soft zeminde soluk kalıyor. Kod, Toast’taki gibi info/info kullanır.',
      'Başlık ve açıklama metinlerinin rengi yok; kod Toast’taki gibi high ve medium emphasis kullanır.',
      'Vertical CTA butonları tonun solid küçük Button’ı ve bir tertiary buton; Horizontal ghost primary küçük Button kullanır.',
    ],
    usage: 'Kullanım',
    usageText: 'Eylemleri küçük Button olarak verin. role="alert"i yalnızca sayfa yüklendikten sonra çıkan acil mesajlara ekleyin.',
    api: 'API',
    apiText: 'Alert tüm div özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Sayfayla birlikte gösterilen bir alert rol istemez; sonradan çıkan bir alert bir live region’da olmalıdır (role="status", acilse role="alert").',
      'İkon dekoratiftir; anlamı renk değil başlık taşır.',
      'Kapatma butonuna çevrilmiş bir closeLabel verin.',
    ],
    mapping: 'Figma’dan koda',
    props: { tone: 'Figma Style (Information → info).', direction: 'Figma ✈️ Direction.', title: 'Başlık.', description: 'Figma Description.', actions: 'Figma CTA Buttons.', onClose: 'Figma Close Button.', closeLabel: 'Kapatma butonunun adı.', icon: 'İkon öğesi.' },
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Alert' };
}

export default async function AlertPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Alert" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2109:21906" />

        <h2 id="playground">{t.component.playground}</h2>
        <AlertPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            {TONES.map((tone) => (
              <Alert key={tone} tone={tone} title={cap(tone)} description="Description" />
            ))}
            {TONES.map((tone) => (
              <Alert key={`h-${tone}`} tone={tone} direction="horizontal" title={cap(tone)} description="Description" />
            ))}
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Style', 'Background', 'Icon']}
            rows={[
              ['default', '--color-surface-level-3', '--color-primary'],
              ['info', '--color-info-soft', '--color-info'],
              ['success', '--color-success-soft', '--color-success'],
              ['error', '--color-error-soft', '--color-error'],
              ['warning', '--color-warning-soft', '--color-warning'],
              ['radius', '--radius-form-element (Horizontal: --radius-full)', '—'],
              ['padding', '--layout-tiny --layout-small --layout-tiny --layout-default', '—'],
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
            code={`<Alert
  tone="warning"
  title="Your trial ends in 3 days"
  description="Add a payment method to keep your projects."
  actions={<Button tone="warning" size="small">Upgrade</Button>}
  onClose={() => setShown(false)}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['tone', "'default' | 'info' | 'success' | 'error' | 'warning'", "'default'"],
              ['direction', "'vertical' | 'horizontal'", "'vertical'"],
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['onClose', '() => void', '—'],
              ['closeLabel', 'string', "'Close'"],
              ['icon', 'ReactNode', '<IconInfo />'],
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
            ['Style = Default / Information / Success / Error / Warning', "tone='default' / 'info' / 'success' / 'error' / 'warning'"],
            ['✈️ Direction = Vertical / Horizontal', "direction='vertical' / 'horizontal'"],
            ['Description', 'description="…"'],
            ['CTA Buttons (Button 01–03)', 'actions={<Button size="small" />…}'],
            ['Close Button', 'onClose={…}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
