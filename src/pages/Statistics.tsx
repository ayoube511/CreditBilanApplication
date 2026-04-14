import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, TrendingUp, TrendingDown, Target, ShieldCheck } from 'lucide-react';
import { ScoreDistributionChart, SensitivityChart } from '@/components/Charts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Sector } from '@/lib/index';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '12px',
  color: 'hsl(var(--popover-foreground))',
};

const confusionData = [
  { predicted: 'Approuvé', actual: 'Approuvé', count: 82, type: 'tp' },
  { predicted: 'Approuvé', actual: 'Refusé',   count: 7,  type: 'fp' },
  { predicted: 'Refusé',   actual: 'Approuvé', count: 5,  type: 'fn' },
  { predicted: 'Refusé',   actual: 'Refusé',   count: 62, type: 'tn' },
];

const sensitivityData = [
  { variable: 'DSCR',                impact: 0.42, color: '#1e3a5f' },
  { variable: 'LTV',                 impact: 0.38, color: '#2563a8' },
  { variable: 'Historique paiement', impact: 0.35, color: '#0d9488' },
  { variable: 'CAF / Loyers',        impact: 0.31, color: '#059669' },
  { variable: 'EBITDA',              impact: 0.28, color: '#d97706' },
  { variable: 'Cotation BAM',        impact: 0.25, color: '#7c3aed' },
  { variable: 'Levier financier',    impact: 0.22, color: '#dc2626' },
  { variable: 'Liquidité générale',  impact: 0.18, color: '#3b82c4' },
  { variable: 'Autonomie fin.',      impact: 0.15, color: '#6b7280' },
];

const scoreDistributionData = [
  { range: '0-20',  count: 8  },
  { range: '21-40', count: 15 },
  { range: '41-60', count: 32 },
  { range: '61-80', count: 58 },
  { range: '81-100',count: 43 },
];

const portfolioData = [
  { segment: 'TPE',       montant: 45200000, count: 62 },
  { segment: 'PME',       montant: 128500000, count: 68 },
  { segment: 'Corporate', montant: 72100000, count: 26 },
];

const riskySectors: Array<{
  secteur: Sector; nbDossiers: number; tauxDefaut: number; montantExpose: number; tendance: 'up' | 'down';
}> = [
  { secteur: 'Commerce',      nbDossiers: 23, tauxDefaut: 28.5, montantExpose: 22100000, tendance: 'up' },
  { secteur: 'BTP',           nbDossiers: 28, tauxDefaut: 22.8, montantExpose: 38900000, tendance: 'up' },
  { secteur: 'Transport',     nbDossiers: 44, tauxDefaut: 18.2, montantExpose: 45200000, tendance: 'down' },
  { secteur: 'Santé',         nbDossiers: 12, tauxDefaut: 16.7, montantExpose: 18200000, tendance: 'down' },
  { secteur: 'Industrie',     nbDossiers: 11, tauxDefaut: 15.4, montantExpose: 17500000, tendance: 'up' },
];

