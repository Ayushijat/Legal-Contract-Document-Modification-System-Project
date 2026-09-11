package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.AuditLogRequest;
import com.example.legal_contract_management.dto.AuditLogResponse;
import com.example.legal_contract_management.service.AuditLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(
            AuditLogService auditLogService
    ) {
        this.auditLogService = auditLogService;
    }

    @PostMapping
    public ResponseEntity<AuditLogResponse> createAuditLog(
            @RequestBody AuditLogRequest request
    ) {

        AuditLogResponse response =
                auditLogService.createAuditLog(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<AuditLogResponse>>
    getAllAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponse>
    getAuditLogById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponse>>
    getAuditLogsByUser(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByUser(userId)
        );
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<List<AuditLogResponse>>
    getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId
    ) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByEntity(
                        entityType,
                        entityId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuditLog(
            @PathVariable Long id
    ) {

        auditLogService.deleteAuditLog(id);

        return ResponseEntity.ok(
                "Audit log deleted successfully"
        );
    }
}