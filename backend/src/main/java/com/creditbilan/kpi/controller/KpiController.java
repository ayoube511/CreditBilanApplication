package com.creditbilan.kpi.controller;

import com.creditbilan.common.response.ApiResponse;
import com.creditbilan.kpi.dto.KpiDtos;
import com.creditbilan.kpi.service.FinancialKpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications/{applicationId}/kpi")
@RequiredArgsConstructor
public class KpiController {

    private final FinancialKpiService kpiService;

    @GetMapping
    public ResponseEntity<ApiResponse<KpiDtos.KpiResponse>> getKpi(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.ok(kpiService.getKpi(applicationId)));
    }

    @PutMapping("/source")
    public ResponseEntity<ApiResponse<KpiDtos.KpiResponse>> saveSource(
            @PathVariable Long applicationId,
            @RequestBody KpiDtos.SourceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("KPI sauvegardés et calculés", kpiService.saveSource(applicationId, request)));
    }

    @PostMapping("/recalculate")
    public ResponseEntity<ApiResponse<KpiDtos.KpiResponse>> recalculate(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.ok("Recalcul effectué", kpiService.recalculate(applicationId)));
    }
}
