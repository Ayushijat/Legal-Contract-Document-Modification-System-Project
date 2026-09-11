package com.example.legal_contract_management.service;

import com.example.legal_contract_management.dto.VersionRequest;
import com.example.legal_contract_management.dto.VersionResponse;
import com.example.legal_contract_management.entity.Contract;
import com.example.legal_contract_management.entity.Document;
import com.example.legal_contract_management.entity.User;
import com.example.legal_contract_management.entity.Version;
import com.example.legal_contract_management.repository.ContractRepository;
import com.example.legal_contract_management.repository.DocumentRepository;
import com.example.legal_contract_management.repository.UserRepository;
import com.example.legal_contract_management.repository.VersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VersionServiceImpl implements VersionService {

    private final VersionRepository versionRepository;
    private final ContractRepository contractRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;

    public VersionServiceImpl(
            VersionRepository versionRepository,
            ContractRepository contractRepository,
            DocumentRepository documentRepository,
            UserRepository userRepository
    ){
        this.versionRepository = versionRepository;
        this.contractRepository = contractRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public VersionResponse createVersion(VersionRequest request) {
        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(()->new RuntimeException("contract not found"));

        User user = userRepository.findById(request.getCreatedBy())
                .orElseThrow(()->new RuntimeException("user not found"));

        Document document = null;
        if(request.getDocumentId()!=null){
            document = documentRepository.findById(request.getDocumentId())
                    .orElseThrow(()->new RuntimeException("Document not found"));
        }

        Version version = new Version();

        version.setContract(contract);
        version.setVersionNumber(request.getVersionNumber());
        version.setCreatedBy(user);
        version.setDocument(document);
        version.setChangeDescription(request.getChangeDescription());
        version.setCreatedAt(LocalDateTime.now());

        Version savedVersion = versionRepository.save(version);
        return mapToReduce(savedVersion);
    }

    @Override
    public List<VersionResponse> getAllVersions() {
        return versionRepository.findAll()
                .stream()
                .map(this::mapToReduce)
                .toList();
    }

    @Override
    public VersionResponse getVersionById(Long id) {
        Version version = versionRepository.findById(id)
                .orElseThrow(()->new RuntimeException("version not found"));
        return mapToReduce(version);
    }

    @Override
    public void deleteVersion(Long id) {
        Version version = versionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Version not found"));

        versionRepository.delete(version);
    }

    private VersionResponse mapToReduce(Version version){
        return new VersionResponse(
                version.getId(),
                version.getContract().getId(),
                version.getVersionNumber(),
                version.getDocument()!=null?version.getDocument().getId():null,
                version.getCreatedBy().getId(),
                version.getChangeDescription(),
                version.getCreatedAt()
        );
    }

}
