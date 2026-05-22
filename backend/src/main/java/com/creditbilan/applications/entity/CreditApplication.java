package com.creditbilan.applications.entity;

import com.creditbilan.users.entity.Organization;
import com.creditbilan.users.entity.User;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "credit_applications")
public class CreditApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counterparty_id")
    private Counterparty counterparty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(unique = true, nullable = false)
    private String reference;

    @Column(nullable = false)
    private String status = "DRAFT";

    @Column(name = "financing_type")
    private String financingType;

    private String segment;
    private String sector;

    @Column(name = "amount_requested_mad")
    private BigDecimal amountRequestedMad;

    private Integer score;

    @Column(name = "credit_class")
    private String creditClass;

    @Column(name = "default_probability_pct")
    private BigDecimal defaultProbabilityPct;

    private String decision;

    @Column(name = "decision_reason", columnDefinition = "TEXT")
    private String decisionReason;

    @Column(name = "decision_date")
    private LocalDateTime decisionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decided_by_id")
    private User decidedBy;

    @Column(name = "application_date")
    private LocalDate applicationDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
