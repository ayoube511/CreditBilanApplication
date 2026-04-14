import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar,
} from 'recharts';

const CHART_COLORS = {
  navy:    'hsl(var(--chart-1))',
  emerald: 'hsl(var(--chart-2))',
  gold:    'hsl(var(--chart-3))',
  red:     'hsl(var(--chart-4))',
  purple:  'hsl(var(--chart-5))',
  teal:    'hsl(var(--chart-6))',
};

const SECTOR_COLORS = [
  '#1e3a5f', '#2563a8', '#3b82c4', '#0d9488', '#059669',
  '#d97706', '#dc2626', '#7c3aed',
];

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  padding: '10px 14px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  fontSize: '12px',
  color: 'hsl(var(--popover-foreground))',
};

// ─── Donut Chart ─────────────────────────────────────────────────────────────
interface DonutChartProps {
  data: Array<{ name: string; value: number; montant?: number }>;
}

export function SectorPieChart({ data }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
    cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number;
  }) => {
    if (percent < 0.06) return null;
    const RADIAN = Math.PI / 180;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={72}
          outerRadius={115}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={CustomLabel as never}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={SECTOR_COLORS[index % SECTOR_COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        {/* Center label */}
        <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={700} fill="hsl(var(--foreground))">
          {total}
        </text>
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fontSize={10} fill="hsl(var(--muted-foreground))">
          dossiers
        </text>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => [`${value} dossiers (${((value/total)*100).toFixed(1)}%)`, name]}
        />
        <Legend
          verticalAlign="bottom"
          height={40}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Area Chart ───────────────────────────────────────────────────────────────
interface TimeSeriesChartProps {
  data: Array<{ date: string; demandes: number; approuvees: number; refusees?: number }>;
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradDemandes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.navy} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CHART_COLORS.navy} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradApprouvees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.emerald} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CHART_COLORS.emerald} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradRefusees" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.20} />
            <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} iconType="circle" iconSize={8} />
        <Area type="monotone" dataKey="demandes" name="Demandes" stroke={CHART_COLORS.navy} strokeWidth={2} fill="url(#gradDemandes)" dot={{ r: 3, fill: CHART_COLORS.navy }} activeDot={{ r: 5 }} />
        <Area type="monotone" dataKey="approuvees" name="Approuvées" stroke={CHART_COLORS.emerald} strokeWidth={2} fill="url(#gradApprouvees)" dot={{ r: 3, fill: CHART_COLORS.emerald }} activeDot={{ r: 5 }} />
        {data[0]?.refusees !== undefined && (
          <Area type="monotone" dataKey="refusees" name="Refusées" stroke={CHART_COLORS.red} strokeWidth={2} fill="url(#gradRefusees)" dot={{ r: 3, fill: CHART_COLORS.red }} activeDot={{ r: 5 }} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ─── Score Distribution Bar Chart ────────────────────────────────────────────
interface ScoreDistributionChartProps {
  data: Array<{ range: string; count: number }>;
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  const getBarColor = (range: string) => {
    const start = parseInt(range.split('-')[0]);
    if (start >= 80) return CHART_COLORS.emerald;
    if (start >= 60) return CHART_COLORS.navy;
    if (start >= 40) return CHART_COLORS.gold;
    return CHART_COLORS.red;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} vertical={false} />
        <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }} />
        <Bar dataKey="count" name="Dossiers" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Horizontal Sensitivity Bar Chart ────────────────────────────────────────
interface SensitivityChartProps {
  data: Array<{ variable: string; impact: number; color: string }>;
}

export function SensitivityChart({ data }: SensitivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 110, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} horizontal={false} />
        <XAxis type="number" domain={[0, 0.5]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="variable" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} axisLine={false} tickLine={false} width={105} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Impact']} />
        <Bar dataKey="impact" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Radial KPI Gauge ─────────────────────────────────────────────────────────
interface GaugeChartProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  unit?: string;
}

export function GaugeChart({ value, max, label, color = CHART_COLORS.navy, unit = '' }: GaugeChartProps) {
  const pct = Math.min((value / max) * 100, 100);
  const data = [{ name: label, value: pct, fill: color }, { name: 'rest', value: 100 - pct, fill: 'hsl(var(--muted))' }];

  return (
    <div className="relative flex flex-col items-center">
      <ResponsiveContainer width={120} height={80}>
        <RadialBarChart
          cx="50%" cy="90%"
          innerRadius="60%" outerRadius="100%"
          startAngle={180} endAngle={0}
          data={data}
          barSize={10}
        >
          <RadialBar dataKey="value" cornerRadius={5} background={{ fill: 'hsl(var(--muted))' }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 text-center">
        <p className="text-lg font-bold font-mono" style={{ color }}>{value.toFixed(2)}{unit}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
