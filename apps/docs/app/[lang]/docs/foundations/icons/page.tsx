import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { getDictionary, type Locale } from '@/i18n';
import { IconGallery } from './IconGallery';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDictionary((await params).lang as Locale).icons.title };
}

export default async function IconsPage({ params }: Props) {
  const t = getDictionary((await params).lang as Locale);
  return (
    <DocPage
      eyebrow={t.nav.foundations}
      title={t.icons.title}
      description={
        <>
          {t.icons.description} <code>{'<IconPhone size={20} />'}</code>.
        </>
      }
    >
      <IconGallery />
    </DocPage>
  );
}
