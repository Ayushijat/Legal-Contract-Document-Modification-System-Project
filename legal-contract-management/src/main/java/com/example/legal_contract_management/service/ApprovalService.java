package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ApprovalRequest;
import com.example.legal_contract_management.dto.ApprovalResponse;

import java.util.List;

public interface ApprovalService {

    ApprovalResponse createApproval(ApprovalRequest request);

    List<ApprovalResponse> getAllApprovals();

    ApprovalResponse getApprovalById(Long id);

    List<ApprovalResponse> getApprovalsByContract(
            Long contractId
    );

    List<ApprovalResponse> getApprovalsByVersion(
            Long versionId
    );

    ApprovalResponse updateApproval(
            Long id,
            ApprovalRequest request
    );

    void deleteApproval(Long id);
}