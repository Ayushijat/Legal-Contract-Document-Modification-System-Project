package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.ApprovalRequest;
import com.example.legal_contract_management.dto.ApprovalResponse;
import com.example.legal_contract_management.service.ApprovalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    public ApprovalController(
            ApprovalService approvalService
    ) {
        this.approvalService = approvalService;
    }

    @PostMapping
    public ResponseEntity<ApprovalResponse> createApproval(
            @RequestBody ApprovalRequest request
    ) {

        ApprovalResponse response =
                approvalService.createApproval(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<ApprovalResponse>>
    getAllApprovals() {

        return ResponseEntity.ok(
                approvalService.getAllApprovals()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApprovalResponse>
    getApprovalById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                approvalService.getApprovalById(id)
        );
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<ApprovalResponse>>
    getApprovalsByContract(
            @PathVariable Long contractId
    ) {

        return ResponseEntity.ok(
                approvalService
                        .getApprovalsByContract(contractId)
        );
    }

    @GetMapping("/version/{versionId}")
    public ResponseEntity<List<ApprovalResponse>>
    getApprovalsByVersion(
            @PathVariable Long versionId
    ) {

        return ResponseEntity.ok(
                approvalService
                        .getApprovalsByVersion(versionId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApprovalResponse>
    updateApproval(
            @PathVariable Long id,
            @RequestBody ApprovalRequest request
    ) {

        return ResponseEntity.ok(
                approvalService.updateApproval(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApproval(
            @PathVariable Long id
    ) {

        approvalService.deleteApproval(id);

        return ResponseEntity.ok(
                "Approval deleted successfully"
        );
    }
}