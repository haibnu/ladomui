import type { Metadata } from 'next';
import { Avatar, AvatarGroup, Button, type AvatarSize } from '@ladom/ui';
import { IconAdd } from '@ladom/icons';
import { DocPage } from '@/components/DocPage';
import { ComponentToolbar, MappingTable, PropsTable, SpecTable } from '@/components/docs/ComponentDoc';
import { Example } from '@/components/docs/Example';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AvatarPlayground } from './AvatarPlayground';

type Props = { params: Promise<{ lang: string }> };

const SIZES: AvatarSize[] = ['xlarge', 'medium', 'small', 'tiny', 'micro'];
const NAME = 'Halil Nuroğlu';

const COPY = {
  en: {
    description: 'A picture of a person or an account: their photo, their initials or an icon, with optional status and notification marks.',
    variants: 'Variants',
    variantsText: 'The content picks the style: an image, initials from the name, or an icon. Initials and icons sit on primary soft.',
    sizes: 'Sizes',
    sizesText: 'XLarge and Medium have the card radius; Small, Tiny and Micro are round. Tiny and Micro show one initial.',
    marks: 'Status and notification',
    marksText: 'The status dot sits in the bottom end corner (not in Micro); the notification bubble overlaps the top end corner (XLarge, Medium and Small).',
    group: 'Avatar Group',
    groupText: 'Overlap steps each avatar 8px back; Spaced keeps the 8px in-group gap. A trailing button can add people.',
    tokens: 'Tokens',
    notes: 'Notes from Figma',
    notesItems: [
      'XLarge Name Surname has a 24px radius while the XLarge image and icon use 16px; code uses the card radius (16px) for all XLarge.',
      'The hover state is the primary focus shadow; code shows it when the avatar is inside a hovered or focused link or button.',
      'The Small notification sits at x 24 in Name Surname and Icon and x 26 in Image, and at y −4 in one Small variant; code places it 8px over the corner in every size.',
      'Avatars in the group have a 1px stroke with a raw color; code uses surface/level-1.',
      'The icon color is not bound in Figma; code uses foreground/high-emphasis, like the initials.',
    ],
    usage: 'Usage',
    api: 'API reference',
    apiText: 'Avatar also accepts every span attribute and forwards its ref. AvatarGroup takes layout and every div attribute.',
    a11y: 'Accessibility',
    a11yItems: [
      'An image avatar uses alt (or the name). Initials and icon avatars have role="img" and the name as their label; give icon avatars an aria-label.',
      'The status dot is decorative. If the status matters, say it in nearby text or in the label (“Halil, online”).',
      'Wrap a clickable avatar in a link or button and name it; the avatar shows its hover ring then.',
    ],
    mapping: 'Figma to code',
    props: {
      size: 'Figma 👕 Size.',
      src: 'Figma 💅 Style=Image.',
      alt: 'Alt text; defaults to name.',
      name: 'Figma 💅 Style=Name Surname (initials).',
      icon: 'Figma 💅 Style=Icon + Change Icon.',
      status: 'Figma 🟢 Status.',
      notification: 'Figma 🔔 Notification: the count.',
      layout: 'AvatarGroup: Figma Property 1 (Overlap / Spaced).',
    },
  },
  tr: {
    description: 'Bir kişinin ya da hesabın görseli: fotoğrafı, baş harfleri ya da bir ikon; isteğe bağlı durum ve bildirim işaretleriyle.',
    variants: 'Tipler',
    variantsText: 'İçerik stili belirler: görsel, isimden baş harfler ya da ikon. Baş harfler ve ikonlar primary soft zemindedir.',
    sizes: 'Boyutlar',
    sizesText: 'XLarge ve Medium kart köşesini kullanır; Small, Tiny ve Micro yuvarlaktır. Tiny ve Micro tek harf gösterir.',
    marks: 'Durum ve bildirim',
    marksText: 'Durum noktası alt-son köşededir (Micro’da yok); bildirim baloncuğu üst-son köşeye taşar (XLarge, Medium ve Small).',
    group: 'Avatar Group',
    groupText: 'Overlap her avatarı 8px geri kaydırır; Spaced 8px grup içi boşluğu korur. Sondaki bir buton kişi ekleyebilir.',
    tokens: 'Tokenlar',
    notes: 'Figma notları',
    notesItems: [
      'XLarge Name Surname 24px köşe kullanırken XLarge görsel ve ikon 16px kullanıyor; kod tüm XLarge için kart köşesini (16px) kullanır.',
      'Hover durumu primary focus gölgesidir; kod, avatar hover ya da focus olan bir link veya butonun içindeyken gösterir.',
      'Small bildirim Name Surname ve Icon’da x 24’te, Image’da x 26’da, bir Small varyantta da y −4’te; kod her boyutta köşenin 8px üstüne koyar.',
      'Gruptaki avatarların 1px çizgisi ham bir renk; kod surface/level-1 kullanır.',
      'İkon rengi Figma’da bağlı değil; kod baş harfler gibi foreground/high-emphasis kullanır.',
    ],
    usage: 'Kullanım',
    api: 'API',
    apiText: 'Avatar tüm span özniteliklerini de kabul eder ve ref’ini iletir. AvatarGroup layout’u ve tüm div özniteliklerini alır.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Görsel avatar alt’ı (ya da ismi) kullanır. Baş harf ve ikon avatarları role="img" taşır ve isim label’dır; ikon avatarlarına aria-label verin.',
      'Durum noktası dekoratiftir. Durum önemliyse yakındaki metinde ya da label’da söyleyin (“Halil, çevrimiçi”).',
      'Tıklanabilir avatarı bir link ya da butonla sarın ve adlandırın; avatar o zaman hover halkasını gösterir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      size: 'Figma 👕 Size.',
      src: 'Figma 💅 Style=Image.',
      alt: 'Alt metni; varsayılanı name.',
      name: 'Figma 💅 Style=Name Surname (baş harfler).',
      icon: 'Figma 💅 Style=Icon + Change Icon.',
      status: 'Figma 🟢 Status.',
      notification: 'Figma 🔔 Notification: sayı.',
      layout: 'AvatarGroup: Figma Property 1 (Overlap / Spaced).',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Avatar' };
}

export default async function AvatarPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  const people = (
    <>
      <Avatar size="small" src="/avatars/1.svg" name="Ada" />
      <Avatar size="small" src="/avatars/2.svg" name="Deniz" />
      <Avatar size="small" src="/avatars/3.svg" name="Ece" />
    </>
  );
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.components} title="Avatar" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1153:124" />

        <h2 id="playground">{t.component.playground}</h2>
        <AvatarPlayground />

        <ForView view="designer">
          <h2 id="variants">{c.variants}</h2>
          <p>{c.variantsText}</p>
          <Example>
            <Avatar src="/avatars/1.svg" name={NAME} />
            <Avatar name={NAME} />
            <Avatar icon={<IconAdd />} aria-label="Add" />
            <Avatar name={NAME} data-state="hover" />
          </Example>

          <h2 id="sizes">{c.sizes}</h2>
          <p>{c.sizesText}</p>
          <Example>
            {SIZES.map((size) => (
              <Avatar key={size} size={size} src="/avatars/2.svg" name={NAME} />
            ))}
          </Example>
          <Example>
            {SIZES.map((size) => (
              <Avatar key={size} size={size} name={NAME} />
            ))}
          </Example>
          <SpecTable
            head={['Size', 'Box', 'Radius', 'Initials', 'Icon', 'Status', 'Notification']}
            rows={[
              ['xlarge', '72px', '--radius-card', 'ui/text lead/bold', '36px', '12px', '20px'],
              ['medium', '48px', '--radius-card', 'ui/text/bold', '24px', '8px', '20px'],
              ['small', '32px', '--radius-full', 'ui/text/bold', '16px', '8px', '16px'],
              ['tiny', '24px', '--radius-full', 'ui/text small/bold', '12px', '4px', '—'],
              ['micro', '16px', '--radius-full', 'ui/footnote/bold', '8px', '—', '—'],
            ]}
          />

          <h2 id="marks">{c.marks}</h2>
          <p>{c.marksText}</p>
          <Example>
            <Avatar size="xlarge" src="/avatars/3.svg" name={NAME} status notification={2} />
            <Avatar name={NAME} status notification={2} />
            <Avatar size="small" src="/avatars/1.svg" name={NAME} status notification={2} />
            <Avatar size="tiny" name={NAME} status />
          </Example>

          <h2 id="group">{c.group}</h2>
          <p>{c.groupText}</p>
          <Example>
            <AvatarGroup>
              {people}
              <Button tone="tertiary" size="small" icon={IconAdd} aria-label="Add person" />
            </AvatarGroup>
            <AvatarGroup layout="spaced">{people}</AvatarGroup>
          </Example>

          <h2 id="tokens">{c.tokens}</h2>
          <SpecTable
            head={['Part', 'Token']}
            rows={[
              ['Initials / icon background', '--color-primary-soft'],
              ['Initials / icon', '--color-foreground-high-emphasis'],
              ['Ring (1px outside)', '--color-surface-level-1'],
              ['Status', '--color-success, 2px --color-surface-level-1 ring'],
              ['Notification', '--color-primary / --color-on-primary, 2px --color-surface-level-1 ring'],
              ['Hover', '--shadow-focus-primary'],
              ['Group gap', '--space-form-ingroup-gutter'],
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
          <Example
            code={`<Avatar src="/avatars/1.svg" name="${NAME}" status />
<Avatar name="${NAME}" notification={2} />
<a href="/profile" aria-label="Profile">
  <Avatar size="small" name="${NAME}" />
</a>

<AvatarGroup>
  <Avatar size="small" src="/avatars/1.svg" name="Ada" />
  <Avatar size="small" src="/avatars/2.svg" name="Deniz" />
  <Avatar size="small" src="/avatars/3.svg" name="Ece" />
</AvatarGroup>`}
          >
            <Avatar src="/avatars/1.svg" name={NAME} status />
            <Avatar name={NAME} notification={2} />
            <a href="#usage" aria-label="Profile">
              <Avatar size="small" name={NAME} />
            </a>
            <AvatarGroup>{people}</AvatarGroup>
          </Example>

          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['size', "'xlarge' | 'medium' | 'small' | 'tiny' | 'micro'", "'medium'"],
              ['src', 'string', '—'],
              ['alt', 'string', 'name'],
              ['name', 'string', '—'],
              ['icon', 'ReactNode', '—'],
              ['status', 'boolean', 'false'],
              ['notification', 'ReactNode', '—'],
              ['layout', "'overlap' | 'spaced'", "'overlap'"],
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
            ['💅 Style = Image / Name Surname / Icon', 'src="…" / name="…" / icon={<Icon… />}'],
            ['👕 Size = XLarge / Medium / Small / Tiny / Micro', "size='xlarge' / 'medium' / 'small' / 'tiny' / 'micro'"],
            ['🕹 State = Hover', 'inside a hovered link or button (data-state="hover" in docs)'],
            ['🟢 Status = True', 'status'],
            ['🔔 Notification = True', 'notification={2}'],
            ['Avatar Group / Property 1 = Overlap / Spaced', "<AvatarGroup layout='overlap' | 'spaced'>"],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
