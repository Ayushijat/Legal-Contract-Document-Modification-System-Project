package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.ClauseRequest;
import com.example.legal_contract_management.dto.ClauseResponse;
import com.example.legal_contract_management.entity.Clause;
import com.example.legal_contract_management.entity.Version;
import com.example.legal_contract_management.repository.ClauseRepository;
import com.example.legal_contract_management.repository.VersionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClauseServiceImpl implements ClauseService {

    private final ClauseRepository clauseRepository;
    private final VersionRepository versionRepository;

    public ClauseServiceImpl(
            ClauseRepository clauseRepository,
            VersionRepository versionRepository
    ) {
        this.clauseRepository = clauseRepository;
        this.versionRepository = versionRepository;
    }

    @Override
    public ClauseResponse createClause(ClauseRequest request) {

        Version version = versionRepository.findById(request.getVersionId())
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        Clause clause = new Clause();

        clause.setVersion(version);
        clause.setClauseNumber(request.getClauseNumber());
        clause.setTitle(request.getTitle());
        clause.setContent(request.getContent());

        Clause savedClause = clauseRepository.save(clause);

        return mapToResponse(savedClause);
    }

    @Override
    public List<ClauseResponse> getAllClauses() {

        return clauseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ClauseResponse getClauseById(Long id) {

        Clause clause = clauseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Clause not found"));

        return mapToResponse(clause);
    }

    @Override
    public List<ClauseResponse> getClausesByVersion(Long versionId) {

        // First verify that version exists
        versionRepository.findById(versionId)
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        return clauseRepository.findByVersionId(versionId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ClauseResponse updateClause(
            Long id,
            ClauseRequest request
    ) {

        Clause clause = clauseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Clause not found"));

        clause.setClauseNumber(request.getClauseNumber());
        clause.setTitle(request.getTitle());
        clause.setContent(request.getContent());

        Clause updatedClause = clauseRepository.save(clause);

        return mapToResponse(updatedClause);
    }

    @Override
    public void deleteClause(Long id) {

        Clause clause = clauseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Clause not found"));

        clauseRepository.delete(clause);
    }

    private ClauseResponse mapToResponse(Clause clause) {

        return new ClauseResponse(
                clause.getId(),
                clause.getVersion().getId(),
                clause.getClauseNumber(),
                clause.getTitle(),
                clause.getContent()
        );
    }
}