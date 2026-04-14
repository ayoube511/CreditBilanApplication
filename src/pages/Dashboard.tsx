import { TrendingUp, TrendingDown, FileText, CheckCircle, XCircle, Clock, DollarSign, Percent, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard, MetricCard } from '@/components/Stats';
import { SectorPieChart, TimeSeriesChart } from '@/components/Charts';
import { mockApplications, mockDashboardStats, mockSectorDistribution, mockTimeSeriesData } from '@/data/index';
import { formatCurrency, formatDate, getClassColor, getStatusColor } from '@/lib/index';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';

export default function Dashboard() {
  const recentApplications = mockApplications.slice(0, 5);

  return (
    <div className="w-full min-h-screen bg-background p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="text-muted-foreground text-lg">Vue d'ensemble de l'activité de crédit leasing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<FileText className="w-5 h-5" />}
          label="Demandes Totales"
          value={mockDashboardStats.totalDemandes}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" />}
          label="En Cours"
          value={mockDashboardStats.enCours}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          icon={<CheckCircle className="w-5 h-5" />}
          label="Approuvées"
          value={mockDashboardStats.approuvees}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          icon={<XCircle className="w-5 h-5" />}
          label="Refusées"
          value={mockDashboardStats.refusees}
          trend={{ value: 3.1, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          label="Montant Total Portefeuille"
          value={formatCurrency(mockDashboardStats.montantTotalPortefeuille)}
          comparison="+18.2% vs mois dernier"
          status="success"
        />
        <MetricCard
          label="Taux d'Approbation"
          value={`${mockDashboardStats.tauxApprobation}%`}
          comparison="+2.4% vs mois dernier"
          status="success"
        />
        <MetricCard
          label="Délai Moyen de Traitement"
          value={`${mockDashboardStats.delaiMoyenTraitement} jours`}
          comparison="-1.2 jours vs mois dernier"
          status="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Répartition par Secteur</CardTitle>
            <CardDescription>Distribution des demandes par secteur d'activité</CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPieChart data={mockSectorDistribution} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Évolution Temporelle</CardTitle>
            <CardDescription>Nombre de demandes par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart data={mockTimeSeriesData} />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dernières Demandes</CardTitle>
            <CardDescription>Les 5 demandes les plus récentes</CardDescription>
          </div>
          <Link to={ROUTE_PATHS.APPLICATIONS}>
            <Button variant="outline" size="sm">
              Voir Tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Segment</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Secteur</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Montant</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Classe</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Statut</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app, index) => (
                  <tr
                    key={app.id}
                    className={`border-b border-border hover:bg-muted/50 transition-colors ${
                      index % 2 === 0 ? 'bg-card' : 'bg-background'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium">{app.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{app.client}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {app.segment}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-muted-foreground">{app.secteur}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-medium">{formatCurrency(app.montant)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-lg">{app.score}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getClassColor(app.classe)}>{app.classe}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge className={getStatusColor(app.statut)}>{app.statut}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-muted-foreground">{formatDate(app.dateCreation)}</span>
                    </td>
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