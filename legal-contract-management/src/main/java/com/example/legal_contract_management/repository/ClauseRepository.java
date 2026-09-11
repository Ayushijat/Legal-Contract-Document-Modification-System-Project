package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Clause;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClauseRepository extends JpaRepository<Clause,Long> {
    List<Clause> findByVersionId(Long versionId);
}
