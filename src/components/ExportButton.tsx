import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import httpClient from '@/api/httpClient';

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get('/exports/applications.csv', {
        responseType: 'blob',
      });

      // Créer le lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `registre-credit-bilan-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export CSV', err);
      alert('Erreur lors de l\'export. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExportCSV}
      disabled={loading}
      variant="outline"
      className="h-9 px-4 text-[9px] font-black uppercase tracking-widest border-slate-200 gap-2"
    >
      <Download size={12} />
      {loading ? 'Export...' : 'Export CSV'}
    </Button>
  );
}
