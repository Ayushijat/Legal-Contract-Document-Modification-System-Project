package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.ClauseRequest;
import com.example.legal_contract_management.dto.ClauseResponse;
import com.example.legal_contract_management.service.ClauseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clauses")
public class ClauseController {

    private final ClauseService clauseService;

    public ClauseController(ClauseService clauseService) {
        this.clauseService = clauseService;
    }

    // Create Clause
    @PostMapping
    public ResponseEntity<ClauseResponse> createClause(
            @RequestBody ClauseRequest request
    ) {

        ClauseResponse response =
                clauseService.createClause(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // Get All Clauses
    @GetMapping
    public ResponseEntity<List<ClauseResponse>> getAllClauses() {

        return ResponseEntity.ok(
                clauseService.getAllClauses()
        );
    }

    // Get Clause By ID
    @GetMapping("/{id}")
    public ResponseEntity<ClauseResponse> getClauseById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                clauseService.getClauseById(id)
        );
    }

    // Get Clauses By Version
    @GetMapping("/version/{versionId}")
    public ResponseEntity<List<ClauseResponse>> getClausesByVersion(
            @PathVariable Long versionId
    ) {

        return ResponseEntity.ok(
                clauseService.getClausesByVersion(versionId)
        );
    }

    // Update Clause
    @PutMapping("/{id}")
    public ResponseEntity<ClauseResponse> updateClause(
            @PathVariable Long id,
            @RequestBody ClauseRequest request
    ) {

        return ResponseEntity.ok(
                clauseService.updateClause(id, request)
        );
    }

    // Delete Clause
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClause(
            @PathVariable Long id
    ) {

        clauseService.deleteClause(id);

        return ResponseEntity.ok(
                "Clause deleted successfully"
        );
    }
}