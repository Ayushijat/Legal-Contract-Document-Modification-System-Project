import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Versions() {

    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [contractId, setContractId] = useState("");
    const [versionNumber, setVersionNumber] = useState("");
    const [documentId, setDocumentId] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [changeDescription, setChangeDescription] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");


   

    const fetchVersions = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/versions",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch versions");
            }

            const data = await response.json();

            setVersions(data);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);

        }
    };


    

    const createVersion = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/versions",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        contractId: Number(contractId),
                        versionNumber: Number(versionNumber),
                        documentId: Number(documentId),
                        createdBy: Number(createdBy),
                        changeDescription: changeDescription
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create version");
            }

            const newVersion = await response.json();

            setVersions((prevVersions) => [
                ...prevVersions,
                newVersion
            ]);

            resetForm();

            setShowForm(false);

            alert("Version created successfully!");

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };


   

    const deleteVersion = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this version?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/versions/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete version");
            }

            setVersions((prevVersions) =>
                prevVersions.filter(
                    (version) => version.id !== id
                )
            );

            alert("Version deleted successfully!");

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setContractId("");
        setVersionNumber("");
        setDocumentId("");
        setCreatedBy("");
        setChangeDescription("");

    };


    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {
        fetchVersions();
    }, []);


    // =========================
    // SEARCH
    // =========================

    const filteredVersions = versions.filter((version) => {

        const search = searchTerm.toLowerCase();

        return (
            String(version.id)
                .includes(search) ||

            String(version.contract?.id ?? version.contractId)
                .includes(search) ||

            String(version.versionNumber)
                .includes(search) ||

            String(version.document?.id ?? version.documentId)
                .includes(search) ||

            version.changeDescription
                ?.toLowerCase()
                .includes(search)
        );

    });


    // =========================
    // STATISTICS
    // =========================

    const totalVersions = versions.length;

    const uniqueContracts = new Set(
        versions.map(
            (version) =>
                version.contract?.id ??
                version.contractId
        )
    ).size;


    return (

        <div className="versions-page">

            <Sidebar />


            

            <div className="versions-header">

                <div>

                    <div className="page-breadcrumb">
                        Dashboard / Versions
                    </div>

                    <h1>Contract Versions</h1>

                    <p>
                        Track and manage different versions of contracts
                    </p>

                </div>


                <button
                    className="add-version-btn"
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
                        : "+ Create Version"}
                </button>

            </div>


            {/* =========================
                CREATE VERSION FORM
            ========================= */}

            {showForm && (

                <div className="version-form-card">

                    <div className="version-form-header">

                        <h2>
                            Create New Version
                        </h2>

                        <p>
                            Add a new version for a contract
                        </p>

                    </div>


                    <form
                        onSubmit={createVersion}
                        className="version-form"
                    >

                        <div className="version-form-grid">


                            {/* Contract ID */}

                            <div className="version-form-group">

                                <label>
                                    Contract ID
                                </label>

                                <input
                                    type="number"
                                    value={contractId}
                                    onChange={(e) =>
                                        setContractId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* Version Number */}

                            <div className="version-form-group">

                                <label>
                                    Version Number
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={versionNumber}
                                    onChange={(e) =>
                                        setVersionNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* Document ID */}

                            <div className="version-form-group">

                                <label>
                                    Document ID
                                </label>

                                <input
                                    type="number"
                                    value={documentId}
                                    onChange={(e) =>
                                        setDocumentId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* Created By */}

                            <div className="version-form-group">

                                <label>
                                    Created By (User ID)
                                </label>

                                <input
                                    type="number"
                                    value={createdBy}
                                    onChange={(e) =>
                                        setCreatedBy(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            {/* Change Description */}

                            <div className="version-form-group full-width">

                                <label>
                                    Change Description
                                </label>

                                <textarea
                                    value={changeDescription}
                                    onChange={(e) =>
                                        setChangeDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe the changes made in this version"
                                    rows="4"
                                    required
                                />

                            </div>

                        </div>


                        <div className="version-form-actions">

                            <button
                                type="button"
                                className="version-cancel-btn"
                                onClick={() => {

                                    resetForm();
                                    setShowForm(false);

                                }}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="version-save-btn"
                            >
                                Create Version
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="version-stats">


                <div className="version-stat-card">

                    <div className="version-stat-icon">
                        🔄
                    </div>

                    <div>

                        <p>Total Versions</p>

                        <h2>
                            {totalVersions}
                        </h2>

                    </div>

                </div>


                <div className="version-stat-card">

                    <div className="version-stat-icon">
                        📄
                    </div>

                    <div>

                        <p>Contracts with Versions</p>

                        <h2>
                            {uniqueContracts}
                        </h2>

                    </div>

                </div>


                <div className="version-stat-card">

                    <div className="version-stat-icon">
                        🗂️
                    </div>

                    <div>

                        <p>Latest Version</p>

                        <h2>
                            {versions.length > 0
                                ? Math.max(
                                    ...versions.map(
                                        (version) =>
                                            Number(
                                                version.versionNumber
                                            ) || 0
                                    )
                                )
                                : 0}
                        </h2>

                    </div>

                </div>

            </div>


            {/* =========================
                VERSION TABLE
            ========================= */}

            <div className="versions-table-card">


                <div className="versions-table-header">

                    <div>

                        <h2>
                            All Versions
                        </h2>

                        <p>
                            {filteredVersions.length} version
                            {filteredVersions.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>


                    <div className="version-search-wrapper">

                        <span className="version-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="version-search"
                            placeholder="Search versions..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* Loading */}

                {loading && (

                    <div className="version-loading">

                        <div className="version-spinner"></div>

                        <p>
                            Loading versions...
                        </p>

                    </div>

                )}


                {/* Error */}

                {!loading && error && (

                    <div className="version-error">

                        <div>
                            ⚠️
                        </div>

                        <h3>
                            Unable to load versions
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="version-retry-btn"
                            onClick={fetchVersions}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* Empty */}

                {!loading &&
                    !error &&
                    filteredVersions.length === 0 && (

                        <div className="version-empty">

                            <div className="version-empty-icon">
                                🔄
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No versions found"
                                    : "No versions yet"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Create your first contract version to get started."}
                            </p>

                        </div>

                    )}


                {/* Table */}

                {!loading &&
                    !error &&
                    filteredVersions.length > 0 && (

                        <div className="version-table-container">

                            <table className="versions-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Contract
                                        </th>

                                        <th>
                                            Version
                                        </th>

                                        <th>
                                            Document
                                        </th>

                                        <th>
                                            Created By
                                        </th>

                                        <th>
                                            Changes
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredVersions.map(
                                        (version) => (

                                            <tr
                                                key={version.id}
                                            >

                                                <td>

                                                    <span className="version-id">
                                                        #{version.id}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="contract-reference">
                                                        Contract #
                                                        {
                                                            version.contract?.id ??
                                                            version.contractId ??
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="version-number-badge">
                                                        v
                                                        {
                                                            version.versionNumber
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    Document #
                                                    {
                                                        version.document?.id ??
                                                        version.documentId ??
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    User #
                                                    {
                                                        version.createdBy?.id ??
                                                        version.createdBy ??
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className="change-description"
                                                        title={
                                                            version.changeDescription
                                                        }
                                                    >
                                                        {
                                                            version.changeDescription ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {version.createdAt
                                                        ? new Date(
                                                            version.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "-"}

                                                </td>


                                                <td>

                                                    <button
                                                        className="version-delete-btn"
                                                        onClick={() =>
                                                            deleteVersion(
                                                                version.id
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>

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

export default Versions;