'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Uploader, type UploaderFile } from '@ladom/ui';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { ControlCheck, ControlSelect } from '@/components/docs/Controls';
import { useView } from '@/components/docs/ViewSwitch';
import styles from '@/components/docs/docs.module.css';
import { useLocale } from '@/components/useLocale';

type State = 'default' | 'hover' | 'pressed' | 'drag';
const COPY = {
  en: {
    direction: 'Direction', state: 'State', error: 'Error', disabled: 'Disabled', multiple: 'Multiple', figma: 'Figma variant', code: 'Code', reset: 'Clear files',
    title: { horizontal: 'Drag files here', vertical: 'Drag & Drop files here' }, or: 'or', browse: 'Select', drop: 'Drop file now', hint: 'Maximum allowed size is 100 MB', remove: 'Remove',
  },
  tr: {
    direction: 'Yön', state: 'Durum', error: 'Hata', disabled: 'Pasif', multiple: 'Çoklu', figma: 'Figma varyantı', code: 'Kod', reset: 'Dosyaları temizle',
    title: { horizontal: 'Dosyaları buraya sürükleyin', vertical: 'Dosyaları sürükleyip bırakın' }, or: 'ya da', browse: 'Seç', drop: 'Dosyayı bırakın', hint: 'İzin verilen en büyük boyut 100 MB', remove: 'Kaldır',
  },
};

export function UploaderPlayground() {
  const { lang } = useLocale();
  const { view } = useView();
  const c = COPY[lang];
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('vertical');
  const [state, setState] = useState<State>('default');
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [multiple, setMultiple] = useState(true);
  const [files, setFiles] = useState<UploaderFile[]>([]);
  const [progress, setProgress] = useState<number | undefined>();
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  // Simulates an upload: the bar fills, then the files are listed.
  const onFiles = (picked: File[]) => {
    clearInterval(timer.current);
    setProgress(0);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = (p ?? 0) + 20;
        if (next < 100) return next;
        clearInterval(timer.current);
        setFiles((f) => [
          ...f,
          ...picked.map((file) => ({ id: `${file.name}-${file.lastModified}`, name: file.name, size: file.size, preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined })),
        ]);
        return undefined;
      });
    }, 250);
  };

  const props = [
    direction !== 'horizontal' && `direction="${direction}"`,
    multiple && 'multiple',
    error && 'error',
    disabled && 'disabled',
    direction === 'vertical' && `hint="${c.hint}"`,
    'files={files}',
    'progress={progress}',
    'onFiles={upload}',
    'onRemove={remove}',
  ].filter(Boolean);
  const code = `import { Uploader } from '@ladom/ui';\n\n<Uploader${props.map((p) => `\n  ${p}`).join('')}\n/>`;
  const figmaState = progress != null ? 'Loading' : files.length ? 'Loaded' : { default: 'Default', hover: 'Hover', pressed: 'Pressed', drag: 'Drag Hover' }[state];
  const figma = `✈️ Direction=${direction === 'vertical' ? 'Vertical' : 'Horizontal'}\n🕹 State=${figmaState}\nDisable=${disabled ? 'True' : 'False'}\nError=${error ? 'True' : 'False'}`;

  return (
    <div className={styles.playground}>
      <div className={styles.stage}>
        <div style={{ inlineSize: direction === 'vertical' ? 280 : 360 }}>
          <Uploader
            direction={direction}
            multiple={multiple}
            error={error}
            disabled={disabled}
            files={files}
            progress={progress}
            onFiles={onFiles}
            onRemove={(f) => setFiles(files.filter((x) => x !== f))}
            data-state={state === 'default' ? undefined : state}
            title={files.length ? c.title.horizontal : c.title[direction]}
            orText={c.or}
            browseLabel={c.browse}
            dropText={c.drop}
            removeLabel={c.remove}
            hint={direction === 'vertical' ? c.hint : undefined}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <ControlSelect label={c.direction} value={direction} options={['horizontal', 'vertical'] as const} onChange={setDirection} />
        <ControlSelect label={c.state} value={state} options={['default', 'hover', 'pressed', 'drag'] as const} onChange={setState} />
        {(
          [
            [c.error, error, setError],
            [c.disabled, disabled, setDisabled],
            [c.multiple, multiple, setMultiple],
          ] as [string, boolean, (v: boolean) => void][]
        ).map(([label, v, set]) => <ControlCheck key={label} label={label} checked={v} onChange={set} />)}
        <Button variant="ghost" tone="secondary" size="small" onClick={() => setFiles([])} disabled={!files.length}>
          {c.reset}
        </Button>
      </div>
      <div className={styles.output}>
        <p className={styles.outputTitle}>{view === 'designer' ? c.figma : c.code}</p>
        <CodeBlock code={view === 'designer' ? figma : code} />
      </div>
    </div>
  );
}
