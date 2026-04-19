/* Shared UI primitives: Wordmark, icons, PhotoPlaceholder, Sparkline, Donut, LineChart, BarChart, MapBG */

function Wordmark({ className = "" }) {
  return (
    <span className={"wordmark " + className}>
      <span className="dot"></span>canary<span style={{ opacity: .4, fontWeight: 500 }}>.pm</span>
    </span>
  );
}

/* Minimal icon set — single-stroke, inherit color */
const Icon = ({ name, size = 16 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home: <><path d="M3 10.5L12 3l9 7.5"/><path d="M5 9v11h14V9"/></>,
    users: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5"/><path d="M15 20c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5"/></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M8 7h3M8 11h3M8 15h3M13 7h3M13 11h3M13 15h3"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/></>,
    doc: <><path d="M7 3h8l4 4v14H7z"/><path d="M15 3v4h4"/><path d="M10 13h6M10 17h4"/></>,
    wrench: <><path d="M15 5a4 4 0 015 5l-9 9-4-4 9-9z"/><circle cx="7" cy="17" r="1"/></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></>,
    bell: <><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16z"/><path d="M10 20a2 2 0 004 0"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow_right: <path d="M5 12h14M13 6l6 6-6 6"/>,
    arrow_up: <path d="M12 19V5M6 11l6-6 6 6"/>,
    arrow_down: <path d="M12 5v14M6 13l6 6 6-6"/>,
    check: <path d="M5 12l5 5L20 7"/>,
    x: <path d="M6 6l12 12M18 6L6 18"/>,
    cog: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1A1.7 1.7 0 009 4.6h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    map: <><path d="M9 3L3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16M15 5v16"/></>,
    heart: <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z"/>,
    bed: <><path d="M3 18v-6a3 3 0 013-3h12a3 3 0 013 3v6"/><path d="M3 14h18M7 12V9a2 2 0 012-2h6a2 2 0 012 2v3"/></>,
    bath: <><path d="M4 11h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3z"/><path d="M7 11V6a2 2 0 014 0M5 20l-1 2M19 20l1 2"/></>,
    ruler: <><path d="M3 15L15 3l6 6-12 12-6-6z"/><path d="M8 10l2 2M11 7l2 2M14 4l2 2M5 13l2 2"/></>,
    star: <path d="M12 3l2.5 6 6 .5-4.5 4.5 1.5 6L12 16.5 6.5 20l1.5-6-4.5-4.5 6-.5z"/>,
    dollar: <path d="M12 3v18M16 7H9a3 3 0 000 6h6a3 3 0 010 6H7"/>,
    pin: <><path d="M12 21s-7-6-7-12a7 7 0 1114 0c0 6-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    logout: <><path d="M15 3h5v18h-5"/><path d="M3 12h13M11 7l5 5-5 5"/></>,
    message: <path d="M4 5h16v11H8l-4 4z"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
};

/* Striped photo placeholder — color-varied by seed */
function PhotoPlaceholder({ seed = 0, label }) {
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
        <pattern id={`s${seed}`} width="24" height="24" patternUnits="userSpaceOnUse" patternTransform={`rotate(${30 + seed*7})`}>
          <rect width="24" height="24" fill="transparent"/>
          <rect width="12" height="24" fill="rgba(255,255,255,0.08)"/>
        </pattern>
      </defs>
      <rect width="400" height="380" fill={`url(#g${seed})`}/>
      <rect width="400" height="380" fill={`url(#s${seed})`}/>
      {/* silhouette of a building */}
      <g opacity="0.22" fill="rgba(20,18,14,0.7)">
        <rect x="80" y="200" width="90" height="140"/>
        <rect x="180" y="160" width="70" height="180"/>
        <rect x="260" y="220" width="80" height="120"/>
        <polygon points="80,200 125,160 170,200"/>
        <polygon points="180,160 215,130 250,160"/>
        <polygon points="260,220 300,185 340,220"/>
        <rect x="95" y="230" width="16" height="22" fill="rgba(255,255,255,0.5)"/>
        <rect x="125" y="230" width="16" height="22" fill="rgba(255,255,255,0.5)"/>
        <rect x="195" y="200" width="14" height="20" fill="rgba(255,255,255,0.5)"/>
        <rect x="220" y="200" width="14" height="20" fill="rgba(255,255,255,0.5)"/>
        <rect x="275" y="245" width="14" height="20" fill="rgba(255,255,255,0.5)"/>
        <rect x="305" y="245" width="14" height="20" fill="rgba(255,255,255,0.5)"/>
      </g>
      {label && (
        <text x="200" y="360" fontFamily="JetBrains Mono" fontSize="10" fill="rgba(255,255,255,0.8)" textAnchor="middle">{label}</text>
      )}
    </svg>
  );
}

