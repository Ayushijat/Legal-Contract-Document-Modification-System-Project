import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {

    const navigate = useNavigate();

    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="dashboard-page">

            
            <Sidebar />


            {/* Main Content */}
            <main className="dashboard-content">

                <div className="dashboard-header">

                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome to Legal Contract Management System</p>
                    </div>

                    <div className="user-info">

                        <div className="user-avatar">
                            {email?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <strong>{email}</strong>
                            <span>{role}</span>
                        </div>

                    </div>

                </div>


                {/* Welcome Card */}
                <div className="welcome-card">

                    <h2>
                        Welcome back! 👋
                    </h2>

                    <p>
                        Manage contracts, documents, versions and
                        approval workflows from one place.
                    </p>

                </div>


                {/* Statistics */}
                <div className="dashboard-cards">

                    <div className="dashboard-card">
                        <div className="card-icon">📄</div>
                        <h3>Contracts</h3>
                        <p>Manage legal contracts</p>
                        <button
                            onClick={() => navigate("/contracts")}
                        >
                            View Contracts →
                        </button>
                    </div>


                    <div className="dashboard-card">
                        <div className="card-icon">📁</div>
                        <h3>Documents</h3>
                        <p>Upload and manage documents</p>
                        <button
                            onClick={() => navigate("/documents")}
                        >
                            View Documents →
                        </button>
                    </div>


                    <div className="dashboard-card">
                        <div className="card-icon">🔄</div>
                        <h3>Versions</h3>
                        <p>Track contract versions</p>
                        <button
                            onClick={() => navigate("/versions")}
                        >
                            View Versions →
                        </button>
                    </div>


                    <div className="dashboard-card">
                        <div className="card-icon">✅</div>
                        <h3>Approvals</h3>
                        <p>Review approval requests</p>
                        <button
                            onClick={() => navigate("/approvals")}
                        >
                            View Approvals →
                        </button>
                    </div>

                </div>


                {/* Role Information */}
                <div className="role-card">

                    <h2>Current Session</h2>

                    <div className="session-info">

                        <div>
                            <span>Email</span>
                            <strong>{email}</strong>
                        </div>

                        <div>
                            <span>Role</span>
                            <strong>{role}</strong>
                        </div>

                        <div>
                            <span>Authentication</span>
                            <strong className="authenticated">
                                ● Authenticated
                            </strong>
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;