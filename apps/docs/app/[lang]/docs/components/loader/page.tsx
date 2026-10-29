import type { Metadata } from 'next';
import { Loader, type LoaderTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { LoaderPlayground } from './LoaderPlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: LoaderTone[] = ['primary', 'secondary', 'tertiary', 'success', 'error', 'warning', 'info'];

const COPY = {
  en: {
    description: 'Shows that something is loading: a spinner when the time is unknown, a bar when progress is known, or the brand mark.',
    variants: 'Variants',
    variantsText: 'Infinite spins the refresh icon in a tone circle. Finite fills a bar, optionally with the percentage and the amount under it. Brand turns the Ladom keycap.',
    tokens: 'Tokens',
    motion: 'Motion',
    motionText: 'Infinite turns once per second, linearly. Brand follows the Figma steps T0–T8 (0°, 15°, 30°, 60°, 90°, 105°, 135°, 165°, 180°) in one second, then repeats them for the second half turn. Both stop when the user asks for reduced motion.',
    notes: 'Notes from Figma',
    notesItems: [
      'Figma has no duration or easing for the spin; code uses 1s per turn, like the Button loader.',
      'Finitive exists only in Primary; code applies every tone (tone-soft track, tone fill).',
      'The Finitive bar is 5px tall, a raw value; code adds --loader-track-height. Its track and fill radii (8px and 4px) both read as round on a 5px bar.',
      'The Brand variant has a primary refresh vector under the keycap that is fully covered; code draws only the keycap.',
      'The Secondary spinner uses secondary-soft as its circle, unlike the other tones.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Loader also accepts every span attribute and forwards its ref. valueText, loaded and total exist only with variant="finite".',
    a11y: 'Accessibility',
    a11yItems: [
      'Infinite and Brand have role="status"; Finite has role="progressbar" with aria-valuenow. All are named “Loading” unless you pass label.',
      'Put the loader inside the region that is loading and set aria-busy on that region while it loads.',
      'The animations stop with prefers-reduced-motion.',
    ],
    mapping: 'Figma to code',
    props: {
      variant: 'Figma 🎛 Type.',
      tone: 'Figma Style (Danger → error, Information → info).',
      value: 'Progress, 0 to 100 (finite).',
      valueText: 'Text under the middle of the bar (Finitive with Text).',
      loaded: 'Amount done, under the end of the bar.',
      total: 'Total amount, after a slash.',
      label: 'Accessible name.',
    },
  },
  tr: {
    description: 'Bir şeyin yüklendiğini gösterir: süre belli değilse dönen ikon, ilerleme belliyse çubuk, ya da marka işareti.',
    variants: 'Tipler',
    variantsText: 'Infinite, ton renkli dairede refresh ikonunu döndürür. Finite bir çubuğu doldurur; altında isteğe bağlı yüzde ve miktar olur. Brand, Ladom tuşunu döndürür.',
    tokens: 'Tokenlar',
    motion: 'Hareket',
    motionText: 'Infinite saniyede bir tur, doğrusal döner. Brand, Figma’daki T0–T8 adımlarını (0°, 15°, 30°, 60°, 90°, 105°, 135°, 165°, 180°) bir saniyede izler, ikinci yarım tur için tekrarlar. Kullanıcı azaltılmış hareket isterse ikisi de durur.',
    notes: 'Figma notları',
    notesItems: [
      'Figma’da dönüş için süre ya da easing yok; kod, Button loader’ı gibi tur başına 1s kullanır.',
      'Finitive yalnızca Primary’de var; kod her tonu uygular (tone-soft zemin, tone dolgu).',
      'Finitive çubuğu 5px yüksekliğinde, ham değer; kod --loader-track-height ekler. Zemin ve dolgu köşeleri (8px ve 4px) 5px çubukta ikisi de yuvarlak görünür.',
      'Brand varyantında tuşun altında tamamen örtülen primary bir refresh vektörü var; kod yalnızca tuşu çizer.',
      'Secondary spinner, diğer tonların aksine daire rengi olarak secondary-soft kullanır.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Loader tüm span özniteliklerini de kabul eder ve ref’ini iletir. valueText, loaded ve total yalnızca variant="finite" ile vardır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Infinite ve Brand role="status" taşır; Finite role="progressbar" ve aria-valuenow taşır. label vermezseniz adları “Loading” olur.',
      'Loader’ı yüklenen bölgenin içine koyun ve yüklenirken o bölgeye aria-busy verin.',
      'Animasyonlar prefers-reduced-motion ile durur.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      variant: 'Figma 🎛 Type.',
      tone: 'Figma Style (Danger → error, Information → info).',
      value: 'İlerleme, 0–100 (finite).',
      valueText: 'Çubuğun ortası altındaki metin (Finitive with Text).',
      loaded: 'Tamamlanan miktar, çubuğun sonu altında.',
      total: 'Toplam miktar, eğik çizgiden sonra.',
      label: 'Erişilebilir ad.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Loader' };
}

export default async function LoaderPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const percent = lang === 'tr' ? '%54' : '54%';
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Loader" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1780:103" />

        <h2 id="playground">{t.component.playground}</h2>
        <LoaderPlayground />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <p>{c.variantsText}</p>
          <Example>
            {TONES.map((tone) => (
              <Loader key={tone} tone={tone} />
            ))}
            <Loader variant="brand" />
          </Example>
          <Example stack>
            <Loader variant="finite" value={64} />
            <Loader variant="finite" value={64} valueText={percent} loaded="45 Mb" total="98 Mb" />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Size', 'Color']}
            rows={[
              ['Infinite circle', '24px (--space-xlarge)', '--color-{tone} (secondary: --color-secondary-soft)'],
              ['Infinite icon', '16px', '--color-on-{tone}'],
              ['Finite track', '--loader-track-height', '--color-{tone}-soft'],
              ['Finite fill', '--loader-track-height', '--color-{tone}'],
              ['Value text', 'ui/text small/regular', '--color-foreground-medium-emphasis'],
              ['Amount', 'ui/footnote/regular', '--color-foreground-high-emphasis / --color-foreground-medium-emphasis'],
              ['Brand', '24px', '--color-static-brand-color'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />

          <h2 id="motion">{c.motion}</h2>
          <p>{c.motionText}</p>

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
            code={`<Loader />
<Loader tone="success" label="Saving" />
<Loader variant="brand" />
<Loader variant="finite" value={54} valueText="${percent}" loaded="45 Mb" total="98 Mb" />`}
            stack
          >
            <Loader />
            <Loader tone="success" label="Saving" />
            <Loader variant="brand" />
            <Loader variant="finite" value={54} valueText={percent} loaded="45 Mb" total="98 Mb" />
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['variant', "'infinite' | 'finite' | 'brand'", "'infinite'"],
              ['tone', "'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info'", "'primary'"],
              ['value', 'number', '—'],
              ['valueText', 'ReactNode', '—'],
              ['loaded', 'ReactNode', '—'],
              ['total', 'ReactNode', '—'],
              ['label', 'string', "'Loading'"],
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
            ['🎛 Type = Infinitive', "variant='infinite' (default)"],
            ['🎛 Type = Finitive', "variant='finite' value={…}"],
            ['🎛 Type = Finitive with Text', "variant='finite' value={…} valueText loaded total"],
            ['🎛 Type = Brand', "variant='brand'"],
            ['Style = Primary / … / Danger / Warning / Information', "tone='primary' / … / 'error' / 'warning' / 'info'"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
