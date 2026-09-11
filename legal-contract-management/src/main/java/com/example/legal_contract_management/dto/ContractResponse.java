package com.example.legal_contract_management.dto;

import com.example.legal_contract_management.entity.ContractStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ContractResponse {

    private Long id;
    private String contractNumber;
    private String title;
    private String contractType;
    private ContractStatus status;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ContractResponse(){

    }

    public ContractResponse(
            Long id,
            String contractNumber,
            String title,
            String contractType,
            ContractStatus status,
            Long createdBy,
            LocalDateTime createdAt,
            LocalDateTime updatedAt){

        this.id = id;
        this.contractNumber = contractNumber;
        this.title = title;
        this.contractType = contractType;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}
