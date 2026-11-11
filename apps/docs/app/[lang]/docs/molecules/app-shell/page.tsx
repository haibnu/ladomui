import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AppShellPlayground } from './AppShellPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'The frame of an admin app: a side menu that stays in view, an AppHeader that sticks to the top, and the page under it.',
    behavior: 'Behavior',
    behaviorItems: [
      'The side menu column and the header are sticky: the page scrolls under them. Scroll inside the box above to see it.',
      'On phones (< 768px) the side menu moves into a left Drawer, opened by a menu button at the start of the header; pressing a link inside the Drawer closes it.',
      'offsetTop keeps the sticky parts under a bar that sits above the shell, such as a site bar: they stick that far from the top, and the shell is that much shorter than the screen.',
      'The page area lays out its children in a column with the default layout gap and the container padding.',
      'The shell is its own stacking layer, so menus opened from the page around it appear over the sticky header.',
    ],
    usage: 'Usage',
    usageText:
      'Put the shell around every page of the app, usually in a layout, and pass an AppSidebar as sidebar. Pass a function to get drawer=true for the copy in the phone Drawer, where the collapse button is not needed. Use the header slots for the page title, a search field and account actions. Set offsetTop to the height of any fixed bar above the shell, as a CSS length.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The header is a <header>; name the side menu with the AppSidebar’s aria-label.',
      'On phones the menu button is named by menuLabel and the Drawer takes the same name; closeLabel names its close button. Translate both.',
      'The Drawer is a modal dialog: focus moves into it, Escape closes it and focus returns to the menu button.',
      'Add a “Skip to content” link before the shell when the menu is long.',
    ],
    props: {
      sidebar: 'The side menu, e.g. an AppSidebar, or a function of { drawer }.',
      headerStart: 'AppHeader start slot, e.g. the page title.',
      headerCenter: 'AppHeader center slot, e.g. a search Input.',
      headerEnd: 'AppHeader end slot, e.g. notifications and the account.',
      children: 'The page.',
      offsetTop: 'Space above the shell that the sticky parts keep clear, as a CSS length.',
      menuLabel: 'Names the menu button and the Drawer.',
      closeLabel: 'Names the Drawer’s close button.',
    },
  },
  tr: {
    description: 'Bir yönetim uygulamasının çerçevesi: görünür kalan bir kenar menü, üste yapışan bir AppHeader ve altında sayfa.',
    behavior: 'Davranış',
    behaviorItems: [
      'Kenar menü sütunu ve başlık yapışkandır: sayfa onların altından kayar. Görmek için yukarıdaki kutunun içinde kaydırın.',
      'Telefonda (< 768px) kenar menü sol bir Drawer’a taşınır ve başlığın başındaki menü butonuyla açılır; Drawer’daki bir bağlantıya basmak onu kapatır.',
      'offsetTop, yapışkan parçaları kabuğun üstünde duran bir çubuğun, örneğin site çubuğunun, altında tutar: üstten o kadar uzakta yapışırlar ve kabuk ekrandan o kadar kısa olur.',
      'Sayfa alanı, içindekileri varsayılan yerleşim boşluğu ve kapsayıcı dolgusuyla bir sütuna dizer.',
      'Kabuk kendi katman bağlamını oluşturur; böylece çevresindeki sayfadan açılan menüler yapışkan başlığın üstünde görünür.',
    ],
    usage: 'Kullanım',
    usageText:
      'Kabuğu uygulamanın her sayfasının çevresine, genellikle bir layout’ta koyun ve sidebar olarak bir AppSidebar verin. Telefon Drawer’ındaki kopya için drawer=true almak isterseniz bir fonksiyon verin; orada daraltma butonuna gerek yoktur. Başlık slotlarını sayfa başlığı, arama alanı ve hesap eylemleri için kullanın. Kabuğun üstünde sabit bir çubuk varsa offsetTop’a onun yüksekliğini CSS uzunluğu olarak verin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Başlık bir <header>’dır; kenar menüye AppSidebar’ın aria-label’ı ile ad verin.',
      'Telefonda menü butonunun adı menuLabel’dır ve Drawer da aynı adı alır; closeLabel kapatma butonuna ad verir. İkisini de çevirin.',
      'Drawer modal bir diyalogdur: odak içine girer, Escape kapatır ve odak menü butonuna döner.',
      'Menü uzunsa kabuğun önüne bir “İçeriğe geç” bağlantısı ekleyin.',
    ],
    props: {
      sidebar: 'Kenar menü, örneğin bir AppSidebar, ya da { drawer } alan bir fonksiyon.',
      headerStart: 'AppHeader başlangıç slotu, örneğin sayfa başlığı.',
      headerCenter: 'AppHeader orta slotu, örneğin bir arama Input’u.',
      headerEnd: 'AppHeader bitiş slotu, örneğin bildirimler ve hesap.',
      children: 'Sayfa.',
      offsetTop: 'Kabuğun üstünde yapışkan parçaların boş bıraktığı alan, CSS uzunluğu.',
      menuLabel: 'Menü butonuna ve Drawer’a ad verir.',
      closeLabel: 'Drawer’ın kapatma butonuna ad verir.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'App Shell' };
}

export default async function AppShellPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="App Shell" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <AppShellPlayground />
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
            code={`// app/(admin)/layout.tsx\nexport default function AdminLayout({ children }: { children: ReactNode }) {\n  return (\n    <AppShell\n      offsetTop="var(--site-bar-height)"\n      menuLabel="Menu"\n      sidebar={({ drawer }) => (\n        <AppSidebar aria-label="Main" collapsible={!drawer}>\n          <AppSidebarSection>\n            <AppSidebarItem as={Link} href="/employees" icon={<IconContacts />} label="Employees" />\n          </AppSidebarSection>\n        </AppSidebar>\n      )}\n      headerEnd={<Avatar size="small" name="Nazlı Güneş" />}\n    >\n      {children}\n    </AppShell>\n  );\n}`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['sidebar', 'ReactNode | ((ctx: { drawer: boolean }) => ReactNode)', '—'],
              ['headerStart', 'ReactNode', '—'],
              ['headerCenter', 'ReactNode', '—'],
              ['headerEnd', 'ReactNode', '—'],
              ['children', 'ReactNode', '—'],
              ['offsetTop', 'string', "'0px'"],
              ['menuLabel', 'string', "'Menu'"],
              ['closeLabel', 'string', "'Close'"],
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
