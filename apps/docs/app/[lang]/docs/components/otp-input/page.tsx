import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ComponentToolbar, MappingTable, PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { OtpInputPlayground } from './OtpInputPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A one-time code field: a box per character, filled by typing, pasting or the code from an SMS.',
    look: 'Look',
    lookText: 'A row of square Input boxes, one per character: 40px in Medium and 32px in Small, with Input’s radius and an 8px gap. groups splits the row with a minus icon between the groups. The active box has the primary line and focus ring, with a blinking caret while it is empty; filled boxes have the darker line. Error turns every box red, disabled fills them like a disabled Input. With mask, each character shows for a moment and then shrinks into a filled circle (12px in Medium, 8px in Small) that grows in its place. There is no Figma drawing yet.',
    usage: 'Usage',
    usageText: 'value is the code as a string. Typing moves to the next box, Backspace clears a box or moves back, the arrow keys, Home and End move between boxes, and a click picks a box. Pasting a code, or the code the phone offers from an SMS (autocomplete="one-time-code"), fills every box at once. onValueChange gets the code as it is typed; onComplete gets it once every box is filled, which is where you verify it.',
    groupsTitle: 'Groups',
    groupsText: 'groups gives the size of each group; they must add up to length. A 6-digit code reads best as [3, 3], an 8-character one as [4, 4].',
    maskTitle: 'Mask',
    maskText: 'mask hides the code for PINs and other secrets: each character shows for maskDelay (1000 ms) and then shrinks into a filled circle. The value is not masked, only its look.',
    charsTitle: 'Letters',
    charsText: 'chars="numeric" (the default) takes digits only and opens the numeric keyboard on phones. chars="alphanumeric" takes letters and digits; anything else typed or pasted is dropped.',
    api: 'API reference',
    apiText: 'OtpInput also takes the other input attributes, such as autoFocus and aria-label; they go to the one input under the boxes.',
    a11y: 'Accessibility',
    a11yItems: [
      'The boxes are drawn on top of one real text input, so screen readers, password managers and SMS autofill see a single field with the whole code. The boxes are hidden from screen readers.',
      'Inside FormField the label, the hint and the error are wired to that input; without one, give it an aria-label.',
      'With mask the boxes show circles, but a screen reader can still read the value of the input, as in a one-time code field of the phone itself.',
      'With name, the code is submitted with the form.',
    ],
    mapping: 'Figma to code',
    props: {
      length: 'Number of boxes.',
      value: 'The code.',
      defaultValue: 'The first code (uncontrolled).',
      onValueChange: 'Called with the code as it is typed.',
      onComplete: 'Called once every box is filled.',
      groups: 'Sizes of the groups, e.g. [3, 3].',
      mask: 'Shows each character briefly, then turns it into a circle.',
      maskDelay: 'How long a masked character shows, in ms.',
      chars: 'Digits only, or letters and digits.',
      size: 'Figma 👕 Size of the boxes.',
      error: 'Error state; FormField’s error sets it too.',
      disabled: 'Disables the field.',
      name: 'Form name of the code.',
    },
  },
  tr: {
    description: 'Tek kullanımlık kod alanı: her karakter için bir kutu; yazarak, yapıştırarak ya da SMS’teki kodla dolar.',
    look: 'Görünüm',
    lookText: 'Her karakter için bir tane, kare Input kutularından oluşan bir satır: Medium’da 40px, Small’da 32px; Input’un köşe yuvarlaklığı ve aralarında 8px boşluk. groups satırı gruplara böler, aralarına bir eksi ikonu koyar. Aktif kutuda primary çizgi ve odak halkası, boşken de yanıp sönen bir imleç olur; dolu kutuların çizgisi daha koyudur. Hata bütün kutuları kırmızı yapar, devre dışı onları devre dışı bir Input gibi doldurur. mask açıkken her karakter bir an görünür, sonra küçülerek yerinde büyüyen dolu bir daireye döner (Medium’da 12px, Small’da 8px). Henüz Figma çizimi yok.',
    usage: 'Kullanım',
    usageText: 'value, string olarak koddur. Yazmak sonraki kutuya geçer, Backspace bir kutuyu temizler ya da geri gider, ok tuşları, Home ve End kutular arasında gezer, tıklamak bir kutuyu seçer. Bir kodu yapıştırmak ya da telefonun SMS’ten önerdiği kod (autocomplete="one-time-code") bütün kutuları birden doldurur. onValueChange kodu yazıldıkça alır; onComplete bütün kutular dolunca alır, kodu orada doğrularsınız.',
    groupsTitle: 'Gruplar',
    groupsText: 'groups her grubun boyutunu verir; toplamı length olmalı. 6 haneli bir kod [3, 3], 8 karakterli bir kod [4, 4] olarak en kolay okunur.',
    maskTitle: 'Maskeleme',
    maskText: 'mask, PIN’ler ve diğer gizli kodlar için kodu gizler: her karakter maskDelay (1000 ms) kadar görünür, sonra küçülerek dolu bir daireye döner. Değer maskelenmez, yalnızca görünüşü.',
    charsTitle: 'Harfler',
    charsText: 'chars="numeric" (varsayılan) yalnızca rakam alır ve telefonlarda sayı klavyesini açar. chars="alphanumeric" harf ve rakam alır; yazılan ya da yapıştırılan başka her şey atılır.',
    api: 'API',
    apiText: 'OtpInput, autoFocus ve aria-label gibi diğer input özniteliklerini de alır; bunlar kutuların altındaki tek input’a gider.',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Kutular tek bir gerçek metin input’unun üstüne çizilir; ekran okuyucular, şifre yöneticileri ve SMS otomatik doldurma bütün kodu içeren tek bir alan görür. Kutular ekran okuyuculardan gizlidir.',
      'FormField içinde etiket, ipucu ve hata o input’a bağlanır; FormField yoksa ona bir aria-label verin.',
      'mask açıkken kutularda daire görünür, ama telefonun kendi tek kullanımlık kod alanında olduğu gibi ekran okuyucu input’un değerini okuyabilir.',
      'name verilirse kod formla gönderilir.',
    ],
    mapping: 'Figma’dan koda',
    props: {
      length: 'Kutu sayısı.',
      value: 'Kod.',
      defaultValue: 'İlk kod (kontrolsüz).',
      onValueChange: 'Kod yazıldıkça çağrılır.',
      onComplete: 'Bütün kutular dolunca çağrılır.',
      groups: 'Grupların boyutları, ör. [3, 3].',
      mask: 'Her karakteri bir an gösterir, sonra daireye çevirir.',
      maskDelay: 'Maskelenen karakterin görünme süresi, ms.',
      chars: 'Yalnızca rakam ya da harf ve rakam.',
      size: 'Kutuların Figma 👕 Size’ı.',
      error: 'Hata durumu; FormField’ın error’u da açar.',
      disabled: 'Alanı devre dışı bırakır.',
      name: 'Kodun form adı.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'OTP Input' };
}

