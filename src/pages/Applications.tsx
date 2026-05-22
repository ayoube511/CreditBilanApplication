import { useState } from 'react';
import { ApplicationTable } from '@/components/ApplicationTable';
import { ApplicationDetails } from '@/components/ApplicationDetails';
import { ExportButton } from '@/components/ExportButton';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

export default function Applications() {
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    setSelectedApplicationId(id);
  };

  const handleCloseDetails = () => {
    setSelectedApplicationId(null);
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
              <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Registre des Engagements
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Plateforme de Gestion Crédit Leasing
              </p>
            </div>
            <div className="flex gap-3">
              {/* Bouton Export CSV */}
              <ExportButton />

              <Button
                className="h-10 px-6 bg-[#565e74] hover:bg-[#444a5c] text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm gap-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Nouveau Flux
              </Button>
            </div>
          </div>

          <ApplicationTable onViewDetails={handleViewDetails} />
        </>
      )}
    </div>
  );
}
