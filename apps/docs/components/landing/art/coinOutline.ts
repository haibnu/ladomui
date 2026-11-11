// The Ladom coin behind the call-to-action button, drawn in outline: the coin's rim and the two parts
// of its L mark as 1.5px ink lines on white, in the line style of the isometric drawings. Geometry is
// the Figma coin's (figma.ts `logo`), without its gradient and inner shadow.
const INK = '#1C1A09';
const STEM =
  'M19.7748 12.4658C15.8857 12.4658 12.7329 15.6186 12.7329 19.5077V31.3107C12.7329 32.0408 13.5158 32.5037 14.1556 32.1518L18.2548 29.8972C19.4819 29.2223 20.2443 27.933 20.2443 26.5326V12.9353C20.2443 12.676 20.0341 12.4658 19.7748 12.4658Z';
const FOOT =
  'M35.2671 34.061C35.2671 30.4311 32.3245 27.4885 28.6946 27.4885H28.6119C27.8041 27.4885 27.0095 27.6944 26.3034 28.0867L17.0982 33.2007C16.2323 33.6818 16.5738 34.9999 17.5644 34.9999H34.3282C34.8467 34.9999 35.2671 34.5795 35.2671 34.061Z';

const line = (d: string) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;

export const coinOutline = `<svg viewBox="-1 -1 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#fff" stroke="${INK}" stroke-width="1.5" vector-effect="non-scaling-stroke"/><circle cx="24" cy="24" r="21" fill="none" stroke="${INK}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>${line(STEM)}${line(FOOT)}</svg>`;
