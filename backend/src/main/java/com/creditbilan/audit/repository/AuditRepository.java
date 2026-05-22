package com.creditbilan.audit.repository;

import com.creditbilan.audit.entity.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditRepository extends JpaRepository<AuditEvent, Long> {
    @Query("SELECT a FROM AuditEvent a WHERE (:action IS NULL OR a.action = :action) AND (:entityType IS NULL OR a.entityType = :entityType) ORDER BY a.createdAt DESC")
    Page<AuditEvent> findWithFilters(@Param("action") String action, @Param("entityType") String entityType, Pageable pageable);
}
