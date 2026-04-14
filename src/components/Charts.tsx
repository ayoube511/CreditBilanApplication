import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line,
} from 'recharts';

/* ── Design tokens ── */
const T = {
  navy:    '#1E2A5E',
  indigo:  '#4F46E5',
  emerald: '#059669',
  amber:   '#F59E0B',
  red:     '#DC2626',
  violet:  '#7C3AED',
  cyan:    '#0891B2',
  slate:   '#64748B',
  border:  '#E5E7EB',
  muted:   '#F9FAFB',
  text:    '#374151',
  textMuted: '#9CA3AF',
};

const SECTOR_PALETTE = [
  '#1E2A5E', '#4F46E5', '#0891B2', '#059669',
  '#D97706', '#DC2626', '#7C3AED', '#DB2777',
];

const tooltipProps = {
  contentStyle: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
    padding: '10px 14px',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '12px',
    color: '#374151',
  },
  cursor: { fill: 'rgba(99,102,241,0.04)' },
};

const axisStyle = {
  tick: { fontSize: 11, fill: T.textMuted, fontFamily: "'Manrope', sans-serif" },
  axisLine: false as const,
  tickLine: false as const,
};

/* ══════════════════════════════════════════════════════════
   1. DONUT CHART — Sector Distribution
══════════════════════════════════════════════════════════ */
interface DonutProps {
  data: Array<{ name: string; value: number; montant?: number }>;
}

