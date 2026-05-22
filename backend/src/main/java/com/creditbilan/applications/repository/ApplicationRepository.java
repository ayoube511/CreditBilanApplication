package com.creditbilan.applications.repository;

import com.creditbilan.applications.entity.CreditApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<CreditApplication, Long> {

    @Query("""
        SELECT a FROM CreditApplication a
        LEFT JOIN FETCH a.counterparty c
        LEFT JOIN FETCH a.createdBy u
        WHERE (:status IS NULL OR a.status = :status)
        AND (:segment IS NULL OR a.segment = :segment)
        AND (:sector IS NULL OR a.sector = :sector)
        AND (:q IS NULL OR LOWER(a.reference) LIKE LOWER(CONCAT('%',:q,'%'))
             OR LOWER(c.legalName) LIKE LOWER(CONCAT('%',:q,'%')))
        """)
    Page<CreditApplication> findWithFilters(
            @Param("status") String status,
            @Param("segment") String segment,
            @Param("sector") String sector,
            @Param("q") String q,
            Pageable pageable
    );

    @Query("SELECT a FROM CreditApplication a LEFT JOIN FETCH a.counterparty LEFT JOIN FETCH a.createdBy WHERE a.id = :id")
    Optional<CreditApplication> findByIdWithDetails(@Param("id") Long id);

    boolean existsByReference(String reference);

    long countByStatus(String status);

    @Query("SELECT COUNT(a) FROM CreditApplication a WHERE a.organization.id = :orgId")
    long countByOrganization(@Param("orgId") Long orgId);
}
