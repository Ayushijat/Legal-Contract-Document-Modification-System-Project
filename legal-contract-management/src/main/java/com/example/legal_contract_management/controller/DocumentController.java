package com.example.legal_contract_management.controller;

import com.example.legal_contract_management.dto.DocumentResponse;
import com.example.legal_contract_management.service.DocumentService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(
            DocumentService documentService) {

        this.documentService = documentService;
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> uploadDocument(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("contractId")
            Long contractId,

            @RequestParam("uploadedBy")
            Long uploadedBy) {

        DocumentResponse response =
                documentService.uploadDocument(
                        file,
                        contractId,
                        uploadedBy
                );

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>>
    getAllDocuments() {

        return ResponseEntity.ok(
                documentService.getAllDocuments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse>
    getDocumentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentService.getDocumentById(id)
        );
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable Long id) {

        byte[] file =
                documentService.downloadDocument(id);

        DocumentResponse document =
                documentService.getDocumentById(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\""
                                + document.getFileName()
                                + "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                document.getFileType()
                        )
                )
                .body(file);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable Long id) {

        documentService.deleteDocument(id);

        return ResponseEntity.noContent().build();
    }
}
