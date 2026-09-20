import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmployeeTable from "../components/EmployeeTable";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getEmployees, deleteEmployee } from "../utils/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

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

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    await deleteEmployee(pendingDelete._id);
    await loadEmployees();
    setPendingDelete(null);
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

      <ConfirmDeleteModal
        employee={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}