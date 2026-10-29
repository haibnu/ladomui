import type { Metadata } from 'next';
import { DocPage } from '../../../../components/DocPage';
import { IconGallery } from './IconGallery';

export const metadata: Metadata = { title: 'Icons' };

export default function IconsPage() {
  return (
    <DocPage
      eyebrow="Foundations"
      title="Icons"
      description={
        <>
          Each icon name maps to exactly one icon: Tabler outline icons, plus custom icons from the Figma file. Use them as
          components, e.g. <code>{'<IconPhone size={20} />'}</code> from <code>@ladom/icons</code>.
        </>
      }
    >
      <IconGallery />
    </DocPage>
  );
}
