package com.example.legal_contract_management.dto;

import java.time.LocalDateTime;

public class ModificationResponse {

    private Long id;
    private Long clauseId;
    private Long versionId;
    private Long modifiedBy;
    private String oldContent;
    private String newContent;
    private String modificationReason;
    private LocalDateTime modifiedAt;

    public ModificationResponse() {
    }

    public ModificationResponse(
            Long id,
            Long clauseId,
            Long versionId,
            Long modifiedBy,
            String oldContent,
            String newContent,
            String modificationReason,
            LocalDateTime modifiedAt
    ) {
        this.id = id;
        this.clauseId = clauseId;
        this.versionId = versionId;
        this.modifiedBy = modifiedBy;
        this.oldContent = oldContent;
        this.newContent = newContent;
        this.modificationReason = modificationReason;
        this.modifiedAt = modifiedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getClauseId() {
        return clauseId;
    }

    public void setClauseId(Long clauseId) {
        this.clauseId = clauseId;
    }

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public Long getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(Long modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public String getOldContent() {
        return oldContent;
    }

    public void setOldContent(String oldContent) {
        this.oldContent = oldContent;
    }

    public String getNewContent() {
        return newContent;
    }

    public void setNewContent(String newContent) {
        this.newContent = newContent;
    }

    public String getModificationReason() {
        return modificationReason;
    }

    public void setModificationReason(String modificationReason) {
        this.modificationReason = modificationReason;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}