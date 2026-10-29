// Writes the design system's Logos and Icons SVG files (see README.md in this folder).
import { writeFileSync, mkdirSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement as h } from 'react';
import { BrandMark } from '../../packages/ui/src/Brand/BrandMark';
import * as I from '../../packages/icons/src/index';
const out = process.argv[2];
mkdirSync(out + '/Logos', { recursive: true }); mkdirSync(out + '/Icons', { recursive: true });
const brand = renderToStaticMarkup(h(BrandMark)).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"').replace('var(--color-static-brand-color)', '#3c3c3c').replace(' aria-hidden="true"', '');
writeFileSync(out + '/Logos/ladom-mark.svg', brand);
const pick = ['Add','Search','Close','Check','Info','Error','Warning','Edit','Delete','Share','Download','Setting','Profile','Notification','Calendar','DateRange','Time','File','FileUpload','Folder','List','Map','ArrowRight','ArrowBottom','Back','Refresh','ExternalLink','Show','Hide','Phone'];
const done = [];
for (const n of pick) {
  const C = (I as any)['Icon' + n];
  if (!C) continue;
  const svg = renderToStaticMarkup(h(C, { size: 24 })).replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"').replace(/currentColor/g, '#1f1f1f').replace(' aria-hidden="true"', '');
  const file = n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '.svg';
  writeFileSync(out + '/Icons/' + file, svg); done.push(file);
}
console.log(JSON.stringify(done));
