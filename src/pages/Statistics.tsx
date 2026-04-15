import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  PieChart, 
  BarChart3, 
  Activity, 
  Zap,
  Layers,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  Pie,
  PieChart as RePieChart
} from 'recharts';
import { mockApplications } from '@/data/index';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#64748b'];

const tooltipStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  padding: '12px',
  fontSize: '11px',
  fontWeight: '600'
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', { 
    style: 'currency', 
    currency: 'MAD', 
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
}

export default function Statistics() {
  // ── REAL-TIME ANALYTICS ENGINE ──
  const stats = useMemo(() => {
    // 1. Portfolio Concentration (by Segment)
    const segmentsMap = mockApplications.reduce((acc, app) => {
      acc[app.segment] = acc[app.segment] || { name: app.segment, montant: 0, count: 0 };
      acc[app.segment].montant += app.montant;
      acc[app.segment].count += 1;
      return acc;
    }, {} as Record<string, any>);
    
    // 2. Score Distribution
    const distribution = [
      { range: '0-20', count: 0, color: '#f43f5e' },
      { range: '21-40', count: 0, color: '#f59e0b' },
      { range: '41-60', count: 0, color: '#6366f1' },
      { range: '61-80', count: 0, color: '#10b981' },
      { range: '81-100', count: 0, color: '#059669' },
    ];
    mockApplications.forEach(app => {
      if (app.score <= 20) distribution[0].count++;
      else if (app.score <= 40) distribution[1].count++;
      else if (app.score <= 60) distribution[2].count++;
      else if (app.score <= 80) distribution[3].count++;
      else distribution[4].count++;
    });

    // 3. Sector Analytics (Advanced)
    const sectorsMap = mockApplications.reduce((acc, app) => {
      acc[app.secteur] = acc[app.secteur] || { name: app.secteur, exposed: 0, count: 0, meanBam: 0, meanScore: 0 };
      acc[app.secteur].exposed += app.montant;
      acc[app.secteur].count += 1;
      acc[app.secteur].meanBam += app.kpi.cotationBAM;
      acc[app.secteur].meanScore += app.score;
      return acc;
    }, {} as Record<string, any>);

    // 4. Decision Engine Audit (Confusion Matrix Logic)
    // Predicted: Score >= 70 -> Approuvé | Actual: statut === 'Approuvé'
    let tp = 0, fp = 0, fn = 0, tn = 0;
    mockApplications.forEach(app => {
      const predicted = app.score >= 70;
      const actual = app.statut === 'Approuvé';
      if (predicted && actual) tp++;
      else if (predicted && !actual) fp++;
      else if (!predicted && actual) fn++;
      else tn++;
    });

    return {
      segments: Object.values(segmentsMap),
      distribution,
      sectors: Object.values(sectorsMap).sort((a, b) => b.exposed - a.exposed),
      matrix: { tp, fp, fn, tn },
      accuracy: ((tp + tn) / mockApplications.length) * 100
    };
  }, []);

  return (
    <div className="w-full px-10 py-10 space-y-10 bg-slate-50/30 min-h-screen">
      {/* ── INSTITUTIONAL HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="h-10 w-2 bg-emerald-500 rounded-full" />
             <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Intelligence Portefeuille</h1>
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-5">
            Moteur d'Audit Analytique · Données Réelles · <span className="text-emerald-500">Live Portefeuille</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 px-8">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Decision Engine Trust</p>
                 <p className="text-2xl font-black text-emerald-600 font-mono">{stats.accuracy.toFixed(1)}%</p>
              </div>
              <div className="h-10 w-px bg-slate-100" />
              <Activity className="text-emerald-500" size={24} />
           </div>
        </div>
      </div>

      {/* ── TOP SECTION: PERFORMANCE & SENSITIVITY ── */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
        {/* Decision Matrix Audit */}
        <Card className="lg:col-span-5 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="pb-8 pt-8 px-8">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-emerald-500" size={20} />
              <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Audit Moteur de Décision</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-tight">Analyse de concordance Score vs Statut Réel</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Vrais Positifs', val: stats.matrix.tp, color: 'bg-emerald-500', icon: ShieldCheck },
                 { label: 'Faux Positifs', val: stats.matrix.fp, color: 'bg-amber-400', icon: AlertTriangle },
                 { label: 'Faux Négatifs', val: stats.matrix.fn, color: 'bg-rose-400', icon: Zap },
                 { label: 'Vrais Négatifs', val: stats.matrix.tn, color: 'bg-slate-800', icon: Target },
               ].map((item) => (
                 <div key={item.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:scale-[1.02] group">
                    <div className="flex items-center justify-between mb-2">
                       <item.icon className="text-slate-400 group-hover:text-emerald-500 transition-colors" size={16} />
                       <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 font-mono">{item.val}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{item.label}</p>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Exposure (Segment) */}
        <Card className="lg:col-span-7 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="pb-8 pt-8 px-8">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <PieChart className="text-indigo-500" size={20} />
                  <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Exposition par Segment</CardTitle>
               </div>
               <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 font-black px-4 py-1.5 rounded-full text-[10px]">RÉEL 2026</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={stats.segments}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="montant"
                  >
                    {stats.segments.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.2)" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v as number)} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
               {stats.segments.map((s, i) => (
                 <div key={s.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{s.name}</span>
                    </div>
                    <p className="text-sm font-black text-slate-900">{formatCurrency(s.montant)}</p>
                    <p className="text-[10px] font-bold text-slate-400">{s.count} Dossiers</p>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── MIDDLE SECTION: SCORE & DISTRIBUTION ── */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3">
               <BarChart3 className="text-emerald-500" size={20} />
               <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Distribution du Scoring</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.distribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                     {stats.distribution.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8">
            <div className="flex items-center gap-3">
               <Layers className="text-rose-500" size={20} />
               <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">Santé par Secteur</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-10">
             <Table>
                <TableHeader>
                   <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase text-slate-400">Secteur</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 text-center">Score Moyen</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-slate-400 text-right">Encours (MAD)</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {stats.sectors.slice(0, 4).map((s) => (
                      <TableRow key={s.name} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                         <TableCell className="py-4">
                            <span className="text-sm font-black text-slate-800 tracking-tight">{s.name}</span>
                            <div className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">{s.count} Demandes</div>
                         </TableCell>
                         <TableCell className="text-center">
                            <Badge className={`${(s.meanScore/s.count) > 70 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} font-black text-[10px] rounded-full`}>
                               {(s.meanScore / s.count).toFixed(1)}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right">
                            <span className="text-xs font-black text-slate-900">{formatCurrency(s.exposed)}</span>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
             <div className="mt-8 flex justify-center">
                <button className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors decoration-emerald-500 underline-offset-8 underline">
                   Voir Analyse Sectorielle Complète
                </button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* ── KPI BENCHMARKS GRID ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <Zap className="text-amber-500" size={20} />
           <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Audits de Conformité Portefeuille</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'CAF / Loyers Cible', val: '≥ 1.40', current: 1.38, status: 'warn' },
             { label: 'Liquidité Globale', val: '> 1.00', current: 1.25, status: 'good' },
             { label: 'LTV Moyenne', val: '≤ 75.0%', current: '71.2%', status: 'good' },
             { label: 'Note BAM Publique', val: '≤ 6.0', current: '3.4', status: 'good' },
           ].map((kpi) => (
             <div key={kpi.label} className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                   <div className={`p-3 rounded-2xl ${kpi.status === 'good' ? 'bg-emerald-50 border border-emerald-100' : 'bg-amber-50 border border-amber-100'}`}>
                      <ShieldCheck size={20} className={kpi.status === 'good' ? 'text-emerald-500' : 'text-amber-500'} />
                   </div>
                   <span className="text-[10px] font-black text-slate-300 uppercase letter spacing-widest">Target: {kpi.val}</span>
                </div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase mb-2 tracking-tight">{kpi.label}</h3>
                <p className={`text-3xl font-black mb-4 font-mono ${kpi.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}`}>
                   {kpi.current}
                </p>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                   <div 
                     className={`h-full rounded-full ${kpi.status === 'good' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'}`} 
                     style={{ width: kpi.status === 'good' ? '85%' : '65%' }}
                   />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
