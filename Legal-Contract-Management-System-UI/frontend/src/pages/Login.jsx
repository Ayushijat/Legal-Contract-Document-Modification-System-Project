import { useState } from "react";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const data = await response.json();

            console.log("Login successful:", data);

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", data.email);
            localStorage.setItem("role", data.role);

            alert("Login successful!");

            // Go to dashboard after saving token
            window.location.href = "/dashboard";

        } catch (error) {

            console.error(error);
            alert(error.message);

        }
    };

    return (
        <div className="login-page">
            

            <div className="login-container">

                {/* Header */}

                <div className="login-header">

                    <h1>LCMS</h1>

                    <h2>Legal Contract Management System</h2>

                    <p>
                        Secure Contract Management Portal
                    </p>

                </div>


                {/* Login Form */}

                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    <div>

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div>

                        <label>Password</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>


                {/* Footer */}

                <div className="login-footer">

                    <p>
                        Secure access to your legal contracts
                    </p>

                    <span>
                        © 2026 Legal Contract Management System
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Login;