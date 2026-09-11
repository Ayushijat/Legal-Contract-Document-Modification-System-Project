import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Modifications() {

    const [modifications, setModifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [clauseId, setClauseId] = useState("");
    const [versionId, setVersionId] = useState("");
    const [modifiedBy, setModifiedBy] = useState("");
    const [oldContent, setOldContent] = useState("");
    const [newContent, setNewContent] = useState("");
    const [modificationReason, setModificationReason] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    // ================= FETCH MODIFICATIONS =================

    const fetchModifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/modifications",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch modifications");
            }

            const data = await response.json();
            setModifications(data);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // ================= CREATE MODIFICATION =================

    const createModification = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/modifications",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        clauseId: Number(clauseId),
                        versionId: Number(versionId),
                        modifiedBy: Number(modifiedBy),
                        oldContent: oldContent,
                        newContent: newContent,
                        modificationReason: modificationReason
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create modification");
            }

            const newModification = await response.json();

            setModifications((prev) => [
                ...prev,
                newModification
            ]);

            resetForm();
            setShowForm(false);

            alert("Modification recorded successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= DELETE =================

    const deleteModification = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this modification history?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/modifications/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete modification");
            }

            setModifications((prev) =>
                prev.filter(
                    (modification) =>
                        modification.id !== id
                )
            );

            alert("Modification deleted successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= RESET FORM =================

    const resetForm = () => {
        setClauseId("");
        setVersionId("");
        setModifiedBy("");
        setOldContent("");
        setNewContent("");
        setModificationReason("");
    };

    // ================= LOAD DATA =================

    useEffect(() => {
        fetchModifications();
    }, []);

    // ================= SEARCH =================

    const filteredModifications = modifications.filter(
        (modification) => {

            const search = searchTerm.toLowerCase();

            return (
                String(modification.id).includes(search) ||

                String(
                    modification.clause?.id ??
                    modification.clauseId
                ).includes(search) ||

                String(
                    modification.version?.id ??
                    modification.versionId
                ).includes(search) ||

                String(
                    modification.modifiedBy?.id ??
                    modification.modifiedBy
                ).includes(search) ||

                modification.oldContent
                    ?.toLowerCase()
                    .includes(search) ||

                modification.newContent
                    ?.toLowerCase()
                    .includes(search) ||

                modification.modificationReason
                    ?.toLowerCase()
                    .includes(search)
            );
        }
    );

    // ================= STATS =================

    const totalModifications = modifications.length;

    const uniqueClauses = new Set(
        modifications.map(
            (modification) =>
                modification.clause?.id ??
                modification.clauseId
        )
    ).size;

    const uniqueUsers = new Set(
        modifications.map(
            (modification) =>
                modification.modifiedBy?.id ??
                modification.modifiedBy
        )
    ).size;

    return (
        <div className="modifications-page">
            <Sidebar />

            {/* ================= HEADER ================= */}

            <div className="modifications-header">

                <div>
                    <div className="page-breadcrumb">
                        Dashboard / Modifications
                    </div>

                    <h1>Modification History</h1>

                    <p>
                        Track every change made to contract clauses
                    </p>
                </div>

                <button
                    className="add-modification-btn"
                    onClick={() => {

                        if (showForm) {
                            resetForm();
                            setShowForm(false);
                        } else {
                            resetForm();
                            setShowForm(true);
                        }

                    }}
                >
                    {showForm
                        ? "✕ Close"
                        : "+ Record Modification"}
                </button>

            </div>


            {/* ================= FORM ================= */}

            {showForm && (

                <div className="modification-form-card">

                    <div className="modification-form-header">

                        <h2>
                            Record Clause Modification
                        </h2>

                        <p>
                            Store the previous and updated clause content
                        </p>

                    </div>


                    <form
                        onSubmit={createModification}
                        className="modification-form"
                    >

                        <div className="modification-form-grid">

                            {/* CLAUSE */}

                            <div className="modification-form-group">

                                <label>
                                    Clause ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={clauseId}
                                    onChange={(e) =>
                                        setClauseId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* VERSION */}

                            <div className="modification-form-group">

                                <label>
                                    Version ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={versionId}
                                    onChange={(e) =>
                                        setVersionId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* USER */}

                            <div className="modification-form-group">

                                <label>
                                    Modified By (User ID)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={modifiedBy}
                                    onChange={(e) =>
                                        setModifiedBy(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* OLD CONTENT */}

                            <div className="modification-form-group full-width">

                                <label>
                                    Old Content
                                </label>

                                <textarea
                                    value={oldContent}
                                    onChange={(e) =>
                                        setOldContent(e.target.value)
                                    }
                                    placeholder="Enter the previous clause content..."
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* NEW CONTENT */}

                            <div className="modification-form-group full-width">

                                <label>
                                    New Content
                                </label>

                                <textarea
                                    value={newContent}
                                    onChange={(e) =>
                                        setNewContent(e.target.value)
                                    }
                                    placeholder="Enter the updated clause content..."
                                    rows="5"
                                    required
                                />

                            </div>


                            {/* REASON */}

                            <div className="modification-form-group full-width">

                                <label>
                                    Modification Reason
                                </label>

                                <textarea
                                    value={modificationReason}
                                    onChange={(e) =>
                                        setModificationReason(e.target.value)
                                    }
                                    placeholder="Explain why this modification was made..."
                                    rows="4"
                                    required
                                />

                            </div>

                        </div>


                        <div className="modification-form-actions">

                            <button
                                type="button"
                                className="modification-cancel-btn"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="modification-save-btn"
                            >
                                Save Modification
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ================= STATS ================= */}

            <div className="modification-stats">

                <div className="modification-stat-card">

                    <div className="modification-stat-icon">
                        📝
                    </div>

                    <div>
                        <p>Total Modifications</p>
                        <h2>
                            {totalModifications}
                        </h2>
                    </div>

                </div>


                <div className="modification-stat-card">

                    <div className="modification-stat-icon">
                        📑
                    </div>

                    <div>
                        <p>Clauses Modified</p>
                        <h2>
                            {uniqueClauses}
                        </h2>
                    </div>

                </div>


                <div className="modification-stat-card">

                    <div className="modification-stat-icon">
                        👤
                    </div>

                    <div>
                        <p>Users Involved</p>
                        <h2>
                            {uniqueUsers}
                        </h2>
                    </div>

                </div>

            </div>


            {/* ================= HISTORY CARD ================= */}

            <div className="modifications-history-card">

                <div className="modifications-history-header">

                    <div>
                        <h2>
                            Change History
                        </h2>

                        <p>
                            {filteredModifications.length} modification
                            {filteredModifications.length !== 1
                                ? "s"
                                : ""} found
                        </p>
                    </div>


                    {/* SEARCH */}

                    <div className="modification-search-wrapper">

                        <span className="modification-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="modification-search"
                            placeholder="Search history..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading && (

                    <div className="modification-loading">

                        <div className="modification-spinner"></div>

                        <p>
                            Loading modification history...
                        </p>

                    </div>

                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (

                    <div className="modification-error">

                        <div>⚠️</div>

                        <h3>
                            Unable to load modification history
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="modification-retry-btn"
                            onClick={fetchModifications}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ================= EMPTY ================= */}

                {!loading &&
                    !error &&
                    filteredModifications.length === 0 && (

                        <div className="modification-empty">

                            <div className="modification-empty-icon">
                                📝
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No modifications found"
                                    : "No modification history"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Record your first clause modification to start the history."}
                            </p>

                        </div>

                    )}


                {/* ================= HISTORY LIST ================= */}

                {!loading &&
                    !error &&
                    filteredModifications.length > 0 && (

                        <div className="modification-history-list">

                            {filteredModifications.map(
                                (modification) => (

                                    <div
                                        className="modification-history-item"
                                        key={modification.id}
                                    >

                                        {/* TOP */}

                                        <div className="modification-history-top">

                                            <div className="modification-meta">

                                                <span className="modification-id">
                                                    #{modification.id}
                                                </span>

                                                <span className="modification-clause-badge">
                                                    Clause #
                                                    {modification.clause?.id ??
                                                        modification.clauseId ??
                                                        "-"}
                                                </span>

                                                <span className="modification-version-badge">
                                                    Version #
                                                    {modification.version?.id ??
                                                        modification.versionId ??
                                                        "-"}
                                                </span>

                                            </div>


                                            <div className="modification-right-meta">

                                                <span className="modified-by">
                                                    👤 User #
                                                    {modification.modifiedBy?.id ??
                                                        modification.modifiedBy ??
                                                        "-"}
                                                </span>

                                                <span className="modified-date">
                                                    {modification.modifiedAt
                                                        ? new Date(
                                                            modification.modifiedAt
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )
                                                        : "-"}
                                                </span>

                                            </div>

                                        </div>


                                        {/* CONTENT COMPARISON */}

                                        <div className="modification-comparison">

                                            {/* OLD */}

                                            <div className="content-box old-content-box">

                                                <div className="content-box-header">

                                                    <span className="old-label">
                                                        BEFORE
                                                    </span>

                                                    <span>
                                                        Old Content
                                                    </span>

                                                </div>

                                                <p>
                                                    {modification.oldContent ||
                                                        "-"}
                                                </p>

                                            </div>


                                            {/* ARROW */}

                                            <div className="modification-arrow">
                                                →
                                            </div>


                                            {/* NEW */}

                                            <div className="content-box new-content-box">

                                                <div className="content-box-header">

                                                    <span className="new-label">
                                                        AFTER
                                                    </span>

                                                    <span>
                                                        New Content
                                                    </span>

                                                </div>

                                                <p>
                                                    {modification.newContent ||
                                                        "-"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* REASON */}

                                        <div className="modification-reason-box">

                                            <div className="reason-title">
                                                <span>💡</span>
                                                Modification Reason
                                            </div>

                                            <p>
                                                {modification.modificationReason ||
                                                    "No reason provided"}
                                            </p>

                                        </div>


                                        {/* FOOTER */}

                                        <div className="modification-history-footer">

                                            <span>
                                                Modified by User #
                                                {modification.modifiedBy?.id ??
                                                    modification.modifiedBy ??
                                                    "-"}
                                            </span>

                                            <button
                                                className="modification-delete-btn"
                                                onClick={() =>
                                                    deleteModification(
                                                        modification.id
                                                    )
                                                }
                                            >
                                                🗑️ Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

            </div>

        </div>
    );
}

export default Modifications;