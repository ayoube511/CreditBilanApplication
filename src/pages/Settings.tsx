import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Globe, Key, TrendingUp, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  role: z.string().min(1, 'Le rôle est requis'),
});

const preferencesSchema = z.object({
  langue: z.string(),
  notifications: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
});

const apiSchema = z.object({
  endpointCredit: z.string().url('URL invalide'),
  endpointFinancial: z.string().url('URL invalide'),
  endpointLLM: z.string().url('URL invalide'),
  apiKeyCredit: z.string().min(10, 'Clé API invalide'),
  apiKeyFinancial: z.string().min(10, 'Clé API invalide'),
  apiKeyLLM: z.string().min(10, 'Clé API invalide'),
});

const scoringSchema = z.object({
  dscrMin: z.number().min(0.5).max(5),
  ltvMax: z.number().min(50).max(100),
  scoreMinApprobation: z.number().min(0).max(100),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PreferencesFormData = z.infer<typeof preferencesSchema>;
type ApiFormData = z.infer<typeof apiSchema>;
type ScoringFormData = z.infer<typeof scoringSchema>;

export default function Settings() {
  const [showApiKeys, setShowApiKeys] = useState({
    credit: false,
    financial: false,
    llm: false,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nom: 'Ahmed Benali',
      email: 'ahmed.benali@leasingcorp.ma',
      role: 'Analyste Senior',
    },
  });

  const preferencesForm = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      langue: 'fr',
      notifications: true,
      theme: 'system',
    },
  });

  const apiForm = useForm<ApiFormData>({
    resolver: zodResolver(apiSchema),
    defaultValues: {
      endpointCredit: 'https://api.creditbureau.ma/v1',
      endpointFinancial: 'https://api.financialdata.ma/v2',
      endpointLLM: 'https://api.openai.com/v1',
      apiKeyCredit: 'cb_live_xxxxxxxxxxxxxxxx',
      apiKeyFinancial: 'fd_live_xxxxxxxxxxxxxxxx',
      apiKeyLLM: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    },
  });

  const scoringForm = useForm<ScoringFormData>({
    resolver: zodResolver(scoringSchema),
    defaultValues: {
      dscrMin: 1.25,
      ltvMax: 80,
      scoreMinApprobation: 65,
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    console.log('Profile data:', data);
    toast.success('Profil mis à jour avec succès');
  };

  const onPreferencesSubmit = (data: PreferencesFormData) => {
    console.log('Preferences data:', data);
    toast.success('Préférences mises à jour avec succès');
  };

  const onApiSubmit = (data: ApiFormData) => {
    console.log('API data:', data);
    toast.success('Configuration API mise à jour avec succès');
  };

  const onScoringSubmit = (data: ScoringFormData) => {
    console.log('Scoring data:', data);
    toast.success('Seuils de scoring mis à jour avec succès');
  };

  const maskApiKey = (key: string, show: boolean) => {
    if (show) return key;
    return key.slice(0, 8) + '•'.repeat(key.length - 8);
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre profil, préférences et configuration de la plateforme
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profil Utilisateur</CardTitle>
            </div>
            <CardDescription>
              Informations personnelles et rôle dans l'organisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom complet</Label>
                <Input
                  id="nom"
                  {...profileForm.register('nom')}
                  placeholder="Votre nom"
                />
                {profileForm.formState.errors.nom && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.nom.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register('email')}
                  placeholder="votre.email@entreprise.ma"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  {...profileForm.register('role')}
                  placeholder="Votre rôle"
                />
                {profileForm.formState.errors.role && (
                  <p className="text-sm text-destructive">
                    {profileForm.formState.errors.role.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer le profil
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Préférences</CardTitle>
            </div>
            <CardDescription>
              Personnalisez votre expérience utilisateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="langue">Langue</Label>
                <Select
                  value={preferencesForm.watch('langue')}
                  onValueChange={(value) => preferencesForm.setValue('langue', value)}
                >
                  <SelectTrigger id="langue">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des alertes pour les nouvelles demandes et décisions
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={preferencesForm.watch('notifications')}
                  onCheckedChange={(checked) => preferencesForm.setValue('notifications', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={preferencesForm.watch('theme')}
                  onValueChange={(value: 'light' | 'dark' | 'system') => preferencesForm.setValue('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Sélectionner un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les préférences
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              <CardTitle>Configuration API</CardTitle>
            </div>
            <CardDescription>
              Endpoints et clés d'accès aux services externes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={apiForm.handleSubmit(onApiSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpointCredit">Endpoint Bureau de Crédit</Label>
                  <Input
                    id="endpointCredit"
                    {...apiForm.register('endpointCredit')}
                    placeholder="https://api.creditbureau.ma/v1"
                  />
                  {apiForm.formState.errors.endpointCredit && (
                    <p className="text-sm text-destructive">
                      {apiForm.formState.errors.endpointCredit.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKeyCredit">Clé API Bureau de Crédit</Label>
                  <div className="relative">
                    <Input
                      id="apiKeyCredit"
                      {...apiForm.register('apiKeyCredit')}
                      type={showApiKeys.credit ? 'text' : 'password'}
                      value={maskApiKey(apiForm.watch('apiKeyCredit'), showApiKeys.credit)}
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKeys(prev => ({ ...prev, credit: !prev.credit }))}
                    >
                      {showApiKeys.credit ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpointFinancial">Endpoint Données Financières</Label>
                  <Input
                    id="endpointFinancial"
                    {...apiForm.register('endpointFinancial')}
                    placeholder="https://api.financialdata.ma/v2"
                  />
                  {apiForm.formState.errors.endpointFinancial && (
                    <p className="text-sm text-destructive">
                      {apiForm.formState.errors.endpointFinancial.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKeyFinancial">Clé API Données Financières</Label>
                  <div className="relative">
                    <Input
                      id="apiKeyFinancial"
                      {...apiForm.register('apiKeyFinancial')}
                      type={showApiKeys.financial ? 'text' : 'password'}
                      value={maskApiKey(apiForm.watch('apiKeyFinancial'), showApiKeys.financial)}
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKeys(prev => ({ ...prev, financial: !prev.financial }))}
                    >
                      {showApiKeys.financial ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpointLLM">Endpoint LLM (Recommandations)</Label>
                  <Input
                    id="endpointLLM"
                    {...apiForm.register('endpointLLM')}
                    placeholder="https://api.openai.com/v1"
                  />
                  {apiForm.formState.errors.endpointLLM && (
                    <p className="text-sm text-destructive">
                      {apiForm.formState.errors.endpointLLM.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKeyLLM">Clé API LLM</Label>
                  <div className="relative">
                    <Input
                      id="apiKeyLLM"
                      {...apiForm.register('apiKeyLLM')}
                      type={showApiKeys.llm ? 'text' : 'password'}
                      value={maskApiKey(apiForm.watch('apiKeyLLM'), showApiKeys.llm)}
                      className="pr-10 font-mono"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowApiKeys(prev => ({ ...prev, llm: !prev.llm }))}
                    >
                      {showApiKeys.llm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer la configuration API
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle>Seuils de Scoring</CardTitle>
            </div>
            <CardDescription>
              Paramètres d'évaluation et critères d'approbation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={scoringForm.handleSubmit(onScoringSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dscrMin">DSCR Minimum</Label>
                <Input
                  id="dscrMin"
                  type="number"
                  step="0.01"
                  {...scoringForm.register('dscrMin', { valueAsNumber: true })}
                  placeholder="1.25"
                />
                <p className="text-sm text-muted-foreground">
                  Ratio minimum de couverture du service de la dette (recommandé: 1.25x)
                </p>
                {scoringForm.formState.errors.dscrMin && (
                  <p className="text-sm text-destructive">
                    {scoringForm.formState.errors.dscrMin.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ltvMax">LTV Maximum (%)</Label>
                <Input
                  id="ltvMax"
                  type="number"
                  {...scoringForm.register('ltvMax', { valueAsNumber: true })}
                  placeholder="80"
                />
                <p className="text-sm text-muted-foreground">
                  Ratio maximum prêt/valeur du bien (recommandé: 80%)
                </p>
                {scoringForm.formState.errors.ltvMax && (
                  <p className="text-sm text-destructive">
                    {scoringForm.formState.errors.ltvMax.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scoreMinApprobation">Score Minimum d'Approbation</Label>
                <Input
                  id="scoreMinApprobation"
                  type="number"
                  {...scoringForm.register('scoreMinApprobation', { valueAsNumber: true })}
                  placeholder="65"
                />
                <p className="text-sm text-muted-foreground">
                  Score minimum requis pour une approbation automatique (0-100)
                </p>
                {scoringForm.formState.errors.scoreMinApprobation && (
                  <p className="text-sm text-destructive">
                    {scoringForm.formState.errors.scoreMinApprobation.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2">
                <h4 className="font-medium text-sm">Aperçu des Seuils</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">DSCR Min</p>
                    <p className="font-mono font-semibold">{scoringForm.watch('dscrMin')}x</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">LTV Max</p>
                    <p className="font-mono font-semibold">{scoringForm.watch('ltvMax')}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score Min</p>
                    <p className="font-mono font-semibold">{scoringForm.watch('scoreMinApprobation')}/100</p>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les seuils
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
