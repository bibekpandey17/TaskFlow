import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import EmployeeTable from "../components/EmployeeTable";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getEmployees, deleteEmployee } from "../utils/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      const employeeList = Array.isArray(data)
        ? data
        : data?.employees || data?.data || [];
      setEmployees(employeeList);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  // Pick up success message passed from Add/Edit pages via navigate(state)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      // Clear the state so refreshing the page doesn't re-show the message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Auto-hide the message after a few seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteEmployee(pendingDelete._id);
      await loadEmployees();
      setMessage("Employee deleted successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to delete employee.");
    } finally {
      setPendingDelete(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Employee Details</h2>
          <p className="text-sm text-slate-500 mt-1">{employees.length} total employees</p>
        </div>

        <Link
          to="/admin-dashboard/employee-details/add"
          className="bg-[#9333EA] hover:bg-[#a855f7] text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
        >
          Add Employee
        </Link>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-md px-4 py-3">
          {message}
        </div>
      )}

      <EmployeeTable employees={employees} onDeleteClick={setPendingDelete} />

      <ConfirmDeleteModal
        employee={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}