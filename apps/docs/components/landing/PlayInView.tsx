'use client';

import { useEffect } from 'react';

// Runs the illustration motion only while an illustration is on screen.
export function PlayInView() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute('data-play', e.isIntersecting)),
      { rootMargin: '0px 0px -10% 0px' },
    );
    document.querySelectorAll('[data-art]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
