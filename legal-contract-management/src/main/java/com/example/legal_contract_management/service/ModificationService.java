package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ModificationRequest;
import com.example.legal_contract_management.dto.ModificationResponse;

import java.util.List;

public interface ModificationService {

    ModificationResponse createModification(
            ModificationRequest request
    );

    List<ModificationResponse> getAllModifications();

    ModificationResponse getModificationById(Long id);

    List<ModificationResponse> getModificationsByClause(
            Long clauseId
    );

    List<ModificationResponse> getModificationsByVersion(
            Long versionId
    );

    void deleteModification(Long id);
}