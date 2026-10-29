import { createElement, forwardRef, type SVGProps } from 'react';

export type IconNode = ReadonlyArray<readonly [tag: string, attrs: Readonly<Record<string, string>>]>;

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'ref'> & {
  /** Width and height; a number is in px. */
  size?: number | string;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  title?: string;
};

// Outline icons are 2px strokes (Tabler); fill icons are solid shapes (custom icons from Figma).
const STYLE_ATTRS = {
  outline: { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
  fill: { fill: 'currentColor', stroke: 'none' },
} as const;

export function createIcon(displayName: string, style: keyof typeof STYLE_ATTRS, node: IconNode) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(({ size = 24, title, children, ...props }, ref) =>
    createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        ...STYLE_ATTRS[style],
        ...(title ? { role: 'img' } : { 'aria-hidden': true }),
        focusable: false,
        ...props,
      },
      title ? createElement('title', null, title) : null,
      ...node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
      children,
    ),
  );
  Icon.displayName = displayName;
  return Icon;
}
