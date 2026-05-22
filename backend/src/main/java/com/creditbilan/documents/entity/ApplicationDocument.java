package com.creditbilan.documents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "application_documents")
public class ApplicationDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false)
    private Long applicationId;

    @Column(name = "uploaded_by_id")
    private Long uploadedById;

    @Column(name = "doc_type")
    private String docType;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    private String bucket;

    @Column(name = "object_key")
    private String objectKey;

    @Column(name = "checksum_sha256")
    private String checksumSha256;

    private String status = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}
