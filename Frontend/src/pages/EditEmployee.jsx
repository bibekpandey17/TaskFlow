import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmployeeForm from "../components/Employeeform";
import { getEmployeeById, updateEmployee } from "../utils/storage";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const data = getEmployeeById(id);
    setEmployee(data);
  }, [id]);

  function handleSubmit(values) {
    updateEmployee(id, values);

    navigate("/admin-dashboard/employee-details", {
      state: {
        message: "Employee changes saved successfully!",
      },
    });
  }

  if (!employee) {
    return (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-800">
          Edit Employee
        </h2>

        <p className="text-sm text-slate-500">
          Employee not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Edit Employee
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Update employee information
        </p>
      </div>

      <EmployeeForm
        initialValues={employee}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}