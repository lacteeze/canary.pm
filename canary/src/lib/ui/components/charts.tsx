function fmtCompact(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

interface Series {
  color: string;
  data: number[];
}

interface LineChartProps {
  series: Series[];
  labels: string[];
  height?: number;
}

export function LineChart({ series, labels, height = 200 }: LineChartProps) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 16, b: 24 };
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals) * 1.1;
  const min = 0;
  const xStep = (w - pad.l - pad.r) / (labels.length - 1);
  const toY = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  const toX = (i: number) => pad.l + i * xStep;
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(p => pad.t + p * (h - pad.t - pad.b));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {gridY.map((y, i) => (
        <line key={i} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#ebe8e2" strokeWidth="1" />
      ))}
      {gridY.map((y, i) => (
        <text key={`l${i}`} x={pad.l - 8} y={y + 3} fontSize="9" fill="#9a948a" textAnchor="end" fontFamily="JetBrains Mono">
          {fmtCompact(max - (i / 4) * max)}
        </text>
      ))}
      {labels.map((lb, i) => (
        <text key={`x${i}`} x={toX(i)} y={h - 8} fontSize="10" fill="#9a948a" textAnchor="middle">{lb}</text>
      ))}
      {series.map((s, si) => {
        const d = s.data.map((v, i) => (i === 0 ? 'M' : 'L') + toX(i) + ' ' + toY(v)).join(' ');
        const area = d + ` L ${toX(s.data.length - 1)} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`;
        return (
          <g key={si}>
            {si === 0 && <path d={area} fill={s.color} opacity="0.08" />}
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#fff" stroke={s.color} strokeWidth="1.5" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

interface BarChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}

export function BarChart({ data, labels, color = '#1a1814', height = 200 }: BarChartProps) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 16, b: 24 };
  const max = Math.max(...data) * 1.15;
  const bw = (w - pad.l - pad.r) / data.length * 0.6;
  const step = (w - pad.l - pad.r) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = pad.t + p * (h - pad.t - pad.b);
        return <line key={i} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#ebe8e2" />;
      })}
      {data.map((v, i) => {
        const barH = (v / max) * (h - pad.t - pad.b);
        const x = pad.l + i * step + step / 2 - bw / 2;
        const y = h - pad.b - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx="2" fill={i === data.length - 1 ? '#F5C518' : color} opacity={i === data.length - 1 ? 1 : 0.85} />
            <text x={x + bw / 2} y={h - 8} fontSize="10" fill="#9a948a" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

interface DonutSegment {
  color: string;
  value: number;
}

interface DonutProps {
  segments: DonutSegment[];
  total: string | number;
  size?: number;
}

export function Donut({ segments, total, size = 140 }: DonutProps) {
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  const sum = segments.reduce((a, s) => a + s.value, 0);
  let cumulative = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f2efe9" strokeWidth="14" />
      {segments.map((s, i) => {
        const frac = s.value / sum;
        const dash = frac * Math.PI * 2 * r;
        const gap = Math.PI * 2 * r - dash;
        const rot = (cumulative / sum) * 360 - 90;
        cumulative += s.value;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rot} ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
      })}
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="20" fontWeight="700" fontFamily="Inter Tight" fill="#1a1814">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6b665f">total</text>
    </svg>
  );
}
