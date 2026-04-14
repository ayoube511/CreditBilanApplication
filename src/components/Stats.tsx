import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  accent?: string;
}

export function StatsCard({ icon, label, value, trend, accent = 'bg-primary/10 text-primary' }: StatsCardProps) {
  return (
    <Card className="card-raised hover:card-lifted transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${accent}`}>{icon}</div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{label}</p>
              <p className="text-2xl font-bold font-mono mt-0.5">{value}</p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-chart-2/10 text-chart-2' : 'bg-chart-4/10 text-chart-4'}`}>
              {trend.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  comparison?: string;
  status?: "success" | "warning" | "destructive";
}

export function MetricCard({ label, value, comparison, status }: MetricCardProps) {
  const borderColors = {
    success:     'border-l-chart-2 bg-chart-2/5',
    warning:     'border-l-chart-3 bg-chart-3/5',
    destructive: 'border-l-chart-4 bg-chart-4/5',
  };
  const textColors = {
    success:     'text-chart-2',
    warning:     'text-chart-3',
    destructive: 'text-chart-4',
  };
  const statusLabels = { success: 'Sain', warning: 'Modéré', destructive: 'Risque' };

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${status ? borderColors[status] : 'border-l-border bg-muted/20'}`}>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-baseline justify-between mt-1">
        <p className={`text-2xl font-bold font-mono ${status ? textColors[status] : 'text-foreground'}`}>{value}</p>
        {status && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status === 'success' ? 'bg-chart-2/10 text-chart-2' : status === 'warning' ? 'bg-chart-3/10 text-chart-3' : 'bg-chart-4/10 text-chart-4'}`}>
            {statusLabels[status]}
          </span>
        )}
      </div>
      {comparison && <p className="text-xs text-muted-foreground mt-1">{comparison}</p>}
    </div>
  );
}
