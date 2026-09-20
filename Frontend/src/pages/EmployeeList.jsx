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

      // Clear the state so refreshing the page doesn't re-show the popup
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  function closeMessage() {
    setMessage("");
  }

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

      <EmployeeTable employees={employees} onDeleteClick={setPendingDelete} />

      {/* Delete confirmation modal (already existed, unchanged) */}
      <ConfirmDeleteModal
        employee={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      {/* Success popup — same style as ManageStaff.jsx */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-[#9333EA] text-lg font-bold">✓</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800">
                  Success
                </h3>
                <p className="text-sm text-slate-500 mt-1">{message}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeMessage}
                className="px-5 py-2 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}