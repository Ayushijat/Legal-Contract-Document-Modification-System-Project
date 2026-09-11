import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Clauses() {

    const [clauses, setClauses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [versionId, setVersionId] = useState("");
    const [clauseNumber, setClauseNumber] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    // ================= FETCH CLAUSES =================

    const fetchClauses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/clauses",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch clauses");
            }

            const data = await response.json();
            setClauses(data);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // ================= CREATE / UPDATE =================

    const saveClause = async (e) => {
        e.preventDefault();

        try {

            const url = editingId
                ? `http://localhost:8080/api/clauses/${editingId}`
                : "http://localhost:8080/api/clauses";

            const method = editingId ? "PUT" : "POST";

            const body = {
                versionId: Number(versionId),
                clauseNumber: Number(clauseNumber),
                title: title,
                content: content
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(
                    editingId
                        ? "Failed to update clause"
                        : "Failed to create clause"
                );
            }

            const savedClause = await response.json();

            if (editingId) {

                setClauses((prevClauses) =>
                    prevClauses.map((clause) =>
                        clause.id === editingId
                            ? savedClause
                            : clause
                    )
                );

                alert("Clause updated successfully!");

            } else {

                setClauses((prevClauses) => [
                    ...prevClauses,
                    savedClause
                ]);

                alert("Clause created successfully!");
            }

            resetForm();
            setShowForm(false);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= EDIT =================

    const editClause = (clause) => {

        setEditingId(clause.id);

        setVersionId(
            clause.version?.id ??
            clause.versionId ??
            ""
        );

        setClauseNumber(clause.clauseNumber ?? "");
        setTitle(clause.title ?? "");
        setContent(clause.content ?? "");

        setShowForm(true);
    };

    // ================= DELETE =================

    const deleteClause = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this clause?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/clauses/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete clause");
            }

            setClauses((prevClauses) =>
                prevClauses.filter(
                    (clause) => clause.id !== id
                )
            );

            alert("Clause deleted successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= RESET =================

    const resetForm = () => {

        setVersionId("");
        setClauseNumber("");
        setTitle("");
        setContent("");
        setEditingId(null);
    };

    // ================= LOAD =================

    useEffect(() => {
        fetchClauses();
    }, []);

    // ================= SEARCH =================

    const filteredClauses = clauses.filter((clause) => {

        const search = searchTerm.toLowerCase();

        return (
            String(clause.id).includes(search) ||
            String(
                clause.version?.id ??
                clause.versionId
            ).includes(search) ||
            String(clause.clauseNumber).includes(search) ||
            clause.title?.toLowerCase().includes(search) ||
            clause.content?.toLowerCase().includes(search)
        );
    });

    // ================= STATS =================

    const totalClauses = clauses.length;

    const uniqueVersions = new Set(
        clauses.map(
            (clause) =>
                clause.version?.id ??
                clause.versionId
        )
    ).size;

    // ================= UI =================

    return (
        <div className="clauses-page">
            <Sidebar />

            {/* HEADER */}

            <div className="clauses-header">

                <div>
                    <div className="page-breadcrumb">
                        Dashboard / Clauses
                    </div>

                    <h1>Contract Clauses</h1>

                    <p>
                        Manage and maintain clauses of contract versions
                    </p>
                </div>

                <button
                    className="add-clause-btn"
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
                        : "+ Add Clause"}
                </button>

            </div>


            {/* FORM */}

            {showForm && (

                <div className="clause-form-card">

                    <div className="clause-form-header">

                        <h2>
                            {editingId
                                ? "Edit Clause"
                                : "Create New Clause"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update the selected contract clause"
                                : "Add a new clause to a contract version"}
                        </p>

                    </div>


                    <form
                        onSubmit={saveClause}
                        className="clause-form"
                    >

                        <div className="clause-form-grid">

                            {/* VERSION ID */}

                            <div className="clause-form-group">

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


                            {/* CLAUSE NUMBER */}

                            <div className="clause-form-group">

                                <label>
                                    Clause Number
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={clauseNumber}
                                    onChange={(e) =>
                                        setClauseNumber(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* TITLE */}

                            <div className="clause-form-group full-width">

                                <label>
                                    Clause Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. Payment Terms"
                                    required
                                />

                            </div>


                            {/* CONTENT */}

                            <div className="clause-form-group full-width">

                                <label>
                                    Clause Content
                                </label>

                                <textarea
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    placeholder="Enter the complete clause content..."
                                    rows="6"
                                    required
                                />

                            </div>

                        </div>


                        {/* FORM BUTTONS */}

                        <div className="clause-form-actions">

                            <button
                                type="button"
                                className="clause-cancel-btn"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="clause-save-btn"
                            >
                                {editingId
                                    ? "Update Clause"
                                    : "Create Clause"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* STATS */}

            <div className="clause-stats">

                <div className="clause-stat-card">

                    <div className="clause-stat-icon">
                        📑
                    </div>

                    <div>
                        <p>Total Clauses</p>
                        <h2>{totalClauses}</h2>
                    </div>

                </div>


                <div className="clause-stat-card">

                    <div className="clause-stat-icon">
                        🔄
                    </div>

                    <div>
                        <p>Versions with Clauses</p>
                        <h2>{uniqueVersions}</h2>
                    </div>

                </div>


                <div className="clause-stat-card">

                    <div className="clause-stat-icon">
                        ✍️
                    </div>

                    <div>
                        <p>Displayed Results</p>
                        <h2>{filteredClauses.length}</h2>
                    </div>

                </div>

            </div>


            {/* TABLE CARD */}

            <div className="clauses-table-card">

                <div className="clauses-table-header">

                    <div>

                        <h2>
                            All Clauses
                        </h2>

                        <p>
                            {filteredClauses.length} clause
                            {filteredClauses.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>


                    {/* SEARCH */}

                    <div className="clause-search-wrapper">

                        <span className="clause-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="clause-search"
                            placeholder="Search clauses..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="clause-loading">

                        <div className="clause-spinner"></div>

                        <p>
                            Loading clauses...
                        </p>

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="clause-error">

                        <div>⚠️</div>

                        <h3>
                            Unable to load clauses
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="clause-retry-btn"
                            onClick={fetchClauses}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredClauses.length === 0 && (

                        <div className="clause-empty">

                            <div className="clause-empty-icon">
                                📑
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No clauses found"
                                    : "No clauses yet"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Create your first contract clause to get started."}
                            </p>

                        </div>

                    )}


                {/* TABLE */}

                {!loading &&
                    !error &&
                    filteredClauses.length > 0 && (

                        <div className="clause-table-container">

                            <table className="clauses-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Version</th>
                                        <th>Clause No.</th>
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredClauses.map(
                                        (clause) => (

                                            <tr key={clause.id}>

                                                <td>
                                                    <span className="clause-id">
                                                        #{clause.id}
                                                    </span>
                                                </td>


                                                <td>

                                                    <span className="clause-version-badge">
                                                        v
                                                        {clause.version?.id ??
                                                            clause.versionId ??
                                                            "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="clause-number-badge">
                                                        Clause{" "}
                                                        {clause.clauseNumber}
                                                    </span>

                                                </td>


                                                <td>

                                                    <strong className="clause-title">
                                                        {clause.title || "-"}
                                                    </strong>

                                                </td>


                                                <td>

                                                    <span
                                                        className="clause-content-preview"
                                                        title={clause.content}
                                                    >
                                                        {clause.content || "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="clause-actions">

                                                        <button
                                                            className="clause-edit-btn"
                                                            onClick={() =>
                                                                editClause(clause)
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>

                                                        <button
                                                            className="clause-delete-btn"
                                                            onClick={() =>
                                                                deleteClause(
                                                                    clause.id
                                                                )
                                                            }
                                                        >
                                                            🗑️ Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </div>

        </div>
    );
}

export default Clauses;