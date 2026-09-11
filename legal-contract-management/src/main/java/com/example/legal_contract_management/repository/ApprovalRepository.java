package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval,Long> {
    List<Approval> findByContractId(Long contractId);

    List<Approval> findByVersionId(Long versionId);
}
