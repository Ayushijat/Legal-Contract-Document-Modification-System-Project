package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.VersionRequest;
import com.example.legal_contract_management.dto.VersionResponse;

import java.util.List;

public interface VersionService {
    VersionResponse createVersion(VersionRequest request);
    List<VersionResponse> getAllVersions();
    VersionResponse getVersionById(Long id);
    void deleteVersion(Long id);
}
