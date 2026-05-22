package com.creditbilan.kpi.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "application_financial_kpis")
public class FinancialKpi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", unique = true, nullable = false)
    private Long applicationId;

    @Column(name = "caf_loyers")
    private BigDecimal cafLoyers;
    private BigDecimal dscr;
    private BigDecimal ltv;
    @Column(name = "couverture_charges")
    private BigDecimal couvertureCharges;
    @Column(name = "liquidite_generale")
    private BigDecimal liquiditeGenerale;
    @Column(name = "rentabilite_cp")
    private BigDecimal rentabiliteCp;
    @Column(name = "levier_financier")
    private BigDecimal levierFinancier;
    @Column(name = "autonomie_financiere")
    private BigDecimal autonomieFinanciere;
    @Column(name = "capacite_remboursement")
    private BigDecimal capaciteRemboursement;
    @Column(name = "cotation_bam")
    private Integer cotationBam;
    @Column(name = "incidents_paiement")
    private Integer incidentsPaiement;
    @Column(name = "data_quality")
    private String dataQuality = "INCOMPLETE";
    @Column(name = "policy_version")
    private String policyVersion;
    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
