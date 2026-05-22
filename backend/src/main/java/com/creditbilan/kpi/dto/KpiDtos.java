package com.creditbilan.kpi.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class KpiDtos {

    @Data
    public static class SourceRequest {
        private BigDecimal caf;
        private BigDecimal loyers;
        private BigDecimal ebitda;
        private BigDecimal serviceDette;
        private BigDecimal chargesFinancieres;
        private BigDecimal resultatNet;
        private BigDecimal actifCourant;
        private BigDecimal passifCourant;
        private BigDecimal capitauxPropres;
        private BigDecimal dettesTotales;
        private BigDecimal totalPassif;
        private BigDecimal valeurBien;
        private BigDecimal montantFinancement;
        private BigDecimal apport;
        private Integer cotationBam;
        private Integer incidentsPaiement;
    }

    @Data
    public static class KpiResponse {
        private Long applicationId;
        private String policyVersion;
        private LocalDateTime calculatedAt;
        private String dataQuality;
        private List<KpiItem> items;
    }

    @Data
    public static class KpiItem {
        private String code;
        private String label;
        private BigDecimal value;
        private String unit;
        private String formulaLabel;
        private String status;
        private String threshold;
        private String source;
        private String interpretation;
    }
}

// Alias for import compatibility
class KpiSourceRequest extends KpiDtos.SourceRequest {}
