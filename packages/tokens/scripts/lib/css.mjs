// Emits CSS custom properties for a set of variables, with one block per non-default mode.
import { MODES, cssName, cssValue } from './variables.mjs';

export const block = (selector, lines) => `${selector} {\n${lines.join('\n')}\n}\n`;
const indent = (text) => text.replace(/^(?=.)/gm, '  ');

// How a non-default mode is selected. `media` modes also apply automatically unless the attribute is set.
export function modeSelectors(breakpoints) {
  return {
    '03 Token': {
      // Tablet applies below the desktop width, Mobile below the tablet width (Mobile comes last so it wins).
      Tablet: { attr: 'data-device', value: 'tablet', media: `(width < ${breakpoints.desktop}px)` },
      Mobile: { attr: 'data-device', value: 'mobile', media: `(width < ${breakpoints.tablet}px)` },
    },
    // Dark follows the device (prefers-color-scheme) unless data-theme is set; data-theme="light" keeps Light.
    '02 Theme': { Dark: { attr: 'data-theme', value: 'dark', media: '(prefers-color-scheme: dark)' } },
    '04 Layout': { Narrow: { attr: 'data-density', value: 'narrow' } },
  };
}

// Every non-default block lists all variables of the collection that vary between modes,
// so a narrower mode never inherits a value from a wider one.
export function emitVariables(vars, keys, selectors) {
  const byCollection = new Map();
  for (const k of keys) {
    const c = vars.get(k).collection;
    byCollection.set(c, [...(byCollection.get(c) ?? []), k]);
  }
  let css = '';
  for (const [collection, list] of byCollection) {
    const [defaultMode, ...otherModes] = MODES[collection];
    const sorted = [...list].sort((a, b) => cssName(a).localeCompare(cssName(b), 'en', { numeric: true }));
    const lines = (mode, ks) => ks.map((k) => `  ${cssName(k)}: ${cssValue(vars, k, mode)};`);
    css += block(':root', lines(defaultMode, sorted));
    const varying = sorted.filter((k) => new Set(MODES[collection].map((m) => JSON.stringify(vars.get(k).values[m]))).size > 1);
    if (!varying.length) continue;
    for (const mode of otherModes) {
      const s = selectors[collection]?.[mode];
      if (!s) throw new Error(`No selector for ${collection} mode ${mode}`);
      if (s.media) css += `\n@media ${s.media} {\n${indent(block(`:root:not([${s.attr}])`, lines(mode, varying)))}}\n`;
    }
    for (const mode of otherModes) {
      const s = selectors[collection][mode];
      css += `\n${block(`:root[${s.attr}="${s.value}"]`, lines(mode, varying))}`;
    }
    css += '\n';
  }
  return css.trimEnd() + '\n';
}

// Docs metadata: CSS value per mode (as written) for each variable.
export function describeVariables(vars, keys) {
  return keys.map((k) => {
    const v = vars.get(k);
    const values = Object.fromEntries(MODES[v.collection].map((m) => [m, cssValue(vars, k, m)]));
    return { name: cssName(k), figma: `${v.collection} / ${v.name}`, ...(v.added && { added: true }), ...(v.description && { description: v.description }), values };
  }).sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));
}
