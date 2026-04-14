import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ icon, label, value, trend }: StatsCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-chart-2" />
              ) : (
                <TrendingDown className="w-4 h-4 text-chart-4" />
              )}
              <span
                className={`text-sm font-semibold ${
                  trend.isPositive ? "text-chart-2" : "text-chart-4"
                }`}
              >
                {trend.value > 0 ? "+" : ""}{trend.value}%
              </span>
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
  const statusColors = {
    success: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    warning: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    destructive: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline justify-between">
            <p className="text-3xl font-bold font-mono">{value}</p>
            {status && (
              <Badge
                variant="outline"
                className={`${statusColors[status]} font-semibold`}
              >
                {status === "success" && "Sain"}
                {status === "warning" && "Modéré"}
                {status === "destructive" && "Risque"}
              </Badge>
            )}
          </div>
          {comparison && (
            <p className="text-xs text-muted-foreground mt-2">{comparison}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
