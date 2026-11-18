'use client';

import { useLayoutEffect, type RefObject } from 'react';
import floating from './floating.module.css';

const pinned = floating.pinned ?? '';

// Places an open panel that its CSS puts next to an anchor (the panel's offset parent).
//
// flip: a dropdown opens under its anchor. When it does not fit below in the visible area (the viewport,
// cut by any ancestor with overflow other than visible) and there is
// more room above (or it fits there), it gets data-flip and its CSS puts it above the anchor, the
// same gap away. Checked again on every scroll and resize, starting from the place below each time.
//
// Inside a <dialog> (Modal, Drawer) the body scrolls, so a panel placed with position: absolute
// next to its anchor would be cut off at the body's edge. The same holds inside any element marked
// data-unclip (a scrolling side menu, for example). There the panel is measured where its CSS
// puts it and pinned to that spot with position: fixed, which no scroll container clips. It is
// measured again on every scroll and resize, so it stays next to its anchor. Dialogs sit in the
// top layer without a transform, so fixed means the viewport; a data-unclip element must not sit
// inside a transform either.
export function useUnclipped(ref: RefObject<HTMLElement | null>, open: boolean, { flip = false }: { flip?: boolean } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!open || !el) return;
    const pin = !!el.parentElement?.closest('dialog, [data-unclip]');
    if (!pin && !flip) return;
    const place = () => {
      el.classList.remove(pinned);
      if (flip) {
        el.removeAttribute('data-flip');
        const box = el.offsetParent ?? el.parentElement;
        const anchor = box?.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        // The visible band: the viewport, cut by every ancestor that clips (a pinned panel
        // escapes them, so there only the viewport counts).
        let top = 0;
        let bottom = window.innerHeight;
        for (let n = pin ? null : box?.parentElement; n && n !== document.body; n = n.parentElement) {
          if (getComputedStyle(n).overflowY === 'visible') continue;
          const c = n.getBoundingClientRect();
          top = Math.max(top, c.top);
          bottom = Math.min(bottom, c.bottom);
        }
        if (anchor && r.bottom > bottom) {
          const gap = r.top - anchor.bottom;
          const fitsAbove = anchor.top - gap - r.height >= top;
          if (fitsAbove || anchor.top - top > bottom - anchor.bottom) el.setAttribute('data-flip', '');
        }
      }
      if (!pin) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--_pin-top', `${r.top}px`);
      el.style.setProperty('--_pin-left', `${r.left}px`);
      el.style.setProperty('--_pin-width', `${r.width}px`);
      el.classList.add(pinned);
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      el.classList.remove(pinned);
      el.removeAttribute('data-flip');
    };
  }, [open, ref, flip]);
}
