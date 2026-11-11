import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { FileSharePlayground } from './FileSharePlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A “Share this file” panel: the link with a Copy Link button, and the people with access, each with a menu for their access level.',
    parts: 'Parts',
    partsText: 'FileShare is built from the existing components: an Input in a FormField, a Button, and per person an Avatar, two lines of text and a tertiary Button that opens a Dropdown of Cells.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The panel is drawn once in the Ladom Agency Website file (the white showcase card), not in the Ladom UI file; sizes are the Figma values at 100%, mapped to the nearest tokens.',
      'The link input in Figma shows a placeholder; code fills it with the link and selects it on focus.',
      'Figma has no open state of the role button; code opens the same Dropdown and Cell the Selectbox uses, checked on the current role.',
      'The title and “People with access” use the caption style; the card uses surface/level-2 and the card radius.',
    ],
    usage: 'Usage',
    usageText: 'The roles are yours: pass roles with the labels you show. onRoleChange is called with the person and the new role value; keep the roles in your own state if you need to save them.',
    api: 'API reference',
    apiText: 'FileShare also accepts every div attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'Copy Link keeps its label and icon; the result shows in a Toast: success when the link was copied, error when the clipboard is blocked (the link stays selectable in the input). It uses the page’s ToastProvider, or brings one when there is none.',
      'In a panel narrower than 400px the button shows its short label (copyShortLabel); its accessible name stays the full label.',
      'Each role button is named with the person (“Access level – Olivia Martin: Can Edit”), opens a menu of radio items and follows the arrow, Home, End, Enter, Space and Escape keys.',
      'People are a list; the avatar is decorative next to the name.',
    ],
    mapping: 'Figma to code',
    props: {
      title: 'Figma “Share this file”.',
      link: 'The link in the input.',
      linkLabel: 'Figma Label of the Form Input.',
      copyLabel: 'Figma Button “Copy Link”.',
      copyShortLabel: 'The button’s label in a narrow panel.',
      copiedLabel: 'Title of the success toast.',
      copyErrorLabel: 'Title of the error toast when the clipboard is blocked.',
      onCopy: 'Called after the link was copied.',
      peopleLabel: 'Figma “People with access”.',
      people: 'One row per person: name, email, avatar, online, role.',
      roles: 'The access levels in the menu; defaults to Can Edit, Can Comment, Can View.',
      roleLabel: 'Name of the role buttons for assistive technology.',
      onRoleChange: 'Called with the person and the chosen role value.',
    },
  },
  tr: {
    description: 'Bir “Bu dosyayı paylaş” paneli: Bağlantıyı kopyala düğmesiyle bağlantı ve erişimi olan kişiler; her birinin erişim düzeyi bir menüyle seçilir.',
    parts: 'Parçalar',
    partsText: 'FileShare mevcut bileşenlerden kurulur: FormField içinde bir Input, bir Button ve kişi başına bir Avatar, iki satır metin ve Cell’lerden oluşan bir Dropdown açan tertiary Button.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Panel yalnızca Ladom Agency Website dosyasında (beyaz vitrin kartı) çizili, Ladom UI dosyasında değil; ölçüler Figma’nın %100 değerleridir ve en yakın tokena çevrilmiştir.',
      'Figma’daki bağlantı girdisi placeholder gösterir; kod bağlantıyı doldurur ve odaklanınca seçer.',
      'Figma’da rol butonunun açık hali yok; kod Selectbox’ın kullandığı Dropdown ve Cell’i açar, mevcut rol işaretli.',
      'Başlık ve “Erişimi olanlar” caption stilini kullanır; kart surface/level-2 ve kart köşesini kullanır.',
    ],
    usage: 'Kullanım',
    usageText: 'Roller sizindir: göstereceğiniz etiketlerle roles verin. onRoleChange kişiyle ve yeni rol değeriyle çağrılır; kaydetmeniz gerekiyorsa rolleri kendi state’inizde tutun.',
    api: 'API',
    apiText: 'FileShare tüm div özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Bağlantıyı kopyala butonu metnini ve ikonunu korur; sonuç bir Toast’ta görünür: bağlantı kopyalanınca success, pano engellenince error (bağlantı girdide seçilebilir kalır). Sayfanın ToastProvider’ını kullanır, yoksa kendisininkini getirir.',
      '400px’ten dar bir panelde buton kısa metnini (copyShortLabel) gösterir; erişilebilir adı tam metin olarak kalır.',
      'Her rol butonu kişiyle adlandırılır (“Erişim düzeyi – Olivia Martin: Düzenleyebilir”), radyo öğelerinden oluşan bir menü açar ve ok, Home, End, Enter, Space ve Escape tuşlarını izler.',
      'Kişiler bir listedir; avatar isimin yanında dekoratiftir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      title: 'Figma “Share this file”.',
      link: 'Girdideki bağlantı.',
      linkLabel: 'Form Input’un Figma Label’ı.',
      copyLabel: 'Figma Button “Copy Link”.',
      copyShortLabel: 'Dar bir panelde butonun metni.',
      copiedLabel: 'Başarı toast’ının başlığı.',
      copyErrorLabel: 'Pano engellendiğinde hata toast’ının başlığı.',
      onCopy: 'Bağlantı kopyalandıktan sonra çağrılır.',
      peopleLabel: 'Figma “People with access”.',
      people: 'Kişi başına bir satır: ad, e-posta, avatar, online, rol.',
      roles: 'Menüdeki erişim düzeyleri; varsayılanı Can Edit, Can Comment, Can View.',
      roleLabel: 'Rol butonlarının yardımcı teknolojiler için adı.',
      onRoleChange: 'Kişi ve seçilen rol değeriyle çağrılır.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'File Share' };
}

