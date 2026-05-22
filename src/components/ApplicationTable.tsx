import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, ChevronUp, Eye, Download, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applicationsApi } from '@/api/applicationsApi';
import { formatCurrency } from '@/lib/index';

interface ApplicationTableProps {
  onViewDetails: (id: string) => void;
}

export function ApplicationTable({ onViewDetails }: ApplicationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error } = useQuery({
    queryKey: ['applications', searchQuery, segmentFilter, statutFilter, page],
    queryFn: () => applicationsApi.getAll({
      q: searchQuery || undefined,
      segment: segmentFilter !== 'all' ? segmentFilter : undefined,
      status: statutFilter !== 'all' ? statutFilter : undefined,
      page,
      size: 10,
    }),
    keepPreviousData: true,
  });

  const applications = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const totalElements = data?.totalElements || 0;

  const getStatusStyle = (status: string) => {
    const mapped = applicationsApi.mapStatus(status);
    if (mapped === 'Approuvé') return 'border-emerald-200 text-emerald-700 bg-emerald-50/50';
    if (mapped === 'Refusé') return 'border-rose-200 text-rose-700 bg-rose-50/50';
    return 'border-amber-200 text-amber-700 bg-amber-50/50';
  };

  const getStatusDot = (status: string) => {
    const mapped = applicationsApi.mapStatus(status);
    if (mapped === 'Approuvé') return 'bg-emerald-600';
    if (mapped === 'Refusé') return 'bg-rose-600';
    return 'bg-amber-600';
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-slate-400';
    if (score >= 80) return 'text-emerald-600';
    if (score >= 65) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBar = (score: number | null) => {
    if (!score) return 'bg-slate-200';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="animate-fade-in w-full">
      <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">

        {/* Search & Controls */}
        <div className="px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-md focus:ring-1 focus:ring-[#565e74] transition-all outline-none placeholder:text-slate-400 placeholder:font-medium"
              placeholder="Filtrage rapide (Réf, Client...)"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Filtre statut */}
            <select
              className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border border-slate-200 rounded text-slate-600 bg-white"
              value={statutFilter}
              onChange={(e) => { setStatutFilter(e.target.value); setPage(0); }}
            >
              <option value="all">Tous statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="IN_REVIEW">En cours</option>
              <option value="SCORING_DONE">Scoré</option>
              <option value="APPROVED">Approuvé</option>
              <option value="REJECTED">Refusé</option>
            </select>

            {/* Filtre segment */}
            <select
              className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border border-slate-200 rounded text-slate-600 bg-white"
              value={segmentFilter}
              onChange={(e) => { setSegmentFilter(e.target.value); setPage(0); }}
            >
              <option value="all">Tous segments</option>
              <option value="PME">PME</option>
              <option value="ETI">ETI</option>
              <option value="Startup">Startup</option>
              <option value="Corporate">Corporate</option>
            </select>

            <div className="h-4 w-px bg-slate-100 mx-2" />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest tabular-nums">
              {totalElements} REGISTRES
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40">
                {[
                  { id: 'reference', label: 'RÉF' },
                  { id: 'client', label: 'CLIENT' },
                  { id: 'sector', label: 'SECTEUR' },
                  { id: 'amount', label: 'ENGAGEMENT', align: 'text-right' },
                  { id: 'score', label: 'SCORE', align: 'text-center' },
                  { id: 'status', label: 'STATUT', align: 'text-center' },
                  { id: 'actions', label: '', align: 'text-right' }
                ].map((col) => (
                  <th key={col.id}
                    className={`px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 ${col.align || ''}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-8 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                      Erreur de chargement. Vérifiez que le backend est démarré.
                    </p>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-32 text-center opacity-40">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Aucun enregistrement disponible.
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id}
                    className="hover:bg-slate-50/50 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-[#565e74]"
                    onClick={() => onViewDetails(String(app.id))}>
                    <td className="px-8 py-5 text-xs font-black tabular-nums text-slate-400">{app.reference}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-[#565e74] transition-colors">
                          {app.clientName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 tracking-tight">{app.clientName}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{app.segment}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{app.sector}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-800 tabular-nums text-xs">
                      {app.amountRequestedMad
                        ? formatCurrency(app.amountRequestedMad).split(',')[0]
                        : '—'
                      } <span className="text-[9px] text-slate-300 ml-1">MAD</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`text-[11px] font-black tabular-nums ${getScoreColor(app.score)}`}>
                          {app.score || '—'}
                        </span>
                        {app.score && (
                          <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div className={`h-full ${getScoreBar(app.score)}`} style={{ width: `${app.score}%` }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 border rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${getStatusStyle(app.status)}`}>
                        <span className={`w-1 h-1 rounded-full ${getStatusDot(app.status)}`} />
                        {applicationsApi.mapStatus(app.status)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm"
                          className="h-7 px-3 text-[9px] font-black uppercase tracking-widest text-[#565e74] border-slate-200 hover:bg-slate-50 gap-2 transition-all">
                          <Eye size={12} /> Détails
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {totalElements} Dossiers · Page {page + 1} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-8 px-4 border border-slate-200 rounded text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-30 flex items-center gap-1">
              <ChevronLeft size={12} /> Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-8 px-4 border border-slate-200 rounded text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-30 flex items-center gap-1">
              Suivant <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
