-- V1__init_schema.sql
-- Schéma initial de la plateforme Crédit / Bilan

SET FOREIGN_KEY_CHECKS = 0;
SET SESSION sql_mode = '';

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                             name VARCHAR(255) NOT NULL,
    legal_identifier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     code VARCHAR(50) NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                     organization_id BIGINT,
                                     email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

-- ============================================================
-- USER_ROLES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
                                          user_id BIGINT NOT NULL,
                                          role_id BIGINT NOT NULL,
                                          PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
    );

-- ============================================================
-- COUNTERPARTIES (clients / contreparties)
-- ============================================================
CREATE TABLE IF NOT EXISTS counterparties (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              organization_id BIGINT,
                                              legal_name VARCHAR(255) NOT NULL,
    segment VARCHAR(50),
    sector VARCHAR(100),
    external_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

-- ============================================================
-- CREDIT_APPLICATIONS (dossiers)
-- ============================================================
CREATE TABLE IF NOT EXISTS credit_applications (
                                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                   organization_id BIGINT,
                                                   counterparty_id BIGINT,
                                                   created_by_id BIGINT,
                                                   reference VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    financing_type VARCHAR(50),
    segment VARCHAR(50),
    sector VARCHAR(100),
    amount_requested_mad DECIMAL(18,2),
    score INTEGER,
    credit_class VARCHAR(10),
    default_probability_pct DECIMAL(5,2),
    decision VARCHAR(50),
    decision_reason TEXT,
    decision_date TIMESTAMP NULL,
    decided_by_id BIGINT,
    application_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id),
    FOREIGN KEY (counterparty_id) REFERENCES counterparties(id),
    FOREIGN KEY (created_by_id) REFERENCES users(id),
    FOREIGN KEY (decided_by_id) REFERENCES users(id),
    INDEX idx_status (status),
    INDEX idx_segment (segment),
    INDEX idx_sector (sector),
    INDEX idx_created_at (created_at)
    );

-- ============================================================
-- APPLICATION_FINANCIAL_SOURCES (données sources KPI)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_financial_sources (
                                                             id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                             application_id BIGINT NOT NULL UNIQUE,
                                                             caf DECIMAL(18,2),
    loyers DECIMAL(18,2),
    ebitda DECIMAL(18,2),
    service_dette DECIMAL(18,2),
    charges_financieres DECIMAL(18,2),
    resultat_net DECIMAL(18,2),
    actif_courant DECIMAL(18,2),
    passif_courant DECIMAL(18,2),
    capitaux_propres DECIMAL(18,2),
    dettes_totales DECIMAL(18,2),
    total_passif DECIMAL(18,2),
    valeur_bien DECIMAL(18,2),
    montant_financement DECIMAL(18,2),
    apport DECIMAL(18,2),
    cotation_bam INTEGER,
    incidents_paiement INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES credit_applications(id)
    );

-- ============================================================
-- APPLICATION_FINANCIAL_KPIS (KPI calculés)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_financial_kpis (
                                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                          application_id BIGINT NOT NULL UNIQUE,
                                                          caf_loyers DECIMAL(10,4),
    dscr DECIMAL(10,4),
    ltv DECIMAL(10,4),
    couverture_charges DECIMAL(10,4),
    liquidite_generale DECIMAL(10,4),
    rentabilite_cp DECIMAL(10,4),
    levier_financier DECIMAL(10,4),
    autonomie_financiere DECIMAL(10,4),
    capacite_remboursement DECIMAL(10,4),
    cotation_bam INTEGER,
    incidents_paiement INTEGER,
    data_quality VARCHAR(20),
    policy_version VARCHAR(50),
    calculated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES credit_applications(id)
    );

-- ============================================================
-- KPI_THRESHOLDS (seuils de conformité)
-- ============================================================
CREATE TABLE IF NOT EXISTS kpi_thresholds (
                                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                              code VARCHAR(50) NOT NULL,
    label VARCHAR(100),
    good_min DECIMAL(10,4),
    warn_min DECIMAL(10,4),
    bad_max DECIMAL(10,4),
    direction VARCHAR(20),
    unit VARCHAR(20),
    policy_version VARCHAR(50) NOT NULL,
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- ============================================================
-- APPLICATION_DOCUMENTS (métadonnées pièces)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_documents (
                                                     id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                     application_id BIGINT NOT NULL,
                                                     uploaded_by_id BIGINT,
                                                     doc_type VARCHAR(100),
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    bucket VARCHAR(100),
    object_key VARCHAR(500),
    checksum_sha256 VARCHAR(64),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES credit_applications(id),
    FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
    );

-- ============================================================
-- APPLICATION_LLM_RECOMMENDATIONS (synthèses IA)
-- ============================================================
CREATE TABLE IF NOT EXISTS application_llm_recommendations (
                                                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                               application_id BIGINT NOT NULL,
                                                               analysis_text TEXT,
                                                               strengths_json TEXT,
                                                               weaknesses_json TEXT,
                                                               recommendation VARCHAR(50),
    conditions_json TEXT,
    model_name VARCHAR(100),
    prompt_version VARCHAR(50),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES credit_applications(id)
    );

-- ============================================================
-- AUDIT_EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_events (
                                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            user_id BIGINT,
                                            organization_id BIGINT,
                                            action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    payload_json TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
    );

-- ============================================================
-- USER_PREFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_preferences (
                                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                                user_id BIGINT NOT NULL UNIQUE,
                                                language VARCHAR(10),
    theme VARCHAR(20),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
    );

SET FOREIGN_KEY_CHECKS = 1;