package com.creditbilan.kpi.repository;

import com.creditbilan.kpi.entity.KpiThreshold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KpiThresholdRepository extends JpaRepository<KpiThreshold, Long> {
    List<KpiThreshold> findByPolicyVersion(String policyVersion);
}
