'use client';

import { useEffect, type RefObject } from 'react';

// Drag and throw: the element follows the pointer, keeps its momentum when released and bounces
// off the edges of `zoneSelector`'s closest ancestor. Moves with `translate`, so animations on
// the element's children keep running. `onGrab` fires on the first grab.
export function useThrow(ref: RefObject<HTMLElement | null>, zoneSelector: string, onGrab?: () => void) {
  useEffect(() => {
    const el = ref.current;
    const zone = el?.closest(zoneSelector);
    if (!el || !zone) return;
    let tx = 0, ty = 0, vx = 0, vy = 0, lx = 0, ly = 0, lt = 0, drag = false, raf = 0;

    const limits = () => {
      const z = zone.getBoundingClientRect(), r = el.getBoundingClientRect();
      const x0 = r.left - tx, y0 = r.top - ty;
      return { minX: z.left - x0, maxX: z.right - x0 - r.width, minY: z.top - y0, maxY: z.bottom - y0 - r.height };
    };
    const place = () => { el.style.translate = `${tx}px ${ty}px`; };
    const step = () => {
      const L = limits();
      vx *= 0.95; vy *= 0.95;
      tx += vx; ty += vy;
      if (tx < L.minX) { tx = L.minX; vx = -vx * 0.6; }
      if (tx > L.maxX) { tx = L.maxX; vx = -vx * 0.6; }
      if (ty < L.minY) { ty = L.minY; vy = -vy * 0.6; }
      if (ty > L.maxY) { ty = L.maxY; vy = -vy * 0.6; }
      place();
      raf = Math.hypot(vx, vy) > 0.1 ? requestAnimationFrame(step) : 0;
    };
    const down = (e: PointerEvent) => {
      drag = true;
      el.setPointerCapture(e.pointerId);
      onGrab?.();
      lx = e.clientX; ly = e.clientY; lt = performance.now();
      vx = vy = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const now = performance.now(), dt = Math.max(1, now - lt) / 16.7;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      const L = limits();
      tx = Math.min(Math.max(tx + dx, L.minX), L.maxX);
      ty = Math.min(Math.max(ty + dy, L.minY), L.maxY);
      vx = dx / dt; vy = dy / dt;
      lx = e.clientX; ly = e.clientY; lt = now;
      place();
    };
    const up = () => {
      if (!drag) return;
      drag = false;
      vx = Math.max(-60, Math.min(60, vx));
      vy = Math.max(-60, Math.min(60, vy));
      raf = requestAnimationFrame(step);
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [ref, zoneSelector, onGrab]);
}