export function SectorPieChart({ data }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number;
  }) => {
    if (percent < 0.07) return null;
    const R = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * R);
    const y = cy + r * Math.sin(-midAngle * R);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
        fontSize={10} fontWeight={700} fontFamily="'DM Mono', monospace">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div style={tooltipProps.contentStyle}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</p>
        <p style={{ color: T.textMuted }}>{d.value} dossiers · {((d.value / total) * 100).toFixed(1)}%</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="48%" innerRadius={68} outerRadius={108}
          paddingAngle={2} dataKey="value" labelLine={false} label={CustomLabel as never}
          animationBegin={0} animationDuration={800} animationEasing="ease-out">
          {data.map((_, i) => (
            <Cell key={i} fill={SECTOR_PALETTE[i % SECTOR_PALETTE.length]} stroke="transparent" />
          ))}
        </Pie>
        {/* Center text */}
        <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle"
          fontSize={24} fontWeight={700} fill={T.navy} fontFamily="'DM Mono', monospace">
          {total}
        </text>
        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
          fontSize={10} fill={T.textMuted} fontFamily="'Manrope', sans-serif">
          dossiers
        </text>
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={7}
          wrapperStyle={{ fontSize: '11px', paddingTop: '10px', fontFamily: "'Manrope', sans-serif" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   2. AREA CHART — Monthly Evolution
══════════════════════════════════════════════════════════ */
interface AreaProps {
  data: Array<{ date: string; demandes: number; approuvees: number; refusees?: number }>;
}

export function TimeSeriesChart({ data }: AreaProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="gDemandes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.navy} stopOpacity={0.18} />
            <stop offset="100%" stopColor={T.navy} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gApprouvees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.emerald} stopOpacity={0.18} />
            <stop offset="100%" stopColor={T.emerald} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gRefusees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={T.red} stopOpacity={0.15} />
            <stop offset="100%" stopColor={T.red} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.7} vertical={false} />
        <XAxis dataKey="date" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipProps} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: "'Manrope', sans-serif" }} iconType="circle" iconSize={7} />
        <Area type="monotone" dataKey="demandes" name="Demandes" stroke={T.navy} strokeWidth={2}
          fill="url(#gDemandes)" dot={{ r: 3.5, fill: T.navy, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }}
          animationDuration={800} animationEasing="ease-out" />
        <Area type="monotone" dataKey="approuvees" name="Approuvées" stroke={T.emerald} strokeWidth={2}
          fill="url(#gApprouvees)" dot={{ r: 3.5, fill: T.emerald, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }}
          animationDuration={900} animationEasing="ease-out" />
        {data[0]?.refusees !== undefined && (
          <Area type="monotone" dataKey="refusees" name="Refusées" stroke={T.red} strokeWidth={2}
            fill="url(#gRefusees)" dot={{ r: 3.5, fill: T.red, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }}
            animationDuration={1000} animationEasing="ease-out" />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   3. SCORE DISTRIBUTION — Colored Bar Chart
══════════════════════════════════════════════════════════ */
interface ScoreDistProps {
  data: Array<{ range: string; count: number }>;
}

const scoreColor = (range: string) => {
  const s = parseInt(range);
  if (s >= 80) return T.emerald;
  if (s >= 60) return T.navy;
  if (s >= 40) return T.amber;
  return T.red;
};

export function ScoreDistributionChart({ data }: ScoreDistProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.7} vertical={false} />
        <XAxis dataKey="range" {...axisStyle} />
        <YAxis {...axisStyle} />
        <Tooltip {...tooltipProps} formatter={(v: number) => [v, 'Dossiers']} />
        <Bar dataKey="count" radius={[5, 5, 0, 0]} animationDuration={700} animationEasing="ease-out">
          {data.map((e, i) => <Cell key={i} fill={scoreColor(e.range)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   4. SENSITIVITY — Horizontal Bar
══════════════════════════════════════════════════════════ */
interface SensitivityProps {
  data: Array<{ variable: string; impact: number; color: string }>;
}

export function SensitivityChart({ data }: SensitivityProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 120, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.7} horizontal={false} />
        <XAxis type="number" domain={[0, 0.5]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} {...axisStyle} />
        <YAxis type="category" dataKey="variable" width={115} {...axisStyle}
          tick={{ fontSize: 11, fill: T.text, fontFamily: "'Manrope', sans-serif" }} />
        <Tooltip {...tooltipProps} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Impact']} />
        <Bar dataKey="impact" radius={[0, 5, 5, 0]} animationDuration={700} animationEasing="ease-out">
          {data.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   5. RADAR CHART — Financial Profile
══════════════════════════════════════════════════════════ */
interface RadarProps {
  data: Array<{ critere: string; valeur: number; seuil?: number }>;
  color?: string;
  label?: string;
}

export function FinancialRadarChart({ data, color = T.navy, label = 'Score' }: RadarProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke={T.border} strokeOpacity={0.8} />
        <PolarAngleAxis dataKey="critere"
          tick={{ fontSize: 10, fill: T.text, fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]}
          tick={{ fontSize: 9, fill: T.textMuted }} tickCount={4} />
        {data[0]?.seuil !== undefined && (
          <Radar name="Seuil" dataKey="seuil" stroke={T.amber} fill={T.amber} fillOpacity={0.06}
            strokeWidth={1.5} strokeDasharray="4 3" />
        )}
        <Radar name={label} dataKey="valeur" stroke={color} fill={color} fillOpacity={0.18}
          strokeWidth={2} dot={{ r: 3, fill: color, strokeWidth: 0 }} />
        <Tooltip {...tooltipProps} formatter={(v: number) => [`${v.toFixed(0)}`, '']} />
        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: "'Manrope', sans-serif" }} iconType="circle" iconSize={7} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   6. BEHAVIORAL RADAR — BAM + Comportemental
══════════════════════════════════════════════════════════ */
export function BehavioralRadarChart({ data }: RadarProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke={T.border} strokeOpacity={0.8} />
        <PolarAngleAxis dataKey="critere"
          tick={{ fontSize: 10, fill: T.text, fontFamily: "'Manrope', sans-serif", fontWeight: 500 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]}
          tick={{ fontSize: 9, fill: T.textMuted }} tickCount={4} />
        <Radar name="Score" dataKey="valeur" stroke={T.violet} fill={T.violet} fillOpacity={0.18}
          strokeWidth={2} dot={{ r: 3, fill: T.violet, strokeWidth: 0 }} />
        <Tooltip {...tooltipProps} formatter={(v: number) => [`${v.toFixed(0)}`, '']} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   7. RADIAL GAUGE — Single KPI
══════════════════════════════════════════════════════════ */
interface GaugeProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  unit?: string;
  threshold?: number;
}

export function GaugeChart({ value, max, label, color, unit = '', threshold }: GaugeProps) {
  const pct = Math.min((value / max) * 100, 100);
  const thresholdPct = threshold ? Math.min((threshold / max) * 100, 100) : null;
  const autoColor = color ?? (thresholdPct ? (pct >= thresholdPct ? T.emerald : T.red) : T.navy);

  const gaugeData = [
    { name: label, value: pct, fill: autoColor },
    { name: 'rest', value: 100 - pct, fill: '#F3F4F6' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 110, height: 65 }}>
        <ResponsiveContainer width={110} height={80}>
          <RadialBarChart cx="50%" cy="90%" innerRadius="55%" outerRadius="100%"
            startAngle={180} endAngle={0} data={gaugeData} barSize={10}>
            <RadialBar dataKey="value" cornerRadius={5} background={{ fill: '#F3F4F6' }} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <p className="num text-[15px] font-700 leading-none" style={{ color: autoColor, fontWeight: 700 }}>
            {value.toFixed(2)}{unit}
          </p>
        </div>
      </div>
      <p className="text-[10px] mt-1 text-center" style={{ color: T.textMuted, fontFamily: "'Manrope', sans-serif" }}>{label}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   8. PORTFOLIO BAR — Segment Concentration
══════════════════════════════════════════════════════════ */
interface PortfolioProps {
  data: Array<{ segment: string; montant: number; count: number }>;
}

export function PortfolioChart({ data }: PortfolioProps) {
  const fmt = (v: number) => `${(v / 1_000_000).toFixed(0)}M`;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} strokeOpacity={0.7} vertical={false} />
        <XAxis dataKey="segment" {...axisStyle} />
        <YAxis yAxisId="l" tickFormatter={fmt} {...axisStyle} />
        <YAxis yAxisId="r" orientation="right" {...axisStyle} />
        <Tooltip {...tooltipProps}
          formatter={(v: number, name: string) => [name === 'Montant (MAD)' ? `${fmt(v)} MAD` : v, name]} />
        <Legend wrapperStyle={{ fontSize: '11px', fontFamily: "'Manrope', sans-serif" }} iconType="circle" iconSize={7} />
        <Bar yAxisId="l" dataKey="montant" name="Montant (MAD)" fill={T.navy} radius={[5,5,0,0]} animationDuration={700} />
        <Bar yAxisId="r" dataKey="count" name="Nb dossiers" fill={T.emerald} radius={[5,5,0,0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   9. MINI SPARKLINE — for KPI cards
══════════════════════════════════════════════════════════ */
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = T.navy, height = 40 }: SparklineProps) {
  const d = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={d} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
          dot={false} animationDuration={600} />
      </LineChart>
    </ResponsiveContainer>
  );
}
