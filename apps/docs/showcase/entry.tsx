import { createRoot, type Root } from 'react-dom/client';
import './.generated/tokens.css';
import './showcase.css';
import { Showcase, type Locale } from './Showcase';
import { DEFAULTS, RADII, brandTokens, resolveColor, PRESETS, type Density, type Mode, type Radius, type Settings } from './theme';

// window.LadomShowcase: mounts the showcase into a container and styles it, never the page.
// Everything it sets is on its own root element (.ladomui-showcase) inside that container.

export type MountOptions = Partial<Settings> & {
  /** Language of the sample texts and the calendar. */
  locale?: Locale;
  /** Skip loading showcase.css next to showcase.js (when the page links it itself). */
  css?: boolean;
};

const VERSION = 'v1';
// Three bento canvases at real size, each scaled to the container width: 5 columns, 3 columns and a short
// 2-column one for phones (showcase.css has the matching grids and sizes).
const CANVASES = [
  { layout: 'desktop', min: 1000, width: 1440 },
  { layout: 'tablet', min: 600, width: 960 },
  { layout: 'mobile', min: 0, width: 480 },
] as const;
const ATTRS = { theme: 'data-ladomui-theme', radius: 'data-ladomui-radius', mode: 'data-ladomui-mode', density: 'data-ladomui-density' } as const;

// The script's own address; showcase.css sits beside it.
const SCRIPT = (document.currentScript as HTMLScriptElement | null)?.src;

function loadCss(): Promise<void> {
  if (!SCRIPT) return Promise.resolve();
  const href = SCRIPT.replace(/showcase\.js(\?.*)?$/, 'showcase.css$1');
  const existing = Array.from(document.styleSheets).some((s) => s.href === href) || document.querySelector(`link[href="${href}"]`);
  if (existing) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

export class ShowcaseInstance {
  readonly element: HTMLElement;
  private root: HTMLElement;
  private react: Root;
  private state: Settings = { ...DEFAULTS };
  private observer: MutationObserver;
  private fit: ResizeObserver;
  private onSet = (e: Event) => this.set((e as CustomEvent<Partial<Settings>>).detail ?? {});

  constructor(container: HTMLElement, options: MountOptions = {}) {
    this.element = container;
    this.root = document.createElement('div');
    this.root.className = 'ladomui-showcase';
    container.appendChild(this.root);
    this.react = createRoot(this.root);
    // The bento canvas is picked by container width and scaled to fit it.
    this.fit = new ResizeObserver(() => {
      const w = this.root.clientWidth;
      const c = CANVASES.find((x) => w >= x.min)!;
      this.root.dataset.layout = c.layout;
      this.root.style.setProperty('--ls-scale', String(w / c.width));
    });
    this.fit.observe(this.root);
    this.react.render(<Showcase locale={options.locale ?? (container.getAttribute('data-ladomui-locale') as Locale) ?? 'en'} />);

    // Initial values: options, then the container's data-ladomui-* attributes.
    const fromAttrs: Partial<Settings> = {};
    for (const key of Object.keys(ATTRS) as (keyof Settings)[]) {
      const v = container.getAttribute(ATTRS[key]);
      if (v) (fromAttrs as Record<string, string>)[key] = v;
    }
    this.set({ ...fromAttrs, ...options, css: undefined, locale: undefined } as Partial<Settings>);

    // Static pages can drive it with attributes or an event instead of the API.
    this.observer = new MutationObserver((records) => {
      const next: Partial<Settings> = {};
      for (const r of records) {
        const key = (Object.keys(ATTRS) as (keyof Settings)[]).find((k) => ATTRS[k] === r.attributeName);
        if (key) (next as Record<string, string>)[key] = container.getAttribute(ATTRS[key]) ?? '';
      }
      this.set(next);
    });
    this.observer.observe(container, { attributes: true, attributeFilter: Object.values(ATTRS) });
    container.addEventListener('ladomui:set', this.onSet);
  }

  get(): Settings {
    return { ...this.state };
  }

  /** Any of theme (preset name or #hex), radius, mode, density. Unknown values are ignored. */
  set(next: Partial<Settings>): this {
    const s = this.state;
    if (typeof next.theme === 'string' && resolveColor(next.theme)) s.theme = next.theme.trim().toLowerCase();
    if (next.radius && (RADII as string[]).includes(next.radius)) s.radius = next.radius as Radius;
    if (next.mode === 'light' || next.mode === 'dark') s.mode = next.mode as Mode;
    if (next.density === 'comfort' || next.density === 'narrow') s.density = next.density as Density;
    this.apply();
    return this;
  }

  setTheme(theme: string) {
    return this.set({ theme });
  }
  setRadius(radius: Radius) {
    return this.set({ radius });
  }
  setMode(mode: Mode) {
    return this.set({ mode });
  }
  setDensity(density: Density) {
    return this.set({ density });
  }

  destroy() {
    this.observer.disconnect();
    this.fit.disconnect();
    this.element.removeEventListener('ladomui:set', this.onSet);
    this.react.unmount();
    this.root.remove();
    instances.delete(this.element);
  }

  private apply() {
    const s = this.state;
    const r = this.root;
    r.dataset.theme = s.mode;
    r.dataset.radius = s.radius;
    r.dataset.density = s.density;
    const tokens = brandTokens(resolveColor(s.theme)!, s.mode);
    for (const [name, value] of Object.entries(tokens)) r.style.setProperty(name, value);
    this.element.dispatchEvent(new CustomEvent('ladomui:change', { detail: this.get() }));
  }
}

const instances = new Map<HTMLElement, ShowcaseInstance>();

const resolve = (target: string | HTMLElement): HTMLElement | null => (typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target);

async function mount(target: string | HTMLElement, options: MountOptions = {}): Promise<ShowcaseInstance | null> {
  const el = resolve(target);
  if (!el) return null;
  const existing = instances.get(el);
  if (existing) return existing.set(options);
  if (options.css !== false) await loadCss();
  const instance = new ShowcaseInstance(el, options);
  instances.set(el, instance);
  return instance;
}

// The calls below act on every mounted showcase, or on the one in `target`.
const each = (target: string | HTMLElement | undefined, fn: (i: ShowcaseInstance) => void) => {
  const el = target ? resolve(target) : null;
  if (el) {
    const i = instances.get(el);
    if (i) fn(i);
  } else instances.forEach(fn);
};

const api = {
  version: VERSION,
  presets: { ...PRESETS },
  mount,
  get: (target?: string | HTMLElement) => (target ? instances.get(resolve(target)!)?.get() : [...instances.values()][0]?.get()) ?? null,
  set: (settings: Partial<Settings>, target?: string | HTMLElement) => each(target, (i) => i.set(settings)),
  setTheme: (theme: string, target?: string | HTMLElement) => each(target, (i) => i.setTheme(theme)),
  setRadius: (radius: Radius, target?: string | HTMLElement) => each(target, (i) => i.setRadius(radius)),
  setMode: (mode: Mode, target?: string | HTMLElement) => each(target, (i) => i.setMode(mode)),
  setDensity: (density: Density, target?: string | HTMLElement) => each(target, (i) => i.setDensity(density)),
  destroy: (target?: string | HTMLElement) => each(target, (i) => i.destroy()),
};

declare global {
  interface Window {
    LadomShowcase: typeof api;
  }
}

window.LadomShowcase = api;

// Containers marked data-ladomui-showcase mount themselves once the page is parsed.
const auto = () => document.querySelectorAll<HTMLElement>('[data-ladomui-showcase]').forEach((el) => void mount(el));
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', auto);
else auto();
