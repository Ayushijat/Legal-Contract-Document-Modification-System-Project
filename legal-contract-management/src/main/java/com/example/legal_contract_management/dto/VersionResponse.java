package com.example.legal_contract_management.dto;

import java.time.LocalDateTime;

public class VersionResponse {
    private Long id;
    private Long contractId;
    private Integer versionNumber;
    private Long documentId;
    private Long createdBy;
    private String changeDescription;
    private LocalDateTime createdAt;

    public VersionResponse() {
    }

    public VersionResponse(
            Long id,
            Long contractId,
            Integer versionNumber,
            Long documentId,
            Long createdBy,
            String changeDescription,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.contractId = contractId;
        this.versionNumber = versionNumber;
        this.documentId = documentId;
        this.createdBy = createdBy;
        this.changeDescription = changeDescription;
        this.createdAt = createdAt;
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

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public void setVersionNumber(Integer versionNumber) {
        this.versionNumber = versionNumber;
    }

    public Long getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public String getChangeDescription() {
        return changeDescription;
    }

    public void setChangeDescription(String changeDescription) {
        this.changeDescription = changeDescription;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
