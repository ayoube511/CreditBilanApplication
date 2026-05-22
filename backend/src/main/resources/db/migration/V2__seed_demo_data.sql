-- V2__seed_demo_data.sql
-- Données de démonstration pour la plateforme Crédit / Bilan

-- Organisation de test
INSERT INTO organizations (id, name, legal_identifier) VALUES
(1, 'Banque Atlas Maroc', 'RC-ATLAS-001');

-- Rôles
INSERT INTO roles (id, code, label) VALUES
(1, 'SUPER_ADMIN', 'Super Administrateur'),
(2, 'ADMIN', 'Administrateur'),
(3, 'ANALYSTE_SENIOR', 'Analyste Senior'),
(4, 'ANALYSTE_CREDIT', 'Analyste Crédit'),
(5, 'RESPONSABLE_RISQUE', 'Responsable Risque'),
(6, 'LECTEUR', 'Lecteur');

-- Users (password = "Admin1234!" hashé bcrypt)
INSERT INTO users (id, organization_id, email, password_hash, full_name, is_active) VALUES
(1, 1, 'admin@creditbilan.ma', '$2a$12$LQv3c1yqBwXHHBYMbYiSuOxSxLqBp1dEX5D.VVyqXfHhpWvKqzKsm', 'Administrateur Système', TRUE),
(2, 1, 'ayoub@creditbilan.ma', '$2a$12$LQv3c1yqBwXHHBYMbYiSuOxSxLqBp1dEX5D.VVyqXfHhpWvKqzKsm', 'Ayoub Analyste', TRUE),
(3, 1, 'senior@creditbilan.ma', '$2a$12$LQv3c1yqBwXHHBYMbYiSuOxSxLqBp1dEX5D.VVyqXfHhpWvKqzKsm', 'Sara Analyste Senior', TRUE),
(4, 1, 'risque@creditbilan.ma', '$2a$12$LQv3c1yqBwXHHBYMbYiSuOxSxLqBp1dEX5D.VVyqXfHhpWvKqzKsm', 'Karim Risque', TRUE);

-- Affectation des rôles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), (1, 2),
(2, 4),
(3, 3),
(4, 5);

-- Contreparties (clients)
INSERT INTO counterparties (id, organization_id, legal_name, segment, sector, external_ref) VALUES
(1, 1, 'Société Immobilière Al Fath', 'PME', 'Immobilier', 'CLIENT-001'),
(2, 1, 'Transport Express Maghreb', 'PME', 'Transport', 'CLIENT-002'),
(3, 1, 'Agro Industries du Sud', 'ETI', 'Agro-alimentaire', 'CLIENT-003'),
(4, 1, 'Tech Solutions Casablanca', 'Startup', 'Technologie', 'CLIENT-004'),
(5, 1, 'Clinique Privée Ibn Sina', 'PME', 'Santé', 'CLIENT-005');

-- Dossiers de crédit
INSERT INTO credit_applications (id, organization_id, counterparty_id, created_by_id, reference, status, financing_type, segment, sector, amount_requested_mad, score, credit_class, default_probability_pct, application_date) VALUES
(1, 1, 1, 2, 'DOS-2026-001', 'SCORING_DONE', 'LEASING', 'PME', 'Immobilier', 2500000.00, 72, 'B', 8.50, '2026-01-15'),
(2, 1, 2, 2, 'DOS-2026-002', 'APPROVED', 'CREDIT', 'PME', 'Transport', 800000.00, 85, 'A', 3.20, '2026-02-01'),
(3, 1, 3, 3, 'DOS-2026-003', 'IN_REVIEW', 'LEASING', 'ETI', 'Agro-alimentaire', 5000000.00, 61, 'C', 15.00, '2026-03-10'),
(4, 1, 4, 2, 'DOS-2026-004', 'DRAFT', 'CREDIT', 'Startup', 'Technologie', 350000.00, NULL, NULL, NULL, '2026-04-05'),
(5, 1, 5, 3, 'DOS-2026-005', 'REJECTED', 'CREDIT', 'PME', 'Santé', 1200000.00, 42, 'D', 28.00, '2026-01-20');

