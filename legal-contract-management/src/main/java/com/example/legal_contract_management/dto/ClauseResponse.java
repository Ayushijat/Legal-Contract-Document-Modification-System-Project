package com.example.legal_contract_management.dto;

public class ClauseResponse {

    private Long id;
    private Long versionId;
    private String clauseNumber;
    private String title;
    private String content;

    public ClauseResponse() {
    }

    public ClauseResponse(
            Long id,
            Long versionId,
            String clauseNumber,
            String title,
            String content
    ) {
        this.id = id;
        this.versionId = versionId;
        this.clauseNumber = clauseNumber;
        this.title = title;
        this.content = content;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public String getClauseNumber() {
        return clauseNumber;
    }

    public void setClauseNumber(String clauseNumber) {
        this.clauseNumber = clauseNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}