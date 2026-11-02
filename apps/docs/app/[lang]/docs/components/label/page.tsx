import type { Metadata } from 'next';
import { Label } from '@ladom/ui';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { LabelPlayground } from './LabelPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'Names a form field. Can carry an info icon, a subtitle or a hint, and an optional marker.',
    types: 'Types',
    typesText: 'Default is the label alone. Icon adds an info icon after it; Subtitle adds secondary text under it; Hint adds a Hint under it.',
    withForm: 'With form element',
    withFormText: 'Directly above an input, the label uses the small text style. A single row gets 4px above and below; a label with subtitle or hint gets the in-group gap below.',
    tokens: 'Tokens',
    usage: 'Usage',
    usageText: 'Connect the label to its field with htmlFor and the field’s id.',
    api: 'API reference',
    apiText: 'Label also accepts every label attribute (htmlFor, …) and forwards its ref to the label element.',
    a11y: 'Accessibility',
    a11yItems: [
      'Always connect the label to its field with htmlFor; clicking the label then focuses the field.',
      'The info icon is decorative; if it explains something, put that text in a Tooltip or the hint as well.',
      'Point the field’s aria-describedby to the subtitle or hint when they describe the field.',
    ],
    mapping: 'Figma to code',
    sample: { label: 'Email', sub: 'We never share it', hint: 'Use your work email', opt: 'Optional' },
    props: {
      children: 'The label text.',
      optional: 'Text at the end of the row (Optional, ⌙ Optional Text).',
      info: 'Info icon after the label (Type=Icon).',
      subtitle: 'Secondary text under the label (Type=Subtitle).',
      hint: 'Hint under the label (Type=Hint).',
      withFormElement: 'Compact label above a form element (with Form Element).',
    } as Record<string, string>,
  },
  tr: {
    description: 'Bir form alanını adlandırır. Info ikonu, alt yazı ya da hint ve opsiyonel işareti taşıyabilir.',
    types: 'Tipler',
    typesText: 'Default sadece label’dır. Icon arkasına bir info ikonu, Subtitle altına ikincil metin, Hint altına bir Hint ekler.',
    withForm: 'Form öğesiyle',
    withFormText: 'Doğrudan bir input’un üstündeyken label küçük yazı stilini kullanır. Tek satırlıysa üstte ve altta 4px, alt yazı ya da hint varsa altta grup içi boşluk alır.',
    tokens: 'Tokenlar',
    usage: 'Kullanım',
    usageText: 'Label’ı alanına htmlFor ve alanın id’si ile bağlayın.',
    api: 'API',
    apiText: 'Label tüm label özniteliklerini de (htmlFor, …) kabul eder ve ref’ini label öğesine iletir.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Label’ı alanına her zaman htmlFor ile bağlayın; label’a tıklayınca alan odaklanır.',
      'Info ikonu dekoratiftir; bir açıklama taşıyorsa o metni Tooltip’e ya da hint’e de koyun.',
      'Alt yazı ya da hint alanı açıklıyorsa alanın aria-describedby özniteliğini onlara yönlendirin.',
    ],
    mapping: 'Figma’dan koda',
    sample: { label: 'E-posta', sub: 'Kimseyle paylaşmayız', hint: 'İş e-postanızı kullanın', opt: 'Opsiyonel' },
    props: {
      children: 'Label metni.',
      optional: 'Satırın sonundaki metin (Optional, ⌙ Optional Text).',
      info: 'Label’dan sonra info ikonu (Type=Icon).',
      subtitle: 'Label’ın altında ikincil metin (Type=Subtitle).',
      hint: 'Label’ın altında Hint (Type=Hint).',
      withFormElement: 'Form öğesinin üstünde kompakt label (with Form Element).',
    } as Record<string, string>,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Label' };
}

export default async function LabelPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const s = c.sample;
  const all = (withFormElement: boolean) => (
    <>
      <Label withFormElement={withFormElement}>{s.label}</Label>
      <Label withFormElement={withFormElement} info>
        {s.label}
      </Label>
      <Label withFormElement={withFormElement} subtitle={s.sub}>
        {s.label}
      </Label>
      <Label withFormElement={withFormElement} hint={s.hint}>
        {s.label}
      </Label>
      <Label withFormElement={withFormElement} optional={s.opt}>
        {s.label}
      </Label>
    </>
  );
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Label" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1172:48" />

        <h2 id="playground">{t.component.playground}</h2>
        <LabelPlayground />

        <ForView view="designer">
          <h2 id="types">{c.types}</h2>
          <p>{c.typesText}</p>
          <Example stack>{all(false)}</Example>

          <h2 id="with-form">{c.withForm}</h2>
          <p>{c.withFormText}</p>
          <Example stack>{all(true)}</Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Text style', 'Color']}
            rows={[
              ['Label', 'ui/text/regular (with form: ui/text small/regular)', <code key="c">--color-foreground-high-emphasis</code>],
              ['Optional, Subtitle', 'ui/text small/regular', <code key="c">--color-foreground-medium-emphasis</code>],
              ['Info icon', '12px', <code key="c">--color-foreground-medium-emphasis</code>],
              ['Gaps', <code key="g">--layout-tiny · --space-micro · --space-form-ingroup-gutter</code>, ''],
            ]}
          />
        </ForView>

        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <Example
            stack
            code={`import { Input, Label } from '@ladom/ui';

<Label htmlFor="email" withFormElement optional="${s.opt}">${s.label}</Label>
<Input id="email" type="email" />`}
          >
            <Label htmlFor="usage-email" withFormElement optional={s.opt}>
              {s.label}
            </Label>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['children', 'ReactNode', '—'],
              ['optional', 'ReactNode', '—'],
              ['info', 'boolean', 'false'],
              ['subtitle', 'ReactNode', '—'],
              ['hint', 'ReactNode', '—'],
              ['withFormElement', 'boolean', 'false'],
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
            ['🎛 Type = Default', '—'],
            ['🎛 Type = Icon', 'info'],
            ['🎛 Type = Subtitle', 'subtitle="…"'],
            ['🎛 Type = Hint', 'hint="…"'],
            ['with Form Element = True', 'withFormElement'],
            ['Optional + ⌙ Optional Text', 'optional="…"'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
