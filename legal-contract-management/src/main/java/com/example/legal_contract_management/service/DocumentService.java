package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(
            MultipartFile file,
            Long contractId,
            Long uploadedBy
    );

    List<DocumentResponse> getAllDocuments();
    DocumentResponse getDocumentById(Long id);
    byte[] downloadDocument(Long id);
    void deleteDocument(Long id);

}
