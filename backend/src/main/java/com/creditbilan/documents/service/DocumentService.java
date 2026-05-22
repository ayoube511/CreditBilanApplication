package com.creditbilan.documents.service;

import com.creditbilan.audit.service.AuditService;
import com.creditbilan.common.config.MinioConfig;
import com.creditbilan.common.exception.BusinessException;
import com.creditbilan.common.exception.ResourceNotFoundException;
import com.creditbilan.documents.dto.DocumentDtos;
import com.creditbilan.documents.entity.ApplicationDocument;
import com.creditbilan.documents.repository.DocumentRepository;
import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;
    private final DocumentRepository documentRepository;
    private final AuditService auditService;

    @Transactional
    public DocumentDtos.UploadUrlResponse prepareUpload(Long applicationId, DocumentDtos.PrepareRequest request, Long userId) {
        ensureBucketExists();

        String objectKey = "applications/" + applicationId + "/" + UUID.randomUUID() + "_" + request.getFilename();

        ApplicationDocument doc = new ApplicationDocument();
        doc.setApplicationId(applicationId);
        doc.setUploadedById(userId);
        doc.setDocType(request.getDocType());
        doc.setOriginalFilename(request.getFilename());
        doc.setMimeType(request.getMimeType());
        doc.setBucket(minioConfig.getBucket());
        doc.setObjectKey(objectKey);
        doc.setStatus("PENDING");
        doc = documentRepository.save(doc);

        try {
            String uploadUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(minioConfig.getBucket())
                            .object(objectKey)
                            .expiry(minioConfig.getPresignedUrlExpiryMinutes(), TimeUnit.MINUTES)
                            .build()
            );

            DocumentDtos.UploadUrlResponse response = new DocumentDtos.UploadUrlResponse();
            response.setDocumentId(doc.getId());
            response.setUploadUrl(uploadUrl);
            response.setObjectKey(objectKey);
            return response;
        } catch (Exception e) {
            log.error("Erreur MinIO getPresignedUrl: {}", e.getMessage());
            throw new BusinessException("Erreur lors de la génération de l'URL d'upload");
        }
    }

    @Transactional
    public DocumentDtos.DocumentInfo finalizeUpload(Long applicationId, Long documentId, Long userId) {
        ApplicationDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", documentId));

        if (!doc.getApplicationId().equals(applicationId)) {
            throw new BusinessException("Document non associé à ce dossier");
        }

        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(doc.getObjectKey())
                            .build()
            );
            doc.setSizeBytes(stat.size());
        } catch (Exception e) {
            log.warn("Impossible de vérifier le fichier MinIO: {}", e.getMessage());
        }

        doc.setStatus("READY");
        doc = documentRepository.save(doc);
        auditService.log("UPLOAD_DOCUMENT", "ApplicationDocument", doc.getId(), null, null);
        return toInfo(doc, false);
    }

    public List<DocumentDtos.DocumentInfo> getDocuments(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId)
                .stream()
                .filter(d -> "READY".equals(d.getStatus()))
                .map(d -> toInfo(d, false))
                .collect(Collectors.toList());
    }

    public DocumentDtos.DocumentInfo getDownloadUrl(Long documentId) {
        ApplicationDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", documentId));

        try {
            String downloadUrl = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioConfig.getBucket())
                            .object(doc.getObjectKey())
                            .expiry(minioConfig.getPresignedUrlExpiryMinutes(), TimeUnit.MINUTES)
                            .build()
            );
            auditService.log("DOWNLOAD_DOCUMENT", "ApplicationDocument", doc.getId(), null, null);
            return toInfo(doc, downloadUrl);
        } catch (Exception e) {
            throw new BusinessException("Erreur lors de la génération de l'URL de téléchargement");
        }
    }

    private void ensureBucketExists() {
        try {
            boolean exists = minioClient.bucketExists(
                    BucketExistsArgs.builder().bucket(minioConfig.getBucket()).build()
            );
            if (!exists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(minioConfig.getBucket()).build());
                log.info("Bucket créé: {}", minioConfig.getBucket());
            }
        } catch (Exception e) {
            log.error("Erreur vérification bucket: {}", e.getMessage());
        }
    }

    private DocumentDtos.DocumentInfo toInfo(ApplicationDocument doc, boolean withUrl) {
        DocumentDtos.DocumentInfo info = new DocumentDtos.DocumentInfo();
        info.setId(doc.getId());
        info.setDocType(doc.getDocType());
        info.setOriginalFilename(doc.getOriginalFilename());
        info.setMimeType(doc.getMimeType());
        info.setSizeBytes(doc.getSizeBytes());
        info.setStatus(doc.getStatus());
        info.setCreatedAt(doc.getCreatedAt());
        return info;
    }

    private DocumentDtos.DocumentInfo toInfo(ApplicationDocument doc, String downloadUrl) {
        DocumentDtos.DocumentInfo info = toInfo(doc, true);
        info.setDownloadUrl(downloadUrl);
        return info;
    }
}
