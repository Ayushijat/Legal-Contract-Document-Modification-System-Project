package com.example.legal_contract_management.service;

import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.ContractStatus;

import java.util.List;

public interface ContractService {

    List<Contract> getAllContracts();

    Contract getContractById(Long id);

    Contract createContract(
            String contractNumber,
            String title,
            String contractType,
            ContractStatus status,
            Long createdById
    );

    Contract updateContract(
            Long id,
            String contractNumber,
            String title,
            String contractType,
            ContractStatus status
    );

    String deleteContract(Long id);
}