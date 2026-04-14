import { FileText, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectorPieChart, TimeSeriesChart } from '@/components/Charts';
import { mockApplications, mockDashboardStats, mockSectorDistribution, mockTimeSeriesData } from '@/data/index';
import { formatCurrency, formatDate, getClassColor, getStatusColor } from '@/lib/index';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  accent?: string;
}

function StatCard({ icon, label, value, trend, accent = 'bg-primary/10 text-primary' }: StatCardProps) {
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

interface MetricBannerProps {
  label: string;
  value: string;
  sub: string;
  status: 'good' | 'warn' | 'bad';
}

function MetricBanner({ label, value, sub, status }: MetricBannerProps) {
  const colors = { good: 'border-l-chart-2 bg-chart-2/5', warn: 'border-l-chart-3 bg-chart-3/5', bad: 'border-l-chart-4 bg-chart-4/5' };
  const textColors = { good: 'text-chart-2', warn: 'text-chart-3', bad: 'text-chart-4' };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${colors[status]}`}>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className={`text-2xl font-bold font-mono mt-1 ${textColors[status]}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const recentApplications = mockApplications.slice(0, 5);

  return (
    <div className="w-full min-h-screen space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de Bord</h1>
          <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble · Portefeuille Crédit-Bail · Avril 2026</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
          <Activity className="h-3 w-3 text-chart-2" />
          Données en temps réel
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText className="w-4 h-4" />} label="Demandes Totales" value={mockDashboardStats.totalDemandes} trend={{ value: 12.5, isPositive: true }} accent="bg-primary/10 text-primary" />
        <StatCard icon={<Clock className="w-4 h-4" />} label="En Cours" value={mockDashboardStats.enCours} trend={{ value: 8.2, isPositive: true }} accent="bg-chart-3/10 text-chart-3" />
        <StatCard icon={<CheckCircle className="w-4 h-4" />} label="Approuvées" value={mockDashboardStats.approuvees} trend={{ value: 15.3, isPositive: true }} accent="bg-chart-2/10 text-chart-2" />
        <StatCard icon={<XCircle className="w-4 h-4" />} label="Refusées" value={mockDashboardStats.refusees} trend={{ value: 3.1, isPositive: false }} accent="bg-chart-4/10 text-chart-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricBanner label="Montant Total Portefeuille" value={formatCurrency(mockDashboardStats.montantTotalPortefeuille)} sub="+18.2% vs mois dernier" status="good" />
        <MetricBanner label="Taux d'Approbation" value={`${mockDashboardStats.tauxApprobation}%`} sub="+2.4% vs mois dernier" status="good" />
        <MetricBanner label="Délai Moyen de Traitement" value={`${mockDashboardStats.delaiMoyenTraitement} jours`} sub="-1.2 jours vs mois dernier" status="good" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="card-raised">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Répartition Sectorielle</CardTitle>
            <CardDescription className="text-xs">Distribution des demandes par secteur d'activité</CardDescription>
          </CardHeader>
          <CardContent><SectorPieChart data={mockSectorDistribution} /></CardContent>
        </Card>
        <Card className="card-raised">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Évolution Mensuelle</CardTitle>
            <CardDescription className="text-xs">Demandes, approbations et refus par mois</CardDescription>
          </CardHeader>
          <CardContent><TimeSeriesChart data={mockTimeSeriesData} /></CardContent>
        </Card>
      </div>

      <Card className="card-raised">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-sm font-semibold">Dernières Demandes</CardTitle>
            <CardDescription className="text-xs">Les 5 dossiers les plus récents</CardDescription>
          </div>
          <Link to={ROUTE_PATHS.APPLICATIONS}>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['ID','Client','Segment','Secteur','Montant','Score','Classe','Statut','Date'].map(h => (
                    <th key={h} className={`py-2.5 px-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide ${['Montant'].includes(h) ? 'text-right' : ['Score','Classe','Statut','Date'].includes(h) ? 'text-center' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, index) => (
                  <tr key={app.id} className={`border-b border-border/50 hover:bg-muted/40 transition-colors ${index % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <td className="py-3 px-4"><span className="font-mono text-xs font-semibold text-primary">{app.id}</span></td>
                    <td className="py-3 px-4"><span className="text-sm font-medium">{app.client}</span></td>
                    <td className="py-3 px-4"><Badge variant="outline" className="text-[10px] h-5 badge-neutral">{app.segment}</Badge></td>
                    <td className="py-3 px-4"><span className="text-xs text-muted-foreground">{app.secteur}</span></td>
                    <td className="py-3 px-4 text-right"><span className="font-mono text-xs font-semibold">{formatCurrency(app.montant)}</span></td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold text-base ${app.score >= 75 ? 'text-chart-2' : app.score >= 55 ? 'text-chart-3' : 'text-chart-4'}`}>{app.score}</span>
                    </td>
                    <td className="py-3 px-4 text-center"><Badge className={`${getClassColor(app.classe)} text-[10px] h-5`}>{app.classe}</Badge></td>
                    <td className="py-3 px-4 text-center"><Badge className={`${getStatusColor(app.statut)} text-[10px] h-5`}>{app.statut}</Badge></td>
                    <td className="py-3 px-4 text-center"><span className="text-xs text-muted-foreground">{formatDate(app.dateCreation)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
