import type { Metadata } from 'next';
import { Badge, type BadgeSize, type BadgeTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { BadgePlayground } from './BadgePlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: BadgeTone[] = ['default', 'primary', 'secondary', 'tertiary', 'error', 'success', 'warning'];
const SIZES: BadgeSize[] = ['medium', 'small', 'tiny', 'micro'];

const COPY = {
  en: {
    description: 'A small label for a status, a category or a count. It is not clickable.',
    variants: 'Variants',
    variantsText: 'Seven tones, each as an outline (the default) or filled. Disabled turns any badge grey.',
    sizes: 'Sizes',
    sizesText: 'Medium and Small use the body text; Tiny and Micro the small text. Micro is a compact 20px pill.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Outline Secondary and Tertiary use their on-color for the text (on-secondary, on-tertiary), the other tones use the tone itself.',
      'Disabled exists only for the Default style; code applies it to every tone.',
      'Micro outline badges have no fill, and the Default Micro outline uses foreground/ghost-emphasis instead of surface/level-4.',
      'Warning Micro filled uses primary/on-primary for the text; code uses on-warning like the other sizes.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Badge also accepts every span attribute and forwards its ref.',
    a11y: 'Accessibility',
    a11yItems: [
      'A badge is plain text; do not rely on its color alone, write the status in the text.',
      'For counts next to an icon, give the icon or its button a label that includes the count (“Notifications, 3 new”).',
      'Disabled sets aria-disabled for the label; it is not a control.',
    ],
    mapping: 'Figma to code',
    props: {
      tone: 'Figma 💅 Style.',
      size: 'Figma 👕 Size.',
      filled: 'Figma Filled.',
      disabled: 'Figma Disabled.',
      iconLeft: 'Figma Icon Leading + Leading Icon Change.',
      iconRight: 'Figma Icon Trailing + Trailing Icon Change.',
      children: 'The label.',
    },
  },
  tr: {
    description: 'Bir durumu, kategoriyi ya da sayıyı gösteren küçük etiket. Tıklanamaz.',
    variants: 'Tipler',
    variantsText: 'Yedi ton; her biri çerçeveli (varsayılan) ya da dolu. Disabled her badge’i griye çevirir.',
    sizes: 'Boyutlar',
    sizesText: 'Medium ve Small gövde metnini, Tiny ve Micro küçük metni kullanır. Micro, 20px yüksekliğinde sıkı bir haptır.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Çerçeveli Secondary ve Tertiary metinde kendi on-rengini (on-secondary, on-tertiary) kullanır; diğer tonlar tonun kendisini.',
      'Disabled yalnızca Default stilinde var; kodda her tona uygulanır.',
      'Çerçeveli Micro badge’lerin dolgusu yok; Default Micro çerçevesi surface/level-4 yerine foreground/ghost-emphasis kullanır.',
      'Dolu Warning Micro metinde primary/on-primary kullanıyor; kod diğer boyutlardaki gibi on-warning kullanır.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Badge tüm span özniteliklerini de kabul eder ve ref’ini iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Badge düz metindir; yalnızca renge güvenmeyin, durumu metne yazın.',
      'Bir ikonun yanındaki sayılarda ikona ya da butonuna sayıyı içeren bir label verin (“Bildirimler, 3 yeni”).',
      'Disabled, etikete aria-disabled ekler; bir kontrol değildir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      tone: 'Figma 💅 Style.',
      size: 'Figma 👕 Size.',
      filled: 'Figma Filled.',
      disabled: 'Figma Disabled.',
      iconLeft: 'Figma Icon Leading + Leading Icon Change.',
      iconRight: 'Figma Icon Trailing + Trailing Icon Change.',
      children: 'Etiket.',
    },
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Badge' };
}

export default async function BadgePage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const row = (filled: boolean) =>
    TONES.map((tone) => (
      <Badge key={tone} tone={tone} filled={filled}>
        {cap(tone)}
      </Badge>
    ));
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Badge" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1394:3" />

        <h2 id="playground">{t.component.playground}</h2>
        <BadgePlayground />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <p>{c.variantsText}</p>
          <Example>{row(false)}</Example>
          <Example>{row(true)}</Example>
          <Example>
            <Badge disabled>Disabled</Badge>
            <Badge disabled filled>
              Disabled
            </Badge>
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example>
            {SIZES.map((size) => (
              <Badge key={size} size={size} tone="primary" filled>
                {cap(size)}
              </Badge>
            ))}
          </Example>
          <SpecTable
            head={['Size', 'Height', 'Padding', 'Gap', 'Text', 'Icon']}
            rows={[
              ['medium', '40px', <code key="p">--space-tiny --space-medium</code>, <code key="g">--space-tiny</code>, 'ui/text/regular', '16px'],
              ['small', '32px', <code key="p">--space-micro --space-small</code>, <code key="g">--space-tiny</code>, 'ui/text/regular', '16px'],
              ['tiny', '24px', <code key="p">--space-micro --space-tiny</code>, <code key="g">--space-micro</code>, 'ui/text small/regular', '12px'],
              ['micro', '20px', <code key="p">--space-atom (+ --space-micro text)</code>, '0', 'ui/text small/regular', '10px'],
            ]}
          />

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Tone', 'Outline line / text', 'Filled background / text']}
            rows={[
              ['default', '--color-surface-level-4 / --color-foreground-high-emphasis', '--color-foreground-high-emphasis / --color-foreground-level-2'],
              ['primary', '--color-primary / --color-primary', '--color-primary / --color-on-primary'],
              ['secondary', '--color-secondary / --color-on-secondary', '--color-secondary / --color-on-secondary'],
              ['tertiary', '--color-tertiary / --color-on-tertiary', '--color-tertiary / --color-on-tertiary'],
              ['error', '--color-error / --color-error', '--color-error / --color-on-error'],
              ['success', '--color-success / --color-success', '--color-success / --color-on-success'],
              ['warning', '--color-warning / --color-warning', '--color-warning / --color-on-warning'],
              ['disabled', '--color-surface-level-3 / --color-foreground-low-emphasis', '—'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
          <p>
            <code>--badge-radius</code> · <code>--color-surface-level-1</code> (outline background)
          </p>

          <h2 id="figma-notes">{c.notes}</h2>
          <ul>
            {c.notesItems.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <Example
            code={`<Badge tone="success">Active</Badge>
<Badge tone="error" filled>Failed</Badge>
<Badge size="micro" tone="primary" filled>New</Badge>
<Badge disabled>Archived</Badge>`}
          >
            <Badge tone="success">Active</Badge>
            <Badge tone="error" filled>
              Failed
            </Badge>
            <Badge size="micro" tone="primary" filled>
              New
            </Badge>
            <Badge disabled>Archived</Badge>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['tone', "'default' | 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning'", "'default'"],
              ['size', "'medium' | 'small' | 'tiny' | 'micro'", "'medium'"],
              ['filled', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
              ['iconLeft', 'ReactNode', '—'],
              ['iconRight', 'ReactNode', '—'],
              ['children', 'ReactNode', '—'],
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
            ['💅 Style = Default / Primary / Secondary / Tertiary / Error / Success / Warning', "tone='default' / 'primary' / … / 'warning'"],
            ['👕 Size = Medium / Small / Tiny / Micro', "size='medium' / 'small' / 'tiny' / 'micro'"],
            ['Filled = True', 'filled'],
            ['Disabled = True', 'disabled'],
            ['Icon Leading / Icon Trailing', 'iconLeft={<Icon… />} / iconRight={<Icon… />}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
