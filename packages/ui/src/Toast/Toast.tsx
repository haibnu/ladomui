'use client';

import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { IconClose, IconInfo } from '@ladom/icons';
import { Button } from '../Button/Button';
import styles from './Toast.module.css';

// Figma: Molecules / Toast (node 2110:46469). tone = Style (Information -> info; Style=Icon is
// any icon), device = Device (Mobile is the dark, hugging toast), description = Description,
// actions = CTA Buttons, onClose = Close Button. ToastProvider and useToast show toasts in a
// stack at the bottom of the screen.
export type ToastTone = 'default' | 'info' | 'success' | 'error' | 'warning';

export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tone?: ToastTone;
  device?: 'desktop' | 'mobile';
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Icon element; info by default (Style=Icon takes any icon or emoji). */
  icon?: ReactNode;
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { tone = 'default', device = 'desktop', title, description, actions, onClose, closeLabel = 'Close', icon, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={[styles.toast, className].filter(Boolean).join(' ')} data-tone={tone} data-device={device} {...rest}>
      <span className={styles.icon} aria-hidden="true">
        {icon ?? <IconInfo />}
      </span>
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        {description != null && <span className={styles.description}>{description}</span>}
        {actions != null && <div className={styles.actions}>{actions}</div>}
      </div>
      {onClose && (
        <span className={styles.close}>
          <Button variant="ghost" tone="tertiary" size="small" icon={IconClose} aria-label={closeLabel} onClick={onClose} />
        </span>
      )}
    </div>
  );
});

export type ToastOptions = Omit<ToastProps, 'onClose'> & {
  /** Milliseconds before it closes itself; 0 keeps it until closed. */
  duration?: number;
};

type Entry = ToastOptions & { toastId: number };
type ToastApi = { toast: (options: ToastOptions) => number; dismiss: (id: number) => void };

const ToastContext = createContext<ToastApi | null>(null);

/** The ToastProvider's API, or null when there is none above (for components that bring their own). */
export function useOptionalToast() {
  return useContext(ToastContext);
}

/** Returns toast(options) and dismiss(id). Needs a ToastProvider above. */
export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast needs a <ToastProvider> above it.');
  return api;
}

export function ToastProvider({ children, closeLabel = 'Close' }: { children: ReactNode; closeLabel?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const next = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setEntries((all) => all.filter((e) => e.toastId !== id));
  }, []);

  const toast = useCallback(
    ({ duration = 5000, ...options }: ToastOptions) => {
      const id = next.current++;
      setEntries((all) => [...all, { ...options, toastId: id }]);
      if (duration > 0) timers.current.set(id, setTimeout(() => dismiss(id), duration));
      return id;
    },
    [dismiss],
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Errors are announced right away; the rest politely. */}
      <div className={styles.stack} role="region" aria-label="Notifications">
        {entries.map(({ toastId, duration: _d, ...e }) => (
          <Toast key={toastId} {...e} role={e.tone === 'error' ? 'alert' : 'status'} closeLabel={e.closeLabel ?? closeLabel} onClose={() => dismiss(toastId)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
