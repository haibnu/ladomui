import type { CSSProperties } from 'react';

// Placeholder until the token pages (Phase 2): proves the tokens and the font are wired up.
const samples = [
  { token: '--text-ui-display', label: 'ui/display' },
  { token: '--text-content-h1-bold', label: 'content/H1/Bold' },
  { token: '--text-ui-title', label: 'ui/title' },
  { token: '--text-ui-text-lead-regular', label: 'ui/text lead/regular' },
  { token: '--text-ui-text-regular', label: 'ui/text/regular' },
  { token: '--text-ui-caption', label: 'ui/CAPTION' },
];

const sampleStyle = (token: string): CSSProperties => ({
  font: `var(${token})`,
  letterSpacing: `var(${token}-letter-spacing, normal)`,
  textTransform: `var(${token}-text-transform, none)` as CSSProperties['textTransform'],
});

export default function Home() {
  return (
    <main>
      {samples.map(({ token, label }) => (
        <p key={token} style={sampleStyle(token)}>
          {label} · Çağrı İşığı
        </p>
      ))}
    </main>
  );
}