export default async function OtpInputPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={`${t.nav.components} / Input`} title="OTP Input" description={c.description}>
        <ComponentToolbar lang={lang} figmaNode="1133:303" />
        <h2 id="playground">{t.component.playground}</h2>
        <OtpInputPlayground />
        <ForView view="designer">
          <h2 id="look">{c.look}</h2>
          <p>{c.lookText}</p>
        </ForView>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`const [code, setCode] = useState('');\n\n<FormField label="Verification code" hint="Enter the code we sent to your phone.">\n  <OtpInput value={code} onValueChange={setCode} onComplete={verify} />\n</FormField>`}
          />
          <h3 id="groups">{c.groupsTitle}</h3>
          <p>{c.groupsText}</p>
          <CodeBlock code={`<OtpInput length={6} groups={[3, 3]} />`} />
          <h3 id="mask">{c.maskTitle}</h3>
          <p>{c.maskText}</p>
          <CodeBlock code={`<FormField label="PIN">\n  <OtpInput length={4} mask />\n</FormField>`} />
          <h3 id="letters">{c.charsTitle}</h3>
          <p>{c.charsText}</p>
          <CodeBlock code={`<OtpInput length={8} groups={[4, 4]} chars="alphanumeric" />`} />
          <h2 id="api">{c.api}</h2>
          <p>{c.apiText}</p>
          <PropsTable
            props={[
              ['length', 'number', '6'],
              ['value', 'string', '—'],
              ['defaultValue', 'string', "''"],
              ['onValueChange', '(value: string) => void', '—'],
              ['onComplete', '(value: string) => void', '—'],
              ['groups', 'number[]', '—'],
              ['mask', 'boolean', 'false'],
              ['maskDelay', 'number', '1000'],
              ['chars', "'numeric' | 'alphanumeric'", "'numeric'"],
              ['size', "'medium' | 'small'", "'medium'"],
              ['error', 'boolean', '—'],
              ['disabled', 'boolean', 'false'],
              ['name', 'string', '—'],
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
            ['Input 👕 Size = Medium / Small', "size='medium' / 'small'"],
            ['Input 🕹 State = Focus (one box)', 'the active box'],
            ['Input 🕹 State = Typed / Error / Disabled', 'a filled box / error / disabled'],
            ['Icon/remove', 'groups separator'],
          ]}
        />
      </DocPage>
    </ViewProvider>
  );
}
