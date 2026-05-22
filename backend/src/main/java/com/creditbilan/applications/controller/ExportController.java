package com.creditbilan.applications.controller;

import com.creditbilan.applications.repository.ApplicationRepository;
import com.creditbilan.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.StringWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/v1/exports")
@RequiredArgsConstructor
public class ExportController {

    private final ApplicationRepository applicationRepository;
    private final AuditService auditService;

    @GetMapping("/applications.csv")
    public ResponseEntity<byte[]> exportCsv(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String segment) {

        var apps = applicationRepository.findAll();

        StringWriter sw = new StringWriter();
        // Header CSV
        sw.append("Référence,Client,Secteur,Segment,Montant MAD,Score,Classe,Statut,Date Demande\n");

        // Données
        apps.forEach(app -> {
            sw.append(safe(app.getReference())).append(",");
            sw.append(safe(app.getCounterparty() != null ? app.getCounterparty().getLegalName() : "")).append(",");
            sw.append(safe(app.getSector())).append(",");
            sw.append(safe(app.getSegment())).append(",");
            sw.append(app.getAmountRequestedMad() != null ? app.getAmountRequestedMad().toString() : "").append(",");
            sw.append(app.getScore() != null ? app.getScore().toString() : "").append(",");
            sw.append(safe(app.getCreditClass())).append(",");
            sw.append(safe(app.getStatus())).append(",");
            sw.append(app.getApplicationDate() != null ? app.getApplicationDate().toString() : "").append("\n");
        });

        byte[] csvBytes = sw.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);

        String filename = "registre-credit-bilan-" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmm")) + ".csv";

        auditService.log("EXPORT_CSV", "CreditApplication", null, null, null);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }

    private String safe(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
