import { useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>LCMS</h2>
                <p>Contract Management</p>
            </div>

            <nav className="sidebar-nav">

                <button
                    className="nav-item"
                    onClick={() => navigate("/dashboard")}
                >
                    🏠 Dashboard
                </button>

                {(role === "ADMIN" ||
                    role === "LEGAL_EDITOR" ||
                    role === "REVIEWER") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/contracts")}
                    >
                        📄 Contracts
                    </button>
                )}

                {(role === "ADMIN" ||
                    role === "LEGAL_EDITOR" ||
                    role === "REVIEWER") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/documents")}
                    >
                        📁 Documents
                    </button>
                )}

                {(role === "ADMIN" ||
                    role === "LEGAL_EDITOR" ||
                    role === "REVIEWER") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/versions")}
                    >
                        🔄 Versions
                    </button>
                )}

                {(role === "ADMIN" ||
                    role === "LEGAL_EDITOR" ||
                    role === "REVIEWER") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/clauses")}
                    >
                        📑 Clauses
                    </button>
                )}

                {(role === "ADMIN" ||
                    role === "LEGAL_EDITOR") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/modifications")}
                    >
                        ✏️ Modifications
                    </button>
                )}

                {(role === "ADMIN" ||
                    role === "APPROVER") && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/approvals")}
                    >
                        ✅ Approvals
                    </button>
                )}

                {role === "ADMIN" && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/users")}
                    >
                        👥 User Management
                    </button>
                )}

                {role === "ADMIN" && (
                    <button
                        className="nav-item"
                        onClick={() => navigate("/audit-logs")}
                    >
                        📝 Audit Logs
                    </button>
                )}

            </nav>

            <button
                className="logout-button"
                onClick={handleLogout}
            >
                🚪 Logout
            </button>

        </aside>
    );
}

export default Sidebar;