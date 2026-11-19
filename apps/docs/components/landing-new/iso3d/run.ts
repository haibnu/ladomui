import * as THREE from 'three';
import { readTokens } from './kit';
import { SCENES, type Built, type IsoLabels, type SceneName } from './scenes';

type Options = { labels: IsoLabels; interactive?: boolean };

/**
 * Renders an isometric scene into a canvas until the returned function is called. It draws only
 * while on screen, shows a still frame under prefers-reduced-motion, and rebuilds itself when the
 * theme or the Customize brand color changes (every color is a token).
 */
export function run(canvas: HTMLCanvasElement, name: SceneName, { labels, interactive = false }: Options) {
  const host = canvas.parentElement ?? canvas;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -4000, 4000);
  camera.position.set(1000, 1000, 1000);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const scene = new THREE.Scene();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let built: Built | null = null;
  let view = { minX: -1, maxX: 1, minY: -1, maxY: 1 };
  let start = performance.now();
  let spread = 0;
  let spreadTarget = 0;
  let tilt = 0;
  let tiltTarget = 0;
  let visible = false;
  let raf = 0;

  const disposeTree = (o: THREE.Object3D) =>
    o.traverse((c) => {
      const m = c as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      mats.forEach((mat) => {
        (mat as THREE.MeshBasicMaterial).map?.dispose();
        mat.dispose();
      });
    });

  // The view box: the scene in its finished (and, for the hero, pulled-apart) state.
  function measure() {
    if (!built) return;
    built.update(built.settle, interactive ? 1 : 0);
    built.root.updateMatrixWorld(true);
    const skip: [THREE.Object3D, THREE.Object3D][] = [];
    built.root.traverse((o) => {
      if (o.userData.noFit && o.parent) skip.push([o, o.parent]);
    });
    skip.forEach(([o, p]) => p.remove(o));
    const box = new THREE.Box3().setFromObject(built.root);
    skip.forEach(([o, p]) => p.add(o));
    const p = new THREE.Vector3();
    view = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) {
          p.set(x, y, z).applyMatrix4(camera.matrixWorldInverse);
          view.minX = Math.min(view.minX, p.x);
          view.maxX = Math.max(view.maxX, p.x);
          view.minY = Math.min(view.minY, p.y);
          view.maxY = Math.max(view.maxY, p.y);
        }
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const bw = view.maxX - view.minX;
    const bh = view.maxY - view.minY;
    const scale = Math.max(bw / width, bh / height) * (interactive ? 1.06 : 1.12);
    const cx = (view.minX + view.maxX) / 2;
    const cy = (view.minY + view.maxY) / 2;
    camera.left = cx - (width * scale) / 2;
    camera.right = cx + (width * scale) / 2;
    camera.top = cy + (height * scale) / 2;
    camera.bottom = cy - (height * scale) / 2;
    camera.updateProjectionMatrix();
    draw();
  }

  function build() {
    if (built) {
      scene.remove(built.root);
      disposeTree(built.root);
    }
    built = SCENES[name](readTokens(host), labels);
    scene.add(built.root);
    measure();
    resize();
  }

  function draw() {
    if (!built) return;
    const t = reduce.matches ? built.settle : (performance.now() - start) / 1000;
    spread += (spreadTarget - spread) * 0.12;
    tilt += (tiltTarget - tilt) * 0.08;
    built.root.rotation.y = tilt;
    built.update(t, reduce.matches ? 0 : spread);
    renderer.render(scene, camera);
  }

  function loop() {
    draw();
    raf = visible && !reduce.matches ? requestAnimationFrame(loop) : 0;
  }
  const wake = () => {
    if (!raf && visible && !reduce.matches) raf = requestAnimationFrame(loop);
    else draw();
  };

  build();

  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    wake();
  });
  io.observe(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  reduce.addEventListener('change', wake);

  // Theme (data-theme on <html>) and the Customize brand color (a <style> in <head>).
  let pending = 0;
  const rebuild = () => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      build();
      wake();
    });
  };
  // Text is painted into textures, so paint again once the web font is in.
  document.fonts?.ready.then(rebuild);
  const mo = new MutationObserver(rebuild);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-density', 'style', 'class'] });
  mo.observe(document.head, { childList: true, subtree: true, characterData: true });

  const onEnter = () => {
    spreadTarget = 1;
    wake();
  };
  const onLeave = () => {
    spreadTarget = 0;
    tiltTarget = 0;
    wake();
  };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    tiltTarget = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
  };
  const onClick = () => {
    start = performance.now();
    wake();
  };
  if (interactive) {
    host.addEventListener('pointerenter', onEnter);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('click', onClick);
  }

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pending);
    io.disconnect();
    ro.disconnect();
    mo.disconnect();
    reduce.removeEventListener('change', wake);
    host.removeEventListener('pointerenter', onEnter);
    host.removeEventListener('pointerleave', onLeave);
    host.removeEventListener('pointermove', onMove);
    host.removeEventListener('click', onClick);
    if (built) disposeTree(built.root);
    renderer.dispose();
  };
}
