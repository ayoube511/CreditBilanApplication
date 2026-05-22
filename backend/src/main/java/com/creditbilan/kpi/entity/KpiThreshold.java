package com.creditbilan.kpi.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "kpi_thresholds")
public class KpiThreshold {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;
    private String label;
    @Column(name = "good_min")
    private BigDecimal goodMin;
    @Column(name = "warn_min")
    private BigDecimal warnMin;
    @Column(name = "bad_max")
    private BigDecimal badMax;
    private String direction = "HIGHER_BETTER";
    private String unit;
    @Column(name = "policy_version", nullable = false)
    private String policyVersion;
    @Column(name = "effective_from")
    private LocalDateTime effectiveFrom;

    @PrePersist protected void onCreate() { if (effectiveFrom == null) effectiveFrom = LocalDateTime.now(); }
}
