import { useNavigate } from "react-router-dom";
import EmployeeForm from "../components/Employeeform";
import { addEmployee } from "../utils/storage";

export default function AddEmployee() {
  const navigate = useNavigate();

  function handleSubmit(values) {
    addEmployee(values);

    // Go back to Employee Details
    navigate("/admin-dashboard/employee-details");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Add Employee
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Add a new employee to the staff list.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <EmployeeForm
          onSubmit={handleSubmit}
          submitLabel="Add Employee"
        />
      </div>
    </div>
  );
}