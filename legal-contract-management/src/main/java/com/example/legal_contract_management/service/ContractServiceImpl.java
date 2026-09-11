package com.example.legal_contract_management.service;

import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.ContractStatus;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.repository.ContractRepository;
import com.example.legal_contract_management.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    public ContractServiceImpl(
            ContractRepository contractRepository,
            UserRepository userRepository) {

        this.contractRepository = contractRepository;
        this.userRepository = userRepository;

    }

    // Get all contracts
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    // Get contract by ID
    public Contract getContractById(Long id) {

        return contractRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Contract not found with id: " + id
                        )
                );
    }

    // Create contract
    public Contract createContract(
            String contractNumber,
            String title,
            String contractType,
            ContractStatus status,
            Long createdById) {

        if (contractRepository.existsByContractNumber(contractNumber)) {
            throw new RuntimeException(
                    "Contract number already exists"
            );
        }

        User user = userRepository.findById(createdById)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: " + createdById
                        )
                );

        Contract contract = new Contract();

        contract.setContractNumber(contractNumber);
        contract.setTitle(title);
        contract.setContractType(contractType);

        // Default status
        if (status == null) {
            status = ContractStatus.DRAFT;
        }

        contract.setStatus(status);
        contract.setCreatedBy(user);

        contract.setCreatedAt(LocalDateTime.now());
        contract.setUpdatedAt(LocalDateTime.now());

        return contractRepository.save(contract);
    }

    // Update contract
    public Contract updateContract(
            Long id,
            String contractNumber,
            String title,
            String contractType,
            ContractStatus status) {

        Contract contract = getContractById(id);

        if (!contract.getContractNumber().equals(contractNumber)
                && contractRepository.existsByContractNumber(contractNumber)) {

            throw new RuntimeException(
                    "Contract number already exists"
            );
        }

        contract.setContractNumber(contractNumber);
        contract.setTitle(title);
        contract.setContractType(contractType);

        if (status != null) {
            contract.setStatus(status);
        }

        contract.setUpdatedAt(LocalDateTime.now());

        return contractRepository.save(contract);
    }

    // Delete contract
    public String deleteContract(Long id) {

        Contract contract = getContractById(id);

        contractRepository.delete(contract);

        return "Contract deleted successfully";
    }
}