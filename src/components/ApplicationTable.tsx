import { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { mockApplications } from '@/data/index';
import { formatCurrency, getClassColor, getStatusColor, type Segment, type Sector, type Status } from '@/lib/index';

interface ApplicationTableProps {
  onViewDetails: (id: string) => void;
}

type SortField = 'id' | 'client' | 'segment' | 'secteur' | 'montant' | 'score' | 'classe' | 'statut';
type SortDirection = 'asc' | 'desc';

export function ApplicationTable({ onViewDetails }: ApplicationTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [secteurFilter, setSecteurFilter] = useState<string>('all');
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
    let filtered = mockApplications.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSegment = segmentFilter === 'all' || app.segment === segmentFilter;
      const matchesSecteur = secteurFilter === 'all' || app.secteur === secteurFilter;
      const matchesStatut = statutFilter === 'all' || app.statut === statutFilter;
      return matchesSearch && matchesSegment && matchesSecteur && matchesStatut;
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
  }, [searchQuery, segmentFilter, secteurFilter, statutFilter, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ID ou client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les segments</SelectItem>
              <SelectItem value="TPE">TPE</SelectItem>
              <SelectItem value="PME">PME</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Select value={secteurFilter} onValueChange={setSecteurFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Secteur" />
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
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
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
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('id')}
                >
                  ID <SortIcon field="id" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('client')}
                >
                  Client <SortIcon field="client" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('segment')}
                >
                  Segment <SortIcon field="segment" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none"
                  onClick={() => handleSort('secteur')}
                >
                  Secteur <SortIcon field="secteur" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-right"
                  onClick={() => handleSort('montant')}
                >
                  Montant <SortIcon field="montant" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-center"
                  onClick={() => handleSort('score')}
                >
                  Score <SortIcon field="score" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-center"
                  onClick={() => handleSort('classe')}
                >
                  Classe <SortIcon field="classe" />
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none text-center"
                  onClick={() => handleSort('statut')}
                >
                  Statut <SortIcon field="statut" />
                </TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedApplications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Aucune demande trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedApplications.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{app.id}</TableCell>
                    <TableCell className="font-medium">{app.client}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.segment}</Badge>
                    </TableCell>
                    <TableCell>{app.secteur}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(app.montant)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-mono font-semibold text-lg">{app.score}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getClassColor(app.classe)}>{app.classe}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(app.statut)}>{app.statut}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewDetails(app.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="text-sm text-muted-foreground">
        {filteredAndSortedApplications.length} demande(s) affichée(s) sur {mockApplications.length} au total
      </div>
    </div>
  );
}
