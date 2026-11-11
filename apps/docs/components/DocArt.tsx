'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { DOC_ART } from './landing/art/docs';
import { DRAWN } from './landing/art/drawn';
import landing from './landing/landing.module.css';
import styles from './shell.module.css';

const FigmaArt = dynamic(() => import('./landing/art/FigmaArt'));
const FIGMA_SLUGS = new Set(['avatar', 'button', 'checkbox', 'radio', 'selectbox', 'tab', 'cell', 'modal', 'drawer']);

/** The isometric illustration of a docs page, beside its title: the component's landing drawing, or a
    drawing of the foundation or guide. Nothing for pages without one. */
export function DocArt() {
  const slug = usePathname().split('/').filter(Boolean).pop() ?? '';
  const Drawn = DOC_ART[slug] ?? DRAWN[slug];
  if (!Drawn && !FIGMA_SLUGS.has(slug)) return null;
  return (
    <span className={`${landing.art} ${styles.pageArt}`} data-play aria-hidden>
      {Drawn ? <Drawn /> : <FigmaArt slug={slug} />}
    </span>
  );
}
