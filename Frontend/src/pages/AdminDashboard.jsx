import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Users,
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  getEmployees,
  getProjects,
} from "../utils/storage";

const donutColors = [
  "#9333EA",
  "#C4B5FD",
  "#7C3AED",
  "#DDD6FE",
  "#5B21B6",
  "#A78BFA",
];

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  

  useEffect(() => {
    setEmployees(getEmployees());
    setProjects(getProjects());
  }, []);

 
  const today = new Date()
    .toISOString()
    .split("T")[0];

  
  const totalEmployees = employees.length;

  const totalProjects = projects.length;

  const pendingCount = projects.filter(
    (project) => project.status === "Pending"
  ).length;

  const inProgressCount = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  const overdueCount = projects.filter(
    (project) =>
      project.dueDate &&
      project.dueDate < today &&
      project.status !== "Completed"
  ).length;

  const completionRate =
    totalProjects === 0
      ? 0
      : Math.round(
          (completedCount / totalProjects) * 100
        );

  
  const kpis = [
    {
      label: "Total Employees",
      value: totalEmployees,
      icon: Users,
      bg: "#9333EA",
    },
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      bg: "#7C3AED",
    },
    {
      label: "Overdue Projects",
      value: overdueCount,
      icon: AlertTriangle,
      bg: "#DC2626",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: CheckCircle2,
      bg: "#16A34A",
    },
  ];

  

  const workloadMap = {};

  projects.forEach((project) => {
    

    const employeeName = (
      project.assignedTo ||
      project.doneBy ||
      "Unassigned"
    ).trim();

    

    const existingName = Object.keys(workloadMap).find(
      (name) =>
        name.toLowerCase() ===
        employeeName.toLowerCase()
    );

    const finalName =
      existingName || employeeName;

    workloadMap[finalName] =
      (workloadMap[finalName] || 0) + 1;
  });

  const workloadData = Object.entries(
    workloadMap
  ).map(([name, value]) => ({
    name,
    value,
  }));

  

  return (
    <div className="space-y-6 font-[Poppins]">


      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Dashboard Overview
        </h2>
      </div>



      <div className="grid grid-cols-4 gap-4">

        {kpis.map((kpi) => {
          const Icon = kpi.icon;

          return (
            <div
              key={kpi.label}
              className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center gap-3"
            >

              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: kpi.bg,
                }}
              >
                <Icon
                  size={22}
                  color="#ffffff"
                />
              </div>

              <div>

                <p className="text-xs text-slate-500">
                  {kpi.label}
                </p>

                <p className="text-lg font-bold text-slate-800">
                  {kpi.value}
                </p>

              </div>

            </div>
          );
        })}

      </div>


      

      <div className="grid grid-cols-3 gap-6">


        
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-800 mb-4">
            Project Status
          </h3>


          {totalProjects === 0 ? (

            <p className="text-sm text-slate-400">
              No projects yet — click "+ Add Project"
              to create one.
            </p>

          ) : (

            <div className="space-y-4">

              {[
                {
                  label: "Pending",
                  count: pendingCount,
                  color: "bg-[#9333EA]",
                },
                {
                  label: "In Progress",
                  count: inProgressCount,
                  color: "bg-blue-500",
                },
                {
                  label: "Completed",
                  count: completedCount,
                  color: "bg-emerald-500",
                },
              ].map((status) => (

                <div key={status.label}>

                  <div className="flex justify-between text-sm mb-1">

                    <span className="text-slate-700">
                      {status.label}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {status.count}
                    </span>

                  </div>


                  <div className="w-full bg-slate-100 rounded-full h-2">

                    <div
                      className={`h-2 rounded-full ${status.color} transition-all`}
                      style={{
                        width: `${
                          (status.count /
                            totalProjects) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* =================================================
            PROJECTS BY EMPLOYEE
        ================================================= */}

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-800 mb-2">
            Projects by Employee
          </h3>


          {workloadData.length === 0 ? (

            <p className="text-sm text-slate-400">
              No projects assigned yet.
            </p>

          ) : (

            <>

              <ResponsiveContainer
                width="100%"
                height={170}
              >

                <PieChart>

                  <Pie
                    data={workloadData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={70}
                  >

                    {workloadData.map(
                      (entry, index) => (

                        <Cell
                          key={entry.name}
                          fill={
                            donutColors[
                              index %
                                donutColors.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>


              
              <div className="grid grid-cols-2 gap-2 mt-2">

                {workloadData.map(
                  (data, index) => (

                    <div
                      key={data.name}
                      className="flex items-center gap-1.5 text-xs text-slate-600"
                    >

                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            donutColors[
                              index %
                                donutColors.length
                            ],
                        }}
                      />

                      <span className="truncate">
                        {data.name} ({data.value})
                      </span>

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}