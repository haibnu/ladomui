'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { IconArrowBottom, IconArrowTop, IconError, IconSearch } from '@ladom/icons';
import { Badge } from '../Badge/Badge';
import { Cell, CellSearch } from '../Cell/Cell';
import { EmptyState } from '../EmptyState/EmptyState';
import { Chip } from '../Chip/Chip';
import { Dropdown } from '../Dropdown/Dropdown';
import { useFieldContext } from '../FormField/FormField';
import { Input } from '../Input/Input';
import styles from './Selectbox.module.css';

// Figma: Components / Selectbox (node 1163:3) with its Dropdown (1145:669) of Cells (87:46114).
// size = 👕 Size, fluid = Fluid, error = Error, disabled = Disable, innerLabel = 🎛 Type=Inner Label,
// multiple = Type=Multiselect (count badge) or, with display="chips", Type=Chip.
// 🕹 State: Hover is :hover, Focus is keyboard focus, Active is the open list, Typed a value.
// Keyboard follows the WAI-ARIA select-only combobox: arrows, Home/End, Enter/Space, Escape and
// type-ahead.
export type SelectboxSize = 'large' | 'medium' | 'small' | 'tiny';

export type SelectboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /** Extra Cell content in the list. */
  iconLeft?: ReactNode;
  avatar?: ReactNode;
  subtitle?: ReactNode;
  bodycopy?: ReactNode;
};

type Common = {
  options: SelectboxOption[];
  size?: SelectboxSize;
  /** Full width (true) or as wide as its content (false). */
  fluid?: boolean;
  placeholder?: string;
  /** Label drawn inside the box (Medium in Figma). */
  innerLabel?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** Adds a search field at the top of the list that filters the options. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown in the list when the search matches nothing (a small EmptyState). */
  noResultsLabel?: string;
  /** Form field name; the value is submitted through hidden inputs. */
  name?: string;
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'focus' | 'active' | 'typed';
};

export type SelectboxProps = Common &
  (
    | { multiple?: false; display?: never; value?: string | null; defaultValue?: string | null; onChange?: (value: string) => void }
    | {
        multiple: true;
        /** How the chosen options show in the box: a count badge or chips. */
        display?: 'count' | 'chips';
        value?: string[];
        defaultValue?: string[];
        onChange?: (value: string[]) => void;
      }
  );

