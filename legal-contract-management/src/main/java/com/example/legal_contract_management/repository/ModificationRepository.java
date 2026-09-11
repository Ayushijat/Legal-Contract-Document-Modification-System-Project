package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Modification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModificationRepository extends JpaRepository<Modification,Long> {
    List<Modification> findByClauseId(Long clauseId);
    List<Modification> findByVersionId(Long versionId);
}
