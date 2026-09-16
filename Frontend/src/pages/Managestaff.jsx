import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  ArrowRight,
} from "lucide-react";

export default function ManageStaff() {
  const staffStats = [
    {
      title: "Total Staff",
      value: "13",
      icon: Users,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Active Staff",
      value: "11",
      icon: UserCheck,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "On Leave",
      value: "2",
      icon: UserX,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Manage Staff
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage your team members and employee records.
          </p>
        </div>

        <Link
          to="/admin-dashboard/employee-details/add"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Add Employee
        </Link>
      </div>


      {/* Staff Statistics */}
      <div className="grid grid-cols-3 gap-4">

        {staffStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <Icon
                  size={22}
                  className={stat.iconColor}
                />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}

      </div>


      {/* Staff Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-slate-800">
              Employee Management
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              View, edit, and remove employee records.
            </p>
          </div>

          <Link
            to="/admin-dashboard/employee-details"
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View Employees
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>


      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <h3 className="font-semibold text-slate-800 mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <Link
            to="/admin-dashboard/employee-details/add"
            className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <UserPlus
                  size={20}
                  className="text-indigo-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Add Employee
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Create a new employee record.
                </p>
              </div>

            </div>
          </Link>


          <Link
            to="/admin-dashboard/employee-details"
            className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Users
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Employee Details
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  View and manage all employees.
                </p>
              </div>

            </div>
          </Link>

        </div>

      </div>

    </div>
  );
}