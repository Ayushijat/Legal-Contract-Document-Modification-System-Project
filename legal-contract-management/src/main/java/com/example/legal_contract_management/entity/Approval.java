package com.example.legal_contract_management.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
public class Approval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "contract_id",nullable = false)
    private Contract contract;

    @ManyToOne
    @JoinColumn(name = "version_id",nullable = false)
    private Version version;

    @ManyToOne
    @JoinColumn(name = "approver_id",nullable = false)
    private User Approver;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String comments;

    private LocalDateTime approvedAt;

    public Approval(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Contract getContract() {
        return contract;
    }

    public void setContract(Contract contract) {
        this.contract = contract;
    }

    public Version getVersion() {
        return version;
    }

    public void setVersion(Version version) {
        this.version = version;
    }

    public User getApprover() {
        return Approver;
    }

    public void setApprover(User approver) {
        Approver = approver;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}
