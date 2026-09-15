import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const [staffId, setStaffId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!staffId.trim() || !password.trim()) {
            setError("Please enter the both Staff ID and password");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/staff/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    staffId: staffId.trim(),
                    password
                }),
            });

            const responseText = await response.text();
            let data = {};

            if (responseText) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error("Server returned an invalid response format.");
                }
            }

            if (!response.ok) {
                throw new Error(data.message || `Login failed (Status: ${response.status})`);
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("loggedInUser", JSON.stringify(data.staff));

            if (data.staff.isAdmin || data.staff.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/employee-dashboard");
            } 

        } catch (err) {
            setError(err.message || "Something went wrong. Please check if the backend is now running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleLogin}>
                <div className="login-logo">TF</div>
                <h2 className="login-title">TaskFlow</h2>
                <p className="login-subtitle-text">Sign in to your account</p>

                <div className="login-field">
                    <label className="login-label">Staff ID:</label>
                    <input
                        required
                        type="text"
                        placeholder="Enter your ID"
                        value={staffId}
                        onChange={(e) => setStaffId(e.target.value)}
                        className="login-input"
                        autoComplete="username"
                    />
                </div>

                <div className="login-field">
                    <label className="login-label">Password:</label>
                    <div className="login-password-wrapper">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input login-password-input"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="login-toggle-visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? <span className="login-spinner"></span> : "Login"}
                </button>

                <p className="login-footer-text">
                   Having trouble? Reach out to your admin.
                </p>  
            </form>
        </div>
    );
}