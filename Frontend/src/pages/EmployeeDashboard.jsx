import { useEffect, useState } from "react";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";

import EmployeeSidebar from "../components/EmployeeSidebar";

const API_BASE = " https://taskflow-v6xw.onrender.com/api/projects";

const statusStyles = {
  "Not Started":
    "bg-slate-100 text-slate-600 border border-slate-200",

  "In Progress":
    "bg-blue-50 text-blue-600 border border-blue-100",

  Completed:
    "bg-emerald-50 text-emerald-600 border border-emerald-100",

  "On Hold":
    "bg-amber-50 text-amber-600 border border-amber-100",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-purple-50 text-[#9333EA]",
  High: "bg-red-50 text-red-600",
};

export default function EmployeeDashboard() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    completionPercentage: 0,
    status: "Not Started",
    priority: "Medium",
  });

  // ---- Get logged in staff from localStorage ----
  function getLoggedInStaff() {
    const stored = localStorage.getItem("loggedInUser");
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  function getAuthHeaders() {
     const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  const staff = getLoggedInStaff();
  const staffId = staff?.staffId || "";
  const staffName = staff?.staffName || "";

  // ---- FETCH ALL (filtered by staffId) ----
  async function fetchProjects() {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE}?staffId=${encodeURIComponent(staffId)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await res.json();
      setProjects(data);
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong while loading projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "completionPercentage" ? Number(value) : value,
    });
  }

  function resetForm() {
    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      completionPercentage: 0,
      status: "Not Started",
      priority: "Medium",
    });

    setEditingId(null);
    setShowForm(false);
  }

  function handleAddClick() {
    setEditingId(null);

    setFormData({
      projectName: "",
      description: "",
      startDate: "",
      endDate: "",
      completionPercentage: 0,
      status: "Not Started",
      priority: "Medium",
    });

    setShowForm(true);
  }

  function toDateInputValue(date) {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  }

  function handleEditClick(project) {
    setFormData({
      projectName: project.projectName || "",
      description: project.description || "",
      startDate: toDateInputValue(project.startDate),
      endDate: toDateInputValue(project.endDate),
      completionPercentage: project.completionPercentage ?? 0,
      status: project.status || "Not Started",
      priority: project.priority || "Medium",
    });

    setEditingId(project._id);
    setShowForm(true);
  }

  // ---- CREATE / UPDATE ----
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      staffId,
      projectName: formData.projectName,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      completionPercentage: formData.completionPercentage,
      status: formData.status,
      priority: formData.priority,
    };

    try {
      let res;

      if (editingId) {
        // UPDATE
        res = await fetch(`${API_BASE}/${editingId}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch(API_BASE, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      await fetchProjects();
      resetForm();

      setMessage(
        editingId
          ? "Project changes saved successfully!"
          : "Project created successfully!"
      );
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  // ---- DELETE ----
  async function confirmDelete() {
    if (!deleteId) return;
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/${deleteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      await fetchProjects();
      setDeleteId(null);
      setExpandedId(null);

      setMessage("Project deleted successfully!");
    } catch (error) {
      setErrorMsg(error.message || "Something went wrong");
      setDeleteId(null);
    }
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.status === filter);

  const today = new Date().toISOString().split("T")[0];

  const totalProjects = projects.length;

  const notStartedProjects = projects.filter(
    (project) => project.status === "Not Started"
  ).length;

  const progressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;

  function isOverdue(project) {
    const end = toDateInputValue(project.endDate);
    return end && end < today && project.status !== "Completed";
  }

  function formatDate(date) {
    if (!date) {
      return "No date";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      <EmployeeSidebar />

      <main className="flex-1 min-w-0 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Projects</h2>
            {staffName && (
              <p className="text-xs text-slate-400 mt-1">
                Showing projects for {staffName}
              </p>
            )}
          </div>

          <button
            onClick={handleAddClick}
            className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-5 py-2.5 rounded-md transition-colors shadow-sm"
          >
            Create Project
          </button>
        </div>

        {errorMsg && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3">
            {errorMsg}
          </div>
        )}

        {!showForm && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500">Total Projects</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {totalProjects}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500">Not Started</p>
              <p className="text-2xl font-bold text-slate-600 mt-1">
                {notStartedProjects}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {progressProjects}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {completedProjects}
              </p>
            </div>
          </div>
        )}

        {!showForm && (
          <div className="flex items-center gap-6 border-b border-slate-200 mb-5 overflow-x-auto">
            {["All", "Not Started", "In Progress", "Completed", "On Hold"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`pb-3 text-sm whitespace-nowrap transition-colors ${
                    filter === item
                      ? "text-[#9333EA] border-b-2 border-[#9333EA] font-medium"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        )}

        {message && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
            <div className="bg-white w-full max-w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Success
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{message}</p>
                </div>

                <button
                  onClick={() => setMessage("")}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setMessage("")}
                  className="px-5 py-2 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
            <div className="bg-white w-full max-w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
              <h3 className="text-base font-semibold text-slate-800">
                Delete Project?
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Are you sure you want to delete this project? This action
                cannot be undone.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={cancelDelete}
                  className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {editingId ? "Edit Project" : "Create Project"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the project details below.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Project Name
                  </label>

                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the project..."
                    rows={4}
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none resize-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none bg-white focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none bg-white focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Completion Percentage ({formData.completionPercentage}%)
                  </label>

                  <input
                    type="range"
                    name="completionPercentage"
                    min={0}
                    max={100}
                    value={formData.completionPercentage}
                    onChange={handleChange}
                    className="w-full accent-[#9333EA]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel 
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#9333EA] hover:bg-[#7E22CE] disabled:opacity-60 text-white rounded-md text-sm font-medium"
                >
                  {submitting
                    ? "Saving....."
                    : editingId
                    ? "Save Changes"
                    : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <>
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-14 text-center">
                <p className="text-sm text-slate-400">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 py-14 text-center">
                <h3 className="text-base font-semibold text-slate-700">
                  No projects found
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Click "Create Project" to create your first project.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => {
                  const overdue = isOverdue(project);
                  const isOpen = expandedId === project._id;

                  return (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpand(project._id)}
                        className="w-full flex items-center text-left px-5 py-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">
                            {project.projectName}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {project.completionPercentage ?? 0}% complete
                          </p>
                        </div>

                        <div className="shrink-0 mr-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              priorityStyles[project.priority] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {project.priority}
                          </span>
                        </div>

                        <div className="shrink-0 mr-8">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              statusStyles[project.status] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <div className="w-5 shrink-0 flex justify-end">
                          <ChevronDown
                            size={19}
                            className={`text-slate-400 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-5">
                          <div className="mb-5">
                            <p className="text-xs font-medium text-slate-500 mb-2">
                              Description
                            </p>
                            <p className="text-sm text-slate-600 leading-6">
                              {project.description ||
                                "No description provided."}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-slate-400">
                                Start Date
                              </p>
                              <p className="text-sm font-medium text-slate-700 mt-1">
                                {formatDate(project.startDate)}
                              </p>
                            </div>

                            <div
                              className={`rounded-lg p-3 ${
                                overdue ? "bg-red-50" : "bg-slate-50"
                              }`}
                            >
                              <p
                                className={`text-xs ${
                                  overdue ? "text-red-500" : "text-slate-400"
                                }`}
                              >
                                End Date
                              </p>
                              <p
                                className={`text-sm font-medium mt-1 ${
                                  overdue ? "text-red-600" : "text-slate-700"
                                }`}
                              >
                                {formatDate(project.endDate)}
                              </p>
                              {overdue && (
                                <p className="text-[11px] text-red-500 mt-1">
                                  Overdue
                                </p>
                              )}
                            </div>

                            <div className="bg-slate-50 rounded-lg p-3">
                              <p className="text-xs text-slate-400">
                                Completion
                              </p>
                              <p className="text-sm font-medium text-slate-700 mt-1">
                                {project.completionPercentage ?? 0}%
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-slate-100">
                            <button
                              type="button"
                              onClick={() => handleEditClick(project)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-100 text-[#9333EA] hover:bg-purple-200 rounded-md text-xs font-medium transition-colors"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(project._id)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}