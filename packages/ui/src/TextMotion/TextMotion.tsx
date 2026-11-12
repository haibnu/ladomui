import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import styles from './TextMotion.module.css';

// Not in Figma yet: an opt-in text animation. No component uses it by default; wrap a label in it.
// roll: every character slides out by one line and a copy slides in from the other side.
// blur: the characters drift out and blur away while their copies drift in and sharpen.
// flip: the characters fold away around the horizontal axis and their copies fold in.
// wave: the characters hop once, one after another.
// It runs while the nearest interactive parent (button, link, tab, …) is hovered
// or focused, or, with trigger="self", while the text itself is hovered.
export type TextMotionEffect = 'roll' | 'blur' | 'flip' | 'wave';
export type TextMotionDirection = 'up' | 'down';
export type TextMotionTrigger = 'parent' | 'self';

export type TextMotionProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** The text to animate. Anything that is not a string or number is rendered as it is, without motion. */
  children: ReactNode;
  effect?: TextMotionEffect;
  /** Which way the characters move. */
  direction?: TextMotionDirection;
  /** parent: runs while the nearest button, link or other control is hovered or focused. self: while the text is hovered. */
  trigger?: TextMotionTrigger;
  /** Characters start one after another; false moves them together. */
  stagger?: boolean;
};

const graphemes = (text: string): string[] => {
  const Segmenter = (Intl as { Segmenter?: new (l?: string, o?: { granularity: 'grapheme' }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter;
  return Segmenter ? Array.from(new Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment) : Array.from(text);
};

export const TextMotion = forwardRef<HTMLSpanElement, TextMotionProps>(function TextMotion(
  { children, effect = 'roll', direction = 'up', trigger = 'parent', stagger = true, className, ...rest },
  ref,
) {
  if (typeof children !== 'string' && typeof children !== 'number') return <>{children}</>;
  const text = String(children);
  const chars = graphemes(text);
  return (
    <span
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-effect={effect}
      data-direction={direction}
      data-trigger={trigger}
      data-stagger={stagger || undefined}
      {...rest}
    >
      {/* Assistive tech reads the text once; the characters are drawn for the eye only. */}
      <span className={styles.label}>{text}</span>
      <span className={styles.chars} aria-hidden="true">
        {chars.map((ch, i) => (
          <span key={i} className={styles.char} style={{ '--_i': i } as CSSProperties}>
            <span className={styles.front}>{ch}</span>
            <span className={styles.back}>{ch}</span>
          </span>
        ))}
      </span>
    </span>
  );
});