// New KPI benchmarks from kpi_a_ajouter.pdf
const kpiBenchmarks = [
  { kpi: 'CAF / Loyers',           seuil: '≥ 1.4',  portefeuille: 1.38, status: 'warn' },
  { kpi: 'Couverture charges fin.', seuil: '> 3.0',  portefeuille: 3.82, status: 'good' },
  { kpi: 'Liquidité générale',      seuil: '> 1.0',  portefeuille: 1.29, status: 'good' },
  { kpi: 'Rentabilité CP',          seuil: '> 10%',  portefeuille: 13.2, status: 'good' },
  { kpi: 'Levier financier',        seuil: '≤ 3.0',  portefeuille: 2.68, status: 'good' },
  { kpi: 'Autonomie financière',    seuil: '≥ 20%',  portefeuille: 28.4, status: 'good' },
  { kpi: 'Capacité remboursement',  seuil: '> 0.33', portefeuille: 0.44, status: 'good' },
  { kpi: 'Score comportemental',    seuil: '≥ 12/20',portefeuille: 14.2, status: 'good' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export default function Statistics() {
  const total = confusionData.reduce((s, d) => s + d.count, 0);
  const accuracy = ((confusionData[0].count + confusionData[3].count) / total) * 100;
  const precision = (confusionData[0].count / (confusionData[0].count + confusionData[1].count)) * 100;
  const recall = (confusionData[0].count / (confusionData[0].count + confusionData[2].count)) * 100;

  return (
    <div className="w-full px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistiques Avancées</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance du modèle de scoring · Analyse du portefeuille · KPIs réglementaires</p>
      </div>

      {/* Model Performance */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Confusion Matrix */}
        <Card className="card-raised">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Matrice de Confusion</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Précision globale: <span className="font-bold text-chart-2">{accuracy.toFixed(1)}%</span> · {confusionData[0].count + confusionData[3].count}/{total} prédictions correctes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div />
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide py-1">Réel: Approuvé</div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide py-1">Réel: Refusé</div>

              <div className="text-[10px] font-semibold text-muted-foreground flex items-center justify-end pr-2">Prédit: Approuvé</div>
              <div className="rounded-lg p-4 bg-chart-2 text-white">
                <div className="text-2xl font-bold font-mono">{confusionData[0].count}</div>
                <div className="text-[10px] opacity-80 mt-0.5">Vrais Positifs</div>
              </div>
              <div className="rounded-lg p-4 bg-chart-4/15 border border-chart-4/20">
                <div className="text-2xl font-bold font-mono text-chart-4">{confusionData[1].count}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Faux Positifs</div>
              </div>

              <div className="text-[10px] font-semibold text-muted-foreground flex items-center justify-end pr-2">Prédit: Refusé</div>
              <div className="rounded-lg p-4 bg-chart-4/15 border border-chart-4/20">
                <div className="text-2xl font-bold font-mono text-chart-4">{confusionData[2].count}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Faux Négatifs</div>
              </div>
              <div className="rounded-lg p-4 bg-primary text-primary-foreground">
                <div className="text-2xl font-bold font-mono">{confusionData[3].count}</div>
                <div className="text-[10px] opacity-80 mt-0.5">Vrais Négatifs</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Précision', value: `${precision.toFixed(1)}%` },
                { label: 'Rappel',    value: `${recall.toFixed(1)}%` },
                { label: 'F1-Score',  value: `${(2 * precision * recall / (precision + recall)).toFixed(1)}%` },
              ].map(m => (
                <div key={m.label} className="text-center bg-muted/40 rounded-lg p-2">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className="text-sm font-bold font-mono text-chart-2">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sensitivity Analysis */}
        <Card className="card-raised">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">Analyse de Sensibilité</CardTitle>
            </div>
            <CardDescription className="text-xs">Impact des variables sur la décision de crédit</CardDescription>
          </CardHeader>
          <CardContent>
            <SensitivityChart data={sensitivityData} />
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution + Portfolio */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card className="card-raised">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Distribution des Scores</CardTitle>
            <CardDescription className="text-xs">Répartition des dossiers par tranche de score</CardDescription>
          </CardHeader>
          <CardContent>
            <ScoreDistributionChart data={scoreDistributionData} />
          </CardContent>
        </Card>

        <Card className="card-raised">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Concentration du Portefeuille</CardTitle>
            <CardDescription className="text-xs">Répartition par segment d'entreprise</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={portfolioData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.6} vertical={false} />
                <XAxis dataKey="segment" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [name === 'Montant' ? formatCurrency(v) : v, name]} />
                <Legend wrapperStyle={{ fontSize: '11px' }} iconType="circle" iconSize={8} />
                <Bar yAxisId="left" dataKey="montant" name="Montant (MAD)" fill="hsl(var(--chart-1))" radius={[6,6,0,0]} />
                <Bar yAxisId="right" dataKey="count" name="Nb dossiers" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* New KPI Benchmarks from kpi_a_ajouter.pdf */}
      <Card className="card-raised">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Benchmarks KPIs Réglementaires</CardTitle>
          </div>
          <CardDescription className="text-xs">Conformité aux seuils définis · Source: Grille scoring interne Avril 2026</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpiBenchmarks.map((k) => (
              <div key={k.kpi} className={`rounded-lg p-3 border ${k.status === 'good' ? 'border-chart-2/20 bg-chart-2/5' : 'border-chart-3/20 bg-chart-3/5'}`}>
                <p className="text-[10px] text-muted-foreground font-medium">{k.kpi}</p>
                <p className={`text-lg font-bold font-mono mt-1 ${k.status === 'good' ? 'text-chart-2' : 'text-chart-3'}`}>
                  {typeof k.portefeuille === 'number' && k.portefeuille > 10 ? `${k.portefeuille.toFixed(1)}%` : k.portefeuille.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Seuil: {k.seuil}</p>
                <div className={`mt-1.5 h-1 rounded-full ${k.status === 'good' ? 'bg-chart-2/30' : 'bg-chart-3/30'}`}>
                  <div className={`h-full rounded-full ${k.status === 'good' ? 'bg-chart-2' : 'bg-chart-3'}`} style={{ width: k.status === 'good' ? '80%' : '55%' }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risky Sectors */}
      <Card className="card-raised">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-chart-4" />
            <CardTitle className="text-sm font-semibold">Top 5 Secteurs à Risque</CardTitle>
          </div>
          <CardDescription className="text-xs">Secteurs avec les taux de défaut les plus élevés</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="text-[11px] uppercase tracking-wide">Secteur</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wide">Nb Dossiers</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wide">Taux Défaut</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wide">Montant Exposé</TableHead>
                <TableHead className="text-right text-[11px] uppercase tracking-wide">Tendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskySectors.map((s) => (
                <TableRow key={s.secteur} className="border-border/40 hover:bg-muted/30">
                  <TableCell className="font-medium text-sm">{s.secteur}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{s.nbDossiers}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`text-[10px] ${s.tauxDefaut > 25 ? 'badge-danger' : s.tauxDefaut > 20 ? 'badge-warning' : 'badge-success'}`}>
                      {s.tauxDefaut.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{formatCurrency(s.montantExpose)}</TableCell>
                  <TableCell className="text-right">
                    {s.tendance === 'up'
                      ? <TrendingUp className="h-4 w-4 text-chart-4 inline" />
                      : <TrendingDown className="h-4 w-4 text-chart-2 inline" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
