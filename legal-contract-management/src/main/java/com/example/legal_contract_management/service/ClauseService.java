package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ClauseRequest;
import com.example.legal_contract_management.dto.ClauseResponse;

import java.util.List;

public interface ClauseService {

    ClauseResponse createClause(ClauseRequest request);

    List<ClauseResponse> getAllClauses();

    ClauseResponse getClauseById(Long id);

    List<ClauseResponse> getClausesByVersion(Long versionId);

    ClauseResponse updateClause(Long id, ClauseRequest request);

    void deleteClause(Long id);
}