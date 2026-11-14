'use client';

import { useEffect, useRef } from 'react';
import type { IsoLabels, SceneName } from './iso3d/scenes';

/** A three.js isometric scene; three.js loads only on the client, after the page. */
export function IsoCanvas({ scene, labels = {}, interactive = false, className }: { scene: SceneName; labels?: IsoLabels; interactive?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const key = JSON.stringify(labels);
  useEffect(() => {
    let stop = () => {};
    let cancelled = false;
    import('./iso3d/run').then(({ run }) => {
      if (!cancelled && ref.current) stop = run(ref.current, scene, { labels: JSON.parse(key), interactive });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, [scene, key, interactive]);
  return (
    <div className={className} aria-hidden>
      <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
