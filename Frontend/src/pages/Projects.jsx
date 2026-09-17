import { useEffect, useState } from "react";
import axios from "axios";

const STAFF_API_URL = "/api/staff";
const PROJECTS_API_URL = "/api/projects";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

function getIsAdmin() {
  return localStorage.getItem("isAdmin") === "true";
}

export default function Projects() {
  const isAdmin = getIsAdmin();

  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffError, setStaffError] = useState("");

  // Selected staff member whose projects panel is open
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [filter, setFilter] = useState("All");

  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    completionPercentage: 0,
    status: "Not Started",
    priority: "Medium",
  });

  // LOAD STAFF LIST

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setLoadingStaff(true);
    setStaffError("");
    try {
      const res = await axios.get(STAFF_API_URL, {
        headers: getAuthHeaders(),
      });
      // Hide admin accounts — only show non-admin staff/employees
      setStaffList(res.data.filter((staff) => !staff.isAdmin));
    } catch (err) {
      setStaffError(
        err.response?.data?.message || "Failed to load staff list"
      );
    } finally {
      setLoadingStaff(false);
    }
  }

  // OPEN / CLOSE PROJECTS PANEL FOR A STAFF MEMBER

  function openStaffProjects(staff) {
    if (staff.isAdmin) return;
    setSelectedStaff(staff);
    setFilter("All");
    setShowForm(false);
    setEditingId(null);
    fetchProjectsForStaff(staff.staffId);
  }

  function closeStaffProjects() {
    setSelectedStaff(null);
    setProjects([]);
    setShowForm(false);
    setEditingId(null);
  }

  async function fetchProjectsForStaff(staffId) {
    setLoadingProjects(true);
    setProjectsError("");
    try {
      const res = await axios.get(PROJECTS_API_URL, {
        headers: getAuthHeaders(),
        params: { staffId },
      });
      setProjects(res.data);
    } catch (err) {
      setProjectsError(
        err.response?.data?.message || "Failed to load projects"
      );
    } finally {
      setLoadingProjects(false);
    }
  }

  // HANDLE INPUT

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "completionPercentage" ? Number(value) : value,
    }));
  }

  function showMessage(text) {
    setMessage(text);
  }

  function closeMessage() {
    setMessage("");
  }

  // RESET FORM

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

  // EDIT PROJECT (admin only — no "add" flow, per requirement)

  function handleEdit(project) {
    setFormData({
      projectName: project.projectName || "",
      description: project.description || "",
      startDate: project.startDate
        ? project.startDate.slice(0, 10)
        : "",
      endDate: project.endDate ? project.endDate.slice(0, 10) : "",
      completionPercentage: project.completionPercentage ?? 0,
      status: project.status || "Not Started",
      priority: project.priority || "Medium",
    });

    setEditingId(project._id);
    setShowForm(true);
  }

  // SUBMIT FORM (update only)

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isAdmin || !editingId) return;

    try {
      await axios.put(
        `${PROJECTS_API_URL}/${editingId}`,
        {
          projectName: formData.projectName,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          completionPercentage: formData.completionPercentage,
          status: formData.status,
          priority: formData.priority,
        },
        { headers: getAuthHeaders() }
      );

      await fetchProjectsForStaff(selectedStaff.staffId);
      resetForm();
      showMessage("Project changes saved successfully!");
    } catch (err) {
      setProjectsError(
        err.response?.data?.message || "Failed to update project"
      );
    }
  }

  // DELETE

  function handleDelete(id) {
    if (!isAdmin) return;
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      await axios.delete(`${PROJECTS_API_URL}/${deleteId}`, {
        headers: getAuthHeaders(),
      });

      await fetchProjectsForStaff(selectedStaff.staffId);
      setDeleteId(null);
      showMessage("Project deleted successfully!");
    } catch (err) {
      setProjectsError(
        err.response?.data?.message || "Failed to delete project"
      );
      setDeleteId(null);
    }
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  // FILTER

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.status === filter);

  function getStatusStyle(status) {
    if (status === "Completed") {
      return "bg-green-50 text-green-600";
    }
    if (status === "In Progress") {
      return "bg-blue-50 text-blue-600";
    }
    if (status === "On Hold") {
      return "bg-orange-50 text-orange-600";
    }
    return "bg-purple-50 text-[#9333EA]";
  }

  function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
  }

  return (
    <div className="space-y-5 font-[Poppins]">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Employees</h2>
        <p className="text-sm text-slate-500 mt-1">
          Click an employee to view their projects.
        </p>
      </div>

      {staffError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3">
          {staffError}
        </div>
      )}

      {/* STAFF TABLE */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Staff Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Staff ID
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Contact No.
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Position
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                  Location
                </th>
              </tr>
            </thead>

            <tbody>
              {loadingStaff ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-sm text-slate-500"
                  >
                    Loading....
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-sm text-slate-500"
                  >
                    No staff found.
                  </td>
                </tr>
              ) : (
                staffList.map((staff) => (
                  <tr
                    key={staff._id}
                    onClick={() => openStaffProjects(staff)}
                    className="border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {staff.staffName}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {staff.staffId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {staff.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-purple-100 text-[#9333EA] rounded-md text-xs font-medium">
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {staff.location}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL SCREEN PROJECTS OVERLAY */}

      {selectedStaff && (
        <div className="fixed inset-0 z-40 bg-white overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={closeStaffProjects}
                  className="text-sm text-slate-500 hover:text-slate-800 mb-2"
                >
                  ← Back to employees
                </button>

                <h2 className="text-xl font-bold text-slate-800">
                  {selectedStaff.staffName}'s Projects (
                  {filteredProjects.length})
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Staff ID: {selectedStaff.staffId}
                </p>
              </div>

              <button
                onClick={closeStaffProjects}
                className="px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            {projectsError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3">
                {projectsError}
              </div>
            )}

            <div className="flex items-center gap-6 border-b border-slate-200">
              {["All", "Not Started", "In Progress", "Completed", "On Hold"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`pb-3 text-sm transition-colors ${
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

            {/* EDIT FORM (admin only) */}

            {isAdmin && showForm && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-5">
                  Edit Project
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        required
                        className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
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
                        required
                        className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Completion %
                      </label>
                      <input
                        type="number"
                        name="completionPercentage"
                        value={formData.completionPercentage}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        required
                        className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-slate-300 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PROJECTS LIST */}

            {!showForm && (
              <>
                {loadingProjects ? (
                  <div className="bg-white rounded-xl shadow-sm py-12 text-center text-sm text-slate-500">
                    Loading projects......
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm py-12 text-center">
                    <h3 className="text-base font-semibold text-slate-700">
                      No projects found
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      This employee has no projects
                      {filter !== "All" ? ` with status "${filter}"` : ""}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-base font-semibold text-slate-800">
                            {project.projectName}
                          </h3>

                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-2">
                          {project.description}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <p className="text-sm text-slate-500">
                            Priority:{" "}
                            <span className="text-slate-700 font-medium">
                              {project.priority}
                            </span>
                          </p>

                          <p className="text-sm text-slate-500">
                            {project.completionPercentage}% complete
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-slate-400">
                            Start: {formatDate(project.startDate)}
                          </p>
                          <p className="text-sm text-slate-400">
                            End: {formatDate(project.endDate)}
                          </p>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleEdit(project)}
                              className="px-3 py-1.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-xs font-medium transition-colors"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(project._id)}
                              className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <span className="text-[#9333EA] text-lg font-bold">✓</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800">
                  Success
                </h3>
                <p className="text-sm text-slate-500 mt-1">{message}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeMessage}
                className="px-5 py-2 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-red-600 text-lg font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800">
                  Delete Project?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}