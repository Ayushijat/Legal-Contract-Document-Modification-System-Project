import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Contracts from "./pages/Contracts";
import Documents from "./pages/Documents";
import Versions from "./pages/Versions";
import Clauses from "./pages/Clauses";
import Modifications from "./pages/Modifications";
import Approvals from "./pages/Approvals";
import AuditLogs from "./pages/AuditLogs";
import Users from "./pages/Users";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/contracts"
                    element={
                        <ProtectedRoute>
                            <Contracts />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute>
                            <Documents />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/versions"
                    element={
                        <ProtectedRoute>
                            <Versions />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clauses"
                    element={
                        <ProtectedRoute>
                            <Clauses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/modifications"
                    element={
                        <ProtectedRoute>
                            <Modifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/approvals"
                    element={
                        <ProtectedRoute>
                            <Approvals />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/audit-logs"
                    element={
                        <ProtectedRoute>
                            <AuditLogs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;