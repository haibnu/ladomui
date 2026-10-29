import type { Metadata } from 'next';
import Link from 'next/link';
import { DocPage } from '@/components/DocPage';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.introduction };
}

export default async function IntroductionPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const link = (path: string) => href(lang, path);

  if (lang === 'tr') {
    return (
      <DocPage
        eyebrow={t.nav.gettingStarted}
        title={t.nav.introduction}
        description="Ladom UI, React için Ladom tasarım sistemidir: Ladom UI Figma dosyasıyla birebir kurulmuş tasarım tokenları, ikonlar ve bileşenler."
      >
        <h2 id="principles">İlkeler</h2>
        <ul>
          <li>
            <strong>Doğruluk kaynağı Figma’dır.</strong> Renkler, yazı, boşluklar, köşe yarıçapları, derinlik ve hareket
            Figma’daki variable ve stillerden gelir. Kodda hiçbir şey uydurulmaz.
          </li>
          <li>
            <strong>Her şey bir token’dır.</strong> Bileşenler hiçbir görsel değeri sabit yazmaz;{' '}
            <code>var(--color-primary)</code> ya da <code>var(--text-ui-title)</code> gibi CSS değişkenleri kullanır.
          </li>
          <li>
            <strong>Sade React ve CSS.</strong> Bileşenler framework’ten bağımsız React ve CSS Modules ile yazılır. Tailwind
            ya da çalışma zamanında stil üretimi yoktur.
          </li>
          <li>
            <strong>Her anlam için tek ikon.</strong> Her ikon adı tek bir ikona karşılık gelir; bir üründe üç farklı
            telefon ikonu kullanılmaz.
          </li>
        </ul>

        <h2 id="packages">Paketler</h2>
        <ul>
          <li>
            <code>@ladom/tokens</code>: CSS değişkeni olarak tasarım tokenları; Açık/Koyu tema, Masaüstü/Tablet/Mobil
            değerleri ve Comfort/Narrow yoğunluğu. Bkz. <Link href={link('/docs/foundations/color')}>Temeller</Link>.
          </li>
          <li>
            <code>@ladom/icons</code>: anlamlı adlarla ikon bileşenleri. Bkz. <Link href={link('/docs/foundations/icons')}>İkonlar</Link>.
          </li>
          <li>
            <code>@ladom/ui</code>: React bileşenleri. Şu an yapılıyorlar ve bu siteye tek tek eklenecekler.
          </li>
        </ul>

        <h2 id="modes">Modlar</h2>
        <p>
          Modlar <code>{'<html>'}</code> üzerindeki özniteliklerle seçilir. Cihaz değerleri ekran genişliğini izler (768px
          altı Mobil, 1280px altı Tablet) ve <code>data-device</code> ile zorlanabilir. Koyu tema{' '}
          <code>data-theme=&quot;dark&quot;</code>, Narrow yoğunluk <code>data-density=&quot;narrow&quot;</code> ile açılır.
        </p>

        <h2 id="next">Sonraki adımlar</h2>
        <p>
          <Link href={link('/docs/installation')}>Kurulum</Link> ile devam edin.
        </p>
      </DocPage>
    );
  }

  return (
    <DocPage
      eyebrow={t.nav.gettingStarted}
      title={t.nav.introduction}
      description="Ladom UI is the Ladom design system for React: design tokens, icons and components built 1:1 from the Ladom UI Figma file."
    >
      <h2 id="principles">Principles</h2>
      <ul>
        <li>
          <strong>Figma is the source of truth.</strong> Colors, type, spacing, radius, depth and motion come from the Figma
          variables and styles. Nothing is invented in code.
        </li>
        <li>
          <strong>Everything is a token.</strong> Components never hard-code a visual value; they use CSS custom properties
          such as <code>var(--color-primary)</code> or <code>var(--text-ui-title)</code>.
        </li>
        <li>
          <strong>Plain React and CSS.</strong> Components are framework-independent React with CSS Modules. No Tailwind, no
          runtime styling.
        </li>
        <li>
          <strong>One icon per meaning.</strong> Every icon name maps to exactly one icon, so a product never mixes three
          different phone icons.
        </li>
      </ul>

      <h2 id="packages">Packages</h2>
      <ul>
        <li>
          <code>@ladom/tokens</code>: design tokens as CSS variables, with Light/Dark themes, Desktop/Tablet/Mobile values
          and Comfort/Narrow density. See <Link href={link('/docs/foundations/color')}>Foundations</Link>.
        </li>
        <li>
          <code>@ladom/icons</code>: icon components with semantic names. See <Link href={link('/docs/foundations/icons')}>Icons</Link>.
        </li>
        <li>
          <code>@ladom/ui</code>: React components. They are being built now and land in this site one by one.
        </li>
      </ul>

      <h2 id="modes">Modes</h2>
      <p>
        Modes are set with attributes on <code>{'<html>'}</code>. Device values follow the screen width (Mobile below
        768px, Tablet below 1280px) and can be forced with <code>data-device</code>. The Dark theme is opt-in with{' '}
        <code>data-theme=&quot;dark&quot;</code>, and Narrow density with <code>data-density=&quot;narrow&quot;</code>.
      </p>

      <h2 id="next">Next steps</h2>
      <p>
        Continue with <Link href={link('/docs/installation')}>Installation</Link>.
      </p>
    </DocPage>
  );
}
