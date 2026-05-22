package com.creditbilan.kpi.repository;

import com.creditbilan.kpi.entity.FinancialSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialSourceRepository extends JpaRepository<FinancialSource, Long> {
    Optional<FinancialSource> findByApplicationId(Long applicationId);
}
