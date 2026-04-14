export const ROUTE_PATHS = {
  DASHBOARD: '/',
  APPLICATIONS: '/applications',
  STATISTICS: '/statistics',
  SETTINGS: '/settings',
} as const;

export type Segment = 'TPE' | 'PME' | 'Corporate';
export type Sector = 'Transport' | 'Agroalimentaire' | 'BTP' | 'Commerce' | 'Industrie' | 'Services' | 'Santé' | 'Technologie' | 'Immobilier' | 'Agriculture';
export type Status = 'En cours' | 'Approuvé' | 'Refusé' | 'En attente';
export type CreditClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface FinancialKPI {
  montantDemande: number;
  valeurBien: number;
  apport: number;
  etatBien: 'Neuf' | 'Occasion';
  ebitda: number;
  serviceDette: number;
  dscr: number;
  ltv: number;
  ratioLiquidite?: number;
  caf?: number;                    
  loyers?: number;                 
  cafLoyers?: number;              
  couvertureCharges?: number;      
  liquiditeGenerale?: number;      
  rentabiliteCP?: number;         
  levierFinancier?: number;        
  autonomieFinanciere?: number;    
  capaciteRemboursement?: number;  
  cotationBAM?: number;            
  incidentsPaiement?: number;      
  scoreComportemental?: number;    
  scoreSectoriel?: number;        
}

export interface Flag {
  id: string;
  type: 'red' | 'green';
  label: string;
  description?: string;
}

export interface Document {
  id: string;
  type: 'Bilan' | 'Relevé bancaire' | 'Garantie' | 'Statuts' | 'Autre';
  nom: string;
  dateUpload: string;
  url: string;
}

export interface CreditApplication {
  id: string;
  client: string;
  segment: Segment;
  secteur: Sector;
  montant: number;
  score: number;
  classe: CreditClass;
  statut: Status;
  dateCreation: string;
  kpi: FinancialKPI;
  probabiliteDefaut: number;
  redFlags: Flag[];
  greenFlags: Flag[];
  documents: Document[];
  recommandationLLM: {
    analyse: string;
    pointsForts: string[];
    pointsFaibles: string[];
    recommandation: 'Approuver' | 'Refuser' | 'Conditions';
    conditions?: string[];
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

export function getClassColor(classe: CreditClass): string {
  const colors: Record<CreditClass, string> = {
    A: 'bg-chart-2 text-white',
    B: 'bg-chart-2/70 text-white',
    C: 'bg-chart-3 text-white',
    D: 'bg-chart-3/70 text-white',
    E: 'bg-chart-4 text-white',
    F: 'bg-chart-4/80 text-white',
  };
  return colors[classe];
}

export function getStatusColor(statut: Status): string {
  const colors: Record<Status, string> = {
    'En cours': 'bg-chart-1 text-white',
    'Approuvé': 'bg-chart-2 text-white',
    'Refusé': 'bg-chart-4 text-white',
    'En attente': 'bg-chart-3 text-white',
  };
  return colors[statut];
}
