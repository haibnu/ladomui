import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { PersonCellPlayground } from './PersonCellPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A person in a Pro table cell or list: an Avatar, the name and a line under it, such as the job title.',
    behavior: 'Behavior',
    behaviorItems: [
      'The Avatar shows the photo, or the initials of the name without one; the status prop adds its online dot.',
      'The name uses the text bold style and the line under it the footnote style; avatarSize changes only the Avatar, the text stays the same.',
      'With onClick the cell is a button, and on hover the name takes the primary foreground color. Without it, it is plain text.',
    ],
    usage: 'Usage',
    usageText:
      'Use it in the first column of a people table or in a list of people inside a Card. Pass onClick when the row opens the person’s profile; leave it out when the whole row is already a link, so the cell does not become a button inside it.',
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The Avatar is hidden from assistive technology; the name and the line under it are the accessible text.',
      'With onClick the cell is a native <button type="button">, reachable with Tab and pressed with Enter or Space.',
      'When the name alone does not say what happens, add an aria-label such as “Open Elif Aydın’s profile”.',
    ],
    props: {
      name: 'The person’s name; also gives the Avatar its initials.',
      subtitle: 'The line under the name, e.g. the job title.',
      src: 'A photo; the initials show without it.',
      avatarSize: 'The Avatar size; the text stays the same.',
      status: 'The Avatar’s status dot.',
      onClick: 'Makes the cell a button.',
    },
  },
  tr: {
    description: 'Pro tablo hücresinde ya da listede bir kişi: Avatar, ad ve altında unvan gibi bir satır.',
    behavior: 'Davranış',
    behaviorItems: [
      'Avatar fotoğrafı gösterir, fotoğraf yoksa adın baş harflerini; status prop’u çevrimiçi noktasını ekler.',
      'Ad text bold stilini, altındaki satır footnote stilini kullanır; avatarSize yalnızca Avatar’ı değiştirir, metin aynı kalır.',
      'onClick verilince hücre bir butondur ve hover’da ad primary foreground rengini alır. Verilmezse düz metindir.',
    ],
    usage: 'Kullanım',
    usageText:
      'Bir çalışan tablosunun ilk sütununda ya da bir Card içindeki kişi listesinde kullanın. Satır kişinin profilini açıyorsa onClick verin; satırın tamamı zaten bir bağlantıysa vermeyin, böylece hücre onun içinde bir butona dönüşmez.',
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Avatar yardımcı teknolojilerden gizlenir; erişilebilir metin ad ve altındaki satırdır.',
      'onClick verilince hücre yerel bir <button type="button"> olur; Tab ile ulaşılır, Enter ya da Space ile basılır.',
      'Ad tek başına ne olacağını anlatmıyorsa “Elif Aydın’ın profilini aç” gibi bir aria-label ekleyin.',
    ],
    props: {
      name: 'Kişinin adı; Avatar’ın baş harflerini de verir.',
      subtitle: 'Adın altındaki satır, örneğin unvan.',
      src: 'Fotoğraf; yoksa baş harfler görünür.',
      avatarSize: 'Avatar boyutu; metin aynı kalır.',
      status: 'Avatar’ın durum noktası.',
      onClick: 'Hücreyi butona çevirir.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Person Cell' };
}

export default async function PersonCellPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Person Cell" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <PersonCellPlayground />
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
            code={`<tbody>\n  {employees.map((e) => (\n    <tr key={e.id}>\n      <td>\n        <PersonCell\n          name={e.name}\n          subtitle={e.title}\n          src={e.photo}\n          onClick={() => router.push(\`/people/\${e.id}\`)}\n        />\n      </td>\n      <td>{e.department}</td>\n    </tr>\n  ))}\n</tbody>`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['name', 'string', '—'],
              ['subtitle', 'ReactNode', '—'],
              ['src', 'string', '—'],
              ['avatarSize', "'medium' | 'small' | 'tiny'", "'small'"],
              ['status', 'boolean', 'false'],
              ['onClick', '(event) => void', '—'],
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
