import type { Metadata } from 'next';
import { Hint, type HintTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { HintPlayground } from './HintPlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: HintTone[] = ['default', 'info', 'error', 'success', 'warning'];

const COPY = {
  en: {
    description: 'A short helper or status message with a round badge, used under form elements and labels.',
    variants: 'Variants',
    variantsText: 'Default for neutral help; Information, Error, Success and Warning for status. Each tone colors the badge and the text.',
    sizes: 'Sizes',
    sizesText: 'Small is the form size and the default; Medium is for standalone messages.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Medium uses a 12px gap for Default and Information and 16px for Error, Success and Warning. Code uses 12px (layout-small) for all.',
      'The warning glyph uses foreground/level-2 (white in Light, black in Dark), unlike the other on-colors.',
    ],
    usage: 'Usage',
    withInput: 'Linking to a field',
    withInputText: 'Give the hint an id and point the field’s aria-describedby to it, so screen readers read the hint with the field.',
    api: 'API reference',
    apiText: 'Hint also accepts every div attribute and forwards its ref.',
    a11y: 'Accessibility',
    a11yItems: [
      'The badge is decorative (aria-hidden); the meaning is in the text, so write it in words (“Password is too short”, not just a red color).',
      'Connect the hint to its field with aria-describedby.',
      'For errors that appear after typing or submitting, add role="alert" or place the hint in a live region so it is announced.',
    ],
    mapping: 'Figma to code',
    props: { tone: 'Figma 🎛 Type.', size: 'Figma 👕 Size.', withForm: 'Figma with Form: adds the in-group gap above.', children: 'The message.' },
  },
  tr: {
    description: 'Yuvarlak rozetli kısa yardım ya da durum mesajı; form öğelerinin ve label’ların altında kullanılır.',
    variants: 'Tipler',
    variantsText: 'Nötr yardım için Default; durum için Information, Error, Success ve Warning. Her ton rozeti ve metni renklendirir.',
    sizes: 'Boyutlar',
    sizesText: 'Small form boyutudur ve varsayılandır; Medium tek başına duran mesajlar içindir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Medium’da boşluk Default ve Information’da 12px, Error, Success ve Warning’de 16px. Kodda hepsi 12px (layout-small).',
      'Warning ikonunun rengi, diğer on-renklerin aksine foreground/level-2 (Açık temada beyaz, Koyu temada siyah).',
    ],
    usage: 'Kullanım',
    withInput: 'Bir alana bağlama',
    withInputText: 'Hint’e bir id verin ve alanın aria-describedby özniteliğini ona yönlendirin; ekran okuyucular hint’i alanla birlikte okur.',
    api: 'API',
    apiText: 'Hint tüm div özniteliklerini de kabul eder ve ref’ini iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Rozet dekoratiftir (aria-hidden); anlam metindedir, bu yüzden metni kelimelerle yazın (sadece kırmızı renk değil, “Şifre çok kısa”).',
      'Hint’i alanına aria-describedby ile bağlayın.',
      'Yazarken ya da gönderince çıkan hatalarda role="alert" ekleyin ya da hint’i bir live region içine koyun ki okunsun.',
    ],
    mapping: 'Figma’dan koda',
    props: { tone: 'Figma 🎛 Type.', size: 'Figma 👕 Size.', withForm: 'Figma with Form: üstüne grup içi boşluğu ekler.', children: 'Mesaj.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Hint' };
}

export default async function HintPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Hint" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1086:50" />

        <h2 id="playground">{t.component.playground}</h2>
        <HintPlayground />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <p>{c.variantsText}</p>
          <Example stack>
            {TONES.map((tone) => (
              <Hint key={tone} tone={tone}>
                {tone}
              </Hint>
            ))}
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example>
            <Hint size="medium">Medium</Hint>
            <Hint size="small">Small</Hint>
          </Example>
          <SpecTable
            head={['Size', 'Badge', 'Gap', 'Text', 'Glyph']}
            rows={[
              ['medium', '24px', <code key="g">--layout-small</code>, 'ui/text/regular', '12px'],
              ['small', '16px', <code key="g">--layout-tiny</code>, 'ui/text small/regular', '12px'],
            ]}
          />

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Tone', 'Badge', 'Glyph', 'Text']}
            rows={[
              ['default', '--color-surface-level-3', '--color-foreground-medium-emphasis', '--color-foreground-medium-emphasis'],
              ['info', '--color-info', '--color-on-info', '--color-on-info'],
              ['error', '--color-error', '--color-on-error', '--color-error'],
              ['success', '--color-success', '--color-on-success', '--color-success'],
              ['warning', '--color-warning', '--color-foreground-level-2', '--color-warning'],
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
          <Example code={TONES.map((tone) => (tone === 'default' ? '<Hint>Default</Hint>' : `<Hint tone="${tone}">${tone}</Hint>`)).join('\n')} stack>
            {TONES.map((tone) => (
              <Hint key={tone} tone={tone}>
                {tone}
              </Hint>
            ))}
          </Example>

          <h3 id="with-input">{c.withInput}</h3>
          <p>{c.withInputText}</p>
          <CodeBlock
            code={`<input id="password" aria-describedby="password-hint" />
<Hint id="password-hint" tone="error" withForm role="alert">
  Use at least 8 characters
</Hint>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['tone', "'default' | 'info' | 'error' | 'success' | 'warning'", "'default'"],
              ['size', "'medium' | 'small'", "'small'"],
              ['withForm', 'boolean', 'false'],
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
            ['🎛 Type = Default / Information / Error / Success / Warning', "tone='default' / 'info' / 'error' / 'success' / 'warning'"],
            ['👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['with Form = True', 'withForm'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