export function Selectbox(props: SelectboxProps) {
  const {
    options,
    size = 'medium',
    fluid = true,
    placeholder = 'Select',
    innerLabel,
    error,
    disabled = false,
    searchable = false,
    searchPlaceholder = 'Search',
    noResultsLabel = 'No results',
    name,
    id,
    className,
    'aria-label': ariaLabel,
    'aria-describedby': describedBy,
    'data-state': forcedState,
  } = props;
  const multiple = props.multiple === true;
  const field = useFieldContext();
  const invalid = error ?? field?.invalid ?? false;
  const uid = useId();
  const listId = `${uid}-list`;
  const optionId = (i: number) => `${uid}-option-${i}`;

  const toArray = (v: string | string[] | null | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);
  const [inner, setInner] = useState<string[]>(() => toArray(props.defaultValue));
  const selected = props.value !== undefined ? toArray(props.value) : inner;
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const visible = useMemo(
    () => (query ? options.filter((o) => o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : options),
    [options, query],
  );
  const chosen = options.filter((o) => selected.includes(o.value));

  const commit = (next: string[]) => {
    if (props.value === undefined) setInner(next);
    if (props.multiple) props.onChange?.(next);
    else props.onChange?.(next[0] ?? '');
  };

  const show = (index?: number) => {
    if (disabled) return;
    setOpen(true);
    const first = visible.findIndex((o) => !o.disabled);
    const current = visible.findIndex((o) => selected.includes(o.value));
    setActive(index ?? (current >= 0 ? current : first));
  };

  const hide = (focusTrigger = true) => {
    setOpen(false);
    setQuery('');
    if (focusTrigger) trigger.current?.focus();
  };

  const pick = (option: SelectboxOption | undefined) => {
    if (!option || option.disabled) return;
    if (multiple) {
      commit(selected.includes(option.value) ? selected.filter((v) => v !== option.value) : [...selected, option.value]);
    } else {
      commit([option.value]);
      hide();
    }
  };

  const move = (from: number, step: 1 | -1) => {
    for (let i = from + step; i >= 0 && i < visible.length; i += step) if (!visible[i]!.disabled) return i;
    return from;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    const key = e.key;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
        e.preventDefault();
        show();
      } else if (key.length === 1 && !searchable) {
        typeAhead(key, true);
      }
      return;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => move(a, key === 'ArrowDown' ? 1 : -1));
    } else if (key === 'Home' || key === 'End') {
      e.preventDefault();
      setActive(key === 'Home' ? move(-1, 1) : move(visible.length, -1));
    } else if (key === 'Enter' || (key === ' ' && e.currentTarget === trigger.current)) {
      e.preventDefault();
      pick(visible[active]);
    } else if (key === 'Escape') {
      e.preventDefault();
      hide();
    } else if (key === 'Tab') {
      hide(false);
    } else if (key.length === 1 && e.currentTarget === trigger.current) {
      typeAhead(key, false);
    }
  };

  // Jumps to the next option starting with the typed letters; while closed it selects it (single).
  const typeAhead = (char: string, select: boolean) => {
    const now = Date.now();
    typed.current = { text: now - typed.current.at < 500 ? typed.current.text + char : char, at: now };
    const text = typed.current.text.toLocaleLowerCase();
    const start = active + (text.length === 1 ? 1 : 0);
    const order = [...visible.slice(start), ...visible.slice(0, start)];
    const hit = order.find((o) => !o.disabled && o.label.toLocaleLowerCase().startsWith(text));
    if (!hit) return;
    if (select && !multiple) commit([hit.value]);
    else setActive(visible.indexOf(hit));
  };

  // Close on a pointer press outside.
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

  const hasValue = chosen.length > 0;
  const floated = innerLabel != null && (open || focused || hasValue || invalid || disabled || forcedState === 'focus' || forcedState === 'active' || forcedState === 'typed');
  const isOpen = open || forcedState === 'active';
  const Arrow = isOpen ? IconArrowTop : IconArrowBottom;
  const cellSize = size === 'small' || size === 'tiny' ? 'small' : 'medium';

  let display: ReactNode;
  if (!hasValue) {
    display = <span className={styles.placeholder}>{innerLabel != null && !floated ? innerLabel : placeholder}</span>;
  } else if (multiple && props.display === 'chips') {
    display = (
      <span className={styles.chips}>
        {chosen.map((o) => (
          <Chip key={o.value} size="tiny">
            {o.label}
          </Chip>
        ))}
      </span>
    );
  } else if (multiple) {
    display = (
      <>
        <Badge size="micro" tone="primary" filled>
          {chosen.length}
        </Badge>
        <span className={styles.value}>{chosen.map((o) => o.label).join(', ')}</span>
      </>
    );
  } else {
    display = <span className={styles.value}>{chosen[0]!.label}</span>;
  }

  return (
    <div
      ref={root}
      className={[styles.selectbox, className].filter(Boolean).join(' ')}
      data-fluid={fluid || undefined}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setFocused(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        id={id ?? field?.id}
        role="combobox"
        className={styles.box}
        data-size={size}
        data-inner={innerLabel != null ? (floated ? 'floated' : 'resting') : undefined}
        data-open={isOpen || undefined}
        data-typed={hasValue || undefined}
        data-compact={(multiple && hasValue) || undefined}
        data-error={invalid || undefined}
        data-state={forcedState}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel == null && innerLabel != null ? `${uid}-label${hasValue ? ` ${uid}-value` : ""}` : undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && !searchable && active >= 0 ? optionId(active) : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={[describedBy, field?.describedBy].filter(Boolean).join(' ') || undefined}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onKeyDown}
      >
        <span className={styles.texts}>
          {innerLabel != null && (
            <span id={`${uid}-label`} className={floated ? styles.innerLabel : styles.visuallyHidden}>
              {innerLabel}
            </span>
          )}
          <span id={`${uid}-value`} className={styles.display}>
            {display}
          </span>
        </span>
        {invalid && <IconError className={styles.errorIcon} aria-hidden="true" />}
        <Arrow className={styles.arrow} aria-hidden="true" />
      </button>
      {open && (
        <Dropdown className={styles.dropdown}>
          {searchable && (
            <CellSearch>
              <Input
                type="search"
                size="small"
                autoFocus
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-label={searchPlaceholder}
                aria-expanded
                aria-controls={listId}
                aria-activedescendant={active >= 0 ? optionId(active) : undefined}
              />
            </CellSearch>
          )}
          <div ref={list} id={listId} role="listbox" aria-multiselectable={multiple || undefined} className={styles.list}>
            {visible.map((o, i) => (
              <Cell
                key={o.value}
                id={optionId(i)}
                role="option"
                size={cellSize}
                control={multiple ? 'checkbox' : undefined}
                selected={selected.includes(o.value)}
                aria-selected={selected.includes(o.value)}
                aria-disabled={o.disabled || undefined}
                data-active={i === active || undefined}
                iconLeft={o.iconLeft}
                avatar={o.avatar}
                subtitle={o.subtitle}
                bodycopy={o.bodycopy}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => !o.disabled && setActive(i)}
                onClick={() => pick(o)}
              >
                {o.label}
              </Cell>
            ))}
          </div>
          {visible.length === 0 && <EmptyState size="small" icon={<IconSearch />} title={noResultsLabel} role="status" />}
        </Dropdown>
      )}
      {name != null && (selected.length ? selected : ['']).map((v, i) => <input key={i} type="hidden" name={name} value={v} />)}
    </div>
  );
}
