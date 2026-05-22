package com.creditbilan.dashboard.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDtos {

    @Data
    public static class Summary {
        private long totalApplications;
        private long approved;
        private long rejected;
        private long inReview;
        private long draft;
        private long scoringDone;
        private BigDecimal totalAmountMad;
        private Double averageScore;
        private long badKpiCount;
    }

    @Data
    public static class SectorDistribution {
        private String sector;
        private long count;
        private BigDecimal totalAmount;
    }

    @Data
    public static class SegmentDistribution {
        private String segment;
        private long count;
    }

    @Data
    public static class PortfolioStats {
        private List<SectorDistribution> bySector;
        private List<SegmentDistribution> bySegment;
        private Map<String, Long> byStatus;
        private Map<String, Long> byClass;
        private Double approvalRate;
    }
}
