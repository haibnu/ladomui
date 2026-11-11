// Ladom UI logo, rebuilt from the "Ladom UI" heading on ladom.co (#prod): the Ladom wordmark in
// Plus Jakarta Sans ExtraBold (converted to a path) and the "keycap" holding ui-letters.svg, drawn as
// a key in the black-and-white isometric style of the landing illustrations.
// Geometry is in that heading's units (48px font): origin at the wordmark's left edge and baseline.
import { useId } from 'react';
import styles from './logo.module.css';

const WORDMARK = 'M25.73 0L3.17 0L3.17-35.76L10.61-35.76L10.61-6.48L25.73-6.48L25.73 0ZM36.05 0.58L36.05 0.58Q33.22 0.58 31.15-0.34Q29.09-1.25 27.98-2.95Q26.88-4.66 26.88-7.01L26.88-7.01Q26.88-9.22 27.89-10.92Q28.90-12.62 30.98-13.78Q33.07-14.93 36.19-15.41L36.19-15.41L43.44-16.56L43.44-17.28Q43.44-18.77 42.26-19.78Q41.09-20.78 39.07-20.78L39.07-20.78Q37.15-20.78 35.69-19.73Q34.22-18.67 33.55-16.94L33.55-16.94L27.79-19.68Q28.56-21.89 30.24-23.47Q31.92-25.06 34.27-25.92Q36.62-26.78 39.41-26.78L39.41-26.78Q42.72-26.78 45.26-25.58Q47.81-24.38 49.22-22.25Q50.64-20.11 50.64-17.28L50.64-17.28L50.64 0L43.92 0L43.92-2.50Q43.49-2.02 43.01-1.68L43.01-1.68Q41.62-0.53 39.89 0.02Q38.16 0.58 36.05 0.58ZM43.44-10.46L43.44-11.28L37.49-10.22Q35.95-9.94 35.14-9.24Q34.32-8.54 34.32-7.25L34.32-7.25Q34.32-6.05 35.23-5.38Q36.14-4.70 37.49-4.70L37.49-4.70Q39.26-4.70 40.61-5.47Q41.95-6.24 42.70-7.56Q43.44-8.88 43.44-10.46L43.44-10.46ZM67.30 0.58L67.30 0.58Q63.46 0.58 60.43-1.25Q57.41-3.07 55.66-6.19Q53.90-9.31 53.90-13.10L53.90-13.10Q53.90-16.94 55.68-20.04Q57.46-23.14 60.48-24.96Q63.50-26.78 67.25-26.78L67.25-26.78Q70.13-26.78 72.38-25.73L72.38-25.73Q73.78-25.01 74.78-24L74.78-24L74.78-36.34L81.98-36.34L81.98 0L75.26 0L75.26-2.50Q74.06-1.15 72.29-0.43L72.29-0.43Q69.98 0.58 67.30 0.58ZM68.16-5.90Q70.13-5.90 71.62-6.82Q73.10-7.73 73.94-9.36Q74.78-10.99 74.78-13.10Q74.78-15.22 73.94-16.85Q73.10-18.48 71.62-19.39Q70.13-20.30 68.16-20.30Q66.19-20.30 64.63-19.37Q63.07-18.43 62.21-16.82Q61.34-15.22 61.34-13.10Q61.34-10.99 62.21-9.36Q63.07-7.73 64.63-6.82Q66.19-5.90 68.16-5.90ZM99.31 0.58L99.31 0.58Q95.42 0.58 92.23-1.20Q89.04-2.98 87.14-6.07Q85.25-9.17 85.25-13.10L85.25-13.10Q85.25-17.09 87.14-20.16Q89.04-23.23 92.23-25.01Q95.42-26.78 99.31-26.78L99.31-26.78Q103.20-26.78 106.37-25.01Q109.54-23.23 111.43-20.16Q113.33-17.09 113.33-13.10L113.33-13.10Q113.33-9.17 111.43-6.07Q109.54-2.98 106.37-1.20Q103.20 0.58 99.31 0.58ZM99.31-5.90L99.31-5.90Q101.28-5.90 102.74-6.82Q104.21-7.73 105.05-9.36Q105.89-10.99 105.89-13.10L105.89-13.10Q105.89-15.22 105.05-16.82Q104.21-18.43 102.74-19.37Q101.28-20.30 99.31-20.30L99.31-20.30Q97.34-20.30 95.86-19.37Q94.37-18.43 93.53-16.82Q92.69-15.22 92.69-13.10L92.69-13.10Q92.69-10.99 93.53-9.36Q94.37-7.73 95.86-6.82Q97.34-5.90 99.31-5.90ZM123.79 0L116.59 0L116.59-26.21L123.31-26.21L123.31-23.04Q124.03-24.48 125.38-25.34L125.38-25.34Q127.58-26.78 130.66-26.78L130.66-26.78Q133.92-26.78 136.42-25.15L136.42-25.15Q137.86-24.14 138.62-22.80L138.62-22.80Q139.68-24.34 141.12-25.25L141.12-25.25Q143.52-26.78 146.74-26.78L146.74-26.78Q149.57-26.78 151.75-25.54Q153.94-24.29 155.18-22.06Q156.43-19.82 156.43-16.85L156.43-16.85L156.43 0L149.23 0L149.23-15.31Q149.23-16.85 148.68-17.95Q148.13-19.06 147.12-19.68Q146.11-20.30 144.67-20.30L144.67-20.30Q143.28-20.30 142.25-19.68Q141.22-19.06 140.66-17.95Q140.11-16.85 140.11-15.31L140.11-15.31L140.11 0L132.91 0L132.91-15.31Q132.91-16.85 132.36-17.95Q131.81-19.06 130.80-19.68Q129.79-20.30 128.35-20.30L128.35-20.30Q126.96-20.30 125.93-19.68Q124.90-19.06 124.34-17.95Q123.79-16.85 123.79-15.31L123.79-15.31L123.79 0Z';
const UI_LETTERS = ["M13.98 11.494c-1.348 0-2.441-1.07-2.441-2.391V0c1.348 0 2.441 1.071 2.441 2.391Z","M4.804 11.679c-.924 0-1.748-.19-2.473-.57-.724-.381-1.297-.9-1.717-1.559C.205 8.882 0 8.126 0 7.282V0c1.348 0 2.441 1.071 2.441 2.391v4.737c0 .453.1.864.299 1.234.211.36.494.643.851.849.357.206.761.308 1.213.308.462 0 .866-.102 1.212-.308.358-.206.636-.489.835-.849.21-.37.315-.781.315-1.234V0c1.349 0 2.442 1.071 2.442 2.391v4.891c0 .844-.211 1.6-.63 2.268-.41.659-.977 1.178-1.701 1.559-.725.38-1.549.57-2.473.57Z"];
// Keycap: 112x88, corners 4px 24px (top-left/bottom-right 4, top-right/bottom-left 24).
const KEY = 'M4 0H88A24 24 0 0 1 112 24V84A4 4 0 0 1 108 88H24A24 24 0 0 1 0 64V4A4 4 0 0 1 4 0Z';
// Depth of the key's side, in the same units, as in the isometric illustrations on the landing page.
const DEPTH = 10;

