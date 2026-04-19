interface PhotoPlaceholderProps {
  seed?: number;
  label?: string;
}

export default function PhotoPlaceholder({ seed = 0, label }: PhotoPlaceholderProps) {
  const hues = [42, 210, 12, 160, 260, 90, 340, 24];
  const h1 = hues[seed % hues.length];
  const h2 = hues[(seed + 3) % hues.length];
  return (
    <svg viewBox="0 0 400 380" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id={`g${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${h1}, 35%, 78%)`} />
          <stop offset="100%" stopColor={`hsl(${h2}, 28%, 62%)`} />
        </linearGradient>
        <pattern id={`s${seed}`} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform={`rotate(${30 + seed * 7})`}>
          <rect width="24" height="24" fill="transparent" />
          <rect width="12" height="24" fill="rgba(255,255,255,0.08)" />
        </pattern>
      </defs>
      <rect width="400" height="380" fill={`url(#g${seed})`} />
      <rect width="400" height="380" fill={`url(#s${seed})`} />
      <g opacity="0.22" fill="rgba(20,18,14,0.7)">
        <rect x="80" y="200" width="90" height="140" />
        <rect x="180" y="160" width="70" height="180" />
        <rect x="260" y="220" width="80" height="120" />
        <polygon points="80,200 125,160 170,200" />
        <polygon points="180,160 215,130 250,160" />
        <polygon points="260,220 300,185 340,220" />
        <rect x="95" y="230" width="16" height="22" fill="rgba(255,255,255,0.5)" />
        <rect x="125" y="230" width="16" height="22" fill="rgba(255,255,255,0.5)" />
        <rect x="195" y="200" width="14" height="20" fill="rgba(255,255,255,0.5)" />
        <rect x="220" y="200" width="14" height="20" fill="rgba(255,255,255,0.5)" />
        <rect x="275" y="245" width="14" height="20" fill="rgba(255,255,255,0.5)" />
        <rect x="305" y="245" width="14" height="20" fill="rgba(255,255,255,0.5)" />
      </g>
      {label && (
        <text x="200" y="360" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.8)" textAnchor="middle">{label}</text>
      )}
    </svg>
  );
}
