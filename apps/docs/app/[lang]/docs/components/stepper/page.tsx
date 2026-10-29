import type { Metadata } from 'next';
import { Stepper } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { StepperPlayground } from './StepperPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Shows where the user is in a flow of steps, such as a sign-up or a wizard.',
    states: 'Step states',
    statesText: 'Done steps are success circles, the current step is a primary soft pill with its number and title, the next steps are surface/level-3 circles.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'The numbers and titles are an unbound 12px Medium style; code uses ui/text small/bold, with the title in capitals as in Figma.',
      'The Success text color is raw; code uses on-success.',
      'The steps are not clickable in Figma; code renders an ordered list without buttons.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Stepper also accepts every ol attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'It is an ordered list; the current step has aria-current="step".',
      'Every step’s title is in the list for screen readers, even when only the current one shows.',
      'Name the list with aria-label.',
    ],
    mapping: 'Figma to code',
    props: { steps: 'Step titles.', current: 'Index of the current step, from 0.' },
  },
  tr: {
    description: 'Kullanıcının kayıt ya da sihirbaz gibi adımlı bir akışta nerede olduğunu gösterir.',
    states: 'Adım durumları',
    statesText: 'Biten adımlar success daireleridir, bulunulan adım numarası ve başlığıyla primary soft bir haptır, sonraki adımlar surface/level-3 dairelerdir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'Numaralar ve başlıklar bağlı olmayan 12px Medium bir stil; kod, Figma’daki gibi başlığı büyük harfle, ui/text small/bold kullanır.',
      'Success metin rengi ham; kod on-success kullanır.',
      'Figma’da adımlar tıklanabilir değil; kod butonsuz sıralı bir liste çizer.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Stepper tüm ol özniteliklerini de kabul eder.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Sıralı bir listedir; bulunulan adım aria-current="step" taşır.',
      'Yalnızca bulunulan adımın başlığı görünse de her adımın başlığı ekran okuyucular için listededir.',
      'Listeyi aria-label ile adlandırın.',
    ],
    mapping: 'Figma’dan koda',
    props: { steps: 'Adım başlıkları.', current: 'Bulunulan adımın sırası, 0’dan başlar.' },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Stepper' };
}

export default async function StepperPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Stepper" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="2496:6853" />

        <h2 id="playground">{t.component.playground}</h2>
        <StepperPlayground />

        <ForView view="designer">
          <h2 id="states">{c.states}</h2>
          <p>{c.statesText}</p>
          <Example>
            <Stepper aria-label="Steps" steps={['Account', 'Profile', 'Team', 'Review']} current={2} />
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['State', 'Background', 'Text']}
            rows={[
              ['Success', '--color-success', '--color-on-success'],
              ['Current', '--color-primary-soft', '--color-primary'],
              ['Next', '--color-surface-level-3', '--color-foreground-medium-emphasis'],
              ['Gap', '--space-tiny', '—'],
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
          <CodeBlock code={`<Stepper aria-label="Sign-up" steps={['Account', 'Profile', 'Review']} current={1} />`} />

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['steps', 'ReactNode[]', '—'],
              ['current', 'number', '—'],
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
            ['.Stepper Item 🕹 State = Success / Current / Next', 'steps before / at / after current'],
            ['Stepper Item 1 … 6', 'steps'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
