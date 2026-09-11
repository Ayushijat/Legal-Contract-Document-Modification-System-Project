package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.ContractStatus;
import com.example.legal_contract_management.service.ContractService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    // Create contract
    @PostMapping
    public ResponseEntity<Contract> createContract(
            @RequestParam String contractNumber,
            @RequestParam String title,
            @RequestParam(required = false) String contractType,
            @RequestParam(required = false) ContractStatus status,
            @RequestParam Long createdById) {

        Contract contract = contractService.createContract(
                contractNumber,
                title,
                contractType,
                status,
                createdById
        );

        return new ResponseEntity<>(contract, HttpStatus.CREATED);
    }

    // Get all contracts
    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {

        return ResponseEntity.ok(
                contractService.getAllContracts()
        );
    }

    // Get contract by ID
    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                contractService.getContractById(id)
        );
    }

    // Update contract
    @PutMapping("/{id}")
    public ResponseEntity<Contract> updateContract(
            @PathVariable Long id,
            @RequestParam String contractNumber,
            @RequestParam String title,
            @RequestParam(required = false) String contractType,
            @RequestParam(required = false) ContractStatus status) {

        Contract contract = contractService.updateContract(
                id,
                contractNumber,
                title,
                contractType,
                status
        );

        return ResponseEntity.ok(contract);
    }

    // Delete contract
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContract(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                contractService.deleteContract(id)
        );
    }
}