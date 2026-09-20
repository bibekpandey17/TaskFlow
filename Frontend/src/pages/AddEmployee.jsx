import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/Employeeform";
import { createEmployee } from "../utils/api";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(values) {
    setError("");
    try {
      await createEmployee(values);
      navigate("/admin-dashboard/employee-details", {
        state: { message: "Employee added successfully!" },
      });
    } catch (err) {
      setError(err.message || "Failed to add employee.");
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Add Employee</h2>
        <p className="text-sm text-slate-500 mt-1">Add a new employee to the staff list.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <EmployeeForm onSubmit={handleSubmit} submitLabel="Add Employee" />
      </div>
    </div>
  );
}