import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Users, ListTodo, AlertTriangle, TrendingUp } from "lucide-react";
import { getEmployees, getProjects } from "../utils/api";

const donutColors = ["#9333EA", "#C4B5FD", "#7C3AED", "#DDD6FE", "#5B21B6"];

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [employeeData, projectData] = await Promise.all([
          getEmployees(),
          getProjects(),
        ]);
        setEmployees(employeeData);
        setProjects(projectData);
      } catch (err) {
        setLoadError(err.message || "Failed to load dashboard data.");
      }
    }

    loadData();
    setTasks(JSON.parse(localStorage.getItem("tasks")) || []);
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const totalEmployees = employees.length;
  const totalTasks = projects.length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in-progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const overdueCount = tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== "completed").length;
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const kpis = [
    { label: "Total Employees", value: totalEmployees, icon: Users, bg: "#9333EA" },
    { label: "Total Projects", value: totalTasks, icon: ListTodo, bg: "#7C3AED" },
    { label: "Overdue Tasks", value: overdueCount, icon: AlertTriangle, bg: "#DC2626" },
    { label: "Completion Rate", value: `${completionRate}%`, icon: TrendingUp, bg: "#16A34A" },
  ];

  // Group tasks per employee for the donut
  const workloadMap = {};
  tasks.forEach((t) => {
    const name = t.assignedTo || "Unassigned";
    workloadMap[name] = (workloadMap[name] || 0) + 1;
  });
  const workloadData = Object.entries(workloadMap).map(([name, value]) => ({ name, value }));

  // Most recently created tasks
  const recentTasks = [...tasks].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>

      {loadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-3">
          {loadError}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: k.bg }}>
                <Icon size={22} color="#ffffff" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{k.label}</p>
                <p className="text-lg font-bold text-slate-800">{k.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Task Status Tracker */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Task Status</h3>
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks created yet.</p>
          ) : (
            <div className="space-y-4">
              {[
                { label: "Pending", count: pendingCount, color: "bg-purple-500" },
                { label: "In Progress", count: inProgressCount, color: "bg-amber-500" },
                { label: "Completed", count: completedCount, color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{s.label}</span>
                    <span className="text-xs font-medium text-slate-500">{s.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${s.color}`}
                      style={{ width: `${tasks.length === 0 ? 0 : (s.count / tasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Workload Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-2">Workload by Employee</h3>
          {workloadData.length === 0 ? (
            <p className="text-sm text-slate-400">No tasks assigned yet.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={workloadData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                    {workloadData.map((entry, i) => (
                      <Cell key={entry.name} fill={donutColors[i % donutColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {workloadData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: donutColors[i % donutColors.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      
    </div>
  );
}