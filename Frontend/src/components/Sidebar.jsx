import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Plus,
  LogOut,
  ClipboardList,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard", end: true },
  { name: "Employee details", icon: Users, path: "/admin-dashboard/employee-details", end: true },

  { name: "All Tasks", icon: ClipboardList, path: "/admin-dashboard/tasks", end: true },
  { name: "Manage Staff", icon: Users, path: "/admin-dashboard/staff", end: true },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("cornor_ems_auth");
    navigate("/");
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4 font-sans text-slate-700 select-none shadow-sm">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#9333EA] from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
            TF
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">TaskFlow</h1>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-[#9333EA] hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-[#9333EA]"}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#9333EA]" />}
                  </>
                )}
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 text-slate-500" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;