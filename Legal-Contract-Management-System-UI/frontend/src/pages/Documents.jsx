import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Documents() {

    const [documents, setDocuments] = useState([]);
    const [contractId, setContractId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get all documents
    const fetchDocuments = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/documents",
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch documents");
            }

            const data = await response.json();

            setDocuments(data);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // Upload document
    const uploadDocument = async (e) => {

        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const formData = new FormData();

            formData.append("file", selectedFile);
            formData.append("contractId", contractId);
            formData.append("uploadedBy", 1);

            const response = await fetch(
                "http://localhost:8080/api/documents/upload",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Failed to upload document");
            }

            const newDocument = await response.json();

            setDocuments([...documents, newDocument]);

            setContractId("");
            setSelectedFile(null);

            alert("Document uploaded successfully!");

        } catch (error) {

            console.error(error);
            alert(error.message);
        }
    };


    // Download document
    const downloadDocument = async (id) => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/documents/${id}/download`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to download document");
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "document";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);
            alert(error.message);
        }
    };


    // Delete document
    const deleteDocument = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/documents/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete document");
            }

            setDocuments(
                documents.filter((document) => document.id !== id)
            );

            alert("Document deleted successfully!");

        } catch (error) {

            console.error(error);
            alert(error.message);
        }
    };


    useEffect(() => {
        fetchDocuments();
    }, []);


    return (

        <div className="documents-page">
            <Sidebar />

            {/* Page Header */}
            <div className="page-header">

                <h1>
                    Legal Contract Management System
                </h1>

                <p>
                    Document Management
                </p>

            </div>


            {/* Upload Document Card */}
            <div className="card">

                <h2>
                    Upload Document
                </h2>

                <form
                    onSubmit={uploadDocument}
                    className="upload-form"
                >

                    {/* Contract ID */}
                    <div className="form-group">

                        <label>
                            Contract ID
                        </label>

                        <input
                            type="number"
                            value={contractId}
                            onChange={(e) =>
                                setContractId(e.target.value)
                            }
                            placeholder="Enter Contract ID"
                            required
                        />

                    </div>


                    {/* File */}
                    <div className="form-group">

                        <label>
                            Select Document
                        </label>

                        <input
                            type="file"
                            onChange={(e) =>
                                setSelectedFile(e.target.files[0])
                            }
                            required
                        />

                    </div>


                    {/* Upload Button */}
                    <button
                        type="submit"
                        className="primary-button"
                    >
                        Upload Document
                    </button>

                </form>

            </div>


            {/* Documents Table Card */}
            <div className="card">

                <h2>
                    Uploaded Documents
                </h2>


                {/* Loading */}
                {loading && (
                    <p className="message">
                        Loading documents...
                    </p>
                )}


                {/* Error */}
                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {/* No documents */}
                {!loading &&
                    !error &&
                    documents.length === 0 && (

                        <p className="message">
                            No documents found.
                        </p>

                    )}


                {/* Documents Table */}
                {!loading &&
                    !error &&
                    documents.length > 0 && (

                        <table className="documents-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Contract ID</th>

                                    <th>File Name</th>

                                    <th>File Type</th>

                                    <th>File Size</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {documents.map((document) => (

                                    <tr key={document.id}>

                                        <td>
                                            {document.id}
                                        </td>

                                        <td>
                                            {document.contractId}
                                        </td>

                                        <td>
                                            {document.fileName}
                                        </td>

                                        <td>
                                            {document.fileType}
                                        </td>

                                        <td>
                                            {document.fileSize} bytes
                                        </td>

                                        <td>

                                            <button
                                                className="action-button download-button"
                                                onClick={() =>
                                                    downloadDocument(
                                                        document.id
                                                    )
                                                }
                                            >
                                                Download
                                            </button>


                                            <button
                                                className="action-button delete-button"
                                                onClick={() =>
                                                    deleteDocument(
                                                        document.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

            </div>

        </div>
    );
}

export default Documents;