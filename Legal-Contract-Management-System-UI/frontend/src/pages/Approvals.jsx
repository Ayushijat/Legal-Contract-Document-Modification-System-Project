import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Approvals() {

    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [contractId, setContractId] = useState("");
    const [versionId, setVersionId] = useState("");
    const [approverId, setApproverId] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [comments, setComments] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    // ================= FETCH APPROVALS =================

    const fetchApprovals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/approvals",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch approvals");
            }

            const data = await response.json();
            setApprovals(data);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // ================= CREATE / UPDATE =================

    const saveApproval = async (e) => {
        e.preventDefault();

        try {

            const url = editingId
                ? `http://localhost:8080/api/approvals/${editingId}`
                : "http://localhost:8080/api/approvals";

            const method = editingId ? "PUT" : "POST";

            const body = editingId
                ? {
                    status: status,
                    comments: comments
                }
                : {
                    contractId: Number(contractId),
                    versionId: Number(versionId),
                    approverId: Number(approverId),
                    status: status,
                    comments: comments
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
                        ? "Failed to update approval"
                        : "Failed to create approval"
                );
            }

            const savedApproval = await response.json();

            if (editingId) {

                setApprovals((prevApprovals) =>
                    prevApprovals.map((approval) =>
                        approval.id === editingId
                            ? savedApproval
                            : approval
                    )
                );

                alert("Approval updated successfully!");

            } else {

                setApprovals((prevApprovals) => [
                    ...prevApprovals,
                    savedApproval
                ]);

                alert("Approval request created successfully!");
            }

            resetForm();
            setShowForm(false);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= EDIT =================

    const editApproval = (approval) => {

        setEditingId(approval.id);

        setContractId(
            approval.contract?.id ??
            approval.contractId ??
            ""
        );

        setVersionId(
            approval.version?.id ??
            approval.versionId ??
            ""
        );

        setApproverId(
            approval.approver?.id ??
            approval.approverId ??
            ""
        );

        setStatus(approval.status ?? "PENDING");
        setComments(approval.comments ?? "");

        setShowForm(true);
    };

    // ================= DELETE =================

    const deleteApproval = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this approval?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/approvals/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete approval");
            }

            setApprovals((prevApprovals) =>
                prevApprovals.filter(
                    (approval) => approval.id !== id
                )
            );

            alert("Approval deleted successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= RESET =================

    const resetForm = () => {
        setContractId("");
        setVersionId("");
        setApproverId("");
        setStatus("PENDING");
        setComments("");
        setEditingId(null);
    };

    // ================= LOAD =================

    useEffect(() => {
        fetchApprovals();
    }, []);

    // ================= SEARCH =================

    const filteredApprovals = approvals.filter(
        (approval) => {

            const search = searchTerm.toLowerCase();

            return (
                String(approval.id).includes(search) ||

                String(
                    approval.contract?.id ??
                    approval.contractId
                ).includes(search) ||

                String(
                    approval.version?.id ??
                    approval.versionId
                ).includes(search) ||

                String(
                    approval.approver?.id ??
                    approval.approverId
                ).includes(search) ||

                approval.status
                    ?.toLowerCase()
                    .includes(search) ||

                approval.comments
                    ?.toLowerCase()
                    .includes(search)
            );
        }
    );

    // ================= STATS =================

    const totalApprovals = approvals.length;

    const pendingApprovals = approvals.filter(
        (approval) =>
            approval.status === "PENDING"
    ).length;

    const approvedApprovals = approvals.filter(
        (approval) =>
            approval.status === "APPROVED"
    ).length;

    const rejectedApprovals = approvals.filter(
        (approval) =>
            approval.status === "REJECTED"
    ).length;

    return (
        <div className="approvals-page">

            {/* ================= HEADER ================= */}

            <Sidebar />

            <div className="approvals-header">

                <div>

                    <div className="page-breadcrumb">
                        Dashboard / Approvals
                    </div>

                    <h1>Contract Approvals</h1>

                    <p>
                        Review, approve, or reject contract versions
                    </p>

                </div>

                <button
                    className="add-approval-btn"
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
                        : "+ New Approval"}
                </button>

            </div>


            {/* ================= FORM ================= */}

            {showForm && (

                <div className="approval-form-card">

                    <div className="approval-form-header">

                        <h2>
                            {editingId
                                ? "Update Approval"
                                : "Create Approval Request"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update the approval status and comments"
                                : "Submit a contract version for approval"}
                        </p>

                    </div>


                    <form
                        onSubmit={saveApproval}
                        className="approval-form"
                    >

                        <div className="approval-form-grid">

                            {/* CONTRACT */}

                            <div className="approval-form-group">

                                <label>
                                    Contract ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={contractId}
                                    onChange={(e) =>
                                        setContractId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required={!editingId}
                                    disabled={editingId}
                                />

                            </div>


                            {/* VERSION */}

                            <div className="approval-form-group">

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
                                    required={!editingId}
                                    disabled={editingId}
                                />

                            </div>


                            {/* APPROVER */}

                            <div className="approval-form-group">

                                <label>
                                    Approver ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={approverId}
                                    onChange={(e) =>
                                        setApproverId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required={!editingId}
                                    disabled={editingId}
                                />

                            </div>


                            {/* STATUS */}

                            <div className="approval-form-group">

                                <label>
                                    Approval Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e.target.value)
                                    }
                                >
                                    <option value="PENDING">
                                        PENDING
                                    </option>

                                    <option value="APPROVED">
                                        APPROVED
                                    </option>

                                    <option value="REJECTED">
                                        REJECTED
                                    </option>
                                </select>

                            </div>


                            {/* COMMENTS */}

                            <div className="approval-form-group full-width">

                                <label>
                                    Comments
                                </label>

                                <textarea
                                    value={comments}
                                    onChange={(e) =>
                                        setComments(e.target.value)
                                    }
                                    placeholder="Enter approval comments..."
                                    rows="4"
                                />

                            </div>

                        </div>


                        <div className="approval-form-actions">

                            <button
                                type="button"
                                className="approval-cancel-btn"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="approval-save-btn"
                            >
                                {editingId
                                    ? "Update Approval"
                                    : "Create Approval"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ================= STATS ================= */}

            <div className="approval-stats">

                <div className="approval-stat-card">

                    <div className="approval-stat-icon">
                        📋
                    </div>

                    <div>
                        <p>Total Requests</p>
                        <h2>{totalApprovals}</h2>
                    </div>

                </div>


                <div className="approval-stat-card">

                    <div className="approval-stat-icon pending-icon">
                        ⏳
                    </div>

                    <div>
                        <p>Pending</p>
                        <h2>{pendingApprovals}</h2>
                    </div>

                </div>


                <div className="approval-stat-card">

                    <div className="approval-stat-icon approved-icon">
                        ✓
                    </div>

                    <div>
                        <p>Approved</p>
                        <h2>{approvedApprovals}</h2>
                    </div>

                </div>


                <div className="approval-stat-card">

                    <div className="approval-stat-icon rejected-icon">
                        ✕
                    </div>

                    <div>
                        <p>Rejected</p>
                        <h2>{rejectedApprovals}</h2>
                    </div>

                </div>

            </div>


            {/* ================= APPROVAL HISTORY ================= */}

            <div className="approvals-table-card">

                <div className="approvals-table-header">

                    <div>

                        <h2>
                            Approval Requests
                        </h2>

                        <p>
                            {filteredApprovals.length} request
                            {filteredApprovals.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>


                    {/* SEARCH */}

                    <div className="approval-search-wrapper">

                        <span className="approval-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="approval-search"
                            placeholder="Search approvals..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading && (

                    <div className="approval-loading">

                        <div className="approval-spinner"></div>

                        <p>
                            Loading approvals...
                        </p>

                    </div>

                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (

                    <div className="approval-error">

                        <div>⚠️</div>

                        <h3>
                            Unable to load approvals
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="approval-retry-btn"
                            onClick={fetchApprovals}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ================= EMPTY ================= */}

                {!loading &&
                    !error &&
                    filteredApprovals.length === 0 && (

                        <div className="approval-empty">

                            <div className="approval-empty-icon">
                                📋
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No approvals found"
                                    : "No approval requests"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Create an approval request to get started."}
                            </p>

                        </div>

                    )}


                {/* ================= TABLE ================= */}

                {!loading &&
                    !error &&
                    filteredApprovals.length > 0 && (

                        <div className="approval-table-container">

                            <table className="approvals-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>Contract</th>
                                        <th>Version</th>
                                        <th>Approver</th>
                                        <th>Status</th>
                                        <th>Comments</th>
                                        <th>Approval Date</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredApprovals.map(
                                        (approval) => (

                                            <tr key={approval.id}>

                                                <td>

                                                    <span className="approval-id">
                                                        #{approval.id}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="approval-contract-badge">
                                                        Contract #
                                                        {approval.contract?.id ??
                                                            approval.contractId ??
                                                            "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="approval-version-badge">
                                                        v
                                                        {approval.version?.id ??
                                                            approval.versionId ??
                                                            "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="approver-user">
                                                        👤 User #
                                                        {approval.approver?.id ??
                                                            approval.approverId ??
                                                            "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`approval-status ${approval.status?.toLowerCase()}`}
                                                    >
                                                        <span className="status-dot">
                                                            ●
                                                        </span>

                                                        {approval.status}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className="approval-comments"
                                                        title={
                                                            approval.comments
                                                        }
                                                    >
                                                        {approval.comments ||
                                                            "-"}
                                                    </span>

                                                </td>


                                                <td>

                                                    {approval.approvedAt
                                                        ? new Date(
                                                            approval.approvedAt
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )
                                                        : approval.status ===
                                                            "PENDING"
                                                            ? "Pending"
                                                            : "-"}

                                                </td>


                                                <td>

                                                    <div className="approval-actions">

                                                        <button
                                                            className="approval-edit-btn"
                                                            onClick={() =>
                                                                editApproval(
                                                                    approval
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>

                                                        <button
                                                            className="approval-delete-btn"
                                                            onClick={() =>
                                                                deleteApproval(
                                                                    approval.id
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

export default Approvals;