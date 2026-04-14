import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ComposedChart, ReferenceLine, Sector
} from 'recharts';
import { useState } from 'react';

/* ── Design tokens (Enhanced Technical Palette) ── */
const T = {
  navy:    '#565E74', // Match User's Primary
  indigo:  '#4F46E5',
  emerald: '#10B981',
  amber:   '#F59E0B',
  red:     '#F43F5E',
  violet:  '#8B5CF6',
  cyan:    '#06B6D4',
  slate:   '#64748B',
  border:  '#E2E8F0',
  muted:   '#F8FAFC',
  text:    '#1E293B',
  textMuted: '#94A3B8',
};

const SECTOR_PALETTE = [
  '#565E74', '#4F46E5', '#06B6D4', '#10B981',
  '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899',
];

const tooltipProps = {
  contentStyle: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    padding: '12px 16px',
    fontFamily: "'Manrope', sans-serif",
    fontSize: '11px',
    color: '#1E293B',
  },
  cursor: { stroke: '#E2E8F0', strokeWidth: 1 },
};

const axisStyle = {
  tick: { fontSize: 10, fill: '#94A3B8', fontFamily: 'Manrope', fontWeight: 700 },
  axisLine: false as const,
  tickLine: false as const,
};

/* ══════════════════════════════════════════════════════════
   1. ADVANCED SECTOR PIE — with Active Focus Shape
   ══════════════════════════════════════════════════════════ */
interface DonutProps {
  data: Array<{ name: string; value: number; montant?: number }>;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const displayName = payload.name.length > 15 ? payload.name.substring(0, 13) + '..' : payload.name;

  return (
    <g>
      <text x={cx} y={cy - 25} textAnchor="middle" fill="#94A3B8" fontSize={8} fontWeight={800} style={{ fontFamily: 'Manrope' }} className="uppercase tracking-[0.2em]">
        {displayName}
      </text>
      <text x={cx} y={cy + 5} textAnchor="middle" fill="#1E293B" fontSize={24} fontWeight={900} style={{ fontFamily: 'Manrope' }}>
        {value}
      </text>
      <text x={cx} y={cy + 25} textAnchor="middle" fill={fill} fontSize={9} fontWeight={800} style={{ fontFamily: 'Manrope' }} className="uppercase tracking-widest">
        {(percent * 100).toFixed(1)}% PART
      </text>
      
      {/* Visual Ring Highlighting */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export function SectorPieChart({ data }: DonutProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70} // More room in the center
          outerRadius={95}
          paddingAngle={4}
          dataKey="value"
          onMouseEnter={onPieEnter}
          animationBegin={0}
          animationDuration={600}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={SECTOR_PALETTE[i % SECTOR_PALETTE.length]} stroke="transparent" />
          ))}
        </Pie>
        {/* Hidden tooltip handling via active shape */}
        <Tooltip content={() => null} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle" 
          iconSize={5}
          wrapperStyle={{ fontSize: '9px', paddingTop: '20px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
interface AreaProps {
  data: Array<{ date: string; demandes: number; approuvees: number; refusees?: number }>;
}

export function TimeSeriesChart({ data }: AreaProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 30, right: 30, left: 10, bottom: 40 }} barGap={8}>
        <defs>
          <linearGradient id="gBarGhost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#565E74" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#565E74" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="gBarPulse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        
        {/* Technical Dot Matrix Grid */}
        <CartesianGrid strokeDasharray="1 15" stroke="#94A3B8" strokeOpacity={0.3} vertical={false} />
        
        <XAxis 
          dataKey="date" 
          {...axisStyle} 
          dy={15}
          padding={{ left: 20, right: 20 }}
          tickFormatter={(v) => {
            const dateParts = v.split('-');
            if (dateParts.length < 2) return v;
            const months = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];
            const monthIdx = parseInt(dateParts[1]) - 1;
            return `${months[monthIdx]} ${dateParts[0].slice(2)}`;
          }}
        />
        <YAxis {...axisStyle} dx={-5} />
        
        <Tooltip 
          {...tooltipProps}
          cursor={{ fill: 'rgba(86, 94, 116, 0.04)' }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-2xl min-w-[180px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">{label}</p>
                {payload.map((entry: any) => (
                  <div key={entry.dataKey} className="flex justify-between items-center mb-2 last:mb-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full" style={{ background: entry.fill }} />
                       {entry.name}
                    </span>
                    <span className="text-sm font-black text-slate-800 tabular-nums">{entry.value}</span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        
        <Legend 
          verticalAlign="top" 
          align="right" 
          height={60} 
          iconType="rect" 
          iconSize={5}
          wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', paddingBottom: '30px' }} 
        />
        
        <ReferenceLine 
          y={25} 
          stroke="#CBD5E1" 
          strokeWidth={1} 
          strokeDasharray="5 5" 
          label={{ position: 'right', value: 'TARGET BASELINE', fill: '#94A3B8', fontSize: 7, fontWeight: 900, letterSpacing: '0.1em' }} 
        />

        <Bar 
          dataKey="demandes" 
          name="Flux Total" 
          fill="url(#gBarGhost)" 
          radius={[4, 4, 0, 0]} 
          barSize={24}
        />
        <Bar 
          dataKey="approuvees" 
          name="Approbations" 
          fill="url(#gBarPulse)" 
          radius={[4, 4, 0, 0]} 
          barSize={24}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   3. SCORE DISTRIBUTION — Professional Bars
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
   4. SENSITIVITY — Professional Horizontal
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
   5. RADAR CHART — Pro Financial Profile
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
   6. RADIAL GAUGE — Minimal KPI
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
   7. PORTFOLIO BAR — High Contrast
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
        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 800, fontFamily: "'Manrope', sans-serif", textTransform: 'uppercase', letterSpacing: '0.1em' }} iconType="circle" iconSize={6} />
        <Bar yAxisId="l" dataKey="montant" name="Montant (MAD)" fill={T.navy} radius={[5,5,0,0]} animationDuration={700} />
        <Bar yAxisId="r" dataKey="count" name="Nb dossiers" fill={T.emerald} radius={[5,5,0,0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══════════════════════════════════════════════════════════
   8. MINI SPARKLINE — Final Refinement
   ══════════════════════════════════════════════════════════ */
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = T.navy, height = 40 }: SparklineProps) {
  if (!data) return null;
  const d = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={d} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2}
          dot={false} animationDuration={600} />
      </LineChart>
    </ResponsiveContainer>
  );
}
