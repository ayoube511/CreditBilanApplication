package com.creditbilan.kpi.service;

import com.creditbilan.applications.repository.ApplicationRepository;
import com.creditbilan.audit.service.AuditService;
import com.creditbilan.common.exception.BusinessException;
import com.creditbilan.common.exception.ResourceNotFoundException;
import com.creditbilan.kpi.dto.KpiDtos;
import com.creditbilan.kpi.entity.FinancialKpi;
import com.creditbilan.kpi.entity.FinancialSource;
import com.creditbilan.kpi.entity.KpiThreshold;
import com.creditbilan.kpi.repository.FinancialKpiRepository;
import com.creditbilan.kpi.repository.FinancialSourceRepository;
import com.creditbilan.kpi.repository.KpiThresholdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialKpiService {

    private static final String POLICY_VERSION = "KPI_POLICY_2026_01";

    private final FinancialSourceRepository sourceRepository;
    private final FinancialKpiRepository kpiRepository;
    private final KpiThresholdRepository thresholdRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditService auditService;

    public KpiDtos.KpiResponse getKpi(Long applicationId) {
        FinancialSource source = sourceRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Données KPI introuvables pour le dossier " + applicationId));
        FinancialKpi kpi = kpiRepository.findByApplicationId(applicationId)
                .orElseGet(() -> calculateAndSave(applicationId, source));
        return buildResponse(applicationId, kpi, source);
    }

    @Transactional
    public KpiDtos.KpiResponse saveSource(Long applicationId, KpiDtos.SourceRequest request) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException("Dossier", applicationId);
        }

        FinancialSource source = sourceRepository.findByApplicationId(applicationId)
                .orElse(new FinancialSource());
        source.setApplicationId(applicationId);
        source.setCaf(request.getCaf());
        source.setLoyers(request.getLoyers());
        source.setEbitda(request.getEbitda());
        source.setServiceDette(request.getServiceDette());
        source.setChargesFinancieres(request.getChargesFinancieres());
        source.setResultatNet(request.getResultatNet());
        source.setActifCourant(request.getActifCourant());
        source.setPassifCourant(request.getPassifCourant());
        source.setCapitauxPropres(request.getCapitauxPropres());
        source.setDettesTotales(request.getDettesTotales());
        source.setTotalPassif(request.getTotalPassif());
        source.setValeurBien(request.getValeurBien());
        source.setMontantFinancement(request.getMontantFinancement());
        source.setApport(request.getApport());
        source.setCotationBam(request.getCotationBam());
        source.setIncidentsPaiement(request.getIncidentsPaiement());
        sourceRepository.save(source);

        FinancialKpi kpi = calculateAndSave(applicationId, source);
        auditService.log("UPDATE_KPI", "CreditApplication", applicationId, null, null);
        return buildResponse(applicationId, kpi, source);
    }

    @Transactional
    public KpiDtos.KpiResponse recalculate(Long applicationId) {
        FinancialSource source = sourceRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new BusinessException("Données sources introuvables. Veuillez saisir les KPI d'abord."));
        FinancialKpi kpi = calculateAndSave(applicationId, source);
        auditService.log("RECALCULATE_SCORING", "CreditApplication", applicationId, null, null);
        return buildResponse(applicationId, kpi, source);
    }

    private FinancialKpi calculateAndSave(Long applicationId, FinancialSource src) {
        FinancialKpi kpi = kpiRepository.findByApplicationId(applicationId).orElse(new FinancialKpi());
        kpi.setApplicationId(applicationId);
        kpi.setPolicyVersion(POLICY_VERSION);
        kpi.setCalculatedAt(LocalDateTime.now());

        kpi.setCafLoyers(divide(src.getCaf(), src.getLoyers()));
        kpi.setDscr(divide(src.getCaf() != null ? src.getCaf() : src.getEbitda(), src.getServiceDette()));
        kpi.setLtv(dividePercent(src.getMontantFinancement(), src.getValeurBien()));
        kpi.setCouvertureCharges(divide(src.getEbitda(), src.getChargesFinancieres()));
        kpi.setLiquiditeGenerale(divide(src.getActifCourant(), src.getPassifCourant()));
        kpi.setRentabiliteCp(dividePercent(src.getResultatNet(), src.getCapitauxPropres()));
        kpi.setLevierFinancier(divide(src.getDettesTotales(), src.getEbitda()));
        kpi.setAutonomieFinanciere(dividePercent(src.getCapitauxPropres(), src.getTotalPassif()));
        kpi.setCapaciteRemboursement(divide(src.getCaf(), src.getDettesTotales()));
        kpi.setCotationBam(src.getCotationBam());
        kpi.setIncidentsPaiement(src.getIncidentsPaiement());

        boolean complete = src.getCaf() != null && src.getLoyers() != null
                && src.getEbitda() != null && src.getValeurBien() != null;
        kpi.setDataQuality(complete ? "COMPLETE" : "PARTIAL");

        kpi = kpiRepository.save(kpi);

        // Update scoring on the application
        updateApplicationScore(applicationId, kpi);
        return kpi;
    }

    private void updateApplicationScore(Long applicationId, FinancialKpi kpi) {
        applicationRepository.findById(applicationId).ifPresent(app -> {
            int score = computeScore(kpi);
            app.setScore(score);
            app.setCreditClass(scoreToClass(score));
            app.setDefaultProbabilityPct(scoreToPd(score));
            app.setStatus("SCORING_DONE");
            applicationRepository.save(app);
        });
    }

    private int computeScore(FinancialKpi kpi) {
        int score = 50;
        if (kpi.getCafLoyers() != null) {
            double v = kpi.getCafLoyers().doubleValue();
            if (v >= 1.4) score += 15;
            else if (v >= 1.2) score += 5;
            else score -= 15;
        }
        if (kpi.getDscr() != null) {
            double v = kpi.getDscr().doubleValue();
            if (v >= 1.25) score += 10;
            else score -= 10;
        }
        if (kpi.getLtv() != null) {
            double v = kpi.getLtv().doubleValue();
            if (v <= 70) score += 10;
            else if (v <= 80) score += 5;
            else score -= 10;
        }
        if (kpi.getLiquiditeGenerale() != null) {
            double v = kpi.getLiquiditeGenerale().doubleValue();
            if (v > 1.0) score += 5;
            else score -= 10;
        }
        if (kpi.getCotationBam() != null) {
            if (kpi.getCotationBam() <= 4) score += 10;
            else if (kpi.getCotationBam() > 6) score -= 20;
        }
        if (kpi.getIncidentsPaiement() != null && kpi.getIncidentsPaiement() > 0) {
            score -= kpi.getIncidentsPaiement() * 5;
        }
        return Math.max(0, Math.min(100, score));
    }

    private String scoreToClass(int score) {
        if (score >= 80) return "A";
        if (score >= 65) return "B";
        if (score >= 50) return "C";
        if (score >= 35) return "D";
        return "E";
    }

    private BigDecimal scoreToPd(int score) {
        double pd = 100 - score;
        return BigDecimal.valueOf(pd).setScale(2, RoundingMode.HALF_UP);
    }

    private KpiDtos.KpiResponse buildResponse(Long applicationId, FinancialKpi kpi, FinancialSource src) {
        List<KpiThreshold> thresholds = thresholdRepository.findByPolicyVersion(POLICY_VERSION);
        Map<String, KpiThreshold> thresholdMap = thresholds.stream()
                .collect(Collectors.toMap(KpiThreshold::getCode, t -> t));

        List<KpiDtos.KpiItem> items = new ArrayList<>();
        items.add(buildItem("CAF_LOYERS", "CAF / Loyers", kpi.getCafLoyers(), "x", "CAF ÷ Loyers", thresholdMap.get("CAF_LOYERS")));
        items.add(buildItem("DSCR", "DSCR", kpi.getDscr(), "x", "CAF ÷ Service de la dette", thresholdMap.get("DSCR")));
        items.add(buildItem("LTV", "Loan To Value", kpi.getLtv(), "%", "Montant financé ÷ Valeur du bien × 100", thresholdMap.get("LTV")));
        items.add(buildItem("LIQUIDITE_GENERALE", "Liquidité Générale", kpi.getLiquiditeGenerale(), "x", "Actif courant ÷ Passif courant", thresholdMap.get("LIQUIDITE_GENERALE")));
        items.add(buildItem("LEVIER_FINANCIER", "Levier Financier", kpi.getLevierFinancier(), "x", "Dettes totales ÷ EBITDA", thresholdMap.get("LEVIER_FINANCIER")));
        items.add(buildItem("AUTONOMIE_FINANCIERE", "Autonomie Financière", kpi.getAutonomieFinanciere(), "%", "Capitaux propres ÷ Total passif × 100", thresholdMap.get("AUTONOMIE_FINANCIERE")));
        items.add(buildItem("COTATION_BAM", "Cotation BAM", kpi.getCotationBam() != null ? BigDecimal.valueOf(kpi.getCotationBam()) : null, "note", "Cotation institutionnelle", thresholdMap.get("COTATION_BAM")));

        KpiDtos.KpiResponse response = new KpiDtos.KpiResponse();
        response.setApplicationId(applicationId);
        response.setPolicyVersion(kpi.getPolicyVersion());
        response.setCalculatedAt(kpi.getCalculatedAt());
        response.setDataQuality(kpi.getDataQuality());
        response.setItems(items);
        return response;
    }

    private KpiDtos.KpiItem buildItem(String code, String label, BigDecimal value, String unit, String formula, KpiThreshold threshold) {
        KpiDtos.KpiItem item = new KpiDtos.KpiItem();
        item.setCode(code);
        item.setLabel(label);
        item.setValue(value != null ? value.setScale(2, RoundingMode.HALF_UP) : null);
        item.setUnit(unit);
        item.setFormulaLabel(formula);
        item.setSource(value != null ? "CALCULATED" : "NOT_AVAILABLE");

        if (value != null && threshold != null) {
            item.setStatus(computeStatus(value.doubleValue(), threshold));
            item.setThreshold(formatThreshold(threshold));
        } else {
            item.setStatus("NOT_AVAILABLE");
        }
        return item;
    }

    private String computeStatus(double value, KpiThreshold t) {
        boolean higherBetter = "HIGHER_BETTER".equals(t.getDirection());
        if (higherBetter) {
            if (t.getGoodMin() != null && value >= t.getGoodMin().doubleValue()) return "GOOD";
            if (t.getWarnMin() != null && value >= t.getWarnMin().doubleValue()) return "WARN";
            return "BAD";
        } else {
            if (t.getBadMax() != null && value > t.getBadMax().doubleValue()) return "BAD";
            if (t.getGoodMin() != null && value <= t.getGoodMin().doubleValue()) return "GOOD";
            return "WARN";
        }
    }

    private String formatThreshold(KpiThreshold t) {
        if ("HIGHER_BETTER".equals(t.getDirection()) && t.getGoodMin() != null) {
            return ">= " + t.getGoodMin() + " " + (t.getUnit() != null ? t.getUnit() : "");
        }
        if ("LOWER_BETTER".equals(t.getDirection()) && t.getBadMax() != null) {
            return "<= " + t.getBadMax() + " " + (t.getUnit() != null ? t.getUnit() : "");
        }
        return "";
    }

    private BigDecimal divide(BigDecimal numerator, BigDecimal denominator) {
        if (numerator == null || denominator == null || denominator.compareTo(BigDecimal.ZERO) == 0) return null;
        return numerator.divide(denominator, 4, RoundingMode.HALF_UP);
    }

    private BigDecimal dividePercent(BigDecimal numerator, BigDecimal denominator) {
        if (numerator == null || denominator == null || denominator.compareTo(BigDecimal.ZERO) == 0) return null;
        return numerator.divide(denominator, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
    }
}
