package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ApprovalRequest;
import com.example.legal_contract_management.dto.ApprovalResponse;
import com.example.legal_contract_management.entity.Approval;
import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.entity.Version;
import com.example.legal_contract_management.repository.ApprovalRepository;
import com.example.legal_contract_management.repository.ContractRepository;
import com.example.legal_contract_management.repository.UserRepository;
import com.example.legal_contract_management.repository.VersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApprovalServiceImpl implements ApprovalService {

    private final ApprovalRepository approvalRepository;
    private final ContractRepository contractRepository;
    private final VersionRepository versionRepository;
    private final UserRepository userRepository;

    public ApprovalServiceImpl(
            ApprovalRepository approvalRepository,
            ContractRepository contractRepository,
            VersionRepository versionRepository,
            UserRepository userRepository
    ) {
        this.approvalRepository = approvalRepository;
        this.contractRepository = contractRepository;
        this.versionRepository = versionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ApprovalResponse createApproval(
            ApprovalRequest request
    ) {

        Contract contract = contractRepository
                .findById(request.getContractId())
                .orElseThrow(() ->
                        new RuntimeException("Contract not found"));

        Version version = versionRepository
                .findById(request.getVersionId())
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        User approver = userRepository
                .findById(request.getApproverId())
                .orElseThrow(() ->
                        new RuntimeException("Approver not found"));

        Approval approval = new Approval();

        approval.setContract(contract);
        approval.setVersion(version);
        approval.setApprover(approver);
        approval.setStatus(request.getStatus());
        approval.setComments(request.getComments());

        if ("APPROVED".equalsIgnoreCase(request.getStatus())
                || "REJECTED".equalsIgnoreCase(request.getStatus())) {

            approval.setApprovedAt(LocalDateTime.now());
        }

        Approval savedApproval =
                approvalRepository.save(approval);

        return mapToResponse(savedApproval);
    }

    @Override
    public List<ApprovalResponse> getAllApprovals() {

        return approvalRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ApprovalResponse getApprovalById(Long id) {

        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Approval not found"));

        return mapToResponse(approval);
    }

    @Override
    public List<ApprovalResponse> getApprovalsByContract(
            Long contractId
    ) {

        contractRepository.findById(contractId)
                .orElseThrow(() ->
                        new RuntimeException("Contract not found"));

        return approvalRepository
                .findByContractId(contractId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ApprovalResponse> getApprovalsByVersion(
            Long versionId
    ) {

        versionRepository.findById(versionId)
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        return approvalRepository
                .findByVersionId(versionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ApprovalResponse updateApproval(
            Long id,
            ApprovalRequest request
    ) {

        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Approval not found"));

        approval.setStatus(request.getStatus());
        approval.setComments(request.getComments());

        if ("APPROVED".equalsIgnoreCase(request.getStatus())
                || "REJECTED".equalsIgnoreCase(request.getStatus())) {

            approval.setApprovedAt(LocalDateTime.now());
        }

        Approval updatedApproval =
                approvalRepository.save(approval);

        return mapToResponse(updatedApproval);
    }

    @Override
    public void deleteApproval(Long id) {

        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Approval not found"));

        approvalRepository.delete(approval);
    }

    private ApprovalResponse mapToResponse(
            Approval approval
    ) {

        return new ApprovalResponse(
                approval.getId(),
                approval.getContract().getId(),
                approval.getVersion().getId(),
                approval.getApprover().getId(),
                approval.getStatus(),
                approval.getComments(),
                approval.getApprovedAt()
        );
    }
}