-- Données sources KPI
INSERT INTO application_financial_sources (application_id, caf, loyers, ebitda, service_dette, charges_financieres, resultat_net, actif_courant, passif_courant, capitaux_propres, dettes_totales, total_passif, valeur_bien, montant_financement, apport, cotation_bam, incidents_paiement) VALUES
(1, 1250000, 850000, 2100000, 1400000, 320000, 680000, 4200000, 3100000, 2600000, 7200000, 9800000, 5000000, 2500000, 500000, 5, 0),
(2, 580000, 320000, 920000, 600000, 95000, 310000, 1800000, 950000, 1200000, 2100000, 3300000, 1200000, 800000, 200000, 3, 0),
(3, 2100000, 1800000, 3500000, 2800000, 650000, 980000, 8500000, 7200000, 3200000, 15000000, 18200000, 8000000, 5000000, 1200000, 7, 2),
(5, 380000, 520000, 620000, 680000, 180000, 120000, 1200000, 1800000, 450000, 3800000, 4250000, 2000000, 1200000, 150000, 8, 5);

-- KPI calculés
INSERT INTO application_financial_kpis (application_id, caf_loyers, dscr, ltv, couverture_charges, liquidite_generale, rentabilite_cp, levier_financier, autonomie_financiere, capacite_remboursement, cotation_bam, incidents_paiement, data_quality, policy_version, calculated_at) VALUES
(1, 1.47, 0.89, 50.00, 6.56, 1.35, 26.15, 3.43, 26.53, 0.17, 5, 0, 'COMPLETE', 'KPI_POLICY_2026_01', NOW()),
(2, 1.81, 0.97, 66.67, 9.68, 1.89, 25.83, 1.75, 36.36, 0.28, 3, 0, 'COMPLETE', 'KPI_POLICY_2026_01', NOW()),
(3, 1.17, 0.75, 62.50, 5.38, 1.18, 30.63, 4.69, 17.58, 0.14, 7, 2, 'COMPLETE', 'KPI_POLICY_2026_01', NOW()),
(5, 0.73, 0.56, 60.00, 3.44, 0.67, 26.67, 8.44, 10.59, 0.10, 8, 5, 'COMPLETE', 'KPI_POLICY_2026_01', NOW());

-- Seuils KPI (politique active)
INSERT INTO kpi_thresholds (code, label, good_min, warn_min, bad_max, direction, unit, policy_version) VALUES
('CAF_LOYERS', 'CAF / Loyers', 1.40, 1.20, 1.20, 'HIGHER_BETTER', 'x', 'KPI_POLICY_2026_01'),
('DSCR', 'DSCR', 1.25, 1.10, 1.10, 'HIGHER_BETTER', 'x', 'KPI_POLICY_2026_01'),
('LTV', 'Loan To Value', NULL, NULL, 80.00, 'LOWER_BETTER', '%', 'KPI_POLICY_2026_01'),
('LIQUIDITE_GENERALE', 'Liquidité Générale', 1.00, 0.80, 0.80, 'HIGHER_BETTER', 'x', 'KPI_POLICY_2026_01'),
('LEVIER_FINANCIER', 'Levier Financier', NULL, NULL, 3.00, 'LOWER_BETTER', 'x', 'KPI_POLICY_2026_01'),
('AUTONOMIE_FINANCIERE', 'Autonomie Financière', 20.00, 10.00, 10.00, 'HIGHER_BETTER', '%', 'KPI_POLICY_2026_01'),
('COTATION_BAM', 'Cotation BAM', NULL, NULL, 6.00, 'LOWER_BETTER', 'note', 'KPI_POLICY_2026_01');

-- Préférences utilisateurs
INSERT INTO user_preferences (user_id, language, theme, notifications_enabled) VALUES
(1, 'fr', 'light', TRUE),
(2, 'fr', 'light', TRUE),
(3, 'fr', 'dark', TRUE),
(4, 'fr', 'light', FALSE);
