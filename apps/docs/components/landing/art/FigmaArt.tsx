import { FIGMA_ART } from './figmaCards';

// A Figma card illustration by docs slug. Loaded on its own (next/dynamic in DocArt) so the large
// figma.ts only reaches the pages that show one of these.
export default function FigmaArt({ slug }: { slug: string }) {
  const svg = FIGMA_ART[slug];
  return svg ? <span aria-hidden dangerouslySetInnerHTML={{ __html: svg }} /> : null;
}
