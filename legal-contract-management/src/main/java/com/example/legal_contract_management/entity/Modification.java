package com.example.legal_contract_management.entity;

import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "modifications")
public class Modification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "clause_id",nullable = false)
    private Clause clause;

    @ManyToOne
    @JoinColumn(name = "version_id",nullable = false)
    private Version version;

    @ManyToOne
    @JoinColumn(name = "modified_by",nullable = false)
    private User modifiedBy;

    @Column(columnDefinition = "TEXT")
    private String oldContent;

    @Column(columnDefinition = "TEXT")
    private String newContent;

    @Column(columnDefinition = "TEXT")
    private String modificationReason;

    private LocalDateTime modifiedAt;

    public Modification(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Clause getClause() {
        return clause;
    }

    public void setClause(Clause clause) {
        this.clause = clause;
    }

    public Version getVersion() {
        return version;
    }

    public void setVersion(Version version) {
        this.version = version;
    }

    public User getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(User modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public String getOldContent() {
        return oldContent;
    }

    public void setOldContent(String oldContent) {
        this.oldContent = oldContent;
    }

    public String getNewContent() {
        return newContent;
    }

    public void setNewContent(String newContent) {
        this.newContent = newContent;
    }

    public String getModificationReason() {
        return modificationReason;
    }

    public void setModificationReason(String modificationReason) {
        this.modificationReason = modificationReason;
    }

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
