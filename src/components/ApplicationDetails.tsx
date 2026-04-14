import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, FileText, Download, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockApplications } from '@/data/index';
import { formatCurrency, formatDate, getClassColor, getStatusColor } from '@/lib/index';
import { IMAGES } from '@/assets/images';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

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
    good:    'text-chart-2',
    warn:    'text-chart-3',
    bad:     'text-chart-4',
    neutral: 'text-foreground',
  };
  const dots = {
    good:    'bg-chart-2',
    warn:    'bg-chart-3',
    bad:     'bg-chart-4',
    neutral: 'bg-muted-foreground',
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold font-mono ${colors[status]}`}>{value}</span>
        {seuil && <span className="text-[10px] text-muted-foreground/60">({seuil})</span>}
      </div>
    </div>
  );
}

function getKpiStatus(value: number | undefined, threshold: number, direction: 'above' | 'below'): 'good' | 'warn' | 'bad' {
  if (value === undefined) return 'neutral' as 'bad';
  const ratio = direction === 'above' ? value / threshold : threshold / value;
  if (ratio >= 1.1) return 'good';
  if (ratio >= 0.9) return 'warn';
  return 'bad';
}

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const application = mockApplications.find(app => app.id === applicationId);

  if (!application) {
    return (
      <div className="w-full flex items-center justify-center p-20 animate-fade-in">
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-center max-w-sm">
           <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dossier de Introuvable</h3>
           <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 mb-6">Le registre {applicationId} est inaccessible.</p>
           <Button onClick={onClose} className="w-full bg-[#565e74] text-white text-[10px] font-black uppercase tracking-widest h-10">Retour au Registre</Button>
        </div>
      </div>
    );
  }

  const { kpi } = application;

  const radarData = [
    { critere: 'DSCR',       valeur: Math.min(kpi.dscr / 4 * 100, 100) },
    { critere: 'LTV',        valeur: Math.max(100 - kpi.ltv, 0) },
    { critere: 'EBITDA',     valeur: Math.min(kpi.ebitda / 1000000 * 100, 100) },
    { critere: 'Liquidité',  valeur: Math.min((kpi.liquiditeGenerale ?? kpi.ratioLiquidite ?? 1) / 2 * 100, 100) },
    { critere: 'CAF/Loyers', valeur: Math.min((kpi.cafLoyers ?? 1) / 2 * 100, 100) },
    { critere: 'Comport.',   valeur: application.score },
  ];

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
              <span>Registre</span>
              <span className="opacity-30">/</span>
              <span className="text-slate-300">Dossier</span>
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

      {/* ── KPI PULSE ROW (Minimalist Observable Icons) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* KPI: AI Score */}
         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-0 text-slate-900 group-hover:scale-110 transition-transform ${application.score >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                     <ShieldCheck size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black tracking-tighter">RATING</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Score Engagement</p>
               <div className="flex items-baseline gap-2">
                  <h3 className={`text-3xl font-black tabular-nums tracking-tighter ${application.score >= 75 ? 'text-emerald-600' : 'text-amber-500'}`}>{application.score}</h3>
                  <span className="text-xs font-bold text-slate-300 tracking-tight">/100</span>
               </div>
            </CardContent>
         </Card>

         {/* KPI: Engagement */}
         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-0 text-[#565e74] group-hover:scale-110 transition-transform">
                     <Activity size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black tracking-tighter">FINANCE</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement Total</p>
               <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black tabular-nums tracking-tighter text-slate-800">{formatCurrency(kpi.montantDemande).split(',')[0]}</h3>
                  <span className="text-[10px] font-black text-slate-300 uppercase ml-1">MAD</span>
               </div>
            </CardContent>
         </Card>

         {/* KPI: Solvabilité */}
         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className="p-0 text-emerald-500 group-hover:scale-110 transition-transform">
                     <TrendingUp size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black tracking-tighter">SOLVABILITÉ</Badge>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ratio DSCR</p>
               <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black tabular-nums tracking-tighter text-slate-800">{kpi.dscr.toFixed(2)}</h3>
                  <span className="text-xs font-bold text-slate-400 ml-1">x</span>
               </div>
            </CardContent>
         </Card>

         {/* KPI: Probabilité Défaut */}
         <Card className="border-none shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
               <div className="flex justify-between items-start mb-2">
                  <div className={`p-0 group-hover:scale-110 transition-transform ${application.probabiliteDefaut > 15 ? 'text-rose-500' : 'text-slate-400'}`}>
                     <AlertTriangle size={24} strokeWidth={2.5} />
                  </div>
                  <Badge className="bg-slate-50 text-slate-400 border-slate-100 text-[8px] font-black tracking-tighter">RISQUE</Badge>
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
        {/* Risk Radar & Analytics */}
        <div className="lg:col-span-12">
           <Card className="border-none shadow-[0_2px_15px_rgba(0,0,0,0.02)] bg-white">
              <CardHeader className="border-b border-slate-50 px-8 py-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Analyse Factorielle Multidimensionnelle</CardTitle>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Comparatif vs Benchmarks Sectoriels</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-[#565e74]" />
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex items-center justify-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                       <ResponsiveContainer width="100%" height={320}>
                          <RadarChart data={radarData}>
                             <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                             <PolarAngleAxis dataKey="critere" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 900, fontFamily: 'Manrope' }} />
                             <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar name="Dossier" dataKey="valeur" stroke="#565e74" fill="#565e74" fillOpacity={0.15} strokeWidth={3} />
                          </RadarChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="space-y-6">
                       <div className="p-6 bg-[#565e74]/5 border-l-4 border-[#565e74] rounded-r-xl">
                          <h4 className="text-[10px] font-black text-[#565e74] uppercase tracking-widest mb-3 flex items-center gap-2">
                             <Sparkles size={14} /> Recommandation Stratégique IA
                          </h4>
                          <p className="text-xs leading-relaxed text-slate-600 font-bold italic">"{application.recommandationLLM.analyse}"</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                             <h5 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3">Points Forts</h5>
                             <ul className="space-y-2">
                                {application.recommandationLLM.pointsForts.slice(0, 3).map((p, i) => (
                                   <li key={i} className="text-[10px] text-emerald-800 font-bold flex items-start gap-2">
                                      <span className="opacity-40">•</span>{p}
                                   </li>
                                ))}
                             </ul>
                          </div>
                          <div className="p-5 bg-rose-50/30 rounded-xl border border-rose-100/50">
                             <h5 className="text-[9px] font-black text-rose-700 uppercase tracking-widest mb-3">Vigilances</h5>
                             <ul className="space-y-2">
                                {application.redFlags.slice(0, 3).map((f, i) => (
                                   <li key={i} className="text-[10px] text-rose-800 font-bold flex items-start gap-2">
                                      <span className="opacity-40">•</span>{f.label}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Detailed KPI Grids */}
        <div className="lg:col-span-4">
           <Card className="border-none shadow-sm bg-white h-full">
              <CardHeader className="bg-slate-50/30 border-b border-slate-100 px-6 py-4">
                 <CardTitle className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Structure Financière</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-0.5">
                 <KpiRow label="Engagement" value={formatCurrency(kpi.montantDemande).split(',')[0]} />
                 <KpiRow label="Valeur Actif" value={formatCurrency(kpi.valeurBien).split(',')[0]} />
                 <KpiRow label="Apport Client" value={formatCurrency(kpi.apport).split(',')[0]} />
                 <KpiRow label="CAF / Loyers" value={(kpi.cafLoyers ?? 1.38).toFixed(2)} status={getKpiStatus(kpi.cafLoyers, 1.4, 'above')} />
                 <KpiRow label="DSCR Ratio" value={`${kpi.dscr.toFixed(2)}x`} status={getKpiStatus(kpi.dscr, 1.25, 'above')} />
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-4">
           <Card className="border-none shadow-sm bg-white h-full">
              <CardHeader className="bg-slate-50/30 border-b border-slate-100 px-6 py-4">
                 <CardTitle className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Analyse de Risque</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-0.5">
                 <KpiRow label="Liquidité Générale" value={(kpi.liquiditeGenerale ?? 1.1).toFixed(2)} status={getKpiStatus(kpi.liquiditeGenerale, 1.0, 'above')} />
                 <KpiRow label="Levier Financier" value={(kpi.levierFinancier ?? 2.6).toFixed(2)} status={getKpiStatus(kpi.levierFinancier, 3.0, 'below')} />
                 <KpiRow label="Rentabilité CP" value={`${(kpi.rentabiliteCP ?? 12).toFixed(1)}%`} status={getKpiStatus(kpi.rentabiliteCP, 10, 'above')} />
                 <KpiRow label="Autonomie Fin." value={`${(kpi.autonomieFinanciere ?? 28).toFixed(1)}%`} status={getKpiStatus(kpi.autonomieFinanciere, 20, 'above')} />
                 <KpiRow label="LTV Dossier" value={`${kpi.ltv.toFixed(1)}%`} status={getKpiStatus(kpi.ltv, 80, 'below')} />
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-4">
           <Card className="border-none shadow-sm bg-white h-full overflow-hidden">
              <CardHeader className="bg-slate-50/30 border-b border-slate-100 px-6 py-4">
                 <CardTitle className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Justificatifs Dossier</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-slate-50/10">
                 <div className="grid grid-cols-2 gap-3">
                    {application.documents.slice(0, 4).map((doc, idx) => (
                       <div key={doc.id} className="p-2 border border-slate-100 rounded-lg hover:border-slate-300 transition-all cursor-pointer group bg-white">
                          <div className="aspect-square bg-slate-50 rounded mb-2 overflow-hidden">
                             <img src={documentImages[idx % documentImages.length]} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-[8px] font-black text-slate-800 truncate uppercase mt-1">{doc.type}</p>
                          <p className="text-[7px] font-bold text-slate-300 uppercase truncate tracking-tighter">{doc.nom}</p>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
