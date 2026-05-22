package com.creditbilan.kpi.repository;

import com.creditbilan.kpi.entity.FinancialKpi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FinancialKpiRepository extends JpaRepository<FinancialKpi, Long> {
    Optional<FinancialKpi> findByApplicationId(Long applicationId);
}
