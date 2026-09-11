package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.VersionRequest;
import com.example.legal_contract_management.dto.VersionResponse;
import com.example.legal_contract_management.entity.Version;
import com.example.legal_contract_management.service.VersionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/versions")
public class VersionController {
    private final VersionService versionService;
    public VersionController(VersionService versionService){
        this.versionService = versionService;
    }

    @PostMapping
    public ResponseEntity<VersionResponse> createVersion(@RequestBody VersionRequest request){
        VersionResponse response = versionService.createVersion(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VersionResponse>> getAllVersions(){
        return ResponseEntity.ok(versionService.getAllVersions());

    }

    @GetMapping("/{id}")
    public ResponseEntity<VersionResponse> getVersionById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                versionService.getVersionById(id)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVersion(
            @PathVariable Long id
    ) {

        versionService.deleteVersion(id);

        return ResponseEntity.ok(
                "Version deleted successfully"
        );
    }

}
