package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.ModificationRequest;
import com.example.legal_contract_management.dto.ModificationResponse;
import com.example.legal_contract_management.service.ModificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modifications")
public class ModificationController {

    private final ModificationService modificationService;

    public ModificationController(
            ModificationService modificationService
    ) {
        this.modificationService = modificationService;
    }

    @PostMapping
    public ResponseEntity<ModificationResponse> createModification(
            @RequestBody ModificationRequest request
    ) {

        ModificationResponse response =
                modificationService.createModification(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<ModificationResponse>>
    getAllModifications() {

        return ResponseEntity.ok(
                modificationService.getAllModifications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModificationResponse>
    getModificationById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                modificationService.getModificationById(id)
        );
    }

    @GetMapping("/clause/{clauseId}")
    public ResponseEntity<List<ModificationResponse>>
    getModificationsByClause(
            @PathVariable Long clauseId
    ) {

        return ResponseEntity.ok(
                modificationService
                        .getModificationsByClause(clauseId)
        );
    }

    @GetMapping("/version/{versionId}")
    public ResponseEntity<List<ModificationResponse>>
    getModificationsByVersion(
            @PathVariable Long versionId
    ) {

        return ResponseEntity.ok(
                modificationService
                        .getModificationsByVersion(versionId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteModification(
            @PathVariable Long id
    ) {

        modificationService.deleteModification(id);

        return ResponseEntity.ok(
                "Modification deleted successfully"
        );
    }
}