import { FileText, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight, TrendingUp, Activity, Wallet, Percent } from 'lucide-react';
import { SectorPieChart, TimeSeriesChart, Sparkline } from '@/components/Charts';
import { mockApplications, mockDashboardStats, mockSectorDistribution, mockTimeSeriesData } from '@/data/index';
import { formatCurrency, formatDate, getClassColor, getStatusColor } from '@/lib/index';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/* ── Sparkline mock data ── */
const SPARKS = {
  demandes:   [12, 15, 18, 14, 22, 19, 28],
  approuvees: [9,  11, 14, 10, 17, 15, 21],
  refusees:   [3,  4,  4,  4,  5,  4,  7],
  montant:    [180, 195, 210, 205, 225, 230, 246],
};

/* ── KPI Card ── */
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: number; positive: boolean };
  spark?: number[];
  sparkColor?: string;
  accentClass: string;
  delay?: string;
}

function KpiCard({ icon, label, value, sub, trend, spark, sparkColor, accentClass, delay = '' }: KpiCardProps) {
  return (
    <div className={`kpi-card ${accentClass} animate-fade-in-up ${delay}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: 'rgba(0,0,0,0.04)' }}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-600 ${trend.positive ? 'badge-success' : 'badge-danger'}`}
            style={{ fontWeight: 600 }}>
            {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-[11px] font-500 mb-1" style={{ color: '#6B7280', fontWeight: 500 }}>{label}</p>
      <p className="num text-[26px] font-700 leading-none" style={{ fontWeight: 700, color: '#0D1117' }}>{value}</p>
      {sub && <p className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>{sub}</p>}
      {spark && (
        <div className="mt-3 -mx-1">
          <Sparkline data={spark} color={sparkColor} height={36} />
        </div>
      )}
    </div>
  );
}

/* ── Metric Banner ── */
interface MetricProps {
  label: string;
  value: string;
  sub: string;
  status: 'success' | 'warning' | 'danger' | 'navy';
  icon: React.ReactNode;
  delay?: string;
}

function MetricBanner({ label, value, sub, status, icon, delay = '' }: MetricProps) {
  const cfg = {
    success: { bar: 'metric-bar-success', val: '#059669', bg: '#ECFDF5' },
    warning: { bar: 'metric-bar-warning', val: '#D97706', bg: '#FFFBEB' },
    danger:  { bar: 'metric-bar-danger',  val: '#DC2626', bg: '#FEF2F2' },
    navy:    { bar: 'metric-bar-navy',    val: '#1E2A5E', bg: '#EEF2FF' },
  }[status];

  return (
    <div className={`card-base p-4 ${cfg.bar} animate-fade-in-up ${delay}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-500" style={{ color: '#6B7280', fontWeight: 500 }}>{label}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: cfg.bg }}>
          {icon}
        </div>
      </div>
      <p className="num text-[22px] font-700 leading-none" style={{ fontWeight: 700, color: cfg.val }}>{value}</p>
      <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#9CA3AF' }}>
        <TrendingUp className="h-3 w-3" style={{ color: cfg.val }} />
        {sub}
      </p>
    </div>
  );
}

/* ── New KPI Benchmarks Row ── */
const KPI_BENCHMARKS = [
  { label: 'CAF / Loyers',     value: 1.38, threshold: 1.4,  unit: 'x',  fmt: (v: number) => v.toFixed(2) },
  { label: 'Couv. Charges',    value: 3.82, threshold: 3.0,  unit: 'x',  fmt: (v: number) => v.toFixed(2) },
  { label: 'Liquidité Gén.',   value: 1.29, threshold: 1.0,  unit: 'x',  fmt: (v: number) => v.toFixed(2) },
  { label: 'Levier Fin.',      value: 2.68, threshold: 3.0,  unit: 'x',  fmt: (v: number) => v.toFixed(2), inverse: true },
  { label: 'Autonomie Fin.',   value: 28.4, threshold: 20,   unit: '%',  fmt: (v: number) => v.toFixed(1) },
  { label: 'Cap. Remb.',       value: 0.44, threshold: 0.33, unit: '',   fmt: (v: number) => v.toFixed(2) },
  { label: 'Score Comport.',   value: 14.2, threshold: 12,   unit: '/20',fmt: (v: number) => v.toFixed(1) },
  { label: 'Score Sectoriel',  value: 13.8, threshold: 12,   unit: '/20',fmt: (v: number) => v.toFixed(1) },
];

function KpiBenchmarkCard({ label, value, threshold, unit, fmt, inverse = false, delay = '' }: {
  label: string; value: number; threshold: number; unit: string; fmt: (v: number) => string; inverse?: boolean; delay?: string;
}) {
  const good = inverse ? value <= threshold : value >= threshold;
  const pct = Math.min((value / (threshold * 1.5)) * 100, 100);
  return (
    <div className={`card-base p-3 animate-fade-in-up ${delay}`}>
      <p className="text-[10px] font-600 mb-1.5" style={{ color: '#9CA3AF', fontWeight: 600 }}>{label}</p>
      <p className="num text-[18px] font-700 leading-none" style={{ fontWeight: 700, color: good ? '#059669' : '#DC2626' }}>
        {fmt(value)}{unit}
      </p>
      <p className="text-[9px] mt-0.5" style={{ color: '#D1D5DB' }}>
        Seuil: {inverse ? '≤' : '≥'} {threshold}{unit}
      </p>
      <div className="progress-track mt-2">
        <div className="progress-fill" style={{ width: `${pct}%`, background: good ? '#059669' : '#DC2626' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const recent = mockApplications.slice(0, 5);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 style={{ color: '#0D1117' }}>Tableau de Bord</h1>
          <p className="text-[13px] mt-1" style={{ color: '#6B7280' }}>
            Portefeuille Crédit-Bail · Avril 2026 · Données en temps réel
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-500"
          style={{ background: '#ECFDF5', color: '#059669', border: '1px solid rgba(5,150,105,0.2)', fontWeight: 500 }}>
          <div className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ background: '#059669' }} />
          Live
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={<FileText className="h-4 w-4" style={{ color: '#1E2A5E' }} />}
          label="Demandes Totales" value={mockDashboardStats.totalDemandes}
          sub="Depuis le début" trend={{ value: 12.5, positive: true }}
          spark={SPARKS.demandes} sparkColor="#1E2A5E"
          accentClass="kpi-card-navy" delay="delay-50" />
        <KpiCard icon={<Clock className="h-4 w-4" style={{ color: '#D97706' }} />}
          label="En Cours" value={mockDashboardStats.enCours}
          sub="Traitement actif" trend={{ value: 8.2, positive: true }}
          spark={SPARKS.approuvees} sparkColor="#D97706"
          accentClass="kpi-card-amber" delay="delay-100" />
        <KpiCard icon={<CheckCircle className="h-4 w-4" style={{ color: '#059669' }} />}
          label="Approuvées" value={mockDashboardStats.approuvees}
          sub="Ce trimestre" trend={{ value: 15.3, positive: true }}
          spark={SPARKS.approuvees} sparkColor="#059669"
          accentClass="kpi-card-emerald" delay="delay-150" />
        <KpiCard icon={<XCircle className="h-4 w-4" style={{ color: '#DC2626' }} />}
          label="Refusées" value={mockDashboardStats.refusees}
          sub="Taux: 16.0%" trend={{ value: 3.1, positive: false }}
          spark={SPARKS.refusees} sparkColor="#DC2626"
          accentClass="kpi-card-red" delay="delay-200" />
      </div>

      {/* ── Metric Banners ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricBanner label="Montant Total Portefeuille" value={formatCurrency(mockDashboardStats.montantTotalPortefeuille)}
          sub="+18.2% vs mois dernier" status="navy"
          icon={<Wallet className="h-3.5 w-3.5" style={{ color: '#1E2A5E' }} />} delay="delay-100" />
        <MetricBanner label="Taux d'Approbation" value={`${mockDashboardStats.tauxApprobation}%`}
          sub="+2.4% vs mois dernier" status="success"
          icon={<Percent className="h-3.5 w-3.5" style={{ color: '#059669' }} />} delay="delay-150" />
        <MetricBanner label="Délai Moyen de Traitement" value={`${mockDashboardStats.delaiMoyenTraitement} j`}
          sub="-1.2 jours vs mois dernier" status="warning"
          icon={<Activity className="h-3.5 w-3.5" style={{ color: '#D97706' }} />} delay="delay-200" />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-base p-5 animate-fade-in-up delay-200">
          <div className="mb-4">
            <h3 className="text-[14px] font-600" style={{ fontWeight: 600, color: '#0D1117' }}>Répartition Sectorielle</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>Distribution par secteur d'activité</p>
          </div>
          <SectorPieChart data={mockSectorDistribution} />
        </div>
        <div className="card-base p-5 animate-fade-in-up delay-250">
          <div className="mb-4">
            <h3 className="text-[14px] font-600" style={{ fontWeight: 600, color: '#0D1117' }}>Évolution Mensuelle</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>Demandes, approbations et refus</p>
          </div>
          <TimeSeriesChart data={mockTimeSeriesData} />
        </div>
      </div>

      {/* ── KPI Benchmarks (nouveaux KPIs du PDF) ── */}
      <div className="animate-fade-in-up delay-300">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[14px] font-600" style={{ fontWeight: 600, color: '#0D1117' }}>Benchmarks KPIs Réglementaires</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>Conformité aux seuils · Grille scoring interne Avril 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {KPI_BENCHMARKS.map((k, i) => (
            <KpiBenchmarkCard key={k.label} {...k} delay={`delay-${(i + 1) * 50}`} />
          ))}
        </div>
      </div>

      {/* ── Recent Applications ── */}
      <div className="card-base overflow-hidden animate-fade-in-up delay-400">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#F3F4F6' }}>
          <div>
            <h3 className="text-[14px] font-600" style={{ fontWeight: 600, color: '#0D1117' }}>Dernières Demandes</h3>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>5 dossiers les plus récents</p>
          </div>
          <Link to={ROUTE_PATHS.APPLICATIONS}>
            <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1.5">
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                {['ID','Client','Segment','Secteur','Montant','Score','Classe','Statut','Date'].map(h => (
                  <th key={h} className={h === 'Montant' ? 'text-right' : ['Score','Classe','Statut','Date'].includes(h) ? 'text-center' : 'text-left'}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((app, i) => (
                <tr key={app.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                  <td><span className="num text-[12px] font-600" style={{ color: '#1E2A5E', fontWeight: 600 }}>{app.id}</span></td>
                  <td><span className="text-[13px] font-500" style={{ fontWeight: 500 }}>{app.client}</span></td>
                  <td>
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-500 badge-neutral" style={{ fontWeight: 500 }}>
                      {app.segment}
                    </span>
                  </td>
                  <td><span className="text-[12px]" style={{ color: '#6B7280' }}>{app.secteur}</span></td>
                  <td className="text-right"><span className="num text-[12px] font-600" style={{ fontWeight: 600 }}>{formatCurrency(app.montant)}</span></td>
                  <td className="text-center">
                    <span className="num text-[15px] font-700" style={{ fontWeight: 700, color: app.score >= 75 ? '#059669' : app.score >= 55 ? '#D97706' : '#DC2626' }}>
                      {app.score}
                    </span>
                  </td>
                  <td className="text-center">
                    <Badge className={`${getClassColor(app.classe)} text-[10px] h-5 px-1.5`}>{app.classe}</Badge>
                  </td>
                  <td className="text-center">
                    <Badge className={`${getStatusColor(app.statut)} text-[10px] h-5 px-1.5`}>{app.statut}</Badge>
                  </td>
                  <td className="text-center"><span className="text-[11px]" style={{ color: '#9CA3AF' }}>{formatDate(app.dateCreation)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
