import type { Metadata } from 'next';
import Link from 'next/link';
import { DocPage } from '../../../components/DocPage';

export const metadata: Metadata = { title: 'Introduction' };

export default function IntroductionPage() {
  return (
    <DocPage
      eyebrow="Getting Started"
      title="Introduction"
      description="Ladom UI is the Ladom design system for React: design tokens, icons and components built 1:1 from the Ladom UI Figma file."
    >
      <h2 id="principles">Principles</h2>
      <ul>
        <li>
          <strong>Figma is the source of truth.</strong> Colors, type, spacing, radius, depth and motion come from the Figma
          variables and styles. Nothing is invented in code.
        </li>
        <li>
          <strong>Everything is a token.</strong> Components never hard-code a visual value; they use CSS custom properties
          such as <code>var(--color-primary)</code> or <code>var(--text-ui-title)</code>.
        </li>
        <li>
          <strong>Plain React and CSS.</strong> Components are framework-independent React with CSS Modules. No Tailwind, no
          runtime styling.
        </li>
        <li>
          <strong>One icon per meaning.</strong> Every icon name maps to exactly one icon, so a product never mixes three
          different phone icons.
        </li>
      </ul>

      <h2 id="packages">Packages</h2>
      <ul>
        <li>
          <code>@ladom/tokens</code>: design tokens as CSS variables, with Light/Dark themes, Desktop/Tablet/Mobile values
          and Comfort/Narrow density. See <Link href="/docs/foundations/color">Foundations</Link>.
        </li>
        <li>
          <code>@ladom/icons</code>: icon components with semantic names. See <Link href="/docs/foundations/icons">Icons</Link>.
        </li>
        <li>
          <code>@ladom/ui</code>: React components. They are being built now and land in this site one by one.
        </li>
      </ul>

      <h2 id="modes">Modes</h2>
      <p>
        Modes are set with attributes on <code>{'<html>'}</code>. Device values follow the screen width (Mobile below
        768px, Tablet below 1280px) and can be forced with <code>data-device</code>. The Dark theme is opt-in with{' '}
        <code>data-theme=&quot;dark&quot;</code>, and Narrow density with <code>data-density=&quot;narrow&quot;</code>.
      </p>

      <h2 id="next">Next steps</h2>
      <p>
        Continue with <Link href="/docs/installation">Installation</Link>.
      </p>
    </DocPage>
  );
}
