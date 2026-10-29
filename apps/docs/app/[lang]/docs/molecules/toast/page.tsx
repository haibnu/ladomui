import type { Metadata } from 'next';
import { Toast, type ToastTone } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { ToastPlayground } from './ToastPlayground';

type Props = { params: Promise<{ lang: string }> };

const TONES: ToastTone[] = ['default', 'info', 'success', 'error', 'warning'];

const COPY = {
  en: {
    description: 'A short message that appears for a moment after an action, like “Changes saved”, and closes itself.',
    types: 'Styles and devices',
    typesText: 'Five styles that color the icon, and Style=Icon for any icon or emoji. Desktop toasts are raised white cards; Mobile toasts are dark and hug their text.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'Every style uses the info icon, colored by the tone; code does the same and takes another icon with icon.',
      'Style=Icon uses an emoji (Emoji / Cookie) at 24px with an 8px radius; pass it as icon.',
      'The Mobile description keeps foreground/medium-emphasis on the inverted background, and the Default Mobile icon stays primary, which is dark on dark in the light theme; code keeps both.',
      'Figma has no stacking, timing or motion for toasts; code stacks them at the bottom center, closes them after 5 seconds and slides them in with motion-swipe-y.',
    ],
    usage: 'Usage',
    usageText: 'Put one ToastProvider around the app and call toast() from useToast(). Toast alone is the card, for custom placement.',
    api: 'API reference',
    apiText: 'toast() takes the Toast props plus duration (ms, 0 keeps it open) and returns an id for dismiss(id).',
    a11y: 'Accessibility',
    a11yItems: [
      'Toasts are announced: role="status", and role="alert" for errors.',
      'Keep toasts short and do not put the only way to do something in one; it closes on its own.',
      'Use duration={0} for toasts with actions, so people have time to use them.',
    ],
    mapping: 'Figma to code',
    props: { tone: 'Figma Style (Information → info).', device: 'Figma Device.', title: 'Title.', description: 'Figma Description.', actions: 'Figma CTA Buttons.', onClose: 'Figma Close Button.', icon: 'Icon element (Style=Icon).', duration: 'toast(): ms before it closes; 0 keeps it.' },
  },
  tr: {
    description: 'Bir işlemden sonra kısa süre görünen ve kendiliğinden kapanan kısa bir mesaj; örneğin “Değişiklikler kaydedildi”.',
    types: 'Stiller ve cihazlar',
    typesText: 'İkonu renklendiren beş stil ve herhangi bir ikon ya da emoji için Style=Icon. Desktop toast’lar yükseltilmiş beyaz kartlardır; Mobile toast’lar koyudur ve metnine sarılır.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Her stil, tonla renklenen info ikonunu kullanıyor; kod da öyle, başka bir ikonu icon ile alır.',
      'Style=Icon, 8px köşeli 24px bir emoji (Emoji / Cookie) kullanıyor; onu icon olarak verin.',
      'Mobile açıklama ters zeminde foreground/medium-emphasis’i, Default Mobile ikon da primary’yi koruyor; açık temada koyu üstüne koyu kalıyor. Kod ikisini de korur.',
      'Figma’da toast’lar için yığma, süre ya da hareket yok; kod onları alt ortada yığar, 5 saniye sonra kapatır ve motion-swipe-y ile kaydırarak getirir.',
    ],
    usage: 'Kullanım',
    usageText: 'Uygulamanın çevresine bir ToastProvider koyun ve useToast()’tan gelen toast()’u çağırın. Toast tek başına karttır; kendi yerleşiminiz için.',
    api: 'API',
    apiText: 'toast(), Toast özelliklerini ve duration’ı (ms, 0 açık tutar) alır; dismiss(id) için bir id döner.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Toast’lar duyurulur: role="status", hatalar için role="alert".',
      'Toast’ları kısa tutun ve bir işi yapmanın tek yolunu bir toast’a koymayın; kendiliğinden kapanır.',
      'Eylemli toast’lar için duration={0} kullanın ki insanlar kullanmaya vakit bulsun.',
    ],
    mapping: 'Figma’dan koda',
    props: { tone: 'Figma Style (Information → info).', device: 'Figma Device.', title: 'Başlık.', description: 'Figma Description.', actions: 'Figma CTA Buttons.', onClose: 'Figma Close Button.', icon: 'İkon öğesi (Style=Icon).', duration: 'toast(): kapanmadan önceki ms; 0 açık tutar.' },
  },
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Toast' };
}

export default async function ToastPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Toast" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2110:46469" />

        <h2 id="playground">{t.component.playground}</h2>
        <ToastPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>
            {TONES.map((tone) => (
              <Toast key={tone} tone={tone} title={cap(tone)} description="Description" />
            ))}
            <Toast icon={<span style={{ fontSize: 'var(--line-height-text-small)' }}>🍪</span>} title="Style=Icon" />
            <Toast device="mobile" title="Mobile" />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Card', '--color-surface-level-1, --radius-card, --shadow-form-level-1'],
              ['Mobile card', '--color-surface-background-invert, --color-foreground-level-2 title'],
              ['Padding', '--layout-tiny --layout-small --layout-tiny --layout-default'],
              ['Icon', '--color-primary / --color-info / --color-success / --color-error / --color-warning'],
              ['Title / description', '--text-ui-text-bold / --text-ui-text-small-regular'],
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
            code={`// app/layout.tsx
<ToastProvider closeLabel="Close">{children}</ToastProvider>

// anywhere inside
const { toast } = useToast();
await save();
toast({ tone: 'success', title: 'Changes saved' });`}
          />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['tone', "'default' | 'info' | 'success' | 'error' | 'warning'", "'default'"],
              ['device', "'desktop' | 'mobile'", "'desktop'"],
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['onClose', '() => void', '—'],
              ['icon', 'ReactNode', '<IconInfo />'],
              ['duration', 'number', '5000'],
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
            ['Style = Default / Information / Success / Error / Warning', "tone='default' / 'info' / 'success' / 'error' / 'warning'"],
            ['Style = Icon + Change Icon', 'icon={…}'],
            ['Device = Desktop / Mobile', "device='desktop' / 'mobile'"],
            ['Description / CTA Buttons / Close Button', 'description / actions / onClose'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
