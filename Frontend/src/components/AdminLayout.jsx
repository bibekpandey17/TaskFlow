import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <main className="p-6 bg-slate-50 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}