package com.creditbilan.applications.controller;

import com.creditbilan.applications.dto.ApplicationDtos;
import com.creditbilan.applications.service.ApplicationService;
import com.creditbilan.common.response.ApiResponse;
import com.creditbilan.common.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ApplicationDtos.ListItem>>> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String segment,
            @RequestParam(required = false) String sector,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        PageResponse<ApplicationDtos.ListItem> result = applicationService.getApplications(
                status, segment, sector, q, page, size, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDtos.Detail>> createApplication(
            @Valid @RequestBody ApplicationDtos.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationDtos.Detail detail = applicationService.createApplication(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Dossier créé", detail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDtos.Detail>> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplication(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDtos.Detail>> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationDtos.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.updateApplication(id, request, userDetails.getUsername())));
    }

    @PostMapping("/{id}/decision")
    public ResponseEntity<ApiResponse<ApplicationDtos.Detail>> makeDecision(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationDtos.DecisionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(
                applicationService.makeDecision(id, request, userDetails.getUsername())));
    }
}
