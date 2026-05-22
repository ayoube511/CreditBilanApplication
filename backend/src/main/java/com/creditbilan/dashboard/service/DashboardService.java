package com.creditbilan.dashboard.service;

import com.creditbilan.applications.repository.ApplicationRepository;
import com.creditbilan.dashboard.dto.DashboardDtos;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JdbcTemplate jdbcTemplate;
    private final ApplicationRepository applicationRepository;

    public DashboardDtos.Summary getSummary() {
        DashboardDtos.Summary summary = new DashboardDtos.Summary();
        summary.setTotalApplications(applicationRepository.count());
        summary.setApproved(applicationRepository.countByStatus("APPROVED"));
        summary.setRejected(applicationRepository.countByStatus("REJECTED"));
        summary.setInReview(applicationRepository.countByStatus("IN_REVIEW"));
        summary.setDraft(applicationRepository.countByStatus("DRAFT"));
        summary.setScoringDone(applicationRepository.countByStatus("SCORING_DONE"));

        // Total amount
        BigDecimal total = jdbcTemplate.queryForObject(
                "SELECT COALESCE(SUM(amount_requested_mad), 0) FROM credit_applications", BigDecimal.class);
        summary.setTotalAmountMad(total);

        // Average score
        Double avgScore = jdbcTemplate.queryForObject(
                "SELECT AVG(score) FROM credit_applications WHERE score IS NOT NULL", Double.class);
        summary.setAverageScore(avgScore != null ? Math.round(avgScore * 10.0) / 10.0 : null);

        return summary;
    }

    public List<DashboardDtos.SectorDistribution> getSectorDistribution() {
        return jdbcTemplate.query(
                "SELECT sector, COUNT(*) as cnt, COALESCE(SUM(amount_requested_mad),0) as total " +
                "FROM credit_applications WHERE sector IS NOT NULL GROUP BY sector ORDER BY cnt DESC",
                (rs, rowNum) -> {
                    DashboardDtos.SectorDistribution d = new DashboardDtos.SectorDistribution();
                    d.setSector(rs.getString("sector"));
                    d.setCount(rs.getLong("cnt"));
                    d.setTotalAmount(rs.getBigDecimal("total"));
                    return d;
                }
        );
    }

    public DashboardDtos.PortfolioStats getPortfolioStats() {
        DashboardDtos.PortfolioStats stats = new DashboardDtos.PortfolioStats();

        // By sector
        stats.setBySector(getSectorDistribution());

        // By segment
        List<DashboardDtos.SegmentDistribution> bySegment = jdbcTemplate.query(
                "SELECT segment, COUNT(*) as cnt FROM credit_applications WHERE segment IS NOT NULL GROUP BY segment",
                (rs, rowNum) -> {
                    DashboardDtos.SegmentDistribution d = new DashboardDtos.SegmentDistribution();
                    d.setSegment(rs.getString("segment"));
                    d.setCount(rs.getLong("cnt"));
                    return d;
                }
        );
        stats.setBySegment(bySegment);

        // By status
        Map<String, Long> byStatus = new HashMap<>();
        jdbcTemplate.query(
                "SELECT status, COUNT(*) as cnt FROM credit_applications GROUP BY status",
                rs -> { byStatus.put(rs.getString("status"), rs.getLong("cnt")); }
        );
        stats.setByStatus(byStatus);

        // By credit class
        Map<String, Long> byClass = new HashMap<>();
        jdbcTemplate.query(
                "SELECT credit_class, COUNT(*) as cnt FROM credit_applications WHERE credit_class IS NOT NULL GROUP BY credit_class",
                rs -> { byClass.put(rs.getString("credit_class"), rs.getLong("cnt")); }
        );
        stats.setByClass(byClass);

        // Approval rate
        long total = applicationRepository.count();
        long approved = applicationRepository.countByStatus("APPROVED");
        stats.setApprovalRate(total > 0 ? Math.round((double) approved / total * 1000.0) / 10.0 : 0.0);

        return stats;
    }
}
