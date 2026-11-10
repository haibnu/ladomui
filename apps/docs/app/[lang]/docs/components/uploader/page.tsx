import type { Metadata } from 'next';
import { Uploader } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { UploaderPlayground } from './UploaderPlayground';

type Props = { params: Promise<{ lang: string }> };

const FILES = [
  { name: 'Cover.png', size: 4813 },
  { name: 'Report-Q3.pdf', size: 2_340_000 },
];

const COPY = {
  en: {
    description: 'Picks files by dragging them in or with the Select button, shows the upload progress and lists the files.',
    directions: 'Directions',
    directionsText: 'Horizontal is a single row for forms. Vertical is a larger drop area with a hint for the limits.',
    states: 'States',
    statesText: 'Hover draws the primary tint line; Pressed and Drag Hover turn the background surface/level-2, and Drag Hover shows “Drop file now” in primary. Loading shows the progress bar, Loaded lists the files above a compact drop zone.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The dashes are 8px with 4px gaps; code uses the border-dashed style (--border-width dashed), whose pattern comes from the browser.',
      'Horizontal sits in a box with a foreground/low-emphasis line, which Vertical does not have until files are listed.',
      'Horizontal Hover, Pressed and Drag Hover are 56px tall instead of 40px; code keeps the height.',
      'The Vertical empty variants have no fill but Error has surface/level-1; code follows this.',
      'The file name uses an unbound 12px style; code uses ui/footnote/bold (Horizontal) and ui/text small/bold (Vertical).',
      'Horizontal Error merges the title and “or” into one low-emphasis text and adds the error icon; code keeps two texts with the same colors.',
      'Figma has no focus state; code rings the drop zone when its button is focused.',
      'In the compact zone the button shows only the upload icon; code names it with browseLabel.',
      'A click anywhere on the uploader opens the file dialog, not only the button; the file list does not.',
    ],
    usage: 'Usage',
    usageText: 'Uploader collects files; uploading them is up to you. Pass progress while uploading and files when done.',
    api: 'API reference',
    apiText: 'Uploader also accepts every div attribute. formatFileSize turns bytes into “4.7 Kb”.',
    a11y: 'Accessibility',
    a11yItems: [
      'Dragging is optional: the Select button opens the native file dialog and is reachable with the keyboard.',
      'Each remove button is named “Remove” plus the file name; pass removeLabel to translate it.',
      'Announce upload results yourself (for example with a Toast or a live region).',
    ],
    mapping: 'Figma to code',
    props: {
      direction: 'Figma ✈️ Direction.',
      onFiles: 'Called with the picked or dropped files.',
      files: 'Files to list (Loaded).',
      onRemove: 'Shows a remove button per file.',
      progress: 'Upload progress, 0 to 100 (Loading).',
      progressText: 'Amount text under the bar in Vertical.',
      accept: 'Allowed file types, as for an input.',
      multiple: 'Allows several files.',
      error: 'Figma Error.',
      disabled: 'Figma Disable.',
      hint: 'Limits under the button in Vertical.',
      title: 'Title; “Drag files here” / “Drag & Drop files here”.',
    },
  },
  tr: {
    description: 'Dosyaları sürükleyerek ya da Seç butonuyla seçtirir, yükleme ilerlemesini gösterir ve dosyaları listeler.',
    directions: 'Yönler',
    directionsText: 'Horizontal formlar için tek satırdır. Vertical, sınırlar için bir hint taşıyan daha büyük bir bırakma alanıdır.',
    states: 'Durumlar',
    statesText: 'Hover primary tint çizgi çizer; Pressed ve Drag Hover zemini surface/level-2 yapar, Drag Hover “Dosyayı bırakın” yazısını primary gösterir. Loading ilerleme çubuğunu gösterir, Loaded dosyaları küçük bir bırakma alanının üstünde listeler.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Kesikler 8px, aralar 4px; kod deseni tarayıcıdan gelen border-dashed stilini (--border-width dashed) kullanır.',
      'Horizontal, foreground/low-emphasis çizgili bir kutuda durur; Vertical’da bu kutu dosyalar listelenene kadar yok.',
      'Horizontal Hover, Pressed ve Drag Hover 40px yerine 56px yüksekliğinde; kod yüksekliği korur.',
      'Boş Vertical varyantların dolgusu yok ama Error’da surface/level-1 var; kod bunu izler.',
      'Dosya adı bağlı olmayan 12px bir stil kullanıyor; kod ui/footnote/bold (Horizontal) ve ui/text small/bold (Vertical) kullanır.',
      'Horizontal Error, başlığı ve “or”u tek bir low-emphasis metinde birleştirip hata ikonunu ekliyor; kod iki metni aynı renklerle korur.',
      'Figma’da focus durumu yok; kod, butonu odaktayken bırakma alanına halka çizer.',
      'Küçük alanda buton yalnızca yükleme ikonunu gösterir; kod onu browseLabel ile adlandırır.',
      'Yalnızca buton değil, Uploader’ın her yerine tıklamak dosya penceresini açar; dosya listesi açmaz.',
    ],
    usage: 'Kullanım',
    usageText: 'Uploader dosyaları toplar; yüklemek size kalır. Yüklerken progress, bitince files verin.',
    api: 'API',
    apiText: 'Uploader tüm div özniteliklerini de kabul eder. formatFileSize baytı “4.7 Kb” biçimine çevirir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Sürüklemek isteğe bağlıdır: Seç butonu yerel dosya penceresini açar ve klavyeyle ulaşılır.',
      'Her kaldırma butonunun adı “Remove” ve dosya adıdır; çevirmek için removeLabel verin.',
      'Yükleme sonuçlarını kendiniz duyurun (örneğin bir Toast ya da live region ile).',
    ],
    mapping: 'Figma’dan koda',
    props: {
      direction: 'Figma ✈️ Direction.',
      onFiles: 'Seçilen ya da bırakılan dosyalarla çağrılır.',
      files: 'Listelenecek dosyalar (Loaded).',
      onRemove: 'Her dosya için bir kaldırma butonu gösterir.',
      progress: 'Yükleme ilerlemesi, 0–100 (Loading).',
      progressText: 'Vertical’da çubuğun altındaki miktar metni.',
      accept: 'İzin verilen dosya türleri, input’taki gibi.',
      multiple: 'Birden çok dosyaya izin verir.',
      error: 'Figma Error.',
      disabled: 'Figma Disable.',
      hint: 'Vertical’da butonun altındaki sınırlar.',
      title: 'Başlık; “Drag files here” / “Drag & Drop files here”.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Uploader' };
}

