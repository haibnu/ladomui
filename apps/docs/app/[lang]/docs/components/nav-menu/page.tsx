import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { NavMenuPlayground } from './NavMenuPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Two simple menus of links for web apps: SidebarNav for the side, TopNav for the top. Use whichever your layout needs.',
    pro: 'Free and Pro',
    proText:
      'These are the simple versions, free under MIT: plain links, one level, no state of their own. The advanced side menu, with a collapsible rail and nested groups, is the Pro App Sidebar.',
    usage: 'Usage',
    usageText:
      'Name each menu with aria-label and mark the page you are on with current. Items are <a> elements; pass your router’s link with as. SidebarNav fills its parent, so put it in a column of 240–280px; its footer takes a SidebarNavSection of its own.',
    router: 'With a router',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'Both render a <nav> with a list of links; give each an aria-label (“Main”), especially when a page has more than one.',
      'current sets aria-current="page", which screen readers announce.',
      'A disabled item is not a link: it has no href, takes no focus and ignores clicks.',
      'Items show the focus ring on keyboard focus.',
    ],
    props: {
      header: 'SidebarNav: above the links, e.g. the logo.',
      footer: 'SidebarNav: pinned to the bottom; a SidebarNavSection.',
      title: 'SidebarNavSection: caption above its links.',
      brand: 'TopNav: at the start, e.g. the logo.',
      actions: 'TopNav: at the end, e.g. buttons or an Avatar.',
      href: 'Items: the link.',
      as: 'Items: the link element, e.g. next/link’s Link.',
      icon: 'Items: an icon element.',
      badge: 'Items: a count or short text at the end, drawn as a Tiny Badge; or a Badge element.',
      current: 'Items: the page you are on.',
      disabled: 'Items: unavailable.',
    },
  },
  tr: {
    description: 'Web uygulamaları için iki basit bağlantı menüsü: kenar için SidebarNav, üst için TopNav. Düzeniniz hangisini istiyorsa onu kullanın.',
    pro: 'Ücretsiz ve Pro',
    proText:
      'Bunlar basit sürümlerdir ve MIT ile ücretsizdir: düz bağlantılar, tek seviye, kendi durumu yok. Daraltılabilir şeridi ve iç içe gruplarıyla gelişmiş kenar menüsü Pro App Sidebar’dır.',
    usage: 'Kullanım',
    usageText:
      'Her menüye aria-label ile ad verin ve bulunduğunuz sayfayı current ile işaretleyin. Öğeler <a> öğesidir; router’ınızın bağlantısını as ile verin. SidebarNav ebeveynini doldurur, onu 240–280px’lik bir sütuna koyun; footer kendi SidebarNavSection’ını alır.',
    router: 'Router ile',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'İkisi de bağlantı listesi içeren bir <nav> çizer; her birine aria-label verin (“Ana menü”), özellikle sayfada birden fazla menü varsa.',
      'current, ekran okuyucuların duyurduğu aria-current="page" değerini verir.',
      'Devre dışı öğe bağlantı değildir: href’i yoktur, odak almaz, tıklamayı yok sayar.',
      'Öğeler klavye odağında odak halkasını gösterir.',
    ],
    props: {
      header: 'SidebarNav: bağlantıların üstü, örneğin logo.',
      footer: 'SidebarNav: alta sabit; bir SidebarNavSection.',
      title: 'SidebarNavSection: bağlantılarının üstündeki başlık.',
      brand: 'TopNav: başta, örneğin logo.',
      actions: 'TopNav: sonda, örneğin butonlar ya da Avatar.',
      href: 'Öğeler: bağlantı.',
      as: 'Öğeler: bağlantı öğesi, örneğin next/link’in Link’i.',
      icon: 'Öğeler: ikon öğesi.',
      badge: 'Öğeler: sonda bir sayı ya da kısa metin, Tiny Badge olarak çizilir; ya da bir Badge öğesi.',
      current: 'Öğeler: bulunulan sayfa.',
      disabled: 'Öğeler: kullanılamaz.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Nav Menu' };
}

export default async function NavMenuPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Nav Menu" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <NavMenuPlayground />
        <h2 id="free-and-pro">{c.pro}</h2>
        <p>{c.proText}</p>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <h3 id="router">{c.router}</h3>
          <CodeBlock
            code={`import Link from 'next/link';\nimport { usePathname } from 'next/navigation';\n\nconst path = usePathname();\n\n<SidebarNav aria-label="Main">\n  <SidebarNavSection>\n    <SidebarNavItem as={Link} href="/" current={path === '/'}>Home</SidebarNavItem>\n    <SidebarNavItem as={Link} href="/reports" current={path === '/reports'}>Reports</SidebarNavItem>\n  </SidebarNavSection>\n</SidebarNav>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['header', 'ReactNode', '—'],
              ['footer', 'ReactNode', '—'],
              ['title', 'ReactNode', '—'],
              ['brand', 'ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['href', 'string', '—'],
              ['as', 'ElementType', "'a'"],
              ['icon', 'ReactNode', '—'],
              ['badge', 'ReactNode', '—'],
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
