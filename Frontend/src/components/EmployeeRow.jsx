import { Link } from "react-router-dom";

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-600",
  "On Leave": "bg-amber-50 text-amber-600",
};

export default function EmployeeRow({ employee, onDeleteClick }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">

      {/* Name */}
      <td className="py-3 px-4 text-sm font-medium text-slate-900">
        {employee.name}
      </td>

      {/* Department */}
      <td className="py-3 px-4 text-sm text-slate-500">
        {employee.department}
      </td>

      {/* Position */}
      <td className="py-3 px-4 text-sm text-slate-500">
        {employee.position}
      </td>

      {/* Email */}
      <td className="py-3 px-4 text-sm text-slate-500">
        {employee.email}
      </td>

      {/* Contact No. */}
      <td className="py-3 px-4 text-sm text-slate-500">
        {employee.phone || employee.contact || "-"}
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            statusStyles[employee.status] ||
            "bg-slate-100 text-slate-600"
          }`}
        >
          {employee.status}
        </span>
      </td>

      {/* Actions */}
      <td className="text-xs font-medium px-2.5 py-1 rounded-full">

        {/* Edit */}
        <Link
          to={`/admin-dashboard/employee-details/${employee.id}/edit`}
          className="px-3 py-1.5 bg-purple-100 text-[#9333EA] hover:bg-purple-200 rounded-md text-xs font-medium"
        >
          Edit
        </Link>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDeleteClick(employee)}
          className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium"
        >
          Delete
        </button>

      </td>
    </tr>
  );
}
