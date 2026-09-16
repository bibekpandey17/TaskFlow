import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmployeeForm from "../components/Employeeform";
import { getEmployeeById, updateEmployee } from "../utils/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getEmployeeById(id)
      .then(setEmployee)
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(values) {
    try {
      await updateEmployee(id, values);
      navigate("/admin-dashboard/employee-details", {
        state: { message: "Employee changes saved successfully!" },
      });
    } catch (err) {
      setError(err.message || "Failed to update employee.");
    }
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!employee) {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-800">Edit Employee</h2>
        <p className="text-sm text-slate-500">Loading.....</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Edit Employee</h2>
        <p className="text-sm text-slate-500 mt-1">Update employee information</p>
      </div>

      <EmployeeForm initialValues={employee} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}