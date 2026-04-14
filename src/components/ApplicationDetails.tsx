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
      <div className="p-6">
        <p className="text-muted-foreground">Dossier {applicationId} introuvable.</p>
        <Button onClick={onClose} className="mt-4">Fermer</Button>
      </div>
    );
  }

  const { kpi } = application;

  const radarData = [
    { critere: 'DSCR',       valeur: Math.min(kpi.dscr / 4 * 100, 100) },
    { critere: 'LTV',        valeur: Math.max(100 - kpi.ltv, 0) },
    { critere: 'EBITDA',     valeur: Math.min(kpi.ebitda / 1000000 * 100, 100) },
    { critere: 'Liquidité Gén.', valeur: Math.min((kpi.liquiditeGenerale ?? kpi.ratioLiquidite ?? 1) / 2 * 100, 100) },
    { critere: 'CAF/Loyers', valeur: Math.min((kpi.cafLoyers ?? 1) / 2 * 100, 100) },
    { critere: 'Historique', valeur: application.score },
  ];

  const documentImages = [IMAGES.DOCUMENTS_1, IMAGES.DOCUMENTS_2, IMAGES.DOCUMENTS_3];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b bg-card px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-bold font-mono text-primary">{application.id}</h2>
              <p className="text-xs text-muted-foreground">{application.client}</p>
            </div>
            <Badge variant="outline" className="badge-neutral text-xs">{application.segment}</Badge>
            <Badge variant="outline" className="badge-neutral text-xs">{application.secteur}</Badge>
            <Badge className={`${getStatusColor(application.statut)} text-xs`}>{application.statut}</Badge>
            <Badge className={`${getClassColor(application.classe)} text-xs`}>Classe {application.classe}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-5">

            {/* Score + Radar */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* Score Card */}
              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Score de Crédit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end gap-3">
                    <span className={`text-5xl font-bold font-mono ${application.score >= 75 ? 'text-chart-2' : application.score >= 55 ? 'text-chart-3' : 'text-chart-4'}`}>
                      {application.score}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1">/100</span>
                    <Badge className={`${getClassColor(application.classe)} text-lg px-3 py-1 ml-auto`}>{application.classe}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Probabilité de défaut</p>
                    <p className={`text-2xl font-bold font-mono mt-0.5 ${application.probabiliteDefaut > 20 ? 'text-chart-4' : application.probabiliteDefaut > 10 ? 'text-chart-3' : 'text-chart-2'}`}>
                      {application.probabiliteDefaut.toFixed(1)}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-muted/40 rounded-lg p-2">
                      <p className="text-[10px] text-muted-foreground">Score Comport.</p>
                      <p className={`text-sm font-bold font-mono ${(kpi.scoreComportemental ?? 0) >= 12 ? 'text-chart-2' : 'text-chart-4'}`}>
                        {kpi.scoreComportemental ?? '—'}/20
                      </p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2">
                      <p className="text-[10px] text-muted-foreground">Score Sectoriel</p>
                      <p className={`text-sm font-bold font-mono ${(kpi.scoreSectoriel ?? 0) >= 12 ? 'text-chart-2' : 'text-chart-4'}`}>
                        {kpi.scoreSectoriel ?? '—'}/20
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="card-raised md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profil de Risque Multi-Critères</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="critere" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} />
                      <Radar name="Score" dataKey="valeur" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* KPI Sections */}
            <div className="grid md:grid-cols-3 gap-5">
              {/* KPIs Financiers de base */}
              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KPIs Financiers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0">
                  <KpiRow label="Montant demandé" value={formatCurrency(kpi.montantDemande)} />
                  <KpiRow label="Valeur du bien" value={formatCurrency(kpi.valeurBien)} />
                  <KpiRow label="Apport" value={formatCurrency(kpi.apport)} />
                  <KpiRow label="État du bien" value={kpi.etatBien} />
                  <KpiRow label="EBITDA" value={formatCurrency(kpi.ebitda)} />
                  <KpiRow label="Service de dette" value={formatCurrency(kpi.serviceDette)} />
                  <KpiRow label="DSCR" value={`${kpi.dscr.toFixed(2)}x`} seuil="≥ 1.25" status={getKpiStatus(kpi.dscr, 1.25, 'above')} />
                  <KpiRow label="LTV" value={`${kpi.ltv.toFixed(1)}%`} seuil="≤ 80%" status={getKpiStatus(kpi.ltv, 80, 'below')} />
                </CardContent>
              </Card>

              {/* Nouveaux KPIs — kpi_a_ajouter.pdf */}
              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-chart-2" />
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KPIs Scoring Avancé</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0">
                  <KpiRow label="CAF" value={kpi.caf ? formatCurrency(kpi.caf) : '—'} />
                  <KpiRow label="Loyers annuels" value={kpi.loyers ? formatCurrency(kpi.loyers) : '—'} />
                  <KpiRow label="CAF / Loyers" value={kpi.cafLoyers?.toFixed(2) ?? '—'} seuil="≥ 1.4" status={getKpiStatus(kpi.cafLoyers, 1.4, 'above')} />
                  <KpiRow label="Couverture charges" value={kpi.couvertureCharges?.toFixed(2) ?? '—'} seuil="> 3.0" status={getKpiStatus(kpi.couvertureCharges, 3.0, 'above')} />
                  <KpiRow label="Liquidité générale" value={kpi.liquiditeGenerale?.toFixed(2) ?? '—'} seuil="> 1.0" status={getKpiStatus(kpi.liquiditeGenerale, 1.0, 'above')} />
                  <KpiRow label="Rentabilité CP" value={kpi.rentabiliteCP ? `${kpi.rentabiliteCP.toFixed(1)}%` : '—'} seuil="> 10%" status={getKpiStatus(kpi.rentabiliteCP, 10, 'above')} />
                  <KpiRow label="Levier financier" value={kpi.levierFinancier?.toFixed(2) ?? '—'} seuil="≤ 3.0" status={getKpiStatus(kpi.levierFinancier, 3.0, 'below')} />
                  <KpiRow label="Autonomie fin." value={kpi.autonomieFinanciere ? `${kpi.autonomieFinanciere.toFixed(1)}%` : '—'} seuil="≥ 20%" status={getKpiStatus(kpi.autonomieFinanciere, 20, 'above')} />
                </CardContent>
              </Card>

              {/* KPIs Comportementaux */}
              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-chart-5" />
                    <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">KPIs Comportementaux</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0">
                  <KpiRow label="Capacité remboursement" value={kpi.capaciteRemboursement?.toFixed(2) ?? '—'} seuil="> 0.33" status={getKpiStatus(kpi.capaciteRemboursement, 0.33, 'above')} />
                  <KpiRow label="Cotation BAM" value={kpi.cotationBAM?.toString() ?? '—'} seuil="≤ 6" status={kpi.cotationBAM !== undefined ? (kpi.cotationBAM <= 6 ? (kpi.cotationBAM <= 4 ? 'good' : 'warn') : 'bad') : 'neutral'} />
                  <KpiRow label="Incidents paiement" value={kpi.incidentsPaiement?.toString() ?? '—'} seuil="0 idéal" status={kpi.incidentsPaiement !== undefined ? (kpi.incidentsPaiement === 0 ? 'good' : kpi.incidentsPaiement === 1 ? 'warn' : 'bad') : 'neutral'} />
                  <KpiRow label="Score comportemental" value={kpi.scoreComportemental ? `${kpi.scoreComportemental}/20` : '—'} seuil="≥ 12/20" status={getKpiStatus(kpi.scoreComportemental, 12, 'above')} />
                  <KpiRow label="Score sectoriel" value={kpi.scoreSectoriel ? `${kpi.scoreSectoriel}/20` : '—'} seuil="≥ 12/20" status={getKpiStatus(kpi.scoreSectoriel, 12, 'above')} />
                </CardContent>
              </Card>
            </div>

            {/* LLM Recommendation */}
            <Card className="card-raised border-chart-5/20 bg-chart-5/3">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-chart-5" />
                  <CardTitle className="text-sm font-semibold text-chart-5">Recommandation IA</CardTitle>
                  <Badge className={`ml-auto text-xs ${application.recommandationLLM.recommandation === 'Approuver' ? 'bg-chart-2 text-white' : application.recommandationLLM.recommandation === 'Refuser' ? 'bg-chart-4 text-white' : 'bg-chart-3 text-white'}`}>
                    {application.recommandationLLM.recommandation}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs leading-relaxed text-muted-foreground">{application.recommandationLLM.analyse}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {application.recommandationLLM.pointsForts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5 text-chart-2">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Points forts
                      </h4>
                      <ul className="space-y-1">
                        {application.recommandationLLM.pointsForts.map((p, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5">
                            <span className="text-chart-2 mt-0.5 shrink-0">•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {application.recommandationLLM.pointsFaibles.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold mb-1.5 flex items-center gap-1.5 text-chart-3">
                        <AlertTriangle className="h-3.5 w-3.5" /> Points faibles
                      </h4>
                      <ul className="space-y-1">
                        {application.recommandationLLM.pointsFaibles.map((p, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5">
                            <span className="text-chart-3 mt-0.5 shrink-0">•</span>{p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {application.recommandationLLM.conditions && application.recommandationLLM.conditions.length > 0 && (
                  <div className="bg-muted/40 rounded-lg p-3">
                    <h4 className="text-xs font-semibold mb-1.5">Conditions</h4>
                    <ul className="space-y-1">
                      {application.recommandationLLM.conditions.map((c, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <span className="text-primary mt-0.5 shrink-0">→</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Red/Green Flags */}
            <div className="grid md:grid-cols-2 gap-5">
              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-chart-4" />
                    <span className="text-muted-foreground">Red Flags</span>
                    <Badge className="badge-danger ml-auto text-[10px]">{application.redFlags.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.redFlags.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Aucun red flag identifié</p>
                  ) : (
                    <ul className="space-y-2">
                      {application.redFlags.map(flag => (
                        <li key={flag.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-chart-4/5 border border-chart-4/15">
                          <X className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold">{flag.label}</p>
                            {flag.description && <p className="text-[10px] text-muted-foreground mt-0.5">{flag.description}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card className="card-raised">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-chart-2" />
                    <span className="text-muted-foreground">Green Flags</span>
                    <Badge className="badge-success ml-auto text-[10px]">{application.greenFlags.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.greenFlags.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Aucun green flag identifié</p>
                  ) : (
                    <ul className="space-y-2">
                      {application.greenFlags.map(flag => (
                        <li key={flag.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-chart-2/5 border border-chart-2/15">
                          <CheckCircle2 className="h-4 w-4 text-chart-2 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold">{flag.label}</p>
                            {flag.description && <p className="text-[10px] text-muted-foreground mt-0.5">{flag.description}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Documents */}
            <Card className="card-raised">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">Documents</span>
                  <Badge className="badge-neutral ml-auto text-[10px]">{application.documents.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {application.documents.map((doc, idx) => (
                    <div key={doc.id} className="group relative rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                        <img src={documentImages[idx % documentImages.length]} alt={doc.nom} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <Button size="sm" variant="secondary" className="w-full h-7 text-[10px]">
                            <Download className="h-3 w-3 mr-1" /> Télécharger
                          </Button>
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <Badge variant="outline" className="text-[9px] h-4 badge-neutral">{doc.type}</Badge>
                        <p className="text-[10px] font-medium truncate">{doc.nom}</p>
                        <p className="text-[9px] text-muted-foreground">{formatDate(doc.dateUpload)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comparative Analysis */}
            <Card className="card-raised">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Analyse Comparative — vs Moyenne Portefeuille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Score', val: application.score, avg: 72, unit: '', higher: true },
                    { label: 'DSCR', val: kpi.dscr, avg: 2.1, unit: 'x', higher: true },
                    { label: 'Liquidité Gén.', val: kpi.liquiditeGenerale ?? 0, avg: 1.25, unit: '', higher: true },
                    { label: 'CAF/Loyers', val: kpi.cafLoyers ?? 0, avg: 1.38, unit: '', higher: true },
                  ].map(m => {
                    const better = m.higher ? m.val > m.avg : m.val < m.avg;
                    return (
                      <div key={m.label} className="text-center bg-muted/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                        <p className={`text-xl font-bold font-mono ${better ? 'text-chart-2' : 'text-chart-4'}`}>
                          {m.val.toFixed(m.unit === '%' ? 0 : 2)}{m.unit}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {better ? <TrendingUp className="h-3 w-3 text-chart-2" /> : <TrendingDown className="h-3 w-3 text-chart-4" />}
                          <span className="text-[10px] text-muted-foreground">moy. {m.avg}{m.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
