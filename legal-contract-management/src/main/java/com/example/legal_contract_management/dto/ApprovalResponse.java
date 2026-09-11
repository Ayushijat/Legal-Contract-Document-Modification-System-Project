package com.example.legal_contract_management.dto;

import java.time.LocalDateTime;

public class ApprovalResponse {

    private Long id;
    private Long contractId;
    private Long versionId;
    private Long approverId;
    private String status;
    private String comments;
    private LocalDateTime approvedAt;

    public ApprovalResponse() {
    }

    public ApprovalResponse(
            Long id,
            Long contractId,
            Long versionId,
            Long approverId,
            String status,
            String comments,
            LocalDateTime approvedAt
    ) {
        this.id = id;
        this.contractId = contractId;
        this.versionId = versionId;
        this.approverId = approverId;
        this.status = status;
        this.comments = comments;
        this.approvedAt = approvedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public Long getApproverId() {
        return approverId;
    }

    public void setApproverId(Long approverId) {
        this.approverId = approverId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}