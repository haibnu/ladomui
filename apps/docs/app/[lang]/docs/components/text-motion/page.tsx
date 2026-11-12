import type { Metadata } from 'next';
import Link from 'next/link';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider, ViewSwitch } from '@/components/docs/ViewSwitch';
import { getDictionary, href, type Locale } from '@/i18n';
import { TextMotionPlayground } from './TextMotionPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Opt-in text animations for labels in buttons and links: roll, blur, flip and wave, on hover and focus.',
    notDrawn: 'Not in Figma yet. The motion uses the Animation tokens and will follow the Figma drawing once it is made.',
    optIn: 'No Ladom UI component animates its text by default. Add TextMotion only where a little motion helps, such as the main call to action of a landing page.',
    motionPage: 'Text animations on the Animation page',
    look: 'Motion',
    lookText:
      'Every effect runs one character after another while the trigger is hovered or focused, and goes back when the pointer leaves. roll: each character slides out by one line and its copy slides in from below. blur: the characters drift up and blur away while their copies drift in and sharpen. flip: the characters fold away around the horizontal axis and their copies fold in. wave: the characters hop once. direction="down" reverses the way they move. The text keeps the font and color of its parent.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText:
      'Put the label inside TextMotion. With trigger="parent" (the default) it runs while the nearest button, link, tab, menu item, list option, label or summary is hovered or focused; mark any other element as the trigger with data-text-motion-trigger. Only text is animated: anything that is not a string or a number is rendered as it is.',
    api: 'API reference',
    apiText: 'TextMotion also accepts every span attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'Assistive tech reads the text once, from a visually hidden copy; the moving characters are hidden from it.',
      'It also runs on keyboard focus, not only on hover.',
      'With prefers-reduced-motion the text stays still. In forced-colors mode it does not move either.',
      'Keep it to short labels; long text in motion is hard to read.',
    ],
    props: {
      children: 'The text to animate (a string or a number).',
      effect: 'roll, blur, flip or wave.',
      direction: 'up: the characters move up and the copy comes from below. down: the other way.',
      trigger: 'parent: the nearest button, link or other control (or an element with data-text-motion-trigger). self: the text itself.',
      stagger: 'Characters start one after another; false moves them together.',
    },
  },
  tr: {
    description: 'Buton ve linklerdeki etiketler için isteğe bağlı metin animasyonları: roll, blur, flip ve wave; üzerine gelince ve odaklanınca.',
    notDrawn: 'Henüz Figma’da yok. Hareket Animasyon tokenlarını kullanıyor; Figma çizimi yapılınca ona uyacak.',
    optIn: 'Hiçbir Ladom UI bileşeni metnini varsayılan olarak hareket ettirmez. TextMotion’u yalnızca biraz hareketin işe yaradığı yerde, örneğin bir landing sayfasının ana çağrı butonunda kullanın.',
    motionPage: 'Animasyon sayfasındaki metin animasyonları',
    look: 'Hareket',
    lookText:
      'Her efekt, tetikleyicinin üzerine gelince ya da odaklanınca harf harf sırayla çalışır, imleç ayrılınca geri döner. roll: her harf bir satır kayar, kopyası alttan gelir. blur: harfler yukarı kayarak bulanıklaşıp kaybolur, kopyaları netleşerek gelir. flip: harfler yatay eksende katlanarak kaybolur, kopyaları katlanarak gelir. wave: harfler bir kez zıplar. direction="down" hareket yönünü tersine çevirir. Metin, üst öğesinin fontunu ve rengini korur.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText:
      'Etiketi TextMotion’un içine koyun. trigger="parent" (varsayılan) ile en yakın buton, link, sekme, menü öğesi, liste seçeneği, label ya da summary’nin üzerine gelince veya odaklanınca çalışır; başka bir öğeyi tetikleyici yapmak için ona data-text-motion-trigger ekleyin. Yalnızca metin hareket eder: string ya da sayı olmayan içerik olduğu gibi çizilir.',
    api: 'API',
    apiText: 'TextMotion tüm span özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Yardımcı teknolojiler metni gizli bir kopyadan bir kez okur; hareket eden harfler onlardan gizlenir.',
      'Yalnızca üzerine gelince değil, klavyeyle odaklanınca da çalışır.',
      'prefers-reduced-motion açıkken metin hareket etmez. Forced-colors modunda da hareket etmez.',
      'Kısa etiketlerde kullanın; uzun metni hareket halindeyken okumak zordur.',
    ],
    props: {
      children: 'Hareket edecek metin (string ya da sayı).',
      effect: 'roll, blur, flip ya da wave.',
      direction: 'up: harfler yukarı kayar, kopya alttan gelir. down: tersi.',
      trigger: 'parent: en yakın buton, link ya da başka bir kontrol (veya data-text-motion-trigger olan bir öğe). self: metnin kendisi.',
      stagger: 'Harfler sırayla başlar; false hepsini birlikte hareket ettirir.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Text Motion' };
}

export default async function TextMotionPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Text Motion" description={c.description}>
        <ViewSwitch />
        <p>{c.notDrawn}</p>
        <p>
          {c.optIn} <Link href={`${href(lang, '/docs/foundations/motion')}#text-animations`}>{c.motionPage}</Link>
        </p>

        <h2 id="playground">{t.component.playground}</h2>
        <TextMotionPlayground />

        <ForView view="designer">
          <h2 id="motion">{c.look}</h2>
          <p>{c.lookText}</p>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Move, fade, blur', '--motion-swipe-y'],
              ['Wave hop (per character; the next starts a quarter later)', '--duration-speed-m'],
              ['Gap between characters', '--duration-speed-xs / 12'],
            ].map((r) => r.map((cell, i) => (i ? <code key={i}>{cell}</code> : cell)))}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`import { Button, TextMotion } from '@ladom/ui';

<Button>
  <TextMotion>Get started</TextMotion>
</Button>

// A card link: the whole card is the trigger.
<a href="/pricing" className="card">
  <TextMotion direction="down">See pricing</TextMotion>
</a>

// Any other element as the trigger.
<div data-text-motion-trigger tabIndex={0}>
  <TextMotion>Hover me</TextMotion>
</div>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['children', 'string | number', '—'],
              ['effect', "'roll' | 'blur' | 'flip' | 'wave'", "'roll'"],
              ['direction', "'up' | 'down'", "'up'"],
              ['trigger', "'parent' | 'self'", "'parent'"],
              ['stagger', 'boolean', 'true'],
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
      </DocPage>
    </ViewProvider>
  );
}
