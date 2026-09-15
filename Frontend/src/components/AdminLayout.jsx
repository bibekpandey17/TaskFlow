
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="sidebar-logo">TaskFlow</h2>
        <nav>
          <Link to="/admin-dashboard">Dashboard</Link>
          <Link to="/admin-dashboard/employees">Employees</Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