export default async function FileSharePage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="File Share" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="108:1581" />

        <h2 id="playground">{t.component.playground}</h2>
        <FileSharePlayground />

        <ForView view="designer">
          <h2 id="parts">{c.parts}</h2>
          <p>{c.partsText}</p>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Card', '--color-surface-level-2, --radius-card, --space-xlarge'],
              ['Titles', '--text-ui-caption, --color-foreground-low-emphasis'],
              ['Link row gap', '--space-form-gutter'],
              ['Person row', '--space-small gap, --space-tiny padding'],
              ['Name / email', '--text-ui-text-regular / --text-ui-text-small-regular'],
              ['Role button', 'Button tertiary small with dropdown'],
              ['Role menu', 'Dropdown with Cell small'],
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
          <p>{c.usageText}</p>
          <CodeBlock
            code={`<FileShare
  link="https://ladom.co/files/brand-guide"
  people={[
    { id: '1', name: 'Olivia Martin', email: 'o.martin@ladom.co', online: true },
    { id: '2', name: 'Isabella Nguyen', email: 'o.nguyen@ladom.co', avatar: '/isabella.jpg', role: 'view' },
  ]}
  roles={[
    { value: 'edit', label: 'Can Edit' },
    { value: 'view', label: 'Can View' },
  ]}
  onRoleChange={(person, role) => save(person.id, role)}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['title', 'ReactNode', '“Share this file”'],
              ['link', 'string', '—'],
              ['linkLabel', 'ReactNode', '“Link”'],
              ['copyLabel', 'string', '“Copy Link”'],
              ['copyShortLabel', 'string', '“Copy”'],
              ['copiedLabel', 'string', '“Link copied”'],
              ['copyErrorLabel', 'string', '“Could not copy the link”'],
              ['onCopy', '(link: string) => void', '—'],
              ['peopleLabel', 'ReactNode', '“People with access”'],
              ['people', 'FileSharePerson[]', '—'],
              ['roles', 'FileShareRole[]', 'Can Edit, Can Comment, Can View'],
              ['roleLabel', 'string', '“Access level”'],
              ['onRoleChange', '(person, role: string) => void', '—'],
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
            ['Share this file', 'title'],
            ['Form Input + Copy Link button', 'link, linkLabel, copyLabel'],
            ['People with access', 'peopleLabel, people'],
            ['Cell: Avatar, name, email', 'people[].avatar / name / email / online'],
            ['Button “Can Edit” with dropdown', 'roles, people[].role, onRoleChange'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
