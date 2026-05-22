import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, FileText, Download, Sparkles, ShieldCheck, Activity, Eye, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency, formatDate } from '@/lib/index';
import { applicationsApi } from '@/api/applicationsApi';
import { kpiApi } from '@/api/kpiApi';
import httpClient from '@/api/httpClient';

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
    good: 'text-emerald-500',
    warn: 'text-amber-500',
    bad: 'text-rose-500',
    neutral: 'text-slate-800',
  };
  const dots = {
    good: 'bg-emerald-500',
    warn: 'bg-amber-500',
    bad: 'bg-rose-500',
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

function mapKpiStatus(status: string): 'good' | 'warn' | 'bad' | 'neutral' {
  if (status === 'GOOD') return 'good';
  if (status === 'WARN') return 'warn';
  if (status === 'BAD') return 'bad';
  return 'neutral';
}

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const [recalculating, setRecalculating] = useState(false);

  const { data: application, isLoading: appLoading } = useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationsApi.getById(Number(applicationId)),
  });

  const { data: kpiData, isLoading: kpiLoading, refetch: refetchKpi } = useQuery({
    queryKey: ['kpi', applicationId],
    queryFn: () => kpiApi.getKpi(Number(applicationId)),
    enabled: !!applicationId,
  });

  const { data: documents } = useQuery({
    queryKey: ['documents', applicationId],
    queryFn: async () => {
      const res = await httpClient.get(`/applications/${applicationId}/documents`);
      return res.data.data || [];
    },
  });

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await kpiApi.recalculate(Number(applicationId));
      await refetchKpi();
    } catch (e) {
      console.error('Erreur recalcul', e);
    } finally {
      setRecalculating(false);
    }
  };

  if (appLoading) {
    return (
      <div className="w-full flex items-center justify-center p-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="w-full flex items-center justify-center p-20 animate-fade-in">
        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm text-center max-w-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-slate-400" size={24} />
          </div>
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">DOSSIER INTROUVABLE</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-6">LE REGISTRE {applicationId} EST INACCESSIBLE.</p>
          <Button onClick={onClose} className="h-9 px-6 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
            RETOUR AU REGISTRE
          </Button>
        </div>
      </div>
    );
  }

  // Extraire les KPI items par code
  const getKpiItem = (code: string) => kpiData?.items?.find(i => i.code === code);
  const cafLoyers = getKpiItem('CAF_LOYERS');
  const dscr = getKpiItem('DSCR');
  const ltv = getKpiItem('LTV');
  const liquidite = getKpiItem('LIQUIDITE_GENERALE');
  const levier = getKpiItem('LEVIER_FINANCIER');
  const autonomie = getKpiItem('AUTONOMIE_FINANCIERE');
  const cotationBam = getKpiItem('COTATION_BAM');

  const getStatusBadge = (status: string) => {
    if (status === 'APPROVED') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'REJECTED') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  const getClassBadge = (cls: string) => {
    if (cls === 'A' || cls === 'B') return 'bg-emerald-900 text-white';
    if (cls === 'C') return 'bg-amber-700 text-white';
    return 'bg-rose-700 text-white';
  };

  return (
    <div className="w-full animate-fade-in space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button onClick={onClose} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
              ← Registre
            </button>
            <span className="text-slate-200">/</span>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{application.reference}</span>
          </div>
          <h1 className="text-xl font-black text-slate-800">{application.counterparty?.legalName}</h1>
          <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">{application.segment} · {application.sector} · {application.financingType}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRecalculate}
            disabled={recalculating}
            variant="outline"
            className="h-9 px-4 text-[9px] font-black uppercase tracking-widest border-slate-200 gap-2"
          >
            <RefreshCw size={12} className={recalculating ? 'animate-spin' : ''} />
            Recalculer
          </Button>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Montant demandé</p>
          <p className="text-lg font-black text-slate-800">{application.amountRequestedMad ? formatCurrency(application.amountRequestedMad).split(',')[0] : '—'}</p>
          <p className="text-[9px] text-slate-400 font-bold mt-1">MAD</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Score</p>
          <p className={`text-lg font-black ${application.score ? (application.score >= 80 ? 'text-emerald-600' : application.score >= 65 ? 'text-amber-500' : 'text-rose-500') : 'text-slate-400'}`}>
            {application.score || '—'}
          </p>
          <p className="text-[9px] text-slate-400 font-bold mt-1">/ 100</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Classe</p>
          {application.creditClass ? (
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-black ${getClassBadge(application.creditClass)}`}>
              {application.creditClass}
            </span>
          ) : <p className="text-lg font-black text-slate-400">—</p>}
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut</p>
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 border rounded ${getStatusBadge(application.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {applicationsApi.mapStatus(application.status)}
          </span>
        </div>
      </div>

      {/* KPI Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#565e74]" />
              Audit Solvabilité BAM-2026
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kpiLoading ? (
              <div className="space-y-2">
                {Array(7).fill(0).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
                ))}
              </div>
            ) : kpiData ? (
              <div className="space-y-1">
                <KpiRow label="CAF / Loyers" value={cafLoyers?.value?.toFixed(2) || '—'} seuil="≥ 1.40" status={mapKpiStatus(cafLoyers?.status || '')} />
                <KpiRow label="DSCR" value={dscr?.value?.toFixed(2) || '—'} seuil="≥ 1.25" status={mapKpiStatus(dscr?.status || '')} />
                <KpiRow label="LTV" value={ltv?.value ? `${ltv.value.toFixed(1)}%` : '—'} seuil="≤ 80%" status={mapKpiStatus(ltv?.status || '')} />
                <KpiRow label="Liquidité Générale" value={liquidite?.value?.toFixed(2) || '—'} seuil="> 1.00" status={mapKpiStatus(liquidite?.status || '')} />
                <KpiRow label="Levier Financier" value={levier?.value?.toFixed(2) || '—'} seuil="≤ 3.00" status={mapKpiStatus(levier?.status || '')} />
                <KpiRow label="Autonomie Financière" value={autonomie?.value ? `${autonomie.value.toFixed(1)}%` : '—'} seuil="≥ 20%" status={mapKpiStatus(autonomie?.status || '')} />
                <KpiRow label="Cotation BAM" value={cotationBam?.value?.toString() || '—'} seuil="≤ 6" status={mapKpiStatus(cotationBam?.status || '')} />
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 text-center py-4">Aucune donnée KPI disponible. Saisir les données sources.</p>
            )}
          </CardContent>
        </Card>

        {/* Informations dossier */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-[#565e74]" />
              Informations Dossier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Référence</span>
              <span className="text-[11px] font-black text-slate-800">{application.reference}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Client</span>
              <span className="text-[11px] font-black text-slate-800">{application.counterparty?.legalName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Segment</span>
              <span className="text-[11px] font-black text-slate-800">{application.segment || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Secteur</span>
              <span className="text-[11px] font-black text-slate-800">{application.sector || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Type</span>
              <span className="text-[11px] font-black text-slate-800">{application.financingType || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Date demande</span>
              <span className="text-[11px] font-black text-slate-800">{application.applicationDate || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Créé par</span>
              <span className="text-[11px] font-black text-slate-800">{application.createdBy?.fullName || '—'}</span>
            </div>
            {application.defaultProbabilityPct && (
              <div className="flex justify-between py-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Prob. défaut</span>
                <span className={`text-[11px] font-black ${application.defaultProbabilityPct < 10 ? 'text-emerald-600' : application.defaultProbabilityPct < 20 ? 'text-amber-500' : 'text-rose-600'}`}>
                  {application.defaultProbabilityPct}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#565e74]" />
            Archives Documentaires ({documents?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!documents || documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-[10px] font-bold text-slate-400 uppercase">Aucun document associé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.map((doc: any) => (
                <div key={doc.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-800">{doc.originalFilename}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{doc.docType} · {doc.status}</p>
                  </div>
                  <FileText size={20} className="text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
