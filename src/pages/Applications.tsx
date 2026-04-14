import { useState } from 'react';
import { ApplicationTable } from '@/components/ApplicationTable';
import { ApplicationDetails } from '@/components/ApplicationDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Plus, Filter } from 'lucide-react';
import type { Segment, Sector, Status } from '@/lib/index';

export default function Applications() {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    segment: 'all' as Segment | 'all',
    secteur: 'all' as Sector | 'all',
    statut: 'all' as Status | 'all',
    montantMin: '',
    montantMax: '',
    scoreMin: '',
    scoreMax: '',
    dateDebut: '',
    dateFin: '',
  });

  const handleViewDetails = (id: string) => {
    setSelectedApplicationId(id);
  };

  const handleCloseDetails = () => {
    setSelectedApplicationId(null);
  };

  const handleResetFilters = () => {
    setFilters({
      segment: 'all',
      secteur: 'all',
      statut: 'all',
      montantMin: '',
      montantMax: '',
      scoreMin: '',
      scoreMax: '',
      dateDebut: '',
      dateFin: '',
    });
  };

  return (
    <div className="w-full px-6 py-8 space-y-8 animate-fade-in">
      {selectedApplicationId ? (
        <ApplicationDetails
          applicationId={selectedApplicationId}
          onClose={handleCloseDetails}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">Registre des Engagements</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Plateforme de Gestion Crédit Leasing</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="h-10 px-5 border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <Filter className="h-3.5 w-3.5" />
                Paramètres d'Affichage
              </Button>
              <Button className="h-10 px-6 bg-[#565e74] hover:bg-[#444a5c] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm gap-2">
                <Plus className="h-3.5 w-3.5" />
                Nouveau Flux
              </Button>
            </div>
          </div>

          <div className="flex gap-6">
            {showFilters && (
              <Card className="w-80 h-fit border-slate-200 shadow-sm">
                <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
                  <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtres Stratégiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  {/* ... maintaining existing filters ... */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase">Segment</Label>
                    <Select
                      value={filters.segment}
                      onValueChange={(value) => setFilters({ ...filters, segment: value as Segment | 'all' })}
                    >
                      <SelectTrigger className="text-[11px] font-bold border-slate-200 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les segments</SelectItem>
                        <SelectItem value="TPE">TPE</SelectItem>
                        <SelectItem value="PME">PME</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase">Secteur Activité</Label>
                    <Select
                      value={filters.secteur}
                      onValueChange={(value) => setFilters({ ...filters, secteur: value as Sector | 'all' })}
                    >
                      <SelectTrigger className="text-[11px] font-bold border-slate-200 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les secteurs</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Agroalimentaire">Agroalimentaire</SelectItem>
                        <SelectItem value="BTP">BTP</SelectItem>
                        <SelectItem value="Commerce">Commerce</SelectItem>
                        <SelectItem value="Industrie">Industrie</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Santé">Santé</SelectItem>
                        <SelectItem value="Technologie">Technologie</SelectItem>
                        <SelectItem value="Immobilier">Immobilier</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase">Engagement (MAD)</Label>
                    <div className="flex gap-2">
                      <Input
                        className="text-[11px] font-bold border-slate-200 h-9"
                        type="number"
                        placeholder="MIN"
                        value={filters.montantMin}
                        onChange={(e) => setFilters({ ...filters, montantMin: e.target.value })}
                      />
                      <Input
                        className="text-[11px] font-bold border-slate-200 h-9"
                        type="number"
                        placeholder="MAX"
                        value={filters.montantMax}
                        onChange={(e) => setFilters({ ...filters, montantMax: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-[9px] font-black uppercase tracking-widest h-9 border-slate-200"
                    onClick={handleResetFilters}
                  >
                    Réinitialiser
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="flex-1">
              <ApplicationTable onViewDetails={handleViewDetails} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
