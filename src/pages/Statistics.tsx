import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, Pie, PieChart as RePieChart
} from 'recharts';
import { TrendingUp, Target, ShieldCheck, BarChart3, Activity, Layers } from 'lucide-react';
import { dashboardApi } from '@/api/dashboardApi';

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#f43f5e', '#64748b', '#8b5cf6'];

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

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex justify-between items-start mb-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <Icon size={16} className={color} />
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  );
}

export default function Statistics() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardApi.getSummary,
  });

  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-stats'],
    queryFn: dashboardApi.getPortfolioStats,
  });

  // Préparer données secteur
  const sectorData = portfolio?.bySector?.map(s => ({
    name: s.sector,
    count: s.count,
    montant: Number((s.totalAmount / 1000000).toFixed(1)),
  })) || [];

  // Préparer données segment
  const segmentData = portfolio?.bySegment?.map(s => ({
    name: s.segment,
    value: s.count,
  })) || [];

  // Préparer données statut
  const statusData = portfolio?.byStatus
    ? Object.entries(portfolio.byStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : [];

  // Préparer données classe
  const classData = portfolio?.byClass
    ? Object.entries(portfolio.byClass).map(([cls, count]) => ({
        name: `Classe ${cls}`,
        value: count,
      }))
    : [];

  const isLoading = summaryLoading || portfolioLoading;

  return (
    <div className="w-full px-6 py-8 space-y-8 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-800">Statistiques Portefeuille</h1>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
          Analyse en temps réel des données backend
        </p>
      </div>

      {/* KPI Summary */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Dossiers" value={summary?.totalApplications || 0} icon={Layers} color="text-blue-500" />
          <StatCard label="Approuvés" value={summary?.approved || 0} icon={ShieldCheck} color="text-emerald-500" />
          <StatCard label="Taux Approbation" value={`${portfolio?.approvalRate || 0}%`} icon={Target} color="text-violet-500" />
          <StatCard label="Score Moyen" value={summary?.averageScore ? Math.round(summary.averageScore) : '—'} icon={Activity} color="text-amber-500" />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Répartition par Secteur */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14} className="text-[#565e74]" />
              Répartition par Secteur
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 bg-slate-100 rounded animate-pulse" />
            ) : sectorData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={sectorData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" name="Dossiers" radius={[4, 4, 0, 0]}>
                    {sectorData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        {/* Répartition par Segment */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-[#565e74]" />
              Répartition par Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 bg-slate-100 rounded animate-pulse" />
            ) : segmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RePieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {segmentData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        {/* Répartition par Statut */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-[#565e74]" />
              Répartition par Statut
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 bg-slate-100 rounded animate-pulse" />
            ) : statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" name="Dossiers" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={
                        entry.name === 'APPROVED' ? '#10b981' :
                        entry.name === 'REJECTED' ? '#f43f5e' :
                        COLORS[index % COLORS.length]
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
            )}
          </CardContent>
        </Card>

        {/* Répartition par Classe de Risque */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#565e74]" />
              Classes de Risque
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 bg-slate-100 rounded animate-pulse" />
            ) : classData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={classData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" name="Dossiers" radius={[4, 4, 0, 0]}>
                    {classData.map((entry, index) => (
                      <Cell key={index} fill={
                        entry.name === 'Classe A' ? '#10b981' :
                        entry.name === 'Classe B' ? '#6366f1' :
                        entry.name === 'Classe C' ? '#f59e0b' :
                        '#f43f5e'
                      } />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune donnée</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
