import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { BottomNavPlayground } from './BottomNavPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A bar of 3 to 5 links at the bottom of the screen for mobile web apps: an icon over a short label, the current page in the primary color.',
    toasts: 'Toasts and the page',
    toastsText:
      'While a fixed BottomNav is on screen it writes its height to --ladom-bottom-nav-height on <html>. ToastProvider lifts its stack by that much, so toasts open above the bar and never cover it. Pad the bottom of your page with the same variable so the last content can scroll clear of the bar.',
    usage: 'Usage',
    usageText:
      'Use it on phones for the 3 to 5 main sections of an app, with short one-word labels. Name it with aria-label and mark the section you are on with current. Items are <a> elements; pass your router’s link with as. With mobileOnly the bar hides from 768px up, for apps that switch to a SidebarNav there.',
    router: 'With a router',
    padding: 'Room for the bar',
    safeArea: 'On phones with a home indicator the bar keeps clear of it with env(safe-area-inset-bottom); add viewport-fit=cover to the viewport meta tag.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'It renders a <nav> with a list of links; give it an aria-label (“Main”).',
      'current sets aria-current="page", which screen readers announce.',
      'The icon is decorative; the label names the link. Keep a label on every item.',
      'A disabled item is not a link: it has no href, takes no focus and ignores clicks.',
      'Items show the focus ring on keyboard focus.',
    ],
    props: {
      position: 'BottomNav: fixed pins it to the bottom of the screen; static leaves it in the flow.',
      mobileOnly: 'BottomNav: hides it from the Tablet breakpoint (768px) up.',
      href: 'Items: the link.',
      as: 'Items: the link element, e.g. next/link’s Link.',
      icon: 'Items: an icon element, 24px.',
      currentIcon: 'Items: shown instead of icon on the current page, e.g. a filled icon.',
      badge: 'Items: a count on the icon, drawn as a filled error Micro Badge; true shows a dot; or a Badge element.',
      current: 'Items: the page you are on.',
      disabled: 'Items: unavailable.',
    },
  },
  tr: {
    description: 'Mobil web uygulamaları için ekranın altında 3–5 bağlantılık bir bar: kısa bir etiketin üstünde ikon, bulunulan sayfa ana renkte.',
    toasts: 'Toast’lar ve sayfa',
    toastsText:
      'Sabit (fixed) bir BottomNav ekrandayken yüksekliğini <html> üzerindeki --ladom-bottom-nav-height değişkenine yazar. ToastProvider yığınını bu kadar yukarı alır; toast’lar barın üstünde açılır, bara binmez. Sayfanızın altına da aynı değişkenle boşluk verin ki son içerik barın altında kalmasın.',
    usage: 'Kullanım',
    usageText:
      'Telefonda, uygulamanın 3–5 ana bölümü için, tek kelimelik kısa etiketlerle kullanın. aria-label ile ad verin ve bulunduğunuz bölümü current ile işaretleyin. Öğeler <a> öğesidir; router’ınızın bağlantısını as ile verin. mobileOnly ile bar 768px ve üstünde gizlenir; orada SidebarNav’a geçen uygulamalar için.',
    router: 'Router ile',
    padding: 'Bar için yer',
    safeArea: 'Ana ekran çubuğu olan telefonlarda bar env(safe-area-inset-bottom) ile ondan uzak durur; viewport meta etiketine viewport-fit=cover ekleyin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Bağlantı listesi içeren bir <nav> çizer; ona aria-label verin (“Ana menü”).',
      'current, ekran okuyucuların duyurduğu aria-current="page" değerini verir.',
      'İkon süstür; bağlantının adı etikettir. Her öğede etiket bırakın.',
      'Devre dışı öğe bağlantı değildir: href’i yoktur, odak almaz, tıklamayı yok sayar.',
      'Öğeler klavye odağında odak halkasını gösterir.',
    ],
    props: {
      position: 'BottomNav: fixed ekranın altına sabitler; static akışta bırakır.',
      mobileOnly: 'BottomNav: Tablet kırılımından (768px) itibaren gizler.',
      href: 'Öğeler: bağlantı.',
      as: 'Öğeler: bağlantı öğesi, örneğin next/link’in Link’i.',
      icon: 'Öğeler: ikon öğesi, 24px.',
      currentIcon: 'Öğeler: bulunulan sayfada icon yerine gösterilir, örneğin dolu ikon.',
      badge: 'Öğeler: ikonun üstünde bir sayı, dolu error Micro Badge olarak çizilir; true nokta gösterir; ya da bir Badge öğesi.',
      current: 'Öğeler: bulunulan sayfa.',
      disabled: 'Öğeler: kullanılamaz.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Bottom Nav' };
}

export default async function BottomNavPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Bottom Nav" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <BottomNavPlayground />
        <h2 id="toasts">{c.toasts}</h2>
        <p>{c.toastsText}</p>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <h3 id="router">{c.router}</h3>
          <CodeBlock
            code={`import Link from 'next/link';\nimport { usePathname } from 'next/navigation';\n\nconst path = usePathname();\n\n<BottomNav aria-label="Main" mobileOnly>\n  <BottomNavItem as={Link} href="/" icon={<IconHome />} current={path === '/'}>Home</BottomNavItem>\n  <BottomNavItem as={Link} href="/search" icon={<IconSearch />} current={path === '/search'}>Search</BottomNavItem>\n  <BottomNavItem as={Link} href="/profile" icon={<IconProfile />} current={path === '/profile'}>Profile</BottomNavItem>\n</BottomNav>`}
          />
          <h3 id="padding">{c.padding}</h3>
          <CodeBlock code={`main {\n  padding-block-end: var(--ladom-bottom-nav-height, 0px);\n}`} />
          <p>{c.safeArea}</p>
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['position', "'fixed' | 'static'", "'fixed'"],
              ['mobileOnly', 'boolean', 'false'],
              ['href', 'string', '—'],
              ['as', 'ElementType', "'a'"],
              ['icon', 'ReactNode', '—'],
              ['currentIcon', 'ReactNode', '—'],
              ['badge', 'ReactNode | true', '—'],
              ['current', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
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
