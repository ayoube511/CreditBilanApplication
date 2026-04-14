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
          <Button className="h-10 px-6 bg-[#565e74] hover:bg-[#444a5c] text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm gap-2">
            <Plus className="h-3.5 w-3.5" />
            Nouveau Flux
          </Button>
        </div>
      </div>

        <div className="flex gap-6">
          {showFilters && (
            <Card className="w-80 h-fit">
              <CardHeader>
                <CardTitle className="text-lg">Filtres Avancés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Segment</Label>
                  <Select
                    value={filters.segment}
                    onValueChange={(value) => setFilters({ ...filters, segment: value as Segment | 'all' })}
                  >
                    <SelectTrigger>
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
                  <Label>Secteur</Label>
                  <Select
                    value={filters.secteur}
                    onValueChange={(value) => setFilters({ ...filters, secteur: value as Sector | 'all' })}
                  >
                    <SelectTrigger>
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
                  <Label>Statut</Label>
                  <Select
                    value={filters.statut}
                    onValueChange={(value) => setFilters({ ...filters, statut: value as Status | 'all' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Approuvé">Approuvé</SelectItem>
                      <SelectItem value="Refusé">Refusé</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Montant (MAD)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.montantMin}
                      onChange={(e) => setFilters({ ...filters, montantMin: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.montantMax}
                      onChange={(e) => setFilters({ ...filters, montantMax: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Score</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="100"
                      value={filters.scoreMin}
                      onChange={(e) => setFilters({ ...filters, scoreMin: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="100"
                      value={filters.scoreMax}
                      onChange={(e) => setFilters({ ...filters, scoreMax: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Période</Label>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={filters.dateDebut}
                      onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={filters.dateFin}
                      onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
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

      <Sheet open={!!selectedApplicationId} onOpenChange={(open) => !open && handleCloseDetails()}>
        <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Détails du Dossier</SheetTitle>
          </SheetHeader>
          {selectedApplicationId && (
            <ApplicationDetails
              applicationId={selectedApplicationId}
              onClose={handleCloseDetails}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
