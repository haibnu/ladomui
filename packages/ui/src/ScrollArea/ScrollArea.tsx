'use client';

import { forwardRef, useCallback, useEffect, useRef, type HTMLAttributes, type PointerEvent, type Ref } from 'react';
import styles from './ScrollArea.module.css';

// Not in Figma yet. A scrolling box with thin, rounded overlay scrollbars that show on hover,
// while scrolling and while dragged. Scrolling itself stays native (wheel, touch, keyboard,
// scrollIntoView); only the native scrollbar is hidden and drawn again on top of the content.
export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export type ScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  /** Which way the content scrolls. */
  orientation?: ScrollAreaOrientation;
  /** auto shows the scrollbars on hover and while scrolling; always keeps them on. */
  scrollbars?: 'auto' | 'always';
  /** Ref to the scrolling element (for scrollTop, scrollIntoView, focus). */
  viewportRef?: Ref<HTMLDivElement>;
  /** Props for the scrolling element: role, tabIndex, aria-*, onScroll, onKeyDown, className. */
  viewportProps?: HTMLAttributes<HTMLDivElement>;
};

type Axis = 'y' | 'x';
// How long the scrollbars stay after the last scroll event, in ms.
const LINGER = 900;

// The track's inner length (its padding keeps the thumb off the edges).
function trackLength(axis: Axis, track: HTMLElement) {
  const cs = getComputedStyle(track);
  return axis === 'y'
    ? track.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    : track.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', scrollbars = 'auto', viewportRef, viewportProps, className, children, ...rest },
  ref,
) {
  const root = useRef<HTMLDivElement | null>(null);
  const viewport = useRef<HTMLDivElement | null>(null);
  const tracks = { y: useRef<HTMLDivElement>(null), x: useRef<HTMLDivElement>(null) };
  const thumbs = { y: useRef<HTMLDivElement>(null), x: useRef<HTMLDivElement>(null) };
  const axes: Axis[] = orientation === 'both' ? ['y', 'x'] : orientation === 'horizontal' ? ['x'] : ['y'];

  const setRoot = useCallback((el: HTMLDivElement | null) => {
    root.current = el;
    setRef(ref, el);
  }, [ref]);
  const setViewport = useCallback((el: HTMLDivElement | null) => {
    viewport.current = el;
    setRef(viewportRef, el);
  }, [viewportRef]);

  // Thumb length and offset follow the viewport; written to the DOM directly, no re-render.
  const update = useCallback(() => {
    const v = viewport.current;
    const r = root.current;
    if (!v || !r) return;
    const rtl = getComputedStyle(v).direction === 'rtl';
    for (const axis of axes) {
      const track = tracks[axis].current;
      const thumb = thumbs[axis].current;
      if (!track || !thumb) continue;
      const size = axis === 'y' ? v.clientHeight : v.clientWidth;
      const content = axis === 'y' ? v.scrollHeight : v.scrollWidth;
      const pos = Math.abs(axis === 'y' ? v.scrollTop : v.scrollLeft);
      const overflow = content - size > 1;
      r.toggleAttribute(`data-overflow-${axis}`, overflow);
      if (!overflow) continue;
      const length = trackLength(axis, track);
      thumb.style[axis === 'y' ? 'blockSize' : 'inlineSize'] = `${(length * size) / content}px`;
      // The CSS min-size may make the thumb longer than the ratio; measure what it really is.
      const drawn = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
      const offset = ((length - drawn) * pos) / (content - size);
      thumb.style.transform = axis === 'y' ? `translateY(${offset}px)` : `translateX(${rtl ? -offset : offset}px)`;
    }
  }, [orientation]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = viewport.current;
    const r = root.current;
    if (!v || !r) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      update();
      r.setAttribute('data-scrolling', '');
      clearTimeout(timer);
      timer = setTimeout(() => r.removeAttribute('data-scrolling'), LINGER);
    };
    // The viewport's own size and its children's sizes both change the scroll length.
    const resize = new ResizeObserver(update);
    const watch = () => {
      resize.disconnect();
      resize.observe(v);
      for (const child of Array.from(v.children)) resize.observe(child);
    };
    const mutation = new MutationObserver(() => {
      watch();
      update();
    });
    watch();
    mutation.observe(v, { childList: true });
    v.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      clearTimeout(timer);
      resize.disconnect();
      mutation.disconnect();
      v.removeEventListener('scroll', onScroll);
    };
  }, [update]);

  const onTrackDown = (axis: Axis) => (e: PointerEvent<HTMLDivElement>) => {
    const v = viewport.current;
    const r = root.current;
    const thumb = thumbs[axis].current;
    if (!v || !r || !thumb || e.button !== 0) return;
    e.preventDefault();
    const rtl = getComputedStyle(v).direction === 'rtl' ? -1 : 1;
    const key = axis === 'y' ? 'scrollTop' : 'scrollLeft';

    if (e.target !== thumb) {
      // A press on the track pages towards the pointer.
      const box = thumb.getBoundingClientRect();
      const before = axis === 'y' ? e.clientY < box.top : rtl > 0 ? e.clientX < box.left : e.clientX > box.right;
      const page = (axis === 'y' ? v.clientHeight : v.clientWidth) * (before ? -1 : 1) * (axis === 'x' ? rtl : 1);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      v.scrollBy({ [axis === 'y' ? 'top' : 'left']: page, behavior: reduce ? 'auto' : 'smooth' });
      return;
    }

    // Dragging the thumb moves the content by the same share of its length.
    const track = tracks[axis].current!;
    const start = axis === 'y' ? e.clientY : e.clientX;
    const from = v[key];
    const length = trackLength(axis, track) - (axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth);
    const content = axis === 'y' ? v.scrollHeight - v.clientHeight : v.scrollWidth - v.clientWidth;
    thumb.setPointerCapture(e.pointerId);
    r.setAttribute('data-dragging', '');
    const move = (ev: globalThis.PointerEvent) => {
      const delta = (axis === 'y' ? ev.clientY : ev.clientX) - start;
      v[key] = from + (delta * content) / Math.max(1, length);
    };
    const up = () => {
      r.removeAttribute('data-dragging');
      thumb.removeEventListener('pointermove', move);
      thumb.removeEventListener('pointerup', up);
      thumb.removeEventListener('pointercancel', up);
    };
    thumb.addEventListener('pointermove', move);
    thumb.addEventListener('pointerup', up);
    thumb.addEventListener('pointercancel', up);
  };

  return (
    <div
      ref={setRoot}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      data-scrollbars={scrollbars}
      {...rest}
    >
      <div {...viewportProps} ref={setViewport} className={[styles.viewport, viewportProps?.className].filter(Boolean).join(' ')}>
        {children}
      </div>
      {axes.map((axis) => (
        // The scrollbars are pointer-only; keyboard and assistive tech use the viewport.
        <div key={axis} ref={tracks[axis]} className={styles.scrollbar} data-axis={axis} aria-hidden="true" onPointerDown={onTrackDown(axis)}>
          <div ref={thumbs[axis]} className={styles.thumb} />
        </div>
      ))}
    </div>
  );
});
