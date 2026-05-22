package com.creditbilan.audit.controller;

import com.creditbilan.audit.entity.AuditEvent;
import com.creditbilan.audit.service.AuditService;
import com.creditbilan.common.response.ApiResponse;
import com.creditbilan.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-events")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'RESPONSABLE_RISQUE')")
    public ResponseEntity<ApiResponse<PageResponse<AuditEvent>>> getEvents(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getEvents(action, entityType, page, size)));
    }
}
