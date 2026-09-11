package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.DocumentRequest;
import com.example.legal_contract_management.dto.DocumentResponse;
import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.Document;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.repository.ContractRepository;
import com.example.legal_contract_management.repository.DocumentRepository;
import com.example.legal_contract_management.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService{

    private final DocumentRepository documentRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final Path uploadDirectory = Paths.get("uploads/contracts");

    public DocumentServiceImpl(
            DocumentRepository documentRepository,
            ContractRepository contractRepository,
            UserRepository userRepository
    ){
        this.documentRepository = documentRepository;
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DocumentResponse uploadDocument(MultipartFile file, Long contractId, Long uploadedBy) {
        if(file.isEmpty()){
            throw new RuntimeException("file is empty");
        }

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(()->new RuntimeException("contract not found"));

        User user = userRepository.findById(uploadedBy)
                .orElseThrow(()->new RuntimeException("user not found"));

        try {
            Files.createDirectories(uploadDirectory);

            String originalFileName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis()+"_"+originalFileName;
            Path filePath = uploadDirectory.resolve(fileName);
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            Document document = new Document();

            document.setContract(contract);
            document.setFileName(originalFileName);
            document.setFileType(file.getContentType());
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setUploadedBy(user);
            document.setUploadedAt(LocalDateTime.now());

            Document savedDocument = documentRepository.save(document);
            return mapToResponse(savedDocument);

        } catch (IOException e) {
            throw new RuntimeException("fail to store file",e);
        }

    }

    @Override
    public List<DocumentResponse> getAllDocuments() {
        return documentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DocumentResponse getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(()->new RuntimeException("document not found"));
        return mapToResponse(document);
    }

    @Override
    public byte[] downloadDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(()->new RuntimeException("document not found"));
        try {
            Path path = Paths.get(document.getFilePath());
            return Files.readAllBytes(path);

        }catch(IOException e){
            throw new RuntimeException("failed to read document",e);
        }
    }

    @Override
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(()->new RuntimeException("document not found"));

        try{
            Path path = Paths.get(document.getFilePath());
            Files.deleteIfExists(path);
            documentRepository.delete(document);
        }catch (IOException e){
            throw new RuntimeException("failed to delete document",e);
        }
    }

    private DocumentResponse mapToResponse(Document document){
        return new DocumentResponse(
                document.getId(),
                document.getContract().getId(),
                document.getFileName(),
                document.getFileType(),
                document.getFilePath(),
                document.getFileSize(),
                document.getUploadedBy().getId(),
                document.getUploadedAt()
        );
    }

}
