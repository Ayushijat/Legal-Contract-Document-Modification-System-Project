package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.AuditLogRequest;
import com.example.legal_contract_management.dto.AuditLogResponse;

import java.util.List;

public interface AuditLogService {

    AuditLogResponse createAuditLog(
            AuditLogRequest request
    );

    List<AuditLogResponse> getAllAuditLogs();

    AuditLogResponse getAuditLogById(Long id);

    List<AuditLogResponse> getAuditLogsByUser(
            Long userId
    );

    List<AuditLogResponse> getAuditLogsByEntity(
            String entityType,
            Long entityId
    );

    void deleteAuditLog(Long id);
}