package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository
        extends JpaRepository<Contract, Long> {

    boolean existsByContractNumber(String contractNumber);
}