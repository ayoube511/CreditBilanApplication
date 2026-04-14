import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Eye, Filter, ArrowRight, Download, SlidersHorizontal, ArrowUpRight, MoreVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockApplications } from '@/data/index';
import { formatCurrency, formatDate } from '@/lib/index';

interface ApplicationTableProps {
  onViewDetails: (id: string) => void;
}

type SortField = 'id' | 'client' | 'segment' | 'secteur' | 'montant' | 'score' | 'classe' | 'statut';
type SortDirection = 'asc' | 'desc';

export function ApplicationTable({ onViewDetails }: ApplicationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [statutFilter, setStatutFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedApplications = useMemo(() => {
    const filtered = mockApplications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSegment = segmentFilter === 'all' || app.segment === segmentFilter;
      const matchesStatut = statutFilter === 'all' || app.statut === statutFilter;
      return matchesSearch && matchesSegment && matchesStatut;
    });

    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];
      if (sortField === 'montant' || sortField === 'score') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchQuery, segmentFilter, statutFilter, sortField, sortDirection]);

  return (
    <div className="space-y-6 animate-fade-in max-w-[1500px] mx-auto">
      
      {/* ── RESTORING ORIGINAL FILTER CONTENT ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input
               className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg focus:ring-1 focus:ring-[#565e74] transition-all outline-none"
               placeholder="Chercher par ID, Client, Référence..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           
           <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger className="w-48 h-[42px] bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:ring-1 focus:ring-[#565e74]">
                <SelectValue placeholder="SEGMENT" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-slate-100 shadow-xl p-1">
                 <SelectItem value="all" className="text-[10px] font-bold uppercase">Tous Segments</SelectItem>
                 <SelectItem value="TPE" className="text-[10px] font-bold uppercase">TPE</SelectItem>
                 <SelectItem value="PME" className="text-[10px] font-bold uppercase">PME</SelectItem>
                 <SelectItem value="Corporate" className="text-[10px] font-bold uppercase">Corporate</SelectItem>
              </SelectContent>
           </Select>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-[42px] px-5 bg-white text-slate-500 border-slate-200 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all gap-2">
              <Filter size={14} /> Filtres
           </Button>
           <Button className="h-[42px] px-6 bg-[#565e74] text-white hover:bg-[#444a5c] rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm gap-2">
              <Download size={14} /> Export
           </Button>
        </div>
      </div>

      {/* ── RESTORING ORIGINAL TABLE HEADERS ── */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/20">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Registre des Dossiers</h3>
           <p className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">Synchronisé Alpha-v4</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">ID</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Client</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Secteur</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Engagement</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Score</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Statut</th>
                <th className="px-8 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedApplications.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-8 py-32 text-center opacity-40">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun dossier trouvé.</p>
                   </td>
                </tr>
              ) : (
                filteredAndSortedApplications.map((app) => (
                  <tr key={app.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => onViewDetails(app.id)}>
                    <td className="px-8 py-5 text-xs font-bold tabular-nums text-slate-400 uppercase">{app.id}</td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-black text-slate-800">{app.client}</p>
                       <p className="text-[9px] text-slate-400 uppercase font-medium mt-1">{app.segment}</p>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-[11px] font-medium text-slate-500">{app.secteur}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-slate-800 tabular-nums text-sm">
                      {formatCurrency(app.montant).split(',')[0]}
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`text-xs font-black tabular-nums ${app.score > 80 ? 'text-emerald-600' : 'text-[#565e74]'}`}>
                         {app.score}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`text-[9px] font-bold uppercase px-3 py-1 border rounded-full ${
                           app.statut === 'Approuvé' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 
                           app.statut === 'Refusé' ? 'border-rose-200 text-rose-700 bg-rose-50' : 
                           'border-amber-200 text-amber-700 bg-amber-50'
                       }`}>
                         {app.statut}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="text-[10px] font-bold uppercase tracking-widest text-[#565e74] hover:underline" onClick={(e) => { e.stopPropagation(); onViewDetails(app.id); }}>
                          Détails
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/30">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Affichage 1-{filteredAndSortedApplications.length} sur {mockApplications.length} entrées</p>
           <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-bold uppercase hover:bg-slate-50">Préc.</button>
              <button className="px-3 py-1 border border-[#565e74] bg-[#565e74] text-white rounded text-[9px] font-bold uppercase">1</button>
              <button className="px-2 py-1 border border-slate-200 rounded text-[9px] font-bold uppercase hover:bg-slate-50">Suiv.</button>
           </div>
        </div>
      </div>

    </div>
  );
}
