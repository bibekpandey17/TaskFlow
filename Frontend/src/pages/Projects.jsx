const columns = ["Planning", "In Progress", "Review", "Completed"];

const projects = [
  { id: 1, name: "Website Revamp", client: "Cornor Tech", manager: "Aswin", stage: "In Progress", budgetBurn: 60, team: ["R", "S"] },
  { id: 2, name: "Mobile App", client: "Tulips HRM", manager: "Bijana", stage: "Planning", budgetBurn: 10, team: ["B", "H"] },
  { id: 3, name: "API Migration", client: "Internal", manager: "Ram", stage: "Review", budgetBurn: 85, team: ["R"] },
];

export default function Projects() {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-800">Project Tracking</h2>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col} className="bg-slate-100 rounded-xl p-3">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">{col}</h3>
            <div className="space-y-3">
              {projects.filter((p) => p.stage === col).map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow-sm p-3 space-y-2">
                  <p className="font-medium text-sm text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.client} · {p.manager}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-[#9333EA] h-1.5 rounded-full" style={{ width: `${p.budgetBurn}%` }} />
                  </div>
                  <p className="text-xs text-slate-400">{p.budgetBurn}% budget used</p>
                  <div className="flex -space-x-2">
                    {p.team.map((initial, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold flex items-center justify-center border-2 border-white">
                        {initial}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Simple Timeline (Gantt placeholder) */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-3">Timeline</h3>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 text-sm">
              <span className="w-32 text-slate-600">{p.name}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div className="bg-[#9333EA] h-2 rounded-full" style={{ width: `${p.budgetBurn}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">A full interactive Gantt (drag-to-reschedule, dependency lines) needs a dedicated library like `gantt-task-react` — worth adding once the rest of the app is stable.</p>
      </div>
    </div>
  );
}