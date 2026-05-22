package com.creditbilan.documents.repository;

import com.creditbilan.documents.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByApplicationIdAndStatus(Long applicationId, String status);
    List<ApplicationDocument> findByApplicationId(Long applicationId);
}
