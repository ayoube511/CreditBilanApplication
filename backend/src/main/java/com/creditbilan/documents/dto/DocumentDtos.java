package com.creditbilan.documents.dto;

import lombok.Data;
import java.time.LocalDateTime;

public class DocumentDtos {

    @Data
    public static class PrepareRequest {
        private String filename;
        private String mimeType;
        private String docType;
    }

    @Data
    public static class UploadUrlResponse {
        private Long documentId;
        private String uploadUrl;
        private String objectKey;
    }

    @Data
    public static class DocumentInfo {
        private Long id;
        private String docType;
        private String originalFilename;
        private String mimeType;
        private Long sizeBytes;
        private String status;
        private String downloadUrl;
        private LocalDateTime createdAt;
    }
}
