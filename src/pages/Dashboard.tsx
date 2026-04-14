import { CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownRight, TrendingUp, Activity, Wallet, ChevronRight, Share, Zap, MoreHorizontal, Layers, Target, ShieldCheck, Timer, AlertTriangle, Cpu, BarChart2, Download, Filter, ShieldAlert } from 'lucide-react';
import { SectorPieChart, TimeSeriesChart, Sparkline } from '@/components/Charts';
import { mockApplications, mockDashboardStats, mockSectorDistribution, mockTimeSeriesData } from '@/data/index';
import { formatCurrency, formatDate } from '@/lib/index';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';

/* ── Capital Guard Style (Design Only) ── */

function CapitalKPI({ label, value, trend, icon: Icon, chartData }: any) {
  const isPositive = trend?.positive;
  const color = isPositive ? '#10B981' : '#F43F5E';

  return (
    <div className="bg-white p-5 border border-slate-200/60 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="text-[#565e74]">
           <Icon size={18} />
        </div>
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

function EfficiencySegment({ label, value }: any) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase mb-2 text-slate-600">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
        <div className="bg-[#565e74] h-full transition-all duration-1000" style={{ width: value }}></div>
      </div>
    </div>
  );
}

function BenchmarkRow({ label, value, target, isBad = false }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 grow">
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full ${isBad ? 'bg-red-500' : 'bg-emerald-500'}`} />
        <span className="text-[11px] font-bold text-slate-500 uppercase">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-md font-black ${isBad ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
        <span className="text-[9px] font-bold text-slate-300 uppercase">Target {target}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const recent = mockApplications.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in max-w-[1500px] mx-auto">
      
      {/* ── KPI Matrix ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CapitalKPI label="Demandes Actives" value={mockDashboardStats.totalDemandes.toLocaleString()} trend={{ value: 14.2, positive: true }} icon={Layers} chartData={[31, 40, 28, 51, 42, 109, 100]} />
        <CapitalKPI label="En Files Attente" value={mockDashboardStats.enCours.toLocaleString()} trend={{ value: 5.8, positive: false }} icon={Clock} chartData={[11, 32, 45, 32, 34, 52, 41]} />
        <CapitalKPI label="Décisions OK" value={mockDashboardStats.approuvees.toLocaleString()} trend={{ value: 12.1, positive: true }} icon={CheckCircle} chartData={[35, 20, 45, 60, 55, 70, 90]} />
        <CapitalKPI label="Encours Global" value={formatCurrency(mockDashboardStats.montantTotalPortefeuille).split(',')[0]} trend={{ value: 8.4, positive: true }} icon={Wallet} chartData={[50, 55, 45, 60, 58, 65, 75]} />
      </section>

      {/* ── Core Intelligence Grid ── */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Activity Flux */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/60 rounded-lg p-7 shadow-sm">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">Évolution de l'Octroi</h3>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                 {['Détail', 'Hebdo', 'Mois'].map((v, i) => (
                   <button key={v} className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${i === 2 ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400'}`}>{v}</button>
                 ))}
              </div>
           </div>

           <div className="h-72 w-full">
              <TimeSeriesChart data={mockTimeSeriesData} />
           </div>
        </div>

        {/* Diagnostic & Pie */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <div className="bg-white border border-slate-200/60 rounded-lg p-7 shadow-sm h-full flex flex-col">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">Répartition Sectorielle</h4>
              <div className="flex-1 min-h-[280px] w-full">
                 <SectorPieChart data={mockSectorDistribution} />
              </div>
           </div>
        </div>
      </div>

      {/* ── Benchmarks (RESTORING ORIGINAL LABELS) ── */}
      <section className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 bg-white border border-slate-200/60 rounded-lg p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <ShieldCheck size={24} className="text-[#565e74]" />
              <h3 className="text-md uppercase tracking-tight font-black">Compliance Score</h3>
           </div>
           <div className="space-y-1">
              <BenchmarkRow label="CAF / Loyers (Bâle III)" value="1.42" target="1.40" />
              <BenchmarkRow label="Couverture Charges" value="3.15" target="3.00" />
              <BenchmarkRow label="Ratio Liquidité" value="0.98" target="1.00" isBad />
              <BenchmarkRow label="Levier Financier" value="2.14" target="2.50" />
           </div>
        </div>

        {/* Action Registry (RESTORING ORIGINAL LABELS) */}
        <div className="lg:w-2/3 bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div>
                <h3 className="text-md font-black text-slate-800 uppercase tracking-tight">Flux de Décisions Récents</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mise à jour Alpha-v4</p>
              </div>
              <Link to={ROUTE_PATHS.APPLICATIONS}>
                 <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 gap-2 hover:text-[#565e74]">
                    Registre complet <ChevronRight size={14} />
                 </Button>
              </Link>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50/50">
                    {['Référence', 'Contrepartie', 'Engagement', 'Scoring', 'Status'].map(h => (
                      <th key={h} className="px-8 py-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{h}</th>
                    ))}
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {recent.map((app) => (
                   <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                      <td className="px-8 py-5 text-xs font-bold tabular-nums text-slate-400">{app.id}</td>
                      <td className="px-8 py-5">
                         <p className="text-xs font-black text-slate-800">{app.client}</p>
                         <p className="text-[9px] text-slate-400 uppercase font-medium mt-1">{app.secteur}</p>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-800 tabular-nums">
                        {formatCurrency(app.montant).split(',')[0]}
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-900">{app.score}</span>
                            <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-[#565e74]" style={{ width: `${app.score}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                           app.statut === 'Approuvé' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                         }`}>
                           <span className={`w-1 h-1 rounded-full ${app.statut === 'Approuvé' ? 'bg-emerald-700' : 'bg-rose-700'}`} />
                           {app.statut}
                         </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </section>

    </div>
  );
}
