package com.example.legal_contract_management.dto;

import java.time.LocalDateTime;

public class DocumentResponse {

    private Long id;
    private Long contractId;
    private String fileName;
    private String fileType;
    private String filePath;
    private Long fileSize;
    private Long uploadedBy;
    private LocalDateTime uploadedAt;

    public DocumentResponse(){

    }

    public DocumentResponse(
            Long id,
            Long contractId,
            String fileName,
            String fileType,
            String filePath,
            Long fileSize,
            Long uploadedBy,
            LocalDateTime uploadedAt
    ){
        this.id = id;
        this.contractId = contractId;
        this.fileName = fileName;
        this.fileType = fileType;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;

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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Long getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(Long uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