export function Logo({ title = 'Ladom UI' }: { title?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={styles.logo} viewBox="0 -65.3 289.6 88" role="img" aria-label={title}>
      <defs>
        <clipPath id={`key-${id}`}>
          <path d={KEY} />
        </clipPath>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" className={styles.shineEdge} />
          <stop offset="0.5" className={styles.shineMid} />
          <stop offset="1" className={styles.shineEdge} />
        </linearGradient>
      </defs>
      <path className={styles.word} d={WORDMARK} />
      {/* The keycap as an isometric key: a solid side under a flat top, outlined, no shadows. */}
      <g className={styles.key} transform={`translate(177.59 -65.3) scale(${88 / (88 + DEPTH)})`}>
        <g className={styles.keyPop}>
          {/* The side: the key's outline swept down DEPTH units; each step hides the one above. */}
          {Array.from({ length: DEPTH }, (_, i) => (
            <path key={i} className={styles.keySide} d={KEY} transform={`translate(0 ${i + 1})`} vectorEffect="non-scaling-stroke" />
          ))}
          {/* The face: a button that is pressed into the side on hover, with a shine passing over it. */}
          <g className={styles.keyFace}>
            <path className={styles.keyTop} d={KEY} vectorEffect="non-scaling-stroke" />
            <g clipPath={`url(#key-${id})`}>
              <rect className={styles.shine} x={-70} y={-20} width={44} height={130} fill={`url(#shine-${id})`} />
            </g>
            <g transform="translate(24 16.57) scale(4.5714)">
              <g className={styles.letters}>
                {UI_LETTERS.map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
