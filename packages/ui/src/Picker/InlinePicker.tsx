'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { IconArrowBottom, IconArrowTop } from '@ladom/icons';
import { Cell } from '../Cell/Cell';
import { Dropdown } from '../Dropdown/Dropdown';
import { useUnclipped } from '../Floating/useUnclipped';
import styles from './InlinePicker.module.css';

// The picker inside an Input box (the currency in CurrencyInput, the country in GsmInput): a
// select-only combobox whose list is the Selectbox one, a Dropdown (1145:669) of Cells (87:46114),
// with the Selectbox keyboard: arrows, Home/End, Enter/Space, Escape and type-ahead.
export type InlinePickerOption = {
  value: string;
  /** Shown in the box for the picked option. */
  trigger: ReactNode;
  /** The Cell title. */
  title: ReactNode;
  bodycopy?: ReactNode;
  iconLeft?: ReactNode;
  /** Text matched by type-ahead. */
  search: string;
};

export type InlinePickerProps = {
  value: string;
  options: InlinePickerOption[];
  size: 'medium' | 'small' | undefined;
  disabled?: boolean;
  label: string;
  /** The side of the box the list lines up with. */
  align: 'start' | 'end';
  /** The Figma chevron: 12px in GSM, 16px elsewhere. */
  arrow?: 'small' | 'medium';
  className?: string;
  onPick: (value: string) => void;
  onDone: () => void;
};

export function InlinePicker({ value, options, size, disabled, label, align, arrow = 'medium', className, onPick, onDone }: InlinePickerProps) {
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-option-${i}`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useUnclipped(panel, open);
  const index = (v: string) => options.findIndex((o) => o.value === v);
  const selected = options[index(value)];

  const show = () => {
    if (disabled) return;
    setOpen(true);
    setActive(Math.max(0, index(value)));
  };
  const hide = (focus = true) => {
    setOpen(false);
    if (focus) trigger.current?.focus();
  };
  const pick = (option: InlinePickerOption | undefined) => {
    if (!option) return;
    onPick(option.value);
    setOpen(false);
    onDone();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) hide(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, Math.max(0, a + (key === 'ArrowDown' ? 1 : -1))));
    } else if (key === 'Home' || key === 'End') {
      e.preventDefault();
      setActive(key === 'Home' ? 0 : options.length - 1);
    } else if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      pick(options[active]);
    } else if (key === 'Escape') {
      e.preventDefault();
      hide();
    } else if (key === 'Tab') {
      hide(false);
    } else if (/^\p{L}$/u.test(key)) {
      const from = active + 1;
      const order = [...options.slice(from), ...options.slice(0, from)];
      const hit = order.find((o) => o.search.toLocaleLowerCase().startsWith(key.toLocaleLowerCase()));
      if (hit) setActive(options.indexOf(hit));
    }
  };

  const Arrow = open ? IconArrowTop : IconArrowBottom;
  return (
    <span ref={root} className={[styles.picker, className].filter(Boolean).join(' ')}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        className={styles.trigger}
        data-arrow={arrow}
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        onClick={(e) => {
          e.stopPropagation();
          if (open) hide();
          else show();
        }}
        onKeyDown={onKeyDown}
      >
        {selected?.trigger ?? value}
        <Arrow aria-hidden="true" className={styles.arrow} />
      </button>
      {open && (
        <Dropdown ref={panel} className={styles.dropdown} data-align={align}>
          <div id={listId} role="listbox" aria-label={label} className={styles.list}>
            {options.map((option, i) => (
              <Cell
                key={option.value}
                id={optionId(i)}
                role="option"
                size={size === 'small' ? 'small' : 'medium'}
                selected={option.value === value}
                aria-selected={option.value === value}
                data-active={i === active || undefined}
                iconLeft={option.iconLeft}
                bodycopy={option.bodycopy}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(option)}
              >
                {option.title}
              </Cell>
            ))}
          </div>
        </Dropdown>
      )}
    </span>
  );
}
