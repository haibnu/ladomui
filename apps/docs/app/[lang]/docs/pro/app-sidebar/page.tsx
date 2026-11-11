import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AppSidebarPlayground } from './AppSidebarPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The Pro side menu of an app: it collapses to a rail of icons and holds nested groups. The free SidebarNav is its simple version.',
    behavior: 'Behavior',
    behaviorItems: [
      'The button at the top collapses the menu to a rail of icons; labels then show in a Tooltip and a badge becomes a dot on the icon. Section titles become lines.',
      'An item with nested AppSidebarItems is a group that opens and closes, up to three levels; a group that holds the current page starts open, and in the rail it is marked as current.',
      'In the rail, a group opens the menu with the group open.',
      'The width animates with motion-fade-default, and not at all under prefers-reduced-motion.',
    ],
    usage: 'Usage',
    usageText:
      'Give top-level items an icon (the rail shows only icons) and mark the page you are on with current. collapsed and onCollapsedChange control the rail, for example to remember it; collapsible={false} hides the button when your app toggles it elsewhere. Items are <a> elements; pass your router’s link with as.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The menu is a <nav> with lists of links; name it with aria-label.',
      'A group is a button with aria-expanded and aria-controls; current sets aria-current="page".',
      'In the rail every item keeps its label as its accessible name and shows it in a Tooltip on hover and focus.',
      'Translate the collapse button with collapseLabel and expandLabel.',
    ],
    props: {
      header: 'AppSidebar: above the links, e.g. the logo; hidden in the rail.',
      footer: 'AppSidebar: pinned to the bottom; an AppSidebarSection.',
      collapsed: 'AppSidebar: shows the rail of icons.',
      defaultCollapsed: 'AppSidebar: the first state (uncontrolled).',
      onCollapsedChange: 'AppSidebar: called when the button toggles the rail.',
      collapsible: 'AppSidebar: shows the collapse button.',
      width: 'AppSidebar: width when expanded, in px.',
      title: 'AppSidebarSection: caption above its links.',
      label: 'AppSidebarItem: the text.',
      icon: 'AppSidebarItem: an icon element; needed at the top level.',
      badge: 'AppSidebarItem: a count, drawn as a Tiny Badge.',
      current: 'AppSidebarItem: the page you are on.',
      children: 'AppSidebarItem: nested items; makes it a group.',
      defaultOpen: 'AppSidebarItem: a group open at first.',
    },
  },
  tr: {
    description: 'Uygulamanın Pro kenar menüsü: ikonlardan oluşan bir şeride daralır ve iç içe gruplar taşır. Ücretsiz SidebarNav onun basit sürümüdür.',
    behavior: 'Davranış',
    behaviorItems: [
      'Üstteki buton menüyü ikonlardan oluşan bir şeride daraltır; etiketler Tooltip’te görünür, badge ikonun üstünde bir noktaya dönüşür. Bölüm başlıkları çizgiye dönüşür.',
      'İçinde AppSidebarItem’lar olan öğe açılıp kapanan bir gruptur, üç seviyeye kadar; bulunulan sayfayı içeren grup açık başlar, şeritte de bulunulan sayfa olarak işaretlenir.',
      'Şeritte bir gruba tıklamak menüyü o grup açık olarak genişletir.',
      'Genişlik motion-fade-default ile değişir; prefers-reduced-motion’da animasyon olmaz.',
    ],
    usage: 'Kullanım',
    usageText:
      'Üst seviye öğelere ikon verin (şerit yalnızca ikonları gösterir) ve bulunduğunuz sayfayı current ile işaretleyin. collapsed ve onCollapsedChange şeridi kontrol eder, örneğin hatırlamak için; uygulamanız başka bir yerden açıp kapatıyorsa collapsible={false} butonu gizler. Öğeler <a> öğesidir; router’ınızın bağlantısını as ile verin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Menü bağlantı listeleri içeren bir <nav>’dır; aria-label ile ad verin.',
      'Grup, aria-expanded ve aria-controls taşıyan bir butondur; current aria-current="page" verir.',
      'Şeritte her öğe etiketini erişilebilir adı olarak korur ve hover ile odakta Tooltip’te gösterir.',
      'Daraltma butonunu collapseLabel ve expandLabel ile çevirin.',
    ],
    props: {
      header: 'AppSidebar: bağlantıların üstü, örneğin logo; şeritte gizlenir.',
      footer: 'AppSidebar: alta sabit; bir AppSidebarSection.',
      collapsed: 'AppSidebar: ikon şeridini gösterir.',
      defaultCollapsed: 'AppSidebar: ilk durum (kontrolsüz).',
      onCollapsedChange: 'AppSidebar: buton şeridi açıp kapattığında çağrılır.',
      collapsible: 'AppSidebar: daraltma butonunu gösterir.',
      width: 'AppSidebar: genişken genişlik, px.',
      title: 'AppSidebarSection: bağlantılarının üstündeki başlık.',
      label: 'AppSidebarItem: metin.',
      icon: 'AppSidebarItem: ikon öğesi; üst seviyede gerekli.',
      badge: 'AppSidebarItem: bir sayı, Tiny Badge olarak çizilir.',
      current: 'AppSidebarItem: bulunulan sayfa.',
      children: 'AppSidebarItem: iç içe öğeler; öğeyi grup yapar.',
      defaultOpen: 'AppSidebarItem: başta açık grup.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'App Sidebar' };
}

export default async function AppSidebarPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="App Sidebar" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <AppSidebarPlayground />
        <h2 id="behavior">{c.behavior}</h2>
        <ul>
          {c.behaviorItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [collapsed, setCollapsed] = useState(() => localStorage.getItem('rail') === '1');\n\n<AppSidebar\n  aria-label="Main"\n  collapsed={collapsed}\n  onCollapsedChange={(next) => {\n    setCollapsed(next);\n    localStorage.setItem('rail', next ? '1' : '0');\n  }}\n>\n  …\n</AppSidebar>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['header', 'ReactNode', '—'],
              ['footer', 'ReactNode', '—'],
              ['collapsed', 'boolean', '—'],
              ['defaultCollapsed', 'boolean', 'false'],
              ['onCollapsedChange', '(collapsed: boolean) => void', '—'],
              ['collapsible', 'boolean', 'true'],
              ['width', 'number', '264'],
              ['title', 'ReactNode', '—'],
              ['label', 'ReactNode', '—'],
              ['icon', 'ReactNode', '—'],
              ['badge', 'ReactNode', '—'],
              ['current', 'boolean', 'false'],
              ['children', 'AppSidebarItem[]', '—'],
              ['defaultOpen', 'boolean', 'holds current'],
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
