import type { Metadata } from 'next';
import licenses from '@/registry/licenses.json';
import tiers from '@/registry/tiers.json';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { DocPage } from '@/components/DocPage';
import { getDictionary, href, type Locale } from '@/i18n';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).nav.license };
}

const names = (tier: string) => Object.entries(tiers as Record<string, string>).filter(([, t]) => t === tier).map(([n]) => n);
const list = (tier: string) =>
  names(tier).map((n, i) => (
    <span key={n}>
      {i > 0 && ', '}
      <code>{n}</code>
    </span>
  ));

const COPY = {
  en: {
    description: 'Every Ladom UI component is free under the MIT License; the molecules are Pro, under the Ladom UI Pro License.',
    free: 'Free',
    freeText: 'The design tokens, the icons, the ladom-ui CLI and every component are MIT: use, change and share them freely, keeping the license line.',
    pro: 'Pro',
    proText: 'The molecules need a license key and are under the Ladom UI Pro License:',
    allowed: 'With a Pro key you may',
    allowedItems: [
      'install the Pro components into your projects with the CLI;',
      'change them and build any number of apps, websites and internal tools with them, for yourself or for clients;',
      'ship those products to their users.',
    ],
    notAllowed: 'You may not',
    notAllowedItems: [
      'redistribute or sell the Pro source, changed or not, on its own or in a component library, UI kit, template or starter;',
      'publish the Pro source in a public repository;',
      'share your key outside your team.',
    ],
    key: 'Getting a key',
    keyText: (
      <>
        Pro keys are issued by Ladom; get in touch through <a href="https://ladom.co">ladom.co</a>. Set the key in{' '}
        <code>LADOM_UI_KEY</code> when you run <code>npx ladom-ui add</code>.
      </>
    ),
    files: 'Which license a file has',
    filesText: 'The first lines of every copied file name its tier and license.',
    summary: 'This page is a summary; the license texts decide.',
  },
  tr: {
    description: 'Ladom UI’ın tüm bileşenleri MIT Lisansı altında ücretsizdir; moleküller Ladom UI Pro Lisansı altında Pro’dur.',
    free: 'Ücretsiz',
    freeText: 'Tasarım tokenları, ikonlar, ladom-ui CLI ve tüm bileşenler MIT’dir: lisans satırını koruyarak özgürce kullanın, değiştirin ve paylaşın.',
    pro: 'Pro',
    proText: 'Moleküller bir lisans anahtarı ister ve Ladom UI Pro Lisansı altındadır:',
    allowed: 'Pro anahtarıyla',
    allowedItems: [
      'Pro bileşenleri CLI ile projelerinize kurabilirsiniz;',
      'onları değiştirip kendiniz ya da müşterileriniz için istediğiniz kadar uygulama, web sitesi ve iç araç yapabilirsiniz;',
      'bu ürünleri kullanıcılarına sunabilirsiniz.',
    ],
    notAllowed: 'Şunları yapamazsınız',
    notAllowedItems: [
      'Pro kaynak kodunu, değiştirilmiş olsun ya da olmasın, tek başına ya da bir bileşen kütüphanesi, UI kit, şablon veya başlangıç projesi içinde dağıtmak ya da satmak;',
      'Pro kaynak kodunu herkese açık bir repoda yayımlamak;',
      'anahtarınızı ekibiniz dışında paylaşmak.',
    ],
    key: 'Anahtar edinmek',
    keyText: (
      <>
        Pro anahtarlarını Ladom verir; <a href="https://ladom.co">ladom.co</a> üzerinden iletişime geçin. <code>npx ladom-ui add</code>{' '}
        çalıştırırken anahtarı <code>LADOM_UI_KEY</code> içinde verin.
      </>
    ),
    files: 'Bir dosyanın lisansı',
    filesText: 'Kopyalanan her dosyanın ilk satırları katmanını ve lisansını söyler.',
    summary: 'Bu sayfa bir özettir; geçerli olan lisans metinleridir.',
  },
};

export default async function LicensePage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <DocPage eyebrow={t.nav.gettingStarted} title={t.nav.license} description={c.description}>
      <h2 id="free">{c.free}</h2>
      <p>{c.freeText}</p>
      <p>{list('free')}</p>

      <h2 id="pro">{c.pro}</h2>
      <p>{c.proText}</p>
      <p>{list('pro')}</p>
      <h3 id="allowed">{c.allowed}</h3>
      <ul>
        {c.allowedItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 id="not-allowed">{c.notAllowed}</h3>
      <ul>
        {c.notAllowedItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3 id="key">{c.key}</h3>
      <p>{c.keyText}</p>

      <h2 id="files">{c.files}</h2>
      <p>{c.filesText}</p>
      <p>{c.summary}</p>
      <h3 id="mit">MIT License</h3>
      <CodeBlock code={licenses.mit.trim()} />
      <h3 id="pro-license">Ladom UI Pro License</h3>
      <CodeBlock code={licenses.pro.replace(/^# .*\n\n/, '').replace(/^> DRAFT.*\n\n/m, '').trim()} />
      <p>
        <a href={href(lang, '/docs/installation')}>{t.nav.installation}</a>
      </p>
    </DocPage>
  );
}
