package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Version;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersionRepository extends JpaRepository<Version,Long> {
}
