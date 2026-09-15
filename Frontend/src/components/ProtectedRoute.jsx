import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("loggedInUser");

    if (!token || !userStr) {
        return <Navigate to="/" replace />;
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch {
        return <Navigate to="/" replace />;
    }

    const isAdmin = user.isAdmin || user.role === "admin";

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/employee-dashboard" replace />;
    }

    return children;
}