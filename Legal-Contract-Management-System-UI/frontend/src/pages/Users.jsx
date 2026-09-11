import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Users() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roleId: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    // =========================
    // FETCH USERS
    // =========================

    const fetchUsers = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();

            setUsers(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };

    // =========================
    // FETCH ROLES
    // =========================

    const fetchRoles = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/users/roles",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch roles");
            }

            const data = await response.json();

            setRoles(data);

        } catch (err) {

            setError(err.message);

        }
    };

    useEffect(() => {

        if (role !== "ADMIN") {
            navigate("/dashboard");
            return;
        }

        fetchUsers();
        fetchRoles();

    }, []);

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            name: "",
            email: "",
            password: "",
            roleId: ""
        });

        setEditingUser(null);
        setShowForm(false);

    };

    // =========================
    // CREATE USER
    // =========================

    const createUser = async () => {

        try {

            const params = new URLSearchParams();

            params.append("name", formData.name);
            params.append("email", formData.email);
            params.append("password", formData.password);
            params.append("roleId", formData.roleId);

            const response = await fetch(
                "http://localhost:8080/api/users",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: params
                }
            );

            if (!response.ok) {

                const message = await response.text();

                throw new Error(message || "Failed to create user");
            }

            alert("User created successfully");

            resetForm();

            fetchUsers();

        } catch (err) {

            alert(err.message);

        }

    };

    // =========================
    // UPDATE USER
    // =========================

    const updateUser = async () => {

        try {

            const params = new URLSearchParams();

            params.append("name", formData.name);
            params.append("email", formData.email);
            params.append("roleId", formData.roleId);

            if (formData.password.trim() !== "") {
                params.append("password", formData.password);
            }

            const response = await fetch(
                `http://localhost:8080/api/users/${editingUser.id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: params
                }
            );

            if (!response.ok) {

                const message = await response.text();

                throw new Error(message || "Failed to update user");
            }

            alert("User updated successfully");

            resetForm();

            fetchUsers();

        } catch (err) {

            alert(err.message);

        }

    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!formData.name ||
            !formData.email ||
            !formData.roleId) {

            alert("Please fill all required fields");

            return;
        }

        if (!editingUser && !formData.password) {

            alert("Password is required");

            return;
        }

        if (editingUser) {

            updateUser();

        } else {

            createUser();

        }

    };

    // =========================
    // EDIT
    // =========================

    const handleEdit = (user) => {

        setEditingUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            roleId: user.role?.id || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {

        if (!window.confirm(
            "Are you sure you want to delete this user?"
        )) {
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:8080/api/users/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                const message = await response.text();

                throw new Error(
                    message || "Failed to delete user"
                );
            }

            alert("User deleted successfully");

            fetchUsers();

        } catch (err) {

            alert(err.message);

        }

    };

    // =========================
    // SEARCH
    // =========================

    const filteredUsers = users.filter((user) => {

        const value = search.toLowerCase();

        return (
            user.name?.toLowerCase().includes(value) ||
            user.email?.toLowerCase().includes(value) ||
            user.role?.name?.toLowerCase().includes(value)
        );

    });

    // =========================
    // STATS
    // =========================

    const adminCount =
        users.filter(
            user => user.role?.name === "ADMIN"
        ).length;

    const editorCount =
        users.filter(
            user => user.role?.name === "LEGAL_EDITOR"
        ).length;

    const reviewerCount =
        users.filter(
            user => user.role?.name === "REVIEWER"
        ).length;

    const approverCount =
        users.filter(
            user => user.role?.name === "APPROVER"
        ).length;

    return (

        <div className="page-container">

            <Sidebar />

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <p className="breadcrumb">
                        Dashboard / Users
                    </p>

                    <h1>User Management</h1>

                    <p>
                        Manage users and assign system roles.
                    </p>

                </div>

                <div className="user-info">

                    <span>{email}</span>

                    <span className="role-badge">
                        {role}
                    </span>

                </div>

            </div>

            {/* STATS */}

            <div className="stats-grid">

                <div className="stat-card">
                    <h3>Total Users</h3>
                    <strong>{users.length}</strong>
                </div>

                <div className="stat-card">
                    <h3>Admins</h3>
                    <strong>{adminCount}</strong>
                </div>

                <div className="stat-card">
                    <h3>Legal Editors</h3>
                    <strong>{editorCount}</strong>
                </div>

                <div className="stat-card">
                    <h3>Reviewers</h3>
                    <strong>{reviewerCount}</strong>
                </div>

                <div className="stat-card">
                    <h3>Approvers</h3>
                    <strong>{approverCount}</strong>
                </div>

            </div>

            {/* TOOLBAR */}

            <div className="page-toolbar">

                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="search-input"
                />

                <button
                    className="primary-button"
                    onClick={() => {

                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }

                    }}
                >
                    {showForm ? "Cancel" : "+ Add User"}
                </button>

            </div>

            {/* FORM */}

            {showForm && (

                <div className="form-card">

                    <div className="form-card-header">

                        <h2>
                            {editingUser
                                ? "Edit User"
                                : "Add New User"}
                        </h2>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter user name"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Password
                                    {!editingUser && " *"}
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={
                                        editingUser
                                            ? "Leave blank to keep current password"
                                            : "Enter password"
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Role *
                                </label>

                                <select
                                    name="roleId"
                                    value={formData.roleId}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        Select Role
                                    </option>

                                    {roles.map((role) => (

                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {editingUser
                                    ? "Update User"
                                    : "Create User"}
                            </button>

                        </div>

                    </form>

                </div>

            )}

            {/* ERROR */}

            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}

            {/* TABLE */}

            <div className="table-card">

                <div className="table-header">

                    <h2>Users</h2>

                    <span>
                        {filteredUsers.length} users
                    </span>

                </div>

                {loading ? (

                    <div className="empty-state">
                        Loading users...
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="empty-state">
                        No users found.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            #{user.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {user.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>

                                            <span className="status-badge">
                                                {user.role?.name}
                                            </span>

                                        </td>

                                        <td>
                                            {user.createdAt
                                                ? new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()
                                                : "-"}
                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="edit-button"
                                                    onClick={() =>
                                                        handleEdit(user)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Users;