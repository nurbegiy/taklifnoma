export default function FloralCorner({ color = '#c9a86a', className = '' }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g stroke={color} strokeWidth="1.1" opacity="0.9">
        <path d="M6 154C6 100 40 40 100 12" />
        <ellipse cx="34" cy="120" rx="22" ry="34" transform="rotate(-28 34 120)" />
        <ellipse cx="58" cy="88" rx="18" ry="28" transform="rotate(-10 58 88)" />
        <ellipse cx="86" cy="56" rx="16" ry="24" transform="rotate(14 86 56)" />
        <ellipse cx="114" cy="30" rx="13" ry="20" transform="rotate(30 114 30)" />
      </g>
    </svg>
  );
}
