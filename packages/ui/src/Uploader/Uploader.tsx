'use client';

import { useId, useRef, useState, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import { IconClose, IconError, IconFile, IconFileUpload } from '@ladom/icons';
import { Button } from '../Button/Button';
import { Loader } from '../Loader/Loader';
import styles from './Uploader.module.css';

// Figma: Components / Uploader (node 4046:12986). direction = ✈️ Direction, error = Error,
// disabled = Disable. 🕹 State: Hover and Pressed are :hover and :active, Drag Hover is a file
// dragged over it, Loading is progress, Loaded is a non-empty files list.
// The uploader only collects files (onFiles); uploading them is up to you.
export type UploaderFile = {
  /** Stable key; the name when omitted. */
  id?: string;
  name: string;
  /** Size in bytes, or a ready text. */
  size?: number | string;
  /** Thumbnail URL (e.g. URL.createObjectURL(file)). */
  preview?: string;
};

export type UploaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'onDrop'> & {
  direction?: 'horizontal' | 'vertical';
  /** Called with the picked or dropped files. */
  onFiles?: (files: File[]) => void;
  /** Files to list (Loaded). */
  files?: UploaderFile[];
  onRemove?: (file: UploaderFile) => void;
  /** Upload progress from 0 to 100; shows the Loading state. */
  progress?: number;
  /** Text under the progress bar in Vertical, e.g. "45 Mb / 98 Mb". */
  progressText?: ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  /** Input name for forms. */
  name?: string;
  /** Texts. */
  title?: ReactNode;
  orText?: ReactNode;
  /** Label of the browse button (the icon-only button's name in the compact zone). */
  browseLabel?: string;
  dropText?: ReactNode;
  /** Limits shown under the button in Vertical. */
  hint?: ReactNode;
  removeLabel?: string;
  /** Shows a state without interaction (docs, visual tests). */
  'data-state'?: 'hover' | 'pressed' | 'drag';
};

const units = ['B', 'Kb', 'Mb', 'Gb'];
export const formatFileSize = (bytes: number) => {
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? size : size.toFixed(1)} ${units[unit]}`;
};

export function Uploader({
  direction = 'horizontal',
  onFiles,
  files = [],
  onRemove,
  progress,
  progressText,
  accept,
  multiple = false,
  disabled = false,
  error = false,
  name,
  title,
  orText = 'or',
  browseLabel = 'Select',
  dropText = 'Drop file now',
  hint,
  removeLabel = 'Remove',
  className,
  'data-state': forcedState,
  ...rest
}: UploaderProps) {
  const input = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  const vertical = direction === 'vertical';
  const loading = progress != null;
  const drag = (dragging || forcedState === 'drag') && !disabled;

  const take = (list: FileList | null) => {
    if (!list || disabled) return;
    const picked = Array.from(list);
    if (picked.length) onFiles?.(multiple ? picked : picked.slice(0, 1));
  };
  const onDragOver = (e: DragEvent) => {
    if (disabled || !e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    setDragging(true);
  };

  const zone = (compact: boolean) => (
    <div
      className={styles.zone}
      data-compact={compact || undefined}
      onClick={(e) => {
        // A press anywhere on the zone opens the file dialog, like the Browse button.
        if (!disabled && e.target === e.currentTarget) input.current?.click();
      }}
    >
      {drag ? (
        <span className={styles.drop}>{dropText}</span>
      ) : loading ? (
        <Loader variant="finite" value={progress} valueText={vertical && progressText == null ? `${Math.round(progress)}%` : undefined} loaded={vertical ? progressText : undefined} className={styles.loader} />
      ) : (
        <span className={styles.prompt}>
          <span className={styles.title}>{title ?? (compact ? 'Drag files here' : 'Drag & Drop files here')}</span>
          <span className={styles.or}>{orText}</span>
          {compact ? (
            <Button variant="ghost" tone="tertiary" size="small" icon={IconFileUpload} aria-label={browseLabel} disabled={disabled} onClick={() => input.current?.click()} />
          ) : (
            <Button
              tone="tertiary"
              iconLeft={IconFileUpload}
              disabled={disabled}
              onClick={() => input.current?.click()}
              aria-describedby={hint != null ? `${inputId}-hint` : undefined}
            >
              {browseLabel}
            </Button>
          )}
          {error && compact && <IconError className={styles.errorIcon} aria-hidden="true" />}
          {hint != null && !compact && (
            <span id={`${inputId}-hint`} className={styles.hint}>
              {hint}
            </span>
          )}
        </span>
      )}
    </div>
  );

  return (
    <div
      className={[styles.uploader, className].filter(Boolean).join(' ')}
      data-direction={direction}
      data-error={error || undefined}
      data-disabled={disabled || undefined}
      data-drag={drag || undefined}
      data-state={forcedState}
      onDragOver={onDragOver}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
      }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragging(false);
        take(e.dataTransfer.files);
      }}
      {...rest}
    >
      {files.length > 0 && (
        <ul className={styles.files}>
          {files.map((f) => (
            <li key={f.id ?? f.name} className={styles.file}>
              <span className={styles.thumb}>{f.preview ? <img src={f.preview} alt="" /> : <IconFile aria-hidden="true" />}</span>
              <span className={styles.meta}>
                <span className={styles.name}>{f.name}</span>
                {f.size != null && <span className={styles.size}>{typeof f.size === 'number' ? formatFileSize(f.size) : f.size}</span>}
              </span>
              {onRemove && <Button variant="ghost" size="small" icon={IconClose} aria-label={`${removeLabel} ${f.name}`} onClick={() => onRemove(f)} disabled={disabled} />}
            </li>
          ))}
        </ul>
      )}
      {zone(!vertical || files.length > 0)}
      <input
        ref={input}
        id={inputId}
        type="file"
        className={styles.input}
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
