# Plateforme Crédit / Bilan — Backend Spring Boot

## Stack technique
- Java 17
- Spring Boot 3.2.5
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8 (local via XAMPP)
- MinIO (Docker)
- Flyway (migrations)
- Swagger / OpenAPI

---

## Prérequis

| Outil | Version | Lien |
|---|---|---|
| Java JDK | 17 LTS | https://adoptium.net |
| Maven | 3.8+ | Inclus dans IntelliJ |
| XAMPP | Dernière | https://www.apachefriends.org |
| Docker Desktop | Dernière | https://www.docker.com/products/docker-desktop |
| IntelliJ IDEA | Community ou Ultimate | https://www.jetbrains.com/idea |
| Postman | Dernière | https://www.postman.com |

---

## Étape 1 — Démarrer MySQL avec XAMPP

1. Ouvrir XAMPP Control Panel
2. Cliquer **Start** sur **MySQL**
3. Ouvrir **phpMyAdmin** → `http://localhost/phpmyadmin`
4. Créer une nouvelle base de données nommée : **`credit_bilan`**
   - Encodage : `utf8mb4_unicode_ci`

---

## Étape 2 — Démarrer MinIO avec Docker

```bash
# Dans le dossier du projet (là où se trouve docker-compose.yml)
docker compose up -d
```

- Console MinIO : http://localhost:9001
- Login : `minioadmin` / `minioadmin123`

---

## Étape 3 — Configurer les variables d'environnement

```bash
# Copier le fichier exemple
cp .env.example .env
```

Éditer `.env` selon ta configuration XAMPP :
```
MYSQL_USER=root
MYSQL_PASSWORD=          # laisser vide si pas de mot de passe XAMPP
```

---

## Étape 4 — Lancer le backend dans IntelliJ

1. Ouvrir IntelliJ → **File > Open** → sélectionner le dossier `credit-bilan-backend`
2. Attendre que Maven télécharge les dépendances
3. Ouvrir `src/main/java/com/creditbilan/CreditBilanApplication.java`
4. Cliquer sur le bouton ▶️ **Run**

Au premier démarrage, Flyway va automatiquement :
- Créer toutes les tables dans `credit_bilan`
- Insérer les données de démonstration

---

## Étape 5 — Vérifier que tout fonctionne

```
GET http://localhost:8080/api/v1/health
```
Doit retourner : `{ "success": true, "data": { "status": "UP" } }`

Swagger UI : http://localhost:8080/swagger-ui.html

---

## Comptes de démonstration

| Email | Mot de passe | Rôle |
|---|---|---|
| admin@creditbilan.ma | Admin1234! | Super Admin |
| ayoub@creditbilan.ma | Admin1234! | Analyste Crédit |
| senior@creditbilan.ma | Admin1234! | Analyste Senior |
| risque@creditbilan.ma | Admin1234! | Responsable Risque |

---

## Endpoints principaux

### Authentification
| Méthode | URL | Description |
|---|---|---|
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/auth/me` | Profil connecté |

### Dossiers
| Méthode | URL | Description |
|---|---|---|
| GET | `/api/v1/applications` | Liste paginée + filtres |
| POST | `/api/v1/applications` | Créer un dossier |
| GET | `/api/v1/applications/{id}` | Détail dossier |
| PATCH | `/api/v1/applications/{id}` | Modifier dossier |
| POST | `/api/v1/applications/{id}/decision` | Décision finale |

### KPI & Scoring
| Méthode | URL | Description |
|---|---|---|
| GET | `/api/v1/applications/{id}/kpi` | KPI calculés |
| PUT | `/api/v1/applications/{id}/kpi/source` | Saisir données sources |
| POST | `/api/v1/applications/{id}/kpi/recalculate` | Recalculer score |

### Documents
| Méthode | URL | Description |
|---|---|---|
| POST | `/api/v1/applications/{id}/documents/upload-url` | URL signée upload |
| POST | `/api/v1/applications/{id}/documents/{docId}/finalize` | Finaliser upload |
| GET | `/api/v1/applications/{id}/documents` | Liste documents |
| GET | `/api/v1/applications/{id}/documents/{docId}/download-url` | URL téléchargement |

### Dashboard
| Méthode | URL | Description |
|---|---|---|
| GET | `/api/v1/dashboard/summary` | Résumé portefeuille |
| GET | `/api/v1/dashboard/sector-distribution` | Répartition secteurs |
| GET | `/api/v1/dashboard/portfolio` | Statistiques complètes |

### Audit
| Méthode | URL | Description |
|---|---|---|
| GET | `/api/v1/audit-events` | Journal d'audit (admin) |

---

## Exemple de test avec Postman

### 1. Login
```json
POST http://localhost:8080/api/v1/auth/login
Content-Type: application/json

{
  "email": "ayoub@creditbilan.ma",
  "password": "Admin1234!"
}
```
→ Copier le `token` reçu

### 2. Utiliser le token
Dans Postman → onglet **Authorization** → Type: **Bearer Token** → coller le token

### 3. Lister les dossiers
```
GET http://localhost:8080/api/v1/applications?page=0&size=10
```

### 4. Saisir des KPI
```json
PUT http://localhost:8080/api/v1/applications/1/kpi/source
Content-Type: application/json

{
  "caf": 1250000,
  "loyers": 850000,
  "ebitda": 2100000,
  "serviceDette": 1400000,
  "valeurBien": 5000000,
  "montantFinancement": 2500000,
  "actifCourant": 4200000,
  "passifCourant": 3100000,
  "capitauxPropres": 2600000,
  "dettesTotales": 7200000,
  "totalPassif": 9800000,
  "cotationBam": 5,
  "incidentsPaiement": 0
}
```

---

## Structure du projet

```
src/main/java/com/creditbilan/
├── CreditBilanApplication.java
├── auth/           → Login, JWT, /me
├── users/          → Utilisateurs, rôles, organisations
├── applications/   → Dossiers de crédit/leasing
├── kpi/            → KPI financiers, scoring, conformité
├── documents/      → Upload/download MinIO
├── dashboard/      → Statistiques et résumé
├── audit/          → Journal des actions
└── common/         → Config, exceptions, réponses API
```

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| `Cannot connect to MySQL` | Vérifier que XAMPP MySQL est démarré et que la base `credit_bilan` existe |
| `MinIO connection refused` | Lancer `docker compose up -d` |
| `Flyway migration error` | Vider la table `flyway_schema_history` dans phpMyAdmin et relancer |
| `JWT token invalid` | Le token expire après 60 min, se reconnecter |
| Port 8080 occupé | Changer `server.port` dans `application.yml` |
