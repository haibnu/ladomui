import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { TextareaPlayground } from './TextareaPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A multi-line text field for notes, descriptions and messages, with an optional character count.',
    look: 'Look and count',
    lookText: 'It is the medium Input box with several lines: the same line, hover, focus, typed, error and disabled states. The count shows length/maxLength at the end of the hint row; inside a FormField it shares the row with the hint.',
    usage: 'Usage',
    usageText: 'Put it in a FormField for the label, hint and error. maxLength stops typing at the limit; showCount shows how much is left. rows sets the starting height; the user can make it taller.',
    api: 'API reference',
    apiText: 'Textarea also accepts every textarea attribute.',
    a11y: 'Accessibility',
    a11yItems: ['Inside a FormField the label, the hint and the error are wired to the field.', 'The count is shown text; maxLength is announced by the browser.'],
    mapping: 'Figma to code',
    props: { showCount: 'Shows length/maxLength.', maxLength: 'The limit.', rows: 'Starting height in lines.', error: 'Figma Error (a FormField error sets it).', disabled: 'Figma Disabled.' },
  },
  tr: {
    description: 'Not, açıklama ve mesajlar için çok satırlı bir metin alanı; isteğe bağlı karakter sayacıyla.',
    look: 'Görünüm ve sayaç',
    lookText: 'Birkaç satırlık orta boy Input kutusudur: aynı çizgi, hover, focus, dolu, hata ve devre dışı durumları. Sayaç, ipucu satırının sonunda uzunluk/maxLength gösterir; FormField içinde satırı ipucuyla paylaşır.',
    usage: 'Kullanım',
    usageText: 'Etiket, ipucu ve hata için bir FormField içine koyun. maxLength sınırda yazmayı durdurur; showCount ne kadar kaldığını gösterir. rows başlangıç yüksekliğini belirler; kullanıcı uzatabilir.',
    api: 'API',
    apiText: 'Textarea tüm textarea özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: ['FormField içinde etiket, ipucu ve hata alana bağlanır.', 'Sayaç görünen bir metindir; maxLength’i tarayıcı duyurur.'],
    mapping: 'Figma’dan koda',
    props: { showCount: 'uzunluk/maxLength gösterir.', maxLength: 'Sınır.', rows: 'Satır olarak başlangıç yüksekliği.', error: 'Figma Error (FormField hatası da ayarlar).', disabled: 'Figma Disabled.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Textarea' };
}

export default async function TextareaPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Textarea" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1212:1629" />
        <h2 id="playground">{t.component.playground}</h2>
        <TextareaPlayground />
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock code={`<FormField label="Note" hint="Shown on the receipt.">\n  <Textarea showCount maxLength={200} />\n</FormField>`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['showCount', 'boolean', 'false'],
              ['maxLength', 'number', '—'],
              ['rows', 'number', '3'],
              ['error', 'boolean', '—'],
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
        <h2 id="figma-to-code">{c.mapping}</h2>
        <MappingTable
          rows={[
            ['🎛 Type = Normal', '<Textarea />'],
            ['Error / Disabled', 'error / disabled'],
            ['Hint', '<FormField hint="…">'],
            ['Textarea / Count › Count', 'showCount maxLength={…}'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
