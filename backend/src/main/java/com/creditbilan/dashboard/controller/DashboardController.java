package com.creditbilan.dashboard.controller;

import com.creditbilan.common.response.ApiResponse;
import com.creditbilan.dashboard.dto.DashboardDtos;
import com.creditbilan.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardDtos.Summary>> getSummary() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSummary()));
    }

    @GetMapping("/sector-distribution")
    public ResponseEntity<ApiResponse<List<DashboardDtos.SectorDistribution>>> getSectorDistribution() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSectorDistribution()));
    }

    @GetMapping("/portfolio")
    public ResponseEntity<ApiResponse<DashboardDtos.PortfolioStats>> getPortfolioStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getPortfolioStats()));
    }
}
