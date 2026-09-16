import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmployeeTable from "../components/Employeetable";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { getEmployees, deleteEmployee } from "../utils/storage";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  function handleConfirmDelete() {
    if (!pendingDelete) return;

    deleteEmployee(pendingDelete.id);
    setEmployees(getEmployees());
    setPendingDelete(null);
  }

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Employee Details
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {employees.length} total employees
          </p>
        </div>

        {/* Add Employee Button */}
        <Link
          to= "/admin-dashboard/employee-details/add"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
        >
          Add Employee
        </Link>
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        onDeleteClick={setPendingDelete}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        employee={pendingDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

    </div>
  );
}