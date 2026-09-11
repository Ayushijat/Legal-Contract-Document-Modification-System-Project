import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function AuditLogs() {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userId, setUserId] = useState("");
    const [action, setAction] = useState("");
    const [entityType, setEntityType] = useState("");
    const [entityId, setEntityId] = useState("");
    const [description, setDescription] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    // ================= FETCH LOGS =================

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/audit-logs",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch audit logs");
            }

            const data = await response.json();
            setLogs(data);

        } catch (error) {
            console.error(error);
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // ================= CREATE LOG =================

    const createLog = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/audit-logs",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        userId: Number(userId),
                        action: action,
                        entityType: entityType,
                        entityId: Number(entityId),
                        description: description
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create audit log");
            }

            const newLog = await response.json();

            setLogs((prevLogs) => [
                ...prevLogs,
                newLog
            ]);

            resetForm();
            setShowForm(false);

            alert("Audit log created successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= DELETE =================

    const deleteLog = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this audit log?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/audit-logs/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete audit log");
            }

            setLogs((prevLogs) =>
                prevLogs.filter((log) => log.id !== id)
            );

            alert("Audit log deleted successfully!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // ================= RESET =================

    const resetForm = () => {
        setUserId("");
        setAction("");
        setEntityType("");
        setEntityId("");
        setDescription("");
    };

    // ================= LOAD =================

    useEffect(() => {
        fetchLogs();
    }, []);

    // ================= SEARCH =================

    const filteredLogs = logs.filter((log) => {

        const search = searchTerm.toLowerCase();

        return (
            String(log.id).includes(search) ||

            String(
                log.user?.id ??
                log.userId
            ).includes(search) ||

            log.action
                ?.toLowerCase()
                .includes(search) ||

            log.entityType
                ?.toLowerCase()
                .includes(search) ||

            String(log.entityId).includes(search) ||

            log.description
                ?.toLowerCase()
                .includes(search)
        );
    });

    // ================= STATS =================

    const totalLogs = logs.length;

    const uniqueUsers = new Set(
        logs.map(
            (log) =>
                log.user?.id ??
                log.userId
        )
    ).size;

    const uniqueEntities = new Set(
        logs.map(
            (log) =>
                `${log.entityType}-${log.entityId}`
        )
    ).size;

    return (
        <div className="audit-logs-page">
            <Sidebar />

            {/* ================= HEADER ================= */}

            <div className="audit-header">

                <div>

                    <div className="page-breadcrumb">
                        Dashboard / Audit Logs
                    </div>

                    <h1>Audit Logs</h1>

                    <p>
                        Track system activities and user actions
                    </p>

                </div>

                <button
                    className="add-audit-btn"
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
                        : "+ Add Log"}
                </button>

            </div>


            {/* ================= FORM ================= */}

            {showForm && (

                <div className="audit-form-card">

                    <div className="audit-form-header">

                        <h2>
                            Create Audit Log
                        </h2>

                        <p>
                            Record a user activity in the system
                        </p>

                    </div>

                    <form
                        onSubmit={createLog}
                        className="audit-form"
                    >

                        <div className="audit-form-grid">

                            <div className="audit-form-group">

                                <label>
                                    User ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={userId}
                                    onChange={(e) =>
                                        setUserId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            <div className="audit-form-group">

                                <label>
                                    Action
                                </label>

                                <input
                                    type="text"
                                    value={action}
                                    onChange={(e) =>
                                        setAction(e.target.value)
                                    }
                                    placeholder="e.g. CREATE, UPDATE, DELETE"
                                    required
                                />

                            </div>


                            <div className="audit-form-group">

                                <label>
                                    Entity Type
                                </label>

                                <select
                                    value={entityType}
                                    onChange={(e) =>
                                        setEntityType(e.target.value)
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Entity
                                    </option>

                                    <option value="CONTRACT">
                                        CONTRACT
                                    </option>

                                    <option value="DOCUMENT">
                                        DOCUMENT
                                    </option>

                                    <option value="VERSION">
                                        VERSION
                                    </option>

                                    <option value="CLAUSE">
                                        CLAUSE
                                    </option>

                                    <option value="MODIFICATION">
                                        MODIFICATION
                                    </option>

                                    <option value="APPROVAL">
                                        APPROVAL
                                    </option>

                                    <option value="USER">
                                        USER
                                    </option>
                                </select>

                            </div>


                            <div className="audit-form-group">

                                <label>
                                    Entity ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={entityId}
                                    onChange={(e) =>
                                        setEntityId(e.target.value)
                                    }
                                    placeholder="e.g. 1"
                                    required
                                />

                            </div>


                            <div className="audit-form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Describe the activity..."
                                    rows="4"
                                    required
                                />

                            </div>

                        </div>


                        <div className="audit-form-actions">

                            <button
                                type="button"
                                className="audit-cancel-btn"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="audit-save-btn"
                            >
                                Save Log
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ================= STATS ================= */}

            <div className="audit-stats">

                <div className="audit-stat-card">

                    <div className="audit-stat-icon">
                        📋
                    </div>

                    <div>
                        <p>Total Activities</p>
                        <h2>{totalLogs}</h2>
                    </div>

                </div>


                <div className="audit-stat-card">

                    <div className="audit-stat-icon">
                        👤
                    </div>

                    <div>
                        <p>Active Users</p>
                        <h2>{uniqueUsers}</h2>
                    </div>

                </div>


                <div className="audit-stat-card">

                    <div className="audit-stat-icon">
                        🗂️
                    </div>

                    <div>
                        <p>Tracked Entities</p>
                        <h2>{uniqueEntities}</h2>
                    </div>

                </div>

            </div>


            {/* ================= LOG TABLE ================= */}

            <div className="audit-table-card">

                <div className="audit-table-header">

                    <div>

                        <h2>
                            Activity History
                        </h2>

                        <p>
                            {filteredLogs.length} activit
                            {filteredLogs.length !== 1
                                ? "ies"
                                : "y"} found
                        </p>

                    </div>


                    <div className="audit-search-wrapper">

                        <span className="audit-search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            className="audit-search"
                            placeholder="Search audit logs..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading && (

                    <div className="audit-loading">

                        <div className="audit-spinner"></div>

                        <p>
                            Loading audit logs...
                        </p>

                    </div>

                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (

                    <div className="audit-error">

                        <div>⚠️</div>

                        <h3>
                            Unable to load audit logs
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="audit-retry-btn"
                            onClick={fetchLogs}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ================= EMPTY ================= */}

                {!loading &&
                    !error &&
                    filteredLogs.length === 0 && (

                        <div className="audit-empty">

                            <div className="audit-empty-icon">
                                📋
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No logs found"
                                    : "No audit logs yet"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "System activities will appear here."}
                            </p>

                        </div>

                    )}


                {/* ================= TABLE ================= */}

                {!loading &&
                    !error &&
                    filteredLogs.length > 0 && (

                        <div className="audit-table-container">

                            <table className="audit-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Entity</th>
                                        <th>Entity ID</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Action</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredLogs.map(
                                        (log) => (

                                            <tr key={log.id}>

                                                <td>
                                                    <span className="audit-id">
                                                        #{log.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="audit-user">
                                                        👤 User #
                                                        {log.user?.id ??
                                                            log.userId ??
                                                            "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="audit-action-badge">
                                                        {log.action || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="audit-entity-badge">
                                                        {log.entityType || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    #{log.entityId ?? "-"}
                                                </td>

                                                <td>
                                                    <span
                                                        className="audit-description"
                                                        title={log.description}
                                                    >
                                                        {log.description || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {log.createdAt
                                                        ? new Date(
                                                            log.createdAt
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )
                                                        : "-"}
                                                </td>

                                                <td>

                                                    <button
                                                        className="audit-delete-btn"
                                                        onClick={() =>
                                                            deleteLog(log.id)
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

export default AuditLogs;