import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { WizardModalPlayground } from './WizardModalPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A task in steps inside a Modal: a Stepper on top, the current step’s content, and Back and Next in the footer.',
    behavior: 'Behavior',
    behaviorItems: [
      'The Stepper sits in the header between the title and the close button; the description goes under them at full width. On phones the Stepper moves under the description.',
      'The title keeps one line and is cut with an ellipsis (the full title shows on hover). If it is cut, use a shorter title or a larger size; in development the console says so.',
      'The first step offers Cancel, the others Back. Next moves one step on; on finishStep the primary button is the finish action.',
      'Steps after finishStep are a result: the footer has only Close. Without them, finish is the last step and onFinish usually closes the Modal.',
      'nextDisabled blocks Next or finish, e.g. until a field is filled or a box is checked.',
      'While busy, Back and Next wait and the Modal does not close with Escape, a press outside it or the close button; show a Loader in the step meanwhile.',
      'The content area keeps a minimum height, so the footer does not jump between steps.',
    ],
    usage: 'Usage',
    usageText:
      'The wizard is controlled: keep step in state and move it in onStepChange, which is also the place to start work for the next step (set busy until it is done). Keep each step short, one decision per step, and put a summary before the step that cannot be undone. Translate the buttons with labels.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'It is a Modal: focus moves into the dialog and returns to the button that opened it; title and description name and describe it.',
      'The Stepper is an ordered list that marks the current step with aria-current="step".',
      'Give a busy step’s Loader a label that says what is happening, so screen readers announce it.',
      'Use finishTone="error" when finishing deletes or cannot be undone.',
    ],
    props: {
      open: 'Shows the Modal.',
      onClose: 'Called by Cancel, Close, Escape and the close button.',
      title: 'The Modal’s title.',
      description: 'A line under the title.',
      steps: 'Step names for the Stepper.',
      step: 'The current step, from 0.',
      onStepChange: 'Called by Back and Next with the new step.',
      children: 'Content of the current step.',
      finishStep: 'The step with the finish button; Next before it.',
      onFinish: 'Called by the finish button.',
      nextDisabled: 'Blocks Next or finish.',
      busy: 'Work in progress: Back and Next wait, the Modal stays open.',
      finishTone: 'Tone of the finish button.',
      size: 'The Modal size.',
      labels: 'Button texts: back, next, cancel, finish, close.',
    },
  },
  tr: {
    description: 'Modal içinde adım adım ilerleyen bir iş: üstte Stepper, ortada mevcut adımın içeriği, altta Geri ve İleri.',
    behavior: 'Davranış',
    behaviorItems: [
      'Stepper başlıkta, başlık ile kapatma butonu arasında durur; açıklama altlarında tam genişliktedir. Telefonda Stepper açıklamanın altına geçer.',
      'Başlık tek satırda kalır ve sığmazsa üç noktayla kesilir (tam başlık üzerine gelince görünür). Kesiliyorsa daha kısa bir başlık ya da bir büyük boy kullanın; geliştirme sırasında konsol bunu söyler.',
      'İlk adımda Vazgeç, diğerlerinde Geri butonu bulunur. İleri bir adım ilerletir; finishStep adımında birincil buton bitirme eylemidir.',
      'finishStep’ten sonraki adımlar bir sonuçtur: altta yalnızca Kapat vardır. Bu adımlar yoksa bitirme son adımdadır ve onFinish genellikle Modal’ı kapatır.',
      'nextDisabled İleri’yi ya da bitirmeyi engeller, örneğin bir alan dolana ya da bir kutu işaretlenene kadar.',
      'busy iken Geri ve İleri bekler, Modal Escape’le, dışına basınca ya da kapatma butonuyla kapanmaz; bu sırada adımda bir Loader gösterin.',
      'İçerik alanının en küçük bir yüksekliği vardır, böylece adımlar arasında alt kısım zıplamaz.',
    ],
    usage: 'Kullanım',
    usageText:
      'Sihirbaz kontrollüdür: step’i state’te tutun ve onStepChange’de ilerletin; sonraki adımın işini başlatmanın yeri de burasıdır (iş bitene kadar busy verin). Her adımı kısa tutun, adım başına tek karar olsun ve geri alınamayan adımdan önce bir özet koyun. Butonları labels ile çevirin.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Bir Modal’dır: odak diyaloğa girer ve kapanınca açan butona döner; title ve description ona ad ve açıklama verir.',
      'Stepper, mevcut adımı aria-current="step" ile işaretleyen sıralı bir listedir.',
      'Meşgul bir adımdaki Loader’a ne olduğunu anlatan bir label verin ki ekran okuyucular okusun.',
      'Bitirme bir şey siliyor ya da geri alınamıyorsa finishTone="error" kullanın.',
    ],
    props: {
      open: 'Modal’ı gösterir.',
      onClose: 'Vazgeç, Kapat, Escape ve kapatma butonu çağırır.',
      title: 'Modal başlığı.',
      description: 'Başlığın altındaki satır.',
      steps: 'Stepper için adım adları.',
      step: 'Mevcut adım, 0’dan başlar.',
      onStepChange: 'Geri ve İleri yeni adımla çağırır.',
      children: 'Mevcut adımın içeriği.',
      finishStep: 'Bitirme butonunun olduğu adım; öncesinde İleri.',
      onFinish: 'Bitirme butonu çağırır.',
      nextDisabled: 'İleri’yi ya da bitirmeyi engeller.',
      busy: 'Süren iş: Geri ve İleri bekler, Modal açık kalır.',
      finishTone: 'Bitirme butonunun tonu.',
      size: 'Modal boyutu.',
      labels: 'Buton metinleri: back, next, cancel, finish, close.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Wizard Modal' };
}

export default async function WizardModalPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Wizard Modal" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <WizardModalPlayground />
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
            code={`const [step, setStep] = useState(0);\nconst [busy, setBusy] = useState(false);\n\nasync function changeStep(next: number) {\n  if (next === 1) {\n    setBusy(true);\n    await calculatePayslips(period);\n    setBusy(false);\n  }\n  setStep(next);\n}\n\n<WizardModal\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Run payroll"\n  steps={['Period', 'Review', 'Confirm', 'Done']}\n  step={step}\n  onStepChange={changeStep}\n  finishStep={2}\n  onFinish={runPayroll}\n  busy={busy}\n  labels={{ finish: 'Run payroll' }}\n>\n  {busy ? <Loader label="Calculating payslips" /> : content[step]}\n</WizardModal>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['open', 'boolean', '—'],
              ['onClose', '() => void', '—'],
              ['title', 'ReactNode', '—'],
              ['description', 'ReactNode', '—'],
              ['steps', 'ReactNode[]', '—'],
              ['step', 'number', '—'],
              ['onStepChange', '(step: number) => void', '—'],
              ['children', 'ReactNode', '—'],
              ['finishStep', 'number', 'steps.length - 1'],
              ['onFinish', '() => void', '—'],
              ['nextDisabled', 'boolean', 'false'],
              ['busy', 'boolean', 'false'],
              ['finishTone', 'ButtonTone', "'primary'"],
              ['size', "'small' | 'medium' | 'large'", "'large'"],
              ['labels', '{ back?; next?; cancel?; finish?; close?: string }', 'English'],
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
