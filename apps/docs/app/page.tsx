import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: 'var(--space-container)' }}>
      <h1 style={{ font: 'var(--text-content-h2-bold)', margin: 0 }}>Ladom UI</h1>
      <p>
        <Link href="/tokens">Tokens</Link> · <Link href="/icons">Icons</Link>
      </p>
    </main>
  );
}
