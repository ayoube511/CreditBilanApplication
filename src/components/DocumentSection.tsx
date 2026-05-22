import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, Download, Trash2, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import httpClient from '@/api/httpClient';

interface DocumentSectionProps {
  applicationId: number;
}

interface Document {
  id: number;
  docType: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  createdAt: string;
}

const DOC_TYPES = [
  'BILAN_COMPTABLE',
  'LIASSE_FISCALE',
  'PIECE_IDENTITE',
  'STATUTS_SOCIETE',
  'EXTRAIT_RC',
  'AUTRE',
];

const formatFileSize = (bytes: number) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentSection({ applicationId }: DocumentSectionProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('BILAN_COMPTABLE');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState('');

  // Charger les documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', applicationId],
    queryFn: async () => {
      const res = await httpClient.get(`/applications/${applicationId}/documents`);
      return res.data.data || [];
    },
  });

  // Upload document
  const handleUpload = async (file: File) => {
    if (!file) return;

    // Vérifier taille max (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop grand. Maximum 10 MB.');
      return;
    }

    // Vérifier type MIME
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non autorisé. Acceptés : PDF, JPG, PNG.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Étape 1 — Obtenir l'URL signée
      setUploadProgress('Préparation de l\'upload...');
      const prepareRes = await httpClient.post(
        `/applications/${applicationId}/documents/upload-url`,
        {
          filename: file.name,
          mimeType: file.type,
          docType: selectedDocType,
        }
      );
      const { documentId, uploadUrl } = prepareRes.data.data;

      // Étape 2 — Uploader directement vers MinIO
      setUploadProgress('Upload en cours...');
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // Étape 3 — Finaliser
      setUploadProgress('Finalisation...');
      await httpClient.post(
        `/applications/${applicationId}/documents/${documentId}/finalize`
      );

      // Rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ['documents', applicationId] });
      setShowUploadForm(false);
      setUploadProgress('');
    } catch (err) {
      setError('Erreur lors de l\'upload. Réessayez.');
      console.error(err);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  // Télécharger un document
  const handleDownload = async (docId: number, filename: string) => {
    try {
      const res = await httpClient.get(
        `/applications/${applicationId}/documents/${docId}/download-url`
      );
      const downloadUrl = res.data.data.downloadUrl;
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Erreur téléchargement', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#565e74]" />
          <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
            Archives Documentaires ({documents.length})
          </h3>
        </div>
        <Button
          onClick={() => setShowUploadForm(!showUploadForm)}
          variant="outline"
          className="h-8 px-3 text-[9px] font-black uppercase tracking-widest border-slate-200 gap-2"
        >
          <Upload size={12} />
          Uploader
        </Button>
      </div>

      {/* Formulaire upload */}
      {showUploadForm && (
        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Nouveau Document
            </p>
            <button onClick={() => setShowUploadForm(false)}>
              <X size={14} className="text-slate-400" />
            </button>
          </div>

          {/* Type de document */}
          <div className="mb-3">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
              Type de document
            </label>
            <select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full h-9 px-3 text-[11px] font-bold border border-slate-200 rounded bg-white text-slate-700"
            >
              {DOC_TYPES.map(t => (
                <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          {/* Zone de drop */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-slate-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <div>
                <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500">{uploadProgress}</p>
              </div>
            ) : (
              <div>
                <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-[10px] font-bold text-slate-500">
                  Cliquez pour sélectionner un fichier
                </p>
                <p className="text-[9px] text-slate-400 mt-1">PDF, JPG, PNG · Max 10 MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />

          {error && (
            <p className="mt-2 text-[10px] font-bold text-rose-500 bg-rose-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Liste des documents */}
      {isLoading ? (
        <div className="space-y-2">
          {Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-[10px] font-bold text-slate-400 uppercase">
            Aucun document associé
          </p>
          <p className="text-[9px] text-slate-300 mt-1">
            Cliquez sur "Uploader" pour ajouter des pièces justificatives
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc: Document) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center">
                  <FileText size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-800">{doc.originalFilename}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                    {doc.docType?.replace(/_/g, ' ')} · {formatFileSize(doc.sizeBytes)} · {doc.status}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {doc.status === 'READY' && (
                  <button
                    onClick={() => handleDownload(doc.id, doc.originalFilename)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Download size={12} className="text-slate-500" />
                  </button>
                )}
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                  doc.status === 'READY'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {doc.status === 'READY' ? '✓ PRÊT' : '⏳ EN ATTENTE'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
