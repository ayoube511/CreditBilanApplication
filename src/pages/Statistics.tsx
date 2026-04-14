import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import type { Sector } from '@/lib/index';

const confusionMatrixData = [
  { predicted: 'Approuvé', actual: 'Approuvé', count: 82, color: 'bg-chart-2' },
  { predicted: 'Approuvé', actual: 'Refusé', count: 7, color: 'bg-chart-4/30' },
  { predicted: 'Refusé', actual: 'Approuvé', count: 5, color: 'bg-chart-4/30' },
  { predicted: 'Refusé', actual: 'Refusé', count: 62, color: 'bg-chart-4' },
];

const sensitivityData = [
  { variable: 'DSCR', impact: 0.42, color: '#10b981' },
  { variable: 'LTV', impact: 0.38, color: '#3b82f6' },
  { variable: 'Historique paiement', impact: 0.35, color: '#8b5cf6' },
  { variable: 'EBITDA', impact: 0.28, color: '#f59e0b' },
  { variable: 'Secteur', impact: 0.22, color: '#ef4444' },
  { variable: 'Apport', impact: 0.18, color: '#ec4899' },
  { variable: 'Ratio liquidité', impact: 0.15, color: '#06b6d4' },
];

const scoreDistributionData = [
  { range: '0-20', count: 8 },
  { range: '21-40', count: 15 },
  { range: '41-60', count: 32 },
  { range: '61-80', count: 58 },
  { range: '81-100', count: 43 },
];

const portfolioConcentrationData = [
  { segment: 'TPE', montant: 45200000, count: 62 },
  { segment: 'PME', montant: 128500000, count: 68 },
  { segment: 'Corporate', montant: 72100000, count: 26 },
];

const riskySectorsData: Array<{
  secteur: Sector;
  nbDossiers: number;
  tauxDefaut: number;
  montantExpose: number;
  tendance: 'up' | 'down';
}> = [
  { secteur: 'Commerce', nbDossiers: 23, tauxDefaut: 28.5, montantExpose: 22100000, tendance: 'up' },
  { secteur: 'BTP', nbDossiers: 28, tauxDefaut: 22.8, montantExpose: 38900000, tendance: 'up' },
  { secteur: 'Transport', nbDossiers: 44, tauxDefaut: 18.2, montantExpose: 45200000, tendance: 'down' },
  { secteur: 'Santé', nbDossiers: 12, tauxDefaut: 16.7, montantExpose: 18200000, tendance: 'down' },
  { secteur: 'Industrie', nbDossiers: 11, tauxDefaut: 15.4, montantExpose: 17500000, tendance: 'up' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Statistics() {
  const totalPredictions = confusionMatrixData.reduce((sum, item) => sum + item.count, 0);
  const accuracy = ((confusionMatrixData[0].count + confusionMatrixData[3].count) / totalPredictions) * 100;

  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques Avancées</h1>
        <p className="text-muted-foreground mt-2">
          Analyse approfondie des performances du modèle de scoring et du portefeuille
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Matrice de Confusion</CardTitle>
            <CardDescription>
              Précision du modèle: {accuracy.toFixed(1)}% ({confusionMatrixData[0].count + confusionMatrixData[3].count}/{totalPredictions} prédictions correctes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1" />
              <div className="text-center text-sm font-semibold text-muted-foreground">Approuvé (Réel)</div>
              <div className="text-center text-sm font-semibold text-muted-foreground">Refusé (Réel)</div>
              
              <div className="text-sm font-semibold text-muted-foreground flex items-center">Approuvé (Prédit)</div>
              <div className={`${confusionMatrixData[0].color} rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold text-white">{confusionMatrixData[0].count}</div>
                <div className="text-xs text-white/80 mt-1">Vrais Positifs</div>
              </div>
              <div className={`${confusionMatrixData[1].color} rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold">{confusionMatrixData[1].count}</div>
                <div className="text-xs text-muted-foreground mt-1">Faux Positifs</div>
              </div>
              
              <div className="text-sm font-semibold text-muted-foreground flex items-center">Refusé (Prédit)</div>
              <div className={`${confusionMatrixData[2].color} rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold">{confusionMatrixData[2].count}</div>
                <div className="text-xs text-muted-foreground mt-1">Faux Négatifs</div>
              </div>
              <div className={`${confusionMatrixData[3].color} rounded-lg p-4 text-center`}>
                <div className="text-2xl font-bold text-white">{confusionMatrixData[3].count}</div>
                <div className="text-xs text-white/80 mt-1">Vrais Négatifs</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Précision:</span>
                <span className="ml-2 font-semibold">{((confusionMatrixData[0].count / (confusionMatrixData[0].count + confusionMatrixData[1].count)) * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rappel:</span>
                <span className="ml-2 font-semibold">{((confusionMatrixData[0].count / (confusionMatrixData[0].count + confusionMatrixData[2].count)) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse de Sensibilité</CardTitle>
            <CardDescription>
              Impact des variables sur la décision de crédit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sensitivityData} layout="vertical" margin={{ left: 100, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 0.5]} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <YAxis type="category" dataKey="variable" />
                <Tooltip
                  formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="impact" radius={[0, 8, 8, 0]}>
                  {sensitivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Scores</CardTitle>
            <CardDescription>
              Répartition des demandes par tranche de score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Concentration du Portefeuille</CardTitle>
            <CardDescription>
              Répartition par segment d'entreprise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioConcentrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="segment" />
                <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'montant') return formatCurrency(value);
                    return value;
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="montant" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} name="Montant (MAD)" />
                <Bar yAxisId="right" dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} name="Nombre de dossiers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-4" />
            Top 5 Secteurs à Risque
          </CardTitle>
          <CardDescription>
            Secteurs avec les taux de défaut les plus élevés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Secteur</TableHead>
                <TableHead className="text-right">Nb Dossiers</TableHead>
                <TableHead className="text-right">Taux de Défaut</TableHead>
                <TableHead className="text-right">Montant Exposé</TableHead>
                <TableHead className="text-right">Tendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskySectorsData.map((secteur) => (
                <TableRow key={secteur.secteur}>
                  <TableCell className="font-medium">{secteur.secteur}</TableCell>
                  <TableCell className="text-right">{secteur.nbDossiers}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={`${
                        secteur.tauxDefaut > 25
                          ? 'bg-chart-4/10 text-chart-4 border-chart-4/20'
                          : secteur.tauxDefaut > 20
                          ? 'bg-chart-3/10 text-chart-3 border-chart-3/20'
                          : 'bg-chart-2/10 text-chart-2 border-chart-2/20'
                      }`}
                    >
                      {secteur.tauxDefaut.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(secteur.montantExpose)}
                  </TableCell>
                  <TableCell className="text-right">
                    {secteur.tendance === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-chart-4 inline" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-chart-2 inline" />
                    )}
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
