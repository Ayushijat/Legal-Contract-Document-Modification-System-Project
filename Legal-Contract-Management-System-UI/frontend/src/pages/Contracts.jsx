import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Contracts() {

    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [contractNumber, setContractNumber] = useState("");
    const [title, setTitle] = useState("");
    const [contractType, setContractType] = useState("");
    const [status, setStatus] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);

    const token = localStorage.getItem("token");

    // =========================
    // FETCH CONTRACTS
    // =========================

    const fetchContracts = async () => {
    try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/api/contracts", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch contracts");
        }

        const data = await response.json();
        setContracts(data);

    } catch (error) {
        console.error(error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
};

    // =========================
    // CREATE CONTRACT
    // =========================

    const createContract = async (e) => {
    e.preventDefault();

    try {
        const formData = new URLSearchParams();

        formData.append("contractNumber", contractNumber);
        formData.append("title", title);
        formData.append("contractType", contractType);
        formData.append("status", status);
        formData.append("createdById", "1");

        const response = await fetch(
            "http://localhost:8080/api/contracts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to create contract");
        }

        const newContract = await response.json();

        setContracts((prevContracts) => [
            ...prevContracts,
            newContract
        ]);

        resetForm();
        setShowForm(false);

        alert("Contract created successfully!");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};
    const updateContract = async (e) => {
    e.preventDefault();

    try {
        const formData = new URLSearchParams();

        formData.append("contractNumber", contractNumber);
        formData.append("title", title);
        formData.append("contractType", contractType);
        formData.append("status", status);

        const response = await fetch(
            `http://localhost:8080/api/contracts/${editingId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update contract");
        }

        const updatedContract = await response.json();

        setContracts((prevContracts) =>
            prevContracts.map((contract) =>
                contract.id === editingId
                    ? updatedContract
                    : contract
            )
        );

        resetForm();
        setShowForm(false);

        alert("Contract updated successfully!");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
};

    // =========================
    // EDIT CONTRACT
    // =========================

    const handleEdit = (contract) => {

        setEditingId(contract.id);

        setContractNumber(contract.contractNumber);
        setTitle(contract.title);
        setContractType(contract.contractType);
        setStatus(contract.status);

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================
    // DELETE CONTRACT
    // =========================

    const deleteContract = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contract?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/contracts/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete contract");
            }

            setContracts((prevContracts) =>
                prevContracts.filter(
                    (contract) => contract.id !== id
                )
            );

            alert("Contract deleted successfully!");

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setEditingId(null);
        setContractNumber("");
        setTitle("");
        setContractType("");
        setStatus("");
    };


    // =========================
    // CANCEL EDIT / FORM
    // =========================

    const handleCancel = () => {

        resetForm();
        setShowForm(false);
    };


    // =========================
    // FETCH ON PAGE LOAD
    // =========================

    useEffect(() => {
        fetchContracts();
    }, []);


    // =========================
    // SEARCH
    // =========================

    const filteredContracts = contracts.filter((contract) => {

        const search = searchTerm.toLowerCase();

        return (
            contract.contractNumber
                ?.toLowerCase()
                .includes(search) ||

            contract.title
                ?.toLowerCase()
                .includes(search) ||

            contract.contractType
                ?.toLowerCase()
                .includes(search) ||

            contract.status
                ?.toLowerCase()
                .includes(search)
        );
    });


    // =========================
    // STATISTICS
    // =========================

    const totalContracts = contracts.length;

    const activeContracts = contracts.filter(
        (contract) =>
            contract.status?.toUpperCase() === "ACTIVE"
    ).length;

    const draftContracts = contracts.filter(
        (contract) =>
            contract.status?.toUpperCase() === "DRAFT"
    ).length;


    return (

        <div className="contracts-page">

            <Sidebar />

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="contracts-header">

                <div>

                    <div className="page-breadcrumb">
                        Dashboard / Contracts
                    </div>

                    <h1>Contracts</h1>

                    <p>
                        Manage and monitor your legal contracts
                    </p>

                </div>


                <button
                    className="add-contract-btn"
                    onClick={() => {

                        if (showForm) {
                            handleCancel();
                        } else {
                            resetForm();
                            setShowForm(true);
                        }

                    }}
                >
                    {showForm
                        ? "✕ Close"
                        : "+ Create Contract"}
                </button>

            </div>


            {/* =========================
                CREATE / EDIT FORM
            ========================= */}

            {showForm && (

                <div className="contract-form-card">

                    <div className="form-card-header">

                        <div>

                            <h2>
                                {editingId
                                    ? "Edit Contract"
                                    : "Create New Contract"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update contract information"
                                    : "Enter the details of the new contract"}
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            editingId
                                ? updateContract
                                : createContract
                        }
                        className="contract-form"
                    >

                        <div className="form-grid">

                            {/* Contract Number */}

                            <div className="form-group">

                                <label>
                                    Contract Number
                                </label>

                                <input
                                    type="text"
                                    value={contractNumber}
                                    onChange={(e) =>
                                        setContractNumber(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. CNT-001"
                                    required
                                />

                            </div>


                            {/* Contract Title */}

                            <div className="form-group">

                                <label>
                                    Contract Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter contract title"
                                    required
                                />

                            </div>


                            {/* Contract Type */}

                            <div className="form-group">

                                <label>
                                    Contract Type
                                </label>

                                <input
                                    type="text"
                                    value={contractType}
                                    onChange={(e) =>
                                        setContractType(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Employment"
                                    required
                                />

                            </div>


                            {/* Status */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    required
                                >
                                    <option value="">
                                        Select status
                                    </option>

                                    <option value="DRAFT">
                                        Draft
                                    </option>

                                    <option value="ACTIVE">
                                        Active
                                    </option>

                                    <option value="EXPIRED">
                                        Expired
                                    </option>

                                    <option value="TERMINATED">
                                        Terminated
                                    </option>
                                </select>

                            </div>

                        </div>


                        <div className="form-actions">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-contract-btn"
                            >
                                {editingId
                                    ? "Update Contract"
                                    : "Create Contract"}
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="contract-stats">

                <div className="contract-stat-card">

                    <div className="stat-icon">
                        📄
                    </div>

                    <div>
                        <p>Total Contracts</p>
                        <h2>{totalContracts}</h2>
                    </div>

                </div>


                <div className="contract-stat-card">

                    <div className="stat-icon">
                        🟢
                    </div>

                    <div>
                        <p>Draft Contracts</p>
                        <h2>{draftContracts}</h2>
                    </div>

                </div>


                <div className="contract-stat-card">

                    <div className="stat-icon">
                        ⏳
                    </div>

                    <div>
                        <p>Draft Contracts</p>
                        <h2>{draftContracts}</h2>
                    </div>

                </div>

            </div>


            {/* =========================
                CONTRACT TABLE
            ========================= */}

            <div className="contracts-table-card">

                <div className="table-header">

                    <div>

                        <h2>All Contracts</h2>

                        <p>
                            {filteredContracts.length} contract
                            {filteredContracts.length !== 1
                                ? "s"
                                : ""} found
                        </p>

                    </div>


                    <div className="search-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search contracts..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                            className="contract-search"
                        />

                    </div>

                </div>


                {/* Loading */}

                {loading && (

                    <div className="loading-state">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading contracts...
                        </p>

                    </div>
                )}


                {/* Error */}

                {!loading && error && (

                    <div className="error-state">

                        <div>⚠️</div>

                        <h3>
                            Unable to load contracts
                        </h3>

                        <p>{error}</p>

                        <button
                            onClick={fetchContracts}
                            className="retry-btn"
                        >
                            Try Again
                        </button>

                    </div>
                )}


                {/* Empty */}

                {!loading &&
                    !error &&
                    filteredContracts.length === 0 && (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📄
                            </div>

                            <h3>
                                {searchTerm
                                    ? "No contracts found"
                                    : "No contracts yet"}
                            </h3>

                            <p>
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Create your first legal contract to get started."}
                            </p>

                        </div>
                    )}


                {/* Table */}

                {!loading &&
                    !error &&
                    filteredContracts.length > 0 && (

                        <div className="table-container">

                            <table className="contracts-table">

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>
                                            Contract
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredContracts.map(
                                        (contract) => (

                                            <tr
                                                key={
                                                    contract.id
                                                }
                                            >

                                                <td>
                                                    <span className="contract-id">
                                                        #{contract.id}
                                                    </span>
                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            contract.contractNumber
                                                        }
                                                    </strong>

                                                </td>


                                                <td>
                                                    {
                                                        contract.title
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        contract.contractType
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={`status-badge ${contract.status
                                                            ?.toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )}`}
                                                    >
                                                        {
                                                            contract.status
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {contract.createdAt
                                                        ? new Date(
                                                            contract.createdAt
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "-"}

                                                </td>


                                                <td>

                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    contract
                                                                )
                                                            }
                                                        >
                                                            ✏️ Edit
                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteContract(
                                                                    contract.id
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

export default Contracts;