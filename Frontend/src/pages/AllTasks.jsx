import { useState, useEffect } from "react";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All Tasks");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  const saveTasks = (updated) => {
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    saveTasks(tasks.filter((t) => t.id !== id));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    saveTasks(tasks.map((t) => (t.id === editingTask.id ? editingTask : t)));
    setEditingTask(null);
  };

  const today = new Date().toISOString().split("T")[0];

  const filtered = tasks.filter((t) => {
    if (filter === "Due Today") return t.dueDate === today;
    if (filter === "Overdue") return t.dueDate && t.dueDate < today;
    if (filter === "No Deadline") return !t.dueDate;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">All Tasks ({tasks.length})</h2>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-4 border-b border-slate-200 text-sm">
        {["Due Today", "Overdue", "No Deadline", "All Tasks"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-2 border-b-2 transition-colors ${
              filter === f ? "border-purple-600 text-purple-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task cards */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 text-sm">No tasks here.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-800">{t.title}</h3>
                <span className="text-xs font-medium bg-purple-50 text-purple-600 px-2 py-1 rounded-full capitalize">{t.status}</span>
              </div>
              <p className="text-sm text-slate-500">{t.description}</p>
              <div className="flex justify-between text-xs text-slate-400 pt-2">
                <span>Assigned to {t.assignedTo || "—"}</span>
                <span>{t.dueDate || "No deadline"}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setEditingTask(t)}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-xs bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingTask(null)}>
          <form
            onSubmit={handleEditSave}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-5 w-96 space-y-3"
          >
            <h3 className="font-semibold text-slate-800">Edit Task</h3>
            <input
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <textarea
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              rows={3}
            />
            <input
               type="text"
               value={editingTask.assignedTo}
               onChange={(e) => setEditingTask({ ...editingTask, assignedTo: e.target.value })}
               placeholder="Employee name"
               className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            <input
              type="date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
            <select
              value={editingTask.status}
              onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingTask(null)} className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg">
                Cancel
              </button>
              <button type="submit" className="text-sm px-3 py-1.5 bg-purple-600 text-white rounded-lg">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}