/* Sparkline */
function Sparkline({ data, color = "#1a1814", fill = false, height = 32 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y];
  });
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.08"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* Line chart */
function LineChart({ series, labels, height = 200 }) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 16, b: 24 };
  const allVals = series.flatMap(s => s.data);
  const max = Math.max(...allVals) * 1.1;
  const min = 0;
  const xStep = (w - pad.l - pad.r) / (labels.length - 1);
  const toY = v => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  const toX = i => pad.l + i * xStep;
  const gridY = [0, 0.25, 0.5, 0.75, 1].map(p => pad.t + p * (h - pad.t - pad.b));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {gridY.map((y, i) => (
        <line key={i} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#ebe8e2" strokeWidth="1"/>
      ))}
      {gridY.map((y, i) => (
        <text key={`l${i}`} x={pad.l - 8} y={y + 3} fontSize="9" fill="#9a948a" textAnchor="end" fontFamily="JetBrains Mono">
          {fmtCompact(max - (i/4)*max)}
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
            {si === 0 && <path d={area} fill={s.color} opacity="0.08"/>}
            <path d={d} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {s.data.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill="#fff" stroke={s.color} strokeWidth="1.5"/>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* Bar chart */
function BarChart({ data, labels, color = "#1a1814", height = 200 }) {
  const w = 700, h = height, pad = { l: 36, r: 12, t: 16, b: 24 };
  const max = Math.max(...data) * 1.15;
  const bw = (w - pad.l - pad.r) / data.length * 0.6;
  const step = (w - pad.l - pad.r) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      {[0,0.25,0.5,0.75,1].map((p, i) => {
        const y = pad.t + p * (h - pad.t - pad.b);
        return <line key={i} x1={pad.l} y1={y} x2={w-pad.r} y2={y} stroke="#ebe8e2"/>;
      })}
      {data.map((v, i) => {
        const barH = (v / max) * (h - pad.t - pad.b);
        const x = pad.l + i * step + step/2 - bw/2;
        const y = h - pad.b - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx="2" fill={i === data.length - 1 ? "#F5C518" : color} opacity={i === data.length - 1 ? 1 : 0.85}/>
            <text x={x + bw/2} y={h - 8} fontSize="10" fill="#9a948a" textAnchor="middle">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* Donut */
function Donut({ segments, total, size = 140 }) {
  const r = size / 2 - 10;
  const cx = size / 2, cy = size / 2;
  const sum = segments.reduce((a, s) => a + s.value, 0);
  let cumulative = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f2efe9" strokeWidth="14"/>
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

/* Map background with roads + water hinting at St. John's */
function MapBG() {
  return (
    <>
      <div className="map-bg"/>
      <svg className="map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
        {Array.from({length:10}).map((_,i) => <line key={`v${i}`} x1={i*10} y1="0" x2={i*10} y2="100" stroke="#1a1814" strokeWidth="0.15"/>)}
        {Array.from({length:10}).map((_,i) => <line key={`h${i}`} x1="0" y1={i*10} x2="100" y2={i*10} stroke="#1a1814" strokeWidth="0.15"/>)}
      </svg>
      {/* Harbour water */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,70 Q15,65 30,72 Q50,82 70,78 Q90,74 100,80 L100,100 L0,100 Z" fill="#b4cfd9" opacity="0.55"/>
        <path d="M10,85 Q30,83 50,88 Q70,92 90,90" fill="none" stroke="#93b3c0" strokeWidth="0.3" opacity="0.5"/>
        {/* roads */}
        <path d="M0,45 L100,42" stroke="#f5f2eb" strokeWidth="2.5" opacity="0.8"/>
        <path d="M0,55 L100,52" stroke="#f5f2eb" strokeWidth="1.8" opacity="0.7"/>
        <path d="M20,0 L25,100" stroke="#f5f2eb" strokeWidth="1.8" opacity="0.7"/>
        <path d="M55,0 L58,100" stroke="#f5f2eb" strokeWidth="2.2" opacity="0.8"/>
        <path d="M80,0 L82,100" stroke="#f5f2eb" strokeWidth="1.6" opacity="0.7"/>
        <path d="M0,28 Q50,25 100,32" fill="none" stroke="#f5f2eb" strokeWidth="1.6" opacity="0.7"/>
        {/* labels */}
        <text x="50" y="80" textAnchor="middle" fontSize="2.4" fill="#4a6771" opacity="0.6" fontFamily="Inter" fontWeight="500">ST. JOHN'S HARBOUR</text>
        <text x="15" y="15" fontSize="2" fill="#3a3631" opacity="0.5" fontFamily="Inter" fontWeight="500">PLEASANTVILLE</text>
        <text x="62" y="18" fontSize="2" fill="#3a3631" opacity="0.5" fontFamily="Inter" fontWeight="500">SIGNAL HILL</text>
        <text x="38" y="40" fontSize="2" fill="#3a3631" opacity="0.5" fontFamily="Inter" fontWeight="500">DOWNTOWN</text>
        <text x="8" y="62" fontSize="2" fill="#3a3631" opacity="0.5" fontFamily="Inter" fontWeight="500">RABBITTOWN</text>
      </svg>
    </>
  );
}

Object.assign(window, { Wordmark, Icon, PhotoPlaceholder, Sparkline, LineChart, BarChart, Donut, MapBG });
