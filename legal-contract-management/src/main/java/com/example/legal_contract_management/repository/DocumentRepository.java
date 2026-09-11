package com.example.legal_contract_management.repository;

import com.example.legal_contract_management.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document,Long> {
}