export default async function UploaderPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const box = { inlineSize: 280 };
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Uploader" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="4046:12986" />

        <h2 id="playground">{t.component.playground}</h2>
        <UploaderPlayground />

        <ForView view="designer">
          <h2 id="directions">{c.directions}</h2>
          <p>{c.directionsText}</p>
          <Example>
            <div style={{ inlineSize: 360 }}>
              <Uploader />
            </div>
            <div style={box}>
              <Uploader direction="vertical" hint="Maximum allowed size is 100 MB" />
            </div>
          </Example>

          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example stack>
            <div style={{ inlineSize: 360 }}>
              <Uploader data-state="hover" />
            </div>
            <div style={{ inlineSize: 360 }}>
              <Uploader data-state="drag" />
            </div>
            <div style={{ inlineSize: 360 }}>
              <Uploader error />
            </div>
            <div style={{ inlineSize: 360 }}>
              <Uploader disabled />
            </div>
            <div style={{ inlineSize: 360 }}>
              <Uploader progress={54} />
            </div>
            <div style={{ inlineSize: 360 }}>
              <Uploader files={FILES} />
            </div>
          </Example>
          <Example>
            <div style={box}>
              <Uploader direction="vertical" error hint="Maximum allowed size is 100 MB" />
            </div>
            <div style={box}>
              <Uploader direction="vertical" progress={54} progressText="45 Mb / 98 Mb" />
            </div>
            <div style={box}>
              <Uploader direction="vertical" files={FILES} />
            </div>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Box', '--color-surface-level-1, --color-foreground-low-emphasis line, --radius-form-element-small'],
              ['Dashed zone', '--border-width dashed --color-surface-level-4'],
              ['Hover', '--color-primary-tint'],
              ['Pressed / drag', '--color-surface-level-2, --color-primary dash'],
              ['Error', '--color-error'],
              ['Title / or / hint', '--color-foreground-high-emphasis / --color-foreground-low-emphasis'],
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
            code={`const [files, setFiles] = useState<UploaderFile[]>([]);
const [progress, setProgress] = useState<number>();

async function upload(picked: File[]) {
  setProgress(0);
  const uploaded = await uploadFiles(picked, setProgress); // your API
  setProgress(undefined);
  setFiles([...files, ...uploaded]);
}

<Uploader
  direction="vertical"
  accept=".csv,.zip"
  multiple
  hint="Maximum allowed size is 100 MB"
  files={files}
  progress={progress}
  onFiles={upload}
  onRemove={(file) => setFiles(files.filter((f) => f !== file))}
/>`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['direction', "'horizontal' | 'vertical'", "'horizontal'"],
              ['onFiles', '(files: File[]) => void', '—'],
              ['files', 'UploaderFile[]', '[]'],
              ['onRemove', '(file: UploaderFile) => void', '—'],
              ['progress', 'number', '—'],
              ['progressText', 'ReactNode', '—'],
              ['accept', 'string', '—'],
              ['multiple', 'boolean', 'false'],
              ['error', 'boolean', 'false'],
              ['disabled', 'boolean', 'false'],
              ['hint', 'ReactNode', '—'],
              ['title', 'ReactNode', '—'],
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
            ['✈️ Direction = Horizontal / Vertical', "direction='horizontal' / 'vertical'"],
            ['🕹 State = Hover / Pressed', ':hover / :active'],
            ['🕹 State = Drag Hover', 'a file dragged over it'],
            ['🕹 State = Loading', 'progress={…}'],
            ['🕹 State = Loaded', 'files={[…]}'],
            ['Error / Disable', 'error / disabled'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
