import type { Metadata } from 'next';
import { NewLanding } from '@/components/landing-new/NewLanding';
import { TopBar } from '@/components/TopBar';
import type { Locale } from '@/i18n';

// Trial of a new, Figma-independent landing ("Ship your design, no handoff"); the live landing stays at /.
export const metadata: Metadata = { title: 'Ship your design', robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  return (
    <>
      <TopBar lang={lang} />
      <NewLanding lang={lang} />
    </>
  );
}
