'use client';

import Link from 'next/link';
import { Button, TextMotion, type TextMotionEffect } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { href } from '@/i18n';
import { useLocale } from '@/components/useLocale';
import styles from './page.module.css';

const EFFECTS: TextMotionEffect[] = ['roll', 'blur', 'flip', 'wave'];

// The "Text animations" part of the Animation page, and the pointer to it on the Typography page.
const COPY = {
  en: {
    title: 'Text animations',
    text: 'Text can move when the control it sits in is hovered or focused. It is opt-in: no Ladom UI component animates its text by default. Wrap a label in TextMotion where a little motion helps, such as the main call to action of a landing page, not on every button.',
    effects: 'Effects',
    effectsText: 'Four effects, each running one character after another. They use the motion tokens above and stay still with prefers-reduced-motion. Hover or focus a button to see it.',
    names: { roll: 'Roll: slides up by one line, the copy comes from below', blur: 'Blur: drifts up and blurs away, the copy sharpens in', flip: 'Flip: folds away, the copy folds in', wave: 'Wave: the characters hop once' },
    primary: 'Get started',
    more: 'Text Motion component',
    pointer: 'Text animations (opt-in, for labels in buttons and links) are on the Animation page.',
    pointerLink: 'Text animations',
  },
  tr: {
    title: 'Metin animasyonları',
    text: 'Metin, içinde durduğu kontrolün üzerine gelince ya da odaklanınca hareket edebilir. Bu isteğe bağlıdır: hiçbir Ladom UI bileşeni metnini varsayılan olarak hareket ettirmez. Biraz hareketin işe yaradığı yerde, örneğin bir landing sayfasının ana çağrı butonunda, etiketi TextMotion ile sarın; her butonda kullanmayın.',
    effects: 'Efektler',
    effectsText: 'Dört efekt var; hepsi harf harf sırayla çalışır. Yukarıdaki animasyon tokenlarını kullanır, prefers-reduced-motion açıkken hareket etmez. Görmek için bir butonun üzerine gelin ya da odaklanın.',
    names: { roll: 'Roll: bir satır yukarı kayar, kopyası alttan gelir', blur: 'Blur: yukarı kayıp bulanıklaşır, kopyası netleşerek gelir', flip: 'Flip: katlanarak kaybolur, kopyası katlanarak gelir', wave: 'Wave: harfler bir kez zıplar' },
    primary: 'Hemen başlayın',
    more: 'Text Motion bileşeni',
    pointer: 'Metin animasyonları (isteğe bağlı, buton ve linklerdeki etiketler için) Animasyon sayfasında.',
    pointerLink: 'Metin animasyonları',
  },
};

export function TextMotionSection() {
  const { lang } = useLocale();
  const c = COPY[lang];
  return (
    <section>
      <h2 id="text-animations" className={styles.sectionTitle}>
        {c.title}
      </h2>
      <p>{c.text}</p>
      <h3 id="effects">{c.effects}</h3>
      <p>{c.effectsText}</p>
      <div className={styles.motionDemo}>
        {EFFECTS.map((effect) => (
          <div key={effect} className={styles.motionItem}>
            <Button>
              <TextMotion effect={effect}>{c.primary}</TextMotion>
            </Button>
            <span className={styles.motionName}>{c.names[effect]}</span>
          </div>
        ))}
      </div>
      <CodeBlock
        code={`import { Button, TextMotion } from '@ladom/ui';

<Button>
  <TextMotion effect="roll">${c.primary}</TextMotion>
</Button>`}
      />
      <p>
        <Link href={href(lang, '/docs/components/text-motion')}>{c.more}</Link>
      </p>
    </section>
  );
}

export function TextMotionPointer() {
  const { lang } = useLocale();
  const c = COPY[lang];
  return (
    <p>
      {c.pointer} <Link href={`${href(lang, '/docs/foundations/motion')}#text-animations`}>{c.pointerLink}</Link>
    </p>
  );
}
