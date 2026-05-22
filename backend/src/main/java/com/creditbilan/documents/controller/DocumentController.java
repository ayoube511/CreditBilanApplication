package com.creditbilan.documents.controller;

import com.creditbilan.common.response.ApiResponse;
import com.creditbilan.documents.dto.DocumentDtos;
import com.creditbilan.documents.service.DocumentService;
import com.creditbilan.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications/{applicationId}/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserRepository userRepository;

    @PostMapping("/upload-url")
    public ResponseEntity<ApiResponse<DocumentDtos.UploadUrlResponse>> prepareUpload(
            @PathVariable Long applicationId,
            @RequestBody DocumentDtos.PrepareRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmailAndIsActiveTrue(userDetails.getUsername())
                .map(u -> u.getId()).orElse(null);
        return ResponseEntity.ok(ApiResponse.ok(documentService.prepareUpload(applicationId, request, userId)));
    }

    @PostMapping("/{documentId}/finalize")
    public ResponseEntity<ApiResponse<DocumentDtos.DocumentInfo>> finalizeUpload(
            @PathVariable Long applicationId,
            @PathVariable Long documentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userRepository.findByEmailAndIsActiveTrue(userDetails.getUsername())
                .map(u -> u.getId()).orElse(null);
        return ResponseEntity.ok(ApiResponse.ok(documentService.finalizeUpload(applicationId, documentId, userId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDtos.DocumentInfo>>> getDocuments(
            @PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getDocuments(applicationId)));
    }

    @GetMapping("/{documentId}/download-url")
    public ResponseEntity<ApiResponse<DocumentDtos.DocumentInfo>> getDownloadUrl(
            @PathVariable Long applicationId,
            @PathVariable Long documentId) {
        return ResponseEntity.ok(ApiResponse.ok(documentService.getDownloadUrl(documentId)));
    }
}
