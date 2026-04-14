import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

interface SectorPieChartProps {
  data: Array<{ name: string; value: number }>;
}

export function SectorPieChart({ data }: SectorPieChartProps) {
  const COLORS = [
    'oklch(0.52 0.18 220)',
    'oklch(0.58 0.2 150)',
    'oklch(0.62 0.18 45)',
    'oklch(0.55 0.22 10)',
    'oklch(0.52 0.18 270)',
    'oklch(0.48 0.15 200)',
    'oklch(0.55 0.16 180)',
    'oklch(0.60 0.20 300)',
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(0.98 0.005 220)',
            border: '1px solid oklch(0.88 0.01 220)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{
            paddingTop: '1rem',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface TimeSeriesChartProps {
  data: Array<{ date: string; demandes: number; approuvees: number }>;
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 220)" />
        <XAxis
          dataKey="date"
          stroke="oklch(0.48 0.01 220)"
          style={{ fontSize: '0.875rem' }}
        />
        <YAxis
          stroke="oklch(0.48 0.01 220)"
          style={{ fontSize: '0.875rem' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(0.98 0.005 220)',
            border: '1px solid oklch(0.88 0.01 220)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
          }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '1rem',
          }}
        />
        <Line
          type="monotone"
          dataKey="demandes"
          stroke="oklch(0.52 0.18 220)"
          strokeWidth={2}
          dot={{ fill: 'oklch(0.52 0.18 220)', r: 4 }}
          activeDot={{ r: 6 }}
          name="Demandes"
        />
        <Line
          type="monotone"
          dataKey="approuvees"
          stroke="oklch(0.58 0.2 150)"
          strokeWidth={2}
          dot={{ fill: 'oklch(0.58 0.2 150)', r: 4 }}
          activeDot={{ r: 6 }}
          name="Approuvées"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ScoreDistributionChartProps {
  data: Array<{ range: string; count: number }>;
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 220)" />
        <XAxis
          dataKey="range"
          stroke="oklch(0.48 0.01 220)"
          style={{ fontSize: '0.875rem' }}
        />
        <YAxis
          stroke="oklch(0.48 0.01 220)"
          style={{ fontSize: '0.875rem' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'oklch(0.98 0.005 220)',
            border: '1px solid oklch(0.88 0.01 220)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
          }}
          cursor={{ fill: 'oklch(0.95 0.005 220)' }}
        />
        <Bar
          dataKey="count"
          fill="oklch(0.52 0.18 220)"
          radius={[8, 8, 0, 0]}
          name="Nombre de demandes"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
