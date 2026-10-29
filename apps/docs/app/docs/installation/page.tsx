import type { Metadata } from 'next';
import { DocPage } from '../../../components/DocPage';

export const metadata: Metadata = { title: 'Installation' };

export default function InstallationPage() {
  return (
    <DocPage eyebrow="Getting Started" title="Installation" description="Set up the tokens, the font and the icons in a React app.">
      <p>
        The packages live in the <code>ladomui</code> monorepo and are not published to npm yet. Until then, use them from
        the workspace (<code>workspace:*</code>). A guide for other Next.js projects follows with the first release.
      </p>

      <h2 id="tokens">1. Load the tokens</h2>
      <p>Import all token groups once, at the root of the app:</p>
      <pre>
        <code>{`import '@ladom/tokens/index.css';`}</code>
      </pre>
      <p>
        A single group can be imported on its own, for example <code>@ladom/tokens/color.css</code>.
      </p>

      <h2 id="font">2. Load the font</h2>
      <p>
        The tokens use Hanken Grotesk. Load it and expose it as <code>--font-hanken-grotesk</code> on{' '}
        <code>{'<html>'}</code>. With Next.js:
      </p>
      <pre>
        <code>{`import { Hanken_Grotesk } from 'next/font/google';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-hanken-grotesk',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}`}</code>
      </pre>

      <h2 id="next-config">3. Compile the packages (Next.js)</h2>
      <p>
        <code>@ladom/ui</code> and <code>@ladom/icons</code> ship TypeScript source. Let Next.js compile them:
      </p>
      <pre>
        <code>{`// next.config.ts
const nextConfig = {
  transpilePackages: ['@ladom/ui', '@ladom/icons'],
};`}</code>
      </pre>

      <h2 id="usage">4. Use them</h2>
      <pre>
        <code>{`import { IconPhone } from '@ladom/icons';

export function CallLink() {
  return (
    <a href="tel:+90..." style={{ font: 'var(--text-ui-text-regular)', color: 'var(--color-foreground-high-emphasis)' }}>
      <IconPhone size={20} /> Call us
    </a>
  );
}`}</code>
      </pre>
    </DocPage>
  );
}
