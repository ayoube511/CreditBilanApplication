import { X, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, FileText, Download, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

export function ApplicationDetails({ applicationId, onClose }: ApplicationDetailsProps) {
  const application = mockApplications.find(app => app.id === applicationId);

  if (!application) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Dossier introuvable</CardTitle>
            <CardDescription>Le dossier {applicationId} n'existe pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onClose} className="w-full">Fermer</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const radarData = [
    { critere: 'DSCR', valeur: Math.min(application.kpi.dscr / 4 * 100, 100) },
    { critere: 'LTV', valeur: Math.max(100 - application.kpi.ltv, 0) },
    { critere: 'EBITDA', valeur: Math.min(application.kpi.ebitda / 1000000 * 100, 100) },
    { critere: 'Liquidité', valeur: Math.min((application.kpi.ratioLiquidite || 1) / 2 * 100, 100) },
    { critere: 'Historique', valeur: application.score },
  ];

  const documentImages = [IMAGES.DOCUMENTS_1, IMAGES.DOCUMENTS_2, IMAGES.DOCUMENTS_3];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold font-mono">{application.id}</h2>
              <p className="text-sm text-muted-foreground">{application.client}</p>
            </div>
            <Badge variant="outline" className="text-sm">{application.segment}</Badge>
            <Badge variant="outline" className="text-sm">{application.secteur}</Badge>
            <Badge className={getStatusColor(application.statut)}>{application.statut}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Montant demandé</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(application.kpi.montantDemande)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valeur du bien</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(application.kpi.valeurBien)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Apport</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(application.kpi.apport)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">État du bien</p>
                    <p className="text-2xl font-semibold">{application.kpi.etatBien}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">EBITDA</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(application.kpi.ebitda)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Service de dette</p>
                    <p className="text-2xl font-mono font-bold">{formatCurrency(application.kpi.serviceDette)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">DSCR</p>
                    <p className="text-2xl font-mono font-bold">{application.kpi.dscr.toFixed(2)}x</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">LTV</p>
                    <p className="text-2xl font-mono font-bold">{application.kpi.ltv.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score de Crédit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-mono font-bold">{application.score}</p>
                      <p className="text-sm text-muted-foreground mt-1">Score sur 100</p>
                    </div>
                    <Badge className={`${getClassColor(application.classe)} text-3xl px-4 py-2`}>{application.classe}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Probabilité de défaut</p>
                    <p className="text-2xl font-mono font-bold text-destructive">{application.probabiliteDefaut.toFixed(1)}%</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="critere" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                        <Radar name="Score" dataKey="valeur" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/5 border-accent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    <CardTitle className="text-accent">Recommandations LLM</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-relaxed">{application.recommandationLLM.analyse}</p>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-chart-2" />
                      Points forts
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {application.recommandationLLM.pointsForts.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-chart-2 mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {application.recommandationLLM.pointsFaibles.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-chart-3" />
                        Points faibles
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {application.recommandationLLM.pointsFaibles.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-chart-3 mt-0.5">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Recommandation finale</span>
                    <Badge className={application.recommandationLLM.recommandation === 'Approuver' ? 'bg-chart-2 text-white' : application.recommandationLLM.recommandation === 'Refuser' ? 'bg-chart-4 text-white' : 'bg-chart-3 text-white'}>
                      {application.recommandationLLM.recommandation}
                    </Badge>
                  </div>
                  {application.recommandationLLM.conditions && application.recommandationLLM.conditions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Conditions</h4>
                      <ul className="space-y-1 text-sm">
                        {application.recommandationLLM.conditions.map((condition, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">→</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-chart-4" />
                    Red Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.redFlags.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Aucun red flag identifié</p>
                  ) : (
                    <ul className="space-y-3">
                      {application.redFlags.map(flag => (
                        <li key={flag.id} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                          <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">{flag.label}</p>
                            {flag.description && <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-chart-2" />
                    Green Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {application.greenFlags.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">Aucun green flag identifié</p>
                  ) : (
                    <ul className="space-y-3">
                      {application.greenFlags.map(flag => (
                        <li key={flag.id} className="flex items-start gap-3 p-3 rounded-lg bg-chart-2/5 border border-chart-2/20">
                          <CheckCircle2 className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">{flag.label}</p>
                            {flag.description && <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
                <CardDescription>{application.documents.length} document(s) déposé(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {application.documents.map((doc, idx) => (
                    <div key={doc.id} className="group relative rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                        <img 
                          src={documentImages[idx % documentImages.length]} 
                          alt={doc.nom}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <Button size="sm" variant="secondary" className="w-full">
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                        <p className="text-sm font-medium truncate">{doc.nom}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(doc.dateUpload)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse Comparative</CardTitle>
                <CardDescription>Position par rapport au portefeuille</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Score vs Moyenne Secteur</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-mono font-bold">{application.score}</p>
                      <span className="text-muted-foreground">/</span>
                      <p className="text-xl font-mono text-muted-foreground">72</p>
                      {application.score > 72 ? (
                        <TrendingUp className="h-5 w-5 text-chart-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-chart-4" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">DSCR vs Moyenne Secteur</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-mono font-bold">{application.kpi.dscr.toFixed(2)}x</p>
                      <span className="text-muted-foreground">/</span>
                      <p className="text-xl font-mono text-muted-foreground">2.1x</p>
                      {application.kpi.dscr > 2.1 ? (
                        <TrendingUp className="h-5 w-5 text-chart-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-chart-4" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">LTV vs Moyenne Secteur</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-mono font-bold">{application.kpi.ltv.toFixed(0)}%</p>
                      <span className="text-muted-foreground">/</span>
                      <p className="text-xl font-mono text-muted-foreground">75%</p>
                      {application.kpi.ltv < 75 ? (
                        <TrendingUp className="h-5 w-5 text-chart-2" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-chart-4" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}