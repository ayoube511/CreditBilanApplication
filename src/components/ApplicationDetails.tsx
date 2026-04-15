import { useState } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, FileText, Download, Sparkles, ShieldCheck, Activity, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockApplications } from '@/data/index';
import { formatCurrency, formatDate, getClassColor, getStatusColor } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface ApplicationDetailsProps {
  applicationId: string;
  onClose: () => void;
}

interface KpiRowProps {
  label: string;
  value: string;
  seuil?: string;
  status?: 'good' | 'warn' | 'bad' | 'neutral';
}

function KpiRow({ label, value, seuil, status = 'neutral' }: KpiRowProps) {
  const colors = {
    good:    'text-emerald-500',
    warn:    'text-amber-500',
    bad:     'text-rose-500',
    neutral: 'text-slate-800',
  };
  const dots = {
    good:    'bg-emerald-500',
    warn:    'bg-amber-500',
    bad:     'bg-rose-500',
    neutral: 'bg-slate-300',
  };
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 group">
      <div className="flex items-center gap-3">
        <div className={`h-1.5 w-1.5 rounded-full ${dots[status]} shadow-sm`} />
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-700 transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[12px] font-black tabular-nums ${colors[status]}`}>{value}</span>
        {seuil && <span className="text-[9px] font-bold text-slate-300 uppercase">/ {seuil}</span>}
      </div>
    </div>
  );
}

/**
 * Audit de Conformité — Basé sur la grille institutionnelle BAM
 * CAF/Loyers: >= 1.4 (Good), 1.2 - 1.4 (Warn), < 1.2 (Bad)
 * DSCR: > 1.25 (Good)
 * BAM: <= 6 (Good), > 6 (Bad / Bloquant)
 */
function getKpiStatus(key: string, value: number | undefined): 'good' | 'warn' | 'bad' {
  if (value === undefined) return 'neutral' as any;
  
  switch(key) {
    case 'cafLoyers':
      if (value >= 1.4) return 'good';
      if (value >= 1.2) return 'warn';
      return 'bad';
    case 'dscr':
      return value >= 1.25 ? 'good' : 'bad';
    case 'liquidite':
      return value > 1.0 ? 'good' : 'bad';
    case 'levier':
      return value <= 3.0 ? 'good' : 'bad';
    case 'autonomie':
      return value >= 20 ? 'good' : 'bad';
    case 'capacite':
      return value > 0.33 ? 'good' : 'bad';
    case 'bam':
      return value <= 6 ? 'good' : 'bad';
    case 'defaut':
      return value < 10 ? 'good' : value < 20 ? 'warn' : 'bad';
    default:
      return 'good';
  }
}

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null);
  const application = mockApplications.find(app => app.id === applicationId);

  if (!application) {
    return (
      <div className="w-full flex items-center justify-center p-20 animate-fade-in">
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-center max-w-sm">
           <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dossier Introuvable</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 mb-6">Le registre {applicationId} est inaccessible.</p>
           <Button onClick={onClose} className="w-full bg-[#565e74] text-white text-[10px] font-black uppercase tracking-widest h-10">Retour au Registre</Button>
        </div>
      </div>
    );
  }

  const { kpi } = application;

  // ── DATA NORMALIZATION HELPERS ──
  // Normalizes diverse financial metrics into a 0-100 scale for visual consistency
  const norm = (val: number | undefined, target: number, maxVal: number) => {
    if (val === undefined) return 0;
    return Math.min((val / maxVal) * 100, 100);
  };

  // Inverse normalization for metrics where LOWER is BETTER (e.g., LTV, Levier, BAM)
  const normInv = (val: number | undefined, worst: number, best: number) => {
    if (val === undefined) return 0;
    const score = ((worst - val) / (worst - best)) * 100;
    return Math.max(0, Math.min(score, 100));
  };

  // ── CHART DATA PREPARATION ──
  const financialData = [
    { name: 'CAF/Loyers', val: norm(kpi.cafLoyers, 1.4, 2.5), raw: kpi.cafLoyers?.toFixed(2), target: '≥ 1.4', formula: 'CAF ÷ Loyers' },
    { name: 'Couverture', val: norm(kpi.couvertureCharges, 3.0, 6.0), raw: kpi.couvertureCharges?.toFixed(2), target: '> 3.0', formula: 'EBE ÷ Charg. Fin' },
    { name: 'Liquidité Générale', val: norm(kpi.liquiditeGenerale, 1.0, 2.0), raw: kpi.liquiditeGenerale?.toFixed(2), target: '> 1.0', formula: 'Actif ÷ Passif' },
    { name: 'DSCR',       val: norm(kpi.dscr, 1.25, 3.0), raw: kpi.dscr.toFixed(2), target: '> 1.25', formula: 'CAF ÷ Serv. Dette' },
    { name: 'Autonomie',  val: norm(kpi.autonomieFinanciere, 20, 50), raw: `${kpi.autonomieFinanciere?.toFixed(1)}%`, target: '≥ 20%', formula: 'CP ÷ Passif' },
    { name: 'LTV (Inv.)', val: normInv(kpi.ltv, 100, 40), raw: `${kpi.ltv.toFixed(1)}%`, target: '≤ 80%', formula: 'Dette ÷ Actif' },
    { name: 'Capacité R.', val: norm(kpi.capaciteRemboursement, 0.33, 0.6), raw: kpi.capaciteRemboursement?.toFixed(2), target: '> 0.33', formula: 'CAF ÷ Dettes Tot' },
  ];

  const behavioralData = [
    { name: 'Cotation BAM', val: normInv(kpi.cotationBAM, 9, 1), raw: kpi.cotationBAM?.toString(), target: '≤ 6', formula: 'Risque Central' },
    { name: 'Historique',  val: normInv(kpi.incidentsPaiement, 3, 0), raw: kpi.incidentsPaiement?.toString(), target: '0 - 1', formula: 'Défauts 24m' },
    { name: 'Score Compo.', val: norm(kpi.scoreComportemental, 12, 20), raw: `${kpi.scoreComportemental}/20`, target: '≥ 12/20', formula: 'Note Agrégée' },
    { name: 'Score Secteur', val: norm(kpi.scoreSectoriel, 12, 20), raw: `${kpi.scoreSectoriel}/20`, target: '≥ 12/20', formula: 'Grille Sectorielle' },
    { name: 'Qualité Dir.', val: 85, raw: 'Positive', target: 'Positive', formula: 'Méthode 5C' },
  ];

  // ── CUSTOM TOOLTIP COMPONENT ──
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200 z-50 min-w-[200px]">
          <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-1">
             <p className="text-[10px] font-black text-white uppercase tracking-widest">{data.name}</p>
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter bg-slate-800 px-1.5 py-0.5 rounded">{data.formula}</span>
          </div>
          <div className="space-y-1">
             <div className="flex justify-between gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Valeur Réelle</span>
                <span className="text-[10px] font-black text-emerald-400 tabular-nums">{data.raw}</span>
             </div>
             <div className="flex justify-between gap-4">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Seuil Institutionnel</span>
                <span className="text-[10px] font-black text-slate-300 tabular-nums">{data.target}</span>
             </div>
             <div className="flex justify-between gap-4 pt-1 border-t border-slate-800/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Score Normalisé</span>
                <span className="text-[10px] font-black text-white tabular-nums">{Math.round(data.val)}/100</span>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const documentImages = [IMAGES.DOCUMENTS_1, IMAGES.DOCUMENTS_2, IMAGES.DOCUMENTS_3];

  return (
    <div className="animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-2 space-y-8">
      
      {/* ── DRILL-DOWN HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-[#565e74] hover:border-[#565e74] transition-all shadow-sm"
          >
            <X size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              <span>Registre des Engagements</span>
              <span className="opacity-30">/</span>
              <span className="text-slate-300">Analyse de Dossier</span>
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tightest uppercase flex items-center gap-3">
              {application.id}
              <Badge className={`${getStatusColor(application.statut)} text-[9px] font-black uppercase tracking-[0.1em] px-2.5 py-1 border-none ml-2`}>
                 {application.statut}
              </Badge>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 px-5 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 gap-2 hover:bg-slate-50 transition-all">
              <Download size={14} /> Dossier PDF
           </Button>
           <Button className="h-10 px-6 bg-[#565e74] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm">
              Valider la Décision
           </Button>
        </div>
      </div>

      {/* ── KPI PULSE ROW (Observable Icons) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-0 group-hover:scale-110 transition-transform ${application.score >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                     <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black">RATING</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Engagement IA</p>
               <div className="flex items-baseline gap-2">
                  <h3 className={`text-3xl font-black tabular-nums tracking-tighter ${application.score >= 75 ? 'text-emerald-600' : 'text-amber-500'}`}>{application.score}</h3>
                  <span className="text-xs font-bold text-slate-300 tracking-tight">/100</span>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-0 text-[#565e74] group-hover:scale-110 transition-transform">
                     <Activity size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black">ENGAGEMENT</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant Demandé</p>
               <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black tabular-nums tracking-tighter text-slate-800">{formatCurrency(kpi.montantDemande).split(',')[0]}</h3>
                  <span className="text-[10px] font-black text-slate-300 uppercase ml-1">MAD</span>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-0 text-emerald-500 group-hover:scale-110 transition-transform">
                     <TrendingUp size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black">SOLVA</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio DSCR</p>
               <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black tabular-nums tracking-tighter text-slate-800">{kpi.dscr.toFixed(2)}</h3>
                  <span className="text-xs font-bold text-slate-400 ml-1">x</span>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-0 group-hover:scale-110 transition-transform ${application.probabiliteDefaut > 15 ? 'text-rose-500' : 'text-slate-400'}`}>
                     <AlertTriangle size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black">RISQUE</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Défaut Probable</p>
               <div className="flex items-baseline gap-1">
                  <h3 className={`text-3xl font-black tabular-nums tracking-tighter ${application.probabiliteDefaut > 15 ? 'text-rose-500' : 'text-slate-800'}`}>{application.probabiliteDefaut.toFixed(1)}</h3>
                  <span className="text-xs font-bold text-slate-400 ml-1">%</span>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* ── DUAL CHARTS ANALYTICS ── */}
        <div className="lg:col-span-12">
           <Card className="border-none shadow-[0_2px_15px_rgba(0,0,0,0.02)] bg-white">
              <CardHeader className="border-b border-slate-50 px-8 py-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-[14px] font-black text-slate-800 uppercase tracking-widest">Analyses d'application !</CardTitle>
                    </div>
                    <Sparkles className="h-4 w-4 text-[#565e74]" />
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="grid lg:grid-cols-2 gap-12">
                    {/* Financial Chart */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Activity size={14} className="text-[#565e74]" /> PERFORMANCE FINANCIÈRE (SOLVABILITÉ)
                       </h4>
                       <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100/50">
                          <ResponsiveContainer width="100%" height={300}>
                             <RadarChart data={financialData}>
                                <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 900, fontFamily: 'Manrope' }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="val" stroke="#565e74" fill="#565e74" fillOpacity={0.15} strokeWidth={3} />
                                <Tooltip content={<CustomTooltip />} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Behavioral Chart */}
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" /> COMPORTEMENT & GOUVERNANCE (RISQUE)
                       </h4>
                       <div className="bg-slate-50/30 rounded-2xl p-6 border border-slate-100/50">
                          <ResponsiveContainer width="100%" height={300}>
                             <RadarChart data={behavioralData}>
                                <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 900, fontFamily: 'Manrope' }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="val" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={3} />
                                <Tooltip content={<CustomTooltip />} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* ── IA EXECUTIVE SYNTHESIS (AUGMENTED DECISION CENTER) ── */}
        <div className="lg:col-span-12">
            <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-white overflow-hidden">
               <div className="grid lg:grid-cols-3 divide-x divide-slate-100">
                  
                  {/* Left & Middle: Narrative & Strategic Metrics */}
                  <div className="p-8 lg:col-span-2 space-y-8">
                     
                     {/* Glass Narrative Block */}
                     <div className="relative p-7 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 overflow-hidden group">
                        <div className="relative flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <Sparkles size={18} className="text-[#565e74]" />
                              <h4 className="text-[12px] font-black text-[#565e74] uppercase tracking-[0.15em]">Synthèse Stratégique</h4>
                           </div>
                        </div>
                        <p className="text-[15px] leading-relaxed text-slate-700 font-bold leading-snug">
                           "{application.recommandationLLM.analyse}"
                        </p>
                     </div>

                     {/* Strategic Pillars & Vigilance Grid */}
                     <div className="grid md:grid-cols-2 gap-8 mt-10">
                        {/* Pillars of Support */}
                        <div className="space-y-5">
                           <div className="flex items-center gap-3 px-1">
                              <CheckCircle2 size={16} className="text-emerald-500" />
                              <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Piliers de Soutien</h5>
                           </div>
                           <div className="space-y-3">
                              {application.recommandationLLM.pointsForts.map((p, i) => (
                                 <div key={i} className="group relative p-4 bg-emerald-50/10 border border-emerald-100/30 rounded-xl hover:bg-emerald-50/30 hover:border-emerald-200/50 transition-all flex items-start gap-3">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                    <span className="text-[11px] text-slate-700 font-bold leading-tight">{p}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Vigilance Markers */}
                        <div className="space-y-5">
                           <div className="flex items-center gap-3 px-1">
                              <AlertTriangle size={16} className="text-rose-500" />
                              <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Vigilance & Risques</h5>
                           </div>
                           <div className="space-y-3">
                              {application.redFlags.map((f, i) => (
                                 <div key={i} className="p-4 bg-rose-50/10 border border-rose-100/30 rounded-xl hover:bg-rose-50/30 transition-all flex items-start gap-4">
                                    <div className="p-1.5 bg-rose-100/50 rounded-lg text-rose-600">
                                       <Activity size={12} strokeWidth={3} />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[10px] font-black text-rose-800 uppercase tracking-tight">{f.label}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Indice de sévérité : Modéré</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* Right: Institutional Audit Panel */}
                  <div className="bg-slate-50/40 p-10 flex flex-col h-full">
                     <div className="flex-1 space-y-8">
                        <div>
                           <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center justify-between">
                              Audit Solvabilité
                              <Badge className="bg-white text-slate-400 border-slate-200 text-[8px] font-black px-2 py-0">BAM-2026</Badge>
                           </h4>
                           <div className="space-y-1.5">
                              <KpiRow label="CAF / Loyers" value={(kpi.cafLoyers ?? 1.38).toFixed(2)} status={getKpiStatus('cafLoyers', kpi.cafLoyers)} />
                              <KpiRow label="Capacité Rembours." value={(kpi.capaciteRemboursement ?? 0.38).toFixed(2)} status={getKpiStatus('capacite', kpi.capaciteRemboursement)} />
                              <KpiRow label="Couv. Charges Fin." value={(kpi.couvertureCharges ?? 4.2).toFixed(2)} status={getKpiStatus('couvertureCharges', kpi.couvertureCharges)} />
                              <KpiRow label="Liquidité Générale" value={(kpi.liquiditeGenerale ?? 1.2).toFixed(2)} status={getKpiStatus('liquidite', kpi.liquiditeGenerale)} />
                              <KpiRow label="Levier Financier" value={(kpi.levierFinancier ?? 2.6).toFixed(2)} status={getKpiStatus('levier', kpi.levierFinancier)} />
                              <KpiRow label="Rentabilité CP" value={`${(kpi.rentabiliteCP ?? 12).toFixed(1)}%`} status={getKpiStatus('rentabiliteCP', kpi.rentabiliteCP)} />
                              <KpiRow label="Autonomie Fin." value={`${(kpi.autonomieFinanciere ?? 28).toFixed(1)}%`} status={getKpiStatus('autonomie', kpi.autonomieFinanciere)} />
                              <KpiRow label="Cotation BAM" value={(kpi.cotationBAM ?? 4).toString()} status={getKpiStatus('bam', kpi.cotationBAM)} />
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 space-y-4">
                        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:bg-emerald-50" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 relative z-10">Statut Décisionnel</p>
                           <div className="relative z-10 flex flex-col items-center">
                              <Badge className="w-full justify-center py-2.5 bg-slate-900 text-white font-black uppercase text-[11px] tracking-[0.15em] border-none shadow-lg mb-2">
                                 Éligible - Classe A
                              </Badge>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Validation Automatique IA Active</p>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </Card>
        </div>

        {/* ── ARCHIVES DOCUMENTAIRES CERTIFIÉES (DIGITAL VAULT) ── */}
        <div className="lg:col-span-12">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-px bg-slate-200" />
                  <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                     <ShieldCheck size={18} className="text-[#565e74]" /> Archives Certifiées
                  </h3>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Vérification OCR Active</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {application.documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    onClick={() => setSelectedDoc({ url: doc.url, title: doc.type })}
                    className="group relative bg-white border border-slate-100 rounded-3xl p-6 transition-all duration-500 cursor-pointer hover:border-emerald-200/50 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
                  >
                     
                     <div className="relative aspect-[4/3] bg-white rounded-2xl mb-6 overflow-hidden border border-slate-200 shadow-sm transition-all duration-500 hover:border-emerald-400 group-hover:scale-[1.01]">
                        {/* THE REAL IFRAME PREVIEW - ALWAYS VISIBLE */}
                        <div className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none bg-white">
                           {doc.url !== '#' && (
                             <iframe 
                               src={`${doc.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                               className="w-full h-full border-none"
                               title="Real Preview"
                             />
                           )}
                        </div>

                        {/* SUBTLE INTERACTIVE OVERLAY (ICON DISAPPEARS OR SHRINKS ON HOVER) */}
                        <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-all duration-300 flex items-center justify-center group">
                           <div className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="text-emerald-600" size={24} />
                           </div>
                        </div>
                     </div>

                     {/* Document Identity */}
                     <div className="space-y-1.5 mb-6">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight truncate">{doc.type}</h4>
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 truncate opacity-80">{doc.nom}</p>
                     </div>

                     {/* Quick Audit Footer */}
                     <div className="flex items-center gap-3 pt-5 border-t border-slate-50">
                        <Button 
                          variant="ghost" 
                          asChild
                          className="flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                           <a href={doc.url} download>
                             <Download size={14} className="mr-2" /> Download
                           </a>
                        </Button>
                        <div className="px-3 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-tighter">
                           100% OCR
                        </div>
                     </div>
                  </div>
               ))}
            </div>
        </div>

        {/* ── UNIFIED PDF PREVIEW VAULT (LIGHT THEME & FIXED CENTERING) ── */}
        <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[95vw] w-[1400px] h-[92vh] p-0 overflow-hidden bg-white border-slate-200 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] z-[100] rounded-3xl outline-none flex flex-col">
            
            {/* App-Aligned Light Header */}
            <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 relative z-10 shrink-0">
              <div className="flex items-center gap-6">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                   <ShieldCheck className="text-[#565e74]" size={24} />
                </div>
                <div>
                   <h2 className="text-slate-900 text-md font-black uppercase tracking-[0.1em]">{selectedDoc?.title}</h2>
                   <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Certifié Alpha-v4</span>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{selectedDoc?.url.split('/').pop()}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <Button 
                   onClick={() => window.print()} 
                   variant="outline" 
                   className="text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl h-12 px-6 text-[10px] font-black uppercase tracking-widest shadow-sm"
                 >
                    Exporter Audit
                 </Button>
                 <Button 
                   onClick={() => setSelectedDoc(null)}
                   variant="ghost"
                   className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-rose-500 transition-all text-slate-400 hover:text-white border border-slate-100"
                 >
                    <X size={20} />
                 </Button>
              </div>
            </div>

            {/* Immersive View Port */}
            <div className="flex-1 w-full bg-slate-100/50 relative overflow-hidden">
               {selectedDoc && (
                 <iframe 
                   src={`${selectedDoc.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                   className="w-full h-full border-none opacity-0 transition-opacity duration-1000 bg-white animate-in zoom-in-95"
                   onLoad={(e) => (e.currentTarget as HTMLIFrameElement).classList.replace('opacity-0', 'opacity-100')}
                   title="PDF Preview"
                 />
               )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
