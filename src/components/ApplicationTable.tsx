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
    <div className="animate-fade-in w-full">
      <div className="bg-white border border-slate-200 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Registry Quick Search/Controls */}
        <div className="px-8 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50">
           <div className="relative flex-1 max-w-sm w-full">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
             <input
               className="w-full pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 text-[11px] font-bold text-slate-700 rounded-md focus:ring-1 focus:ring-[#565e74] transition-all outline-none placeholder:text-slate-400 placeholder:font-medium"
               placeholder="Filtrage rapide (ID, Client...)"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" className="h-8 px-3 text-[9px] font-black uppercase tracking-widest text-slate-400 gap-2 hover:bg-slate-50">
                <Download size={14} /> Export CSV
              </Button>
              <div className="h-4 w-px bg-slate-100 mx-2" />
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest tabular-nums">
                {filteredAndSortedApplications.length} REGISTRES
              </p>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40">
                {[
                  { id: 'id', label: 'RÉF' },
                  { id: 'client', label: 'CENTRE DE DÉCISION / CLIENT' },
                  { id: 'secteur', label: 'SECTEUR' },
                  { id: 'montant', label: 'ENGAGEMENT', align: 'text-right' },
                  { id: 'score', label: 'SCORE', align: 'text-center' },
                  { id: 'statut', label: 'STATUT', align: 'text-center' },
                  { id: 'actions', label: '', align: 'text-right' }
                ].map((col) => (
                  <th key={col.id} 
                      className={`px-8 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-100 cursor-pointer hover:text-slate-800 transition-colors ${col.align || ''}`}
                      onClick={() => col.id !== 'actions' && handleSort(col.id as SortField)}>
                    <div className={`flex items-center gap-1.5 ${col.align === 'text-right' ? 'justify-end' : col.align === 'text-center' ? 'justify-center' : ''}`}>
                      {col.label}
                      {sortField === col.id && (
                        sortDirection === 'asc' ? <ChevronUp size={10} className="text-[#565e74]" /> : <ChevronDown size={10} className="text-[#565e74]" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedApplications.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-8 py-32 text-center opacity-40">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun enregistrement disponible pour ces critères.</p>
                   </td>
                </tr>
              ) : (
                filteredAndSortedApplications.map((app) => (
                  <tr key={app.id} 
                      className="hover:bg-slate-50/50 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-[#565e74]"
                      onClick={() => onViewDetails(app.id)}>
                    <td className="px-8 py-5 text-xs font-black tabular-nums text-slate-400">{app.id}</td>
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-[#565e74] transition-colors">
                             {app.client.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 tracking-tight">{app.client}</p>
                            <p className="text-[9px] text-slate-400 uppercase font-bold mt-0.5">{app.segment}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{app.secteur}</p>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-800 tabular-nums text-xs">
                      {formatCurrency(app.montant).split(',')[0]} <span className="text-[9px] text-slate-300 ml-1">MAD</span>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <div className="inline-flex items-center gap-2">
                          <span className={`text-[11px] font-black tabular-nums ${app.score > 75 ? 'text-emerald-600' : 'text-slate-800'}`}>
                            {app.score}
                          </span>
                          <div className="w-8 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                             <div className={`h-full ${app.score > 75 ? 'bg-emerald-500' : 'bg-slate-400'}`} style={{ width: `${app.score}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 border rounded shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                           app.statut === 'Approuvé' ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50' : 
                           app.statut === 'Refusé' ? 'border-rose-200 text-rose-700 bg-rose-50/50' : 
                           'border-amber-200 text-amber-700 bg-amber-50/50'
                       }`}>
                         <span className={`w-1 h-1 rounded-full ${
                           app.statut === 'Approuvé' ? 'bg-emerald-600' : 
                           app.statut === 'Refusé' ? 'bg-rose-600' : 
                           'bg-amber-600'
                         }`} />
                         {app.statut}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="h-7 px-3 text-[9px] font-black uppercase tracking-widest text-[#565e74] border-slate-200 hover:bg-slate-50 gap-2 transition-all">
                             <Eye size={12} /> Détails
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-500">
                             <MoreVertical size={14} />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 border-t border-slate-100 flex justify-between items-center bg-slate-50/10">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indexation : {filteredAndSortedApplications.length} sur {mockApplications.length} Dossiers</p>
           <div className="flex gap-2">
              <button className="h-8 px-4 border border-slate-200 rounded text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Précédent</button>
              <div className="flex gap-1">
                 <button className="h-8 w-8 bg-[#565e74] text-white rounded text-[9px] font-black shadow-sm">1</button>
                 <button className="h-8 w-8 text-slate-400 hover:bg-slate-50 rounded text-[9px] font-black">2</button>
              </div>
              <button className="h-8 px-4 border border-slate-200 rounded text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">Suivant</button>
           </div>
        </div>
      </div>
    </div>
  );
}
