package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.AuditLogRequest;
import com.example.legal_contract_management.dto.AuditLogResponse;
import com.example.legal_contract_management.entity.AuditLog;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.repository.AuditLogRepository;
import com.example.legal_contract_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogServiceImpl(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository
    ) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AuditLogResponse createAuditLog(
            AuditLogRequest request
    ) {

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        AuditLog auditLog = new AuditLog();

        auditLog.setUser(user);
        auditLog.setAction(request.getAction());
        auditLog.setEntityType(request.getEntityType());
        auditLog.setEntityId(request.getEntityId());
        auditLog.setDescription(request.getDescription());
        auditLog.setCreatedAt(LocalDateTime.now());

        AuditLog savedAuditLog =
                auditLogRepository.save(auditLog);

        return mapToResponse(savedAuditLog);
    }

    @Override
    public List<AuditLogResponse> getAllAuditLogs() {

        return auditLogRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public AuditLogResponse getAuditLogById(Long id) {

        AuditLog auditLog =
                auditLogRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Audit log not found"
                                ));

        return mapToResponse(auditLog);
    }

    @Override
    public List<AuditLogResponse> getAuditLogsByUser(
            Long userId
    ) {

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return auditLogRepository
                .findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<AuditLogResponse> getAuditLogsByEntity(
            String entityType,
            Long entityId
    ) {

        return auditLogRepository
                .findByEntityTypeAndEntityId(
                        entityType,
                        entityId
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteAuditLog(Long id) {

        AuditLog auditLog =
                auditLogRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Audit log not found"
                                ));

        auditLogRepository.delete(auditLog);
    }

    private AuditLogResponse mapToResponse(
            AuditLog auditLog
    ) {

        return new AuditLogResponse(
                auditLog.getId(),
                auditLog.getUser().getId(),
                auditLog.getAction(),
                auditLog.getEntityType(),
                auditLog.getEntityId(),
                auditLog.getDescription(),
                auditLog.getCreatedAt()
        );
    }
}