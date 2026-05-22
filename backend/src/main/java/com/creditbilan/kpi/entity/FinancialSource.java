package com.creditbilan.kpi.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "application_financial_sources")
public class FinancialSource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false)
    private Long applicationId;

    private BigDecimal caf;
    private BigDecimal loyers;
    private BigDecimal ebitda;
    @Column(name = "service_dette")
    private BigDecimal serviceDette;
    @Column(name = "charges_financieres")
    private BigDecimal chargesFinancieres;
    @Column(name = "resultat_net")
    private BigDecimal resultatNet;
    @Column(name = "actif_courant")
    private BigDecimal actifCourant;
    @Column(name = "passif_courant")
    private BigDecimal passifCourant;
    @Column(name = "capitaux_propres")
    private BigDecimal capitauxPropres;
    @Column(name = "dettes_totales")
    private BigDecimal dettesTotales;
    @Column(name = "total_passif")
    private BigDecimal totalPassif;
    @Column(name = "valeur_bien")
    private BigDecimal valeurBien;
    @Column(name = "montant_financement")
    private BigDecimal montantFinancement;
    private BigDecimal apport;
    @Column(name = "cotation_bam")
    private Integer cotationBam;
    @Column(name = "incidents_paiement")
    private Integer incidentsPaiement = 0;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
