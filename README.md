# 🏦 Plateforme Crédit / Bilan
### Registre des Engagements — Solution Métier de Suivi, d'Analyse Financière et de Scoring

<div align="center">

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-S3-C72E49?style=for-the-badge&logo=minio&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Réalisé dans le cadre d'un stage professionnel — Mai 2026**

</div>

---

## 📋 Table des Matières

- [Présentation du projet](#-présentation-du-projet)
- [Architecture technique](#-architecture-technique)
- [Stack technologique](#-stack-technologique)
- [Diagrammes UML](#-diagrammes-uml)
- [Structure du projet](#-structure-du-projet)
- [Installation et lancement](#-installation-et-lancement)
- [API REST — Endpoints](#-api-rest--endpoints)
- [Fonctionnalités](#-fonctionnalités)
- [Comptes de démonstration](#-comptes-de-démonstration)
- [Collection Postman](#-collection-postman)

---

## 🎯 Présentation du projet

La **Plateforme Crédit / Bilan** est une application web professionnelle destinée aux banques, sociétés de financement et structures de crédit-bail/leasing. Elle permet de :

- 📁 **Centraliser** tous les dossiers de crédit et leasing
- 📊 **Analyser** les indicateurs financiers (DSCR, LTV, CAF/Loyers, etc.)
- 🎯 **Scorer** automatiquement les dossiers selon une politique de risque versionnée
- 📄 **Gérer** les pièces justificatives via un stockage sécurisé MinIO
- 📈 **Piloter** le portefeuille via des tableaux de bord et statistiques en temps réel
- 🔐 **Sécuriser** l'accès avec authentification JWT et gestion des rôles

> **Principe fondamental** : Le frontend affiche, le backend calcule. Toutes les règles métier (scoring, conformité, audit, sécurité) sont centralisées côté serveur.

---

## 🏗 Architecture technique

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVIGATEUR WEB                               │
│              React 18 + Vite + TypeScript                        │
│         TanStack Query · Axios · Recharts · Tailwind             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP REST /api/v1
                           │ JWT Bearer Token
┌──────────────────────────▼──────────────────────────────────────┐
│                   BACKEND SPRING BOOT                            │
│                                                                  │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌────────┐  │
│  │  Auth   │ │Dossiers  │ │   KPI    │ │  Docs  │ │ Audit  │  │
│  │  JWT    │ │  CRUD    │ │ Scoring  │ │ MinIO  │ │ Events │  │
│  └─────────┘ └──────────┘ └──────────┘ └────────┘ └────────┘  │
│                                                                  │
│  Spring Security · Spring Data JPA · Flyway · OpenAPI           │
└──────┬───────────────────────────────────────┬──────────────────┘
       │ JDBC                                   │ S3 API
┌──────▼──────────┐                   ┌─────────▼──────────┐
│   MySQL 8.x     │                   │   MinIO Docker     │
│   XAMPP/Local   │                   │   Port 9000/9001   │
│   Port 3306     │                   │   Bucket privé     │
└─────────────────┘                   └────────────────────┘
```

---

## 🛠 Stack technologique

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Frontend** | React + Vite + TypeScript | 18 / 5.x |
| **State Management** | TanStack Query | 5.x |
| **HTTP Client** | Axios | 1.x |
| **UI Components** | shadcn/ui + Tailwind CSS | — |
| **Charts** | Recharts | 2.x |
| **Backend** | Spring Boot | 3.2.5 |
| **Sécurité** | Spring Security + JWT | 6.x |
| **ORM** | Spring Data JPA + Hibernate | 6.x |
| **Base de données** | MySQL (MariaDB 10.4) | 8.x |
| **Migrations** | Flyway | 9.x |
| **Stockage fichiers** | MinIO | S3-compatible |
| **Documentation API** | SpringDoc OpenAPI (Swagger) | 2.5 |
| **Conteneurisation** | Docker Compose | — |

---

## 📐 Diagrammes UML

### 1. Diagramme de Cas d'Utilisation

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Plateforme Crédit / Bilan                        │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────────────────────────┐  │
│  │   Analyste   │───▶│ Se connecter                             │  │
│  │   Crédit     │───▶│ Consulter tableau de bord                │  │
│  │              │───▶│ Consulter registre dossiers              │  │
│  │              │───▶│ Créer / modifier dossier                 │  │
│  │              │───▶│ Saisir KPI financiers                    │  │
│  │              │───▶│ Recalculer score et conformité           │  │
│  │              │───▶│ Uploader pièces justificatives           │  │
│  │              │───▶│ Télécharger / prévisualiser document     │  │
│  └──────────────┘    └──────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────────────────────────┐  │
│  │ Responsable  │───▶│ Valider / refuser dossier                │  │
│  │   Risque     │───▶│ Consulter audit                          │  │
│  │              │───▶│ Consulter statistiques                   │  │
│  │              │───▶│ Exporter CSV                             │  │
│  └──────────────┘    └──────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────┐    ┌──────────────────────────────────────────┐  │
│  │Administrateur│───▶│ Gérer utilisateurs et rôles              │  │
│  │              │───▶│ Configurer seuils de scoring             │  │
│  │              │───▶│ Consulter journal d'audit complet        │  │
│  └──────────────┘    └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 2. Diagramme de Classes Métier

```
┌─────────────────────┐       ┌─────────────────────┐
│    Organization     │       │        User          │
├─────────────────────┤       ├─────────────────────┤
│ + id: Long          │1    * │ + id: Long           │
│ + name: String      │◄──────│ + email: String      │
│ + legalIdentifier   │       │ + fullName: String   │
└─────────────────────┘       │ + isActive: Boolean  │
                               └──────────┬──────────┘
                                          │ * 
                                          │ has
                                          ▼ *
                               ┌─────────────────────┐
                               │        Role          │
                               ├─────────────────────┤
                               │ + code: String       │
                               │ + label: String      │
                               └─────────────────────┘

┌─────────────────────┐       ┌──────────────────────────────────┐
│   Counterparty      │       │        CreditApplication          │
├─────────────────────┤       ├──────────────────────────────────┤
│ + id: Long          │1    * │ + id: Long                        │
│ + legalName: String │◄──────│ + reference: String               │
│ + segment: String   │       │ + status: ApplicationStatus       │
│ + sector: String    │       │ + amountRequestedMad: Decimal     │
└─────────────────────┘       │ + score: Integer                  │
                               │ + creditClass: String             │
                               │ + defaultProbabilityPct: Decimal  │
                               └──────────┬───────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼ 1                   ▼ *                   ▼ *
        ┌───────────────────┐  ┌────────────────────┐  ┌──────────────────┐
        │  FinancialKpi     │  │ApplicationDocument │  │   AuditEvent     │
        ├───────────────────┤  ├────────────────────┤  ├──────────────────┤
        │ + cafLoyers       │  │ + docType          │  │ + action         │
        │ + dscr            │  │ + originalFilename │  │ + entityType     │
        │ + ltv             │  │ + bucket           │  │ + createdAt      │
        │ + liquidite       │  │ + objectKey        │  │ + ipAddress      │
        │ + levierFinancier │  │ + status           │  └──────────────────┘
        │ + autonomie       │  └────────────────────┘
        │ + dataQuality     │
        │ + policyVersion   │
        └───────────────────┘
```

---

### 3. Diagramme de Séquence — Login JWT

```
Utilisateur    Frontend React    AuthController    AuthService    MySQL
     │                │                │               │            │
     │ email+password │                │               │            │
     │───────────────▶│                │               │            │
     │                │ POST /auth/login│               │            │
     │                │───────────────▶│               │            │
     │                │                │ login(request)│            │
     │                │                │──────────────▶│            │
     │                │                │               │ findByEmail│
     │                │                │               │───────────▶│
     │                │                │               │◀───────────│
     │                │                │               │            │
     │                │                │               │ BCrypt.match│
     │                │                │               │────────────│
     │                │                │               │            │
     │                │                │               │ generateJWT│
     │                │                │  AuthResponse │            │
     │                │                │◀──────────────│            │
     │                │  200 OK +token │               │            │
     │                │◀───────────────│               │            │
     │  Connexion OK  │                │               │            │
     │◀───────────────│                │               │            │
     │                │ GET /auth/me   │               │            │
     │                │───────────────▶│               │            │
     │                │  Profil user   │               │            │
     │◀───────────────│◀───────────────│               │            │
```

---

### 4. Diagramme d'État — Cycle de vie d'un Dossier

```
                    ┌─────────────┐
                    │   [Début]   │
                    └──────┬──────┘
                           │ Création
                           ▼
                    ┌─────────────┐
                    │    DRAFT    │◄──────────────────────┐
                    │  (Brouillon)│                       │
                    └──────┬──────┘                       │
                           │ Infos complètes              │
                           ▼                              │
                    ┌─────────────┐    Docs manquants     │
              ┌────▶│  IN_REVIEW  │──────────────────┐    │
              │     │ (En cours)  │                  │    │
              │     └──────┬──────┘                  ▼    │
              │            │                  ┌──────────────────┐
              │            │ KPI + Scoring    │WAITING_DOCUMENTS │
              │            │                  │ (En attente)     │
              │            ▼                  └────────┬─────────┘
              │     ┌─────────────┐                    │ Docs ajoutés
              └─────│SCORING_DONE │◄───────────────────┘
                    │  (Scoré)    │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────────────────┐
        │ APPROVED │ │ REJECTED │ │APPROVED_WITH_CONDITIONS│
        │(Approuvé)│ │ (Refusé) │ └──────────┬───────────┘
        └────┬─────┘ └────┬─────┘            │
             │            │         ┌─────────┴──────────┐
             ▼            ▼         ▼                    ▼
           [Fin]        [Fin]   APPROVED             REJECTED
                                  [Fin]               [Fin]
```

---

### 5. Diagramme d'Activité — Recalcul Scoring

```
         ┌─────────────────────────────┐
         │ POST /applications/{id}/    │
         │      kpi/recalculate        │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │ Vérifier authentification    │
         │ et droits utilisateur        │
         └──────────────┬───────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │ Charger dossier + KPI        │
         │ depuis MySQL                 │
         └──────────────┬───────────────┘
                        │
              ┌─────────▼──────────┐
              │  KPI incomplets ?  │
              └─────────┬──────────┘
              OUI │          │ NON
                  ▼          ▼
           ┌──────────┐  ┌────────────────────────┐
           │ 400 Error│  │ Charger politique active│
           └──────────┘  └────────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Calculer ratios KPI     │
                         │ CAF/Loyers, DSCR, LTV.. │
                         └────────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Appliquer seuils        │
                         │ GOOD / WARN / BAD       │
                         └────────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Calculer score global   │
                         │ + classe + prob. défaut │
                         └────────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Sauvegarder en MySQL    │
                         │ + écrire audit_event    │
                         └────────────┬───────────┘
                                      │
                                      ▼
                         ┌────────────────────────┐
                         │ Retourner ScoringResult │
                         │ au frontend React       │
                         └────────────────────────┘
```

---

## 📁 Structure du projet

```
CreditBilanApplication/
│
├── 📁 backend/                          # API Spring Boot
│   ├── src/main/java/com/creditbilan/
│   │   ├── CreditBilanApplication.java  # Point d'entrée
│   │   ├── auth/                        # Login, JWT, /me
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── dto/
│   │   │   └── security/                # JwtService, Filter
│   │   ├── users/                       # Utilisateurs, rôles
│   │   ├── applications/                # Dossiers crédit/leasing
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── dto/
│   │   ├── kpi/                         # KPI financiers + scoring
│   │   ├── documents/                   # MinIO upload/download
│   │   ├── dashboard/                   # Statistiques portefeuille
│   │   ├── audit/                       # Journal d'audit
│   │   └── common/                      # Config, exceptions, réponses
│   ├── src/main/resources/
│   │   ├── application.yml              # Configuration
│   │   └── db/migration/
│   │       ├── V1__init_schema.sql      # Création des tables
│   │       └── V2__seed_demo_data.sql   # Données de démo
│   └── pom.xml
│
├── 📁 src/                              # Frontend React
│   ├── api/                             # Clients API
│   │   ├── httpClient.ts                # Axios + JWT interceptor
│   │   ├── authApi.ts                   # Login, profil
│   │   ├── applicationsApi.ts           # Dossiers
│   │   ├── dashboardApi.ts              # Dashboard
│   │   └── kpiApi.ts                    # KPI financiers
│   ├── components/                      # Composants UI
│   │   ├── ApplicationTable.tsx         # Liste dossiers connectée
│   │   ├── ApplicationDetails.tsx       # Fiche détail connectée
│   │   ├── DocumentSection.tsx          # Upload/download MinIO
│   │   └── ExportButton.tsx             # Export CSV
│   ├── contexts/
│   │   └── AuthContext.tsx              # Gestion authentification
│   └── pages/
│       ├── Login.tsx                    # Page connexion
│       ├── Dashboard.tsx                # Tableau de bord
│       ├── Applications.tsx             # Registre dossiers
│       └── Statistics.tsx               # Statistiques
│
├── 📁 postman/                          # Collection Postman
│   └── My Collection.postman_collection.json
│
├── docker-compose.yml                   # MinIO Docker
├── .env.example                         # Variables d'environnement
└── README.md                            # Ce fichier
```

---

## 🚀 Installation et lancement

### Prérequis

| Logiciel | Version | Lien |
|----------|---------|------|
| Java JDK | 17 LTS | https://adoptium.net |
| Node.js | 24 LTS | https://nodejs.org |
| XAMPP | Dernière | https://apachefriends.org |
| Docker Desktop | Dernière | https://docker.com |
| IntelliJ IDEA | 2026+ | https://jetbrains.com/idea |

---

### Étape 1 — Démarrer MySQL avec XAMPP

```bash
# Ouvrir XAMPP Control Panel
# Cliquer Start sur MySQL et Apache
# Ouvrir phpMyAdmin : http://localhost/phpmyadmin
# Créer la base de données : credit_bilan (utf8mb4_unicode_ci)
```

---

### Étape 2 — Démarrer MinIO avec Docker

```bash
cd backend/
docker compose up -d

# Console MinIO : http://localhost:9001
# Login : minioadmin / minioadmin123
```

---

### Étape 3 — Lancer le Backend

```bash
cd backend/

# Copier les variables d'environnement
cp .env.example .env

# Lancer avec IntelliJ : Run CreditBilanApplication.java
# OU avec Maven :
mvn spring-boot:run
```

✅ Le backend démarre sur **http://localhost:8080**
✅ Flyway crée automatiquement toutes les tables
✅ Les données de démo sont insérées

---

### Étape 4 — Lancer le Frontend

```bash
# Installer les dépendances
npm install

# Créer le fichier .env
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env

# Lancer le frontend
npm run dev
```

✅ Le frontend démarre sur **http://localhost:8081**

---

### Étape 5 — Vérifier le lancement

```bash
# Health check backend
GET http://localhost:8080/api/v1/health
# Réponse : { "success": true, "data": { "status": "UP" } }

# Swagger UI
http://localhost:8080/swagger-ui.html

# Frontend
http://localhost:8081
```

---

## 🔌 API REST — Endpoints

### 🔐 Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/login` | Connexion + token JWT |
| GET | `/api/v1/auth/me` | Profil utilisateur connecté |

### 📁 Dossiers
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/applications` | Liste paginée + filtres |
| POST | `/api/v1/applications` | Créer un dossier |
| GET | `/api/v1/applications/{id}` | Détail dossier |
| PATCH | `/api/v1/applications/{id}` | Modifier dossier |
| POST | `/api/v1/applications/{id}/decision` | Décision finale |

### 📊 KPI & Scoring
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/applications/{id}/kpi` | KPI calculés |
| PUT | `/api/v1/applications/{id}/kpi/source` | Saisir données sources |
| POST | `/api/v1/applications/{id}/kpi/recalculate` | Recalculer score |

### 📄 Documents
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/applications/{id}/documents/upload-url` | URL signée upload |
| POST | `/api/v1/applications/{id}/documents/{docId}/finalize` | Finaliser upload |
| GET | `/api/v1/applications/{id}/documents` | Liste documents |
| GET | `/api/v1/applications/{id}/documents/{docId}/download-url` | URL téléchargement |

### 📈 Dashboard & Statistiques
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/dashboard/summary` | Résumé portefeuille |
| GET | `/api/v1/dashboard/sector-distribution` | Répartition secteurs |
| GET | `/api/v1/dashboard/portfolio` | Statistiques complètes |

### 📋 Exports & Audit
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/exports/applications.csv` | Export CSV registre |
| GET | `/api/v1/audit-events` | Journal d'audit (admin) |

---

## ✨ Fonctionnalités

### 🔐 Sécurité
- Authentification JWT avec token d'accès (60 min)
- Gestion des rôles : Super Admin, Admin, Analyste Senior, Analyste Crédit, Responsable Risque, Lecteur
- Protection de toutes les routes sensibles
- Audit trail de toutes les actions importantes

### 📊 Analyse Financière
- Calcul automatique des KPI : CAF/Loyers, DSCR, LTV, Liquidité Générale, Levier Financier, Autonomie Financière, Cotation BAM
- Scoring automatique (0-100) avec classe de risque (A à E)
- Conformité BAM avec seuils versionnés : GOOD / WARN / BAD
- Probabilité de défaut calculée côté serveur

### 📁 Gestion Documentaire
- Upload sécurisé via URLs signées MinIO (expiration 30 min)
- Stockage dans bucket privé S3-compatible
- Types de documents : Bilan, Liasse fiscale, Pièce d'identité, Statuts, Extrait RC
- Validation type MIME et taille (max 10 MB)

### 📈 Pilotage Portefeuille
- Dashboard temps réel : demandes actives, encours global, taux d'approbation
- Répartition sectorielle et par segment
- Statistiques par statut et classe de risque
- Export CSV du registre complet

---

## 👥 Comptes de démonstration

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `admin@creditbilan.ma` | `Admin1234!` | Super Administrateur |
| `ayoub@creditbilan.ma` | `Admin1234!` | Analyste Crédit |
| `senior@creditbilan.ma` | `Admin1234!` | Analyste Senior |
| `risque@creditbilan.ma` | `Admin1234!` | Responsable Risque |

---

## 📮 Collection Postman

La collection Postman complète est disponible dans le dossier `postman/`.

Elle contient tous les endpoints testés :
- Login et récupération du profil
- CRUD dossiers avec filtres et pagination
- Saisie KPI et recalcul scoring
- Upload et download documents
- Dashboard et statistiques
- Journal d'audit

**Import** : Ouvrir Postman → Import → sélectionner le fichier JSON

---

## 🔧 Variables d'environnement

### Backend (`backend/.env`)
```env
# MySQL (XAMPP)
MYSQL_USER=root
MYSQL_PASSWORD=

# MinIO Docker
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=credit-bilan-documents

# JWT
JWT_SECRET=credit-bilan-super-secret-key-change-in-production
```

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## 🗄 Modèle de données

Les principales tables de la base de données :

| Table | Description |
|-------|-------------|
| `organizations` | Organisations / établissements |
| `users` | Utilisateurs de la plateforme |
| `roles` / `user_roles` | Rôles et permissions |
| `counterparties` | Clients / contreparties |
| `credit_applications` | Dossiers de crédit/leasing |
| `application_financial_sources` | Données sources KPI |
| `application_financial_kpis` | KPI calculés et versionnés |
| `kpi_thresholds` | Seuils de conformité |
| `application_documents` | Métadonnées des pièces |
| `audit_events` | Journal d'audit complet |

---

## 📝 Décisions techniques

| Décision | Justification |
|----------|--------------|
| Spring Boot 3.2.5 | Stabilité LTS + Java 17 |
| JWT stateless | Scalabilité, pas de session serveur |
| MinIO S3 | Stockage sécurisé URLs signées temporaires |
| Flyway migrations | Versionnement du schéma traçable |
| MariaDB 10.4 | Compatible XAMPP local |
| React + TanStack Query | Cache intelligent, états loading/error automatiques |

---

<div align="center">

**Plateforme Crédit / Bilan** — Stage professionnel Mai 2026

Développé avec ❤️ par **Ayoube MOUBSSITE**

</div>
