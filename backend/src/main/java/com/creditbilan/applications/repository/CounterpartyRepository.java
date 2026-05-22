package com.creditbilan.applications.repository;

import com.creditbilan.applications.entity.Counterparty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CounterpartyRepository extends JpaRepository<Counterparty, Long> {
}
