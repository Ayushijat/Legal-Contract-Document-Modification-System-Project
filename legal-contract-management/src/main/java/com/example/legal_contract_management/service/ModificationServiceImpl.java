package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ModificationRequest;
import com.example.legal_contract_management.dto.ModificationResponse;
import com.example.legal_contract_management.entity.Clause;
import com.example.legal_contract_management.entity.Modification;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.entity.Version;
import com.example.legal_contract_management.repository.ClauseRepository;
import com.example.legal_contract_management.repository.ModificationRepository;
import com.example.legal_contract_management.repository.UserRepository;
import com.example.legal_contract_management.repository.VersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ModificationServiceImpl
        implements ModificationService {

    private final ModificationRepository modificationRepository;
    private final ClauseRepository clauseRepository;
    private final VersionRepository versionRepository;
    private final UserRepository userRepository;

    public ModificationServiceImpl(
            ModificationRepository modificationRepository,
            ClauseRepository clauseRepository,
            VersionRepository versionRepository,
            UserRepository userRepository
    ) {
        this.modificationRepository = modificationRepository;
        this.clauseRepository = clauseRepository;
        this.versionRepository = versionRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ModificationResponse createModification(
            ModificationRequest request
    ) {

        Clause clause = clauseRepository.findById(request.getClauseId())
                .orElseThrow(() ->
                        new RuntimeException("Clause not found"));

        Version version = versionRepository.findById(request.getVersionId())
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        User user = userRepository.findById(request.getModifiedBy())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Modification modification = new Modification();

        modification.setClause(clause);
        modification.setVersion(version);
        modification.setModifiedBy(user);

        modification.setOldContent(request.getOldContent());
        modification.setNewContent(request.getNewContent());
        modification.setModificationReason(
                request.getModificationReason()
        );

        modification.setModifiedAt(LocalDateTime.now());

        Modification savedModification =
                modificationRepository.save(modification);

        return mapToResponse(savedModification);
    }

    @Override
    public List<ModificationResponse> getAllModifications() {

        return modificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ModificationResponse getModificationById(Long id) {

        Modification modification =
                modificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Modification not found"
                                ));

        return mapToResponse(modification);
    }

    @Override
    public List<ModificationResponse> getModificationsByClause(
            Long clauseId
    ) {

        clauseRepository.findById(clauseId)
                .orElseThrow(() ->
                        new RuntimeException("Clause not found"));

        return modificationRepository
                .findByClauseId(clauseId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ModificationResponse> getModificationsByVersion(
            Long versionId
    ) {

        versionRepository.findById(versionId)
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        return modificationRepository
                .findByVersionId(versionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void deleteModification(Long id) {

        Modification modification =
                modificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Modification not found"
                                ));

        modificationRepository.delete(modification);
    }

    private ModificationResponse mapToResponse(
            Modification modification
    ) {

        return new ModificationResponse(
                modification.getId(),
                modification.getClause().getId(),
                modification.getVersion().getId(),
                modification.getModifiedBy().getId(),
                modification.getOldContent(),
                modification.getNewContent(),
                modification.getModificationReason(),
                modification.getModifiedAt()
        );
    }
}