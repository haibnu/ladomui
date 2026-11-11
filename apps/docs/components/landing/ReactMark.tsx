// The React logo (atom), for the "Install for React" button.
export function ReactMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-11.5 -10.23 23 20.46" aria-hidden>
      <circle r="2.05" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}
