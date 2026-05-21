import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Clock, Layers, Wallet } from 'lucide-react';
import { SectorPieChart, TimeSeriesChart, Sparkline } from '@/components/Charts';
import { mockApplications, mockTimeSeriesData } from '@/data/index';
import { formatCurrency, formatDate } from '@/lib/index';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { dashboardApi } from '@/api/dashboardApi';
import { applicationsApi } from '@/api/applicationsApi';

function CapitalKPI({ label, value, trend, icon: Icon, chartData }: any) {
  const isPositive = trend?.positive;
  const color = isPositive ? '#10B981' : '#F43F5E';

  return (
    <div className="bg-white p-5 border border-slate-200/60 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="text-[#565e74]"><Icon size={18} /></div>
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800 tabular-nums leading-none">{value}</h2>
      <div className="mt-4 flex items-center space-x-3">
        {trend && (
          <span className={`text-[10px] px-2 py-0.5 font-bold rounded ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
        <div className="flex-1 h-8">
          <Sparkline data={chartData} color={color} height={32} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
  });

  const { data: sectors, isLoading: sectorsLoading } = useQuery({
    queryKey: ['sector-distribution'],
    queryFn: dashboardApi.getSectorDistribution,
  });

  const { data: recentApps } = useQuery({
    queryKey: ['applications-recent'],
    queryFn: () => applicationsApi.getAll({ page: 0, size: 4 }),
  });

  // Préparer les données secteur pour le graphique
  const sectorData = sectors?.map(s => ({
    name: s.sector,
    value: s.count,
  })) || [];

  const totalDemandes = summary?.totalApplications || 0;
  const enCours = (summary?.inReview || 0) + (summary?.draft || 0) + (summary?.scoringDone || 0);
  const approuvees = summary?.approved || 0;
  const montantTotal = summary?.totalAmountMad || 0;

  return (
    <div className="w-full px-6 py-8 space-y-8 animate-fade-in">

      {/* KPI Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-5 border border-slate-200/60 rounded-lg h-32 animate-pulse bg-slate-100" />
          ))
        ) : (
          <>
            <CapitalKPI label="Demandes Actives" value={totalDemandes.toLocaleString()} trend={{ value: 14.2, positive: true }} icon={Layers} chartData={[31, 40, 28, 51, 42, 109, 100]} />
            <CapitalKPI label="En Files Attente" value={enCours.toLocaleString()} trend={{ value: 5.8, positive: false }} icon={Clock} chartData={[11, 32, 45, 32, 34, 52, 41]} />
            <CapitalKPI label="Décisions OK" value={approuvees.toLocaleString()} trend={{ value: 12.1, positive: true }} icon={CheckCircle} chartData={[35, 20, 45, 60, 55, 70, 90]} />
            <CapitalKPI label="Encours Global" value={formatCurrency(montantTotal).split(',')[0]} trend={{ value: 8.4, positive: true }} icon={Wallet} chartData={[50, 55, 45, 60, 58, 65, 75]} />
          </>
        )}
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Évolution de l'Octroi</h3>
          <TimeSeriesChart data={mockTimeSeriesData} />
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Répartition Sectorielle</h3>
          {sectorsLoading ? (
            <div className="h-48 animate-pulse bg-slate-100 rounded" />
          ) : sectorData.length > 0 ? (
            <SectorPieChart data={sectorData} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
          )}
        </div>
      </section>

      {/* Dossiers récents */}
      <section className="bg-white border border-slate-200/60 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Dossiers Récents</h3>
          <Link to={ROUTE_PATHS.APPLICATIONS} className="text-xs text-slate-500 hover:text-slate-800 font-medium">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-3">
          {recentApps?.content?.map((app) => (
            <div key={app.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{app.clientName}</p>
                <p className="text-xs text-slate-400">{app.reference} · {app.sector}</p>
              </div>
              <div className="flex items-center gap-3">
                {app.score && (
                  <span className="text-xs font-bold text-slate-600">Score: {app.score}</span>
                )}
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                  app.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {applicationsApi.mapStatus(app.status)}
                </span>
              </div>
            </div>
          )) || mockApplications.slice(0, 4).map((app) => (
            <div key={app.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-slate-800">{app.client}</p>
                <p className="text-xs text-slate-400">{app.id} · {app.secteur}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Score: {app.score}</span>
                <span className="text-xs px-2 py-1 rounded font-medium bg-blue-50 text-blue-700">{app.statut}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
