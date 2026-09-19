import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  LogOut,
  ClipboardCheck,
} from "lucide-react";

const navItems = [
  {
    name: "Projects",
    icon: ClipboardList,
    path: "/employee-dashboard",
    end: true,
  },
];

const EmployeeSidebar = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) {
      try {
        setStaff(JSON.parse(stored));
      } catch {
        setStaff(null);
      }
    }
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedInUser");
  navigate("/");
};

  const displayName = staff?.staffName || "Employee";
  const displayRole = staff?.role || "staff";

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col justify-between p-4 font-[Poppins] text-slate-700 select-none shadow-sm">
      <div>
        {/* Branding — matches Login page */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#9333EA] flex items-center justify-center shadow-md shadow-purple-200">
            <ClipboardCheck size={20} color="#ffffff" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">
              Task<span className="text-[#9333EA]">Flow</span>
            </h1>
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
                      ? "bg-purple-50 text-[#9333EA] shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-[#9333EA]" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#9333EA]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom section — user card + logout */}
      <div className="pt-3 mt-1 border-t border-slate-100">
        <div className="flex items-center gap-3 p-2.5 mb-2 rounded-xl bg-slate-50 border border-slate-100">
          <div className="w-9 h-9 rounded-full bg-[#9333EA] flex items-center justify-center flex-shrink-0 shadow-sm shadow-purple-200">
            <span className="text-white text-sm font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {displayName}
            </p>
            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-purple-100 text-[#9333EA] text-[10px] font-medium capitalize leading-none">
              {displayRole}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-all duration-200"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-400" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default EmployeeSidebar;