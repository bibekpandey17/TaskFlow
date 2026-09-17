import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/api/staff";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export default function ManageStaff() {
  const [accounts, setAccounts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    staffName: "",
    email: "",
    phone: "",
    staffId: "",
    role: "",
    location: "",
    password: "",
  });

  useEffect(() => {
    fetchStaff();
    // If you have a separate employees endpoint, fetch it here similarly:
    // fetchEmployees();
  }, []);

  async function fetchStaff() {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });
      setAccounts(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load staff accounts"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "staffName") {
      setFormData((prev) => ({
        ...prev,
        staffName: value,
      }));

      const employee = employees.find(
        (emp) =>
          emp.name?.toLowerCase().trim() === value.toLowerCase().trim()
      );

      if (employee) {
        setFormData((prev) => ({
          ...prev,
          staffName: value,
          email: employee.email || "",
          phone: employee.phone || employee.contact || "",
          role: employee.position || "",
          location: employee.location || "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          staffName: value,
          email: "",
          phone: "",
          role: "",
          location: "",
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function showMessage(text) {
    setMessage(text);
  }

  function closeMessage() {
    setMessage("");
  }

  function resetForm() {
    setFormData({
      staffName: "",
      email: "",
      phone: "",
      staffId: "",
      role: "",
      location: "",
      password: "",
    });

    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function handleCreateAccount() {
    setEditingId(null);

    setFormData({
      staffName: "",
      email: "",
      phone: "",
      staffId: "",
      role: "",
      location: "",
      password: "",
    });

    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingId) {
        const payload = {
          staffName: formData.staffName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          location: formData.location,
        };

        // Only send password if the admin typed a new one
        if (formData.password) {
          payload.password = formData.password;
        }

        await axios.put(`${API_URL}/${editingId}`, payload, {
          headers: getAuthHeaders(),
        });

        await fetchStaff();
        resetForm();
        showMessage("Account changes saved successfully!");
      } else {
        const payload = {
          staffId: formData.staffId,
          password: formData.password,
          staffName: formData.staffName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          location: formData.location,
        };

        await axios.post(API_URL, payload, {
          headers: getAuthHeaders(),
        });

        await fetchStaff();
        resetForm();
        showMessage("Staff account created successfully!");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingId ? "Failed to update account" : "Failed to create account")
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(account) {
    setFormData({
      staffName: account.staffName || "",
      email: account.email || "",
      phone: account.phone || "",
      staffId: account.staffId || "",
      role: account.role || "",
      location: account.location || "",
      password: "",
    });

    setEditingId(account._id);
    setShowForm(true);
  }

  function handleDelete(id) {
    setDeleteId(id);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    setLoading(true);
    setError("");

    try {
      await axios.delete(`${API_URL}/${deleteId}`, {
        headers: getAuthHeaders(),
      });

      await fetchStaff();
      setDeleteId(null);
      showMessage("Account deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setDeleteId(null);
    } finally {
      setLoading(false);
    }
  }

  function cancelDelete() {
    setDeleteId(null);
  }

  return (
    <div className="space-y-5 font-[Poppins]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manage Staff</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage staff accounts.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleCreateAccount}
            className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
          >
            + Create Account
          </button>
        )}
      </div>

      {error && !showForm && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3">
          {error}
        </div>
      )}

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

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <span className="text-red-600 text-lg font-bold">!</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800">
                  Delete Account?
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this account? This action
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
                disabled={loading}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-5">
            {editingId ? "Edit Staff Account" : "Create Staff Account"}
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Staff Name:
                </label>
                <input
                  type="text"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contact Number:
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Staff ID:
                </label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  placeholder="Create staff ID"
                  required
                  disabled={!!editingId}
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Position / Role:
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Enter position"
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location:
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password {editingId && "(leave blank to keep unchanged)"}:
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    editingId ? "Enter new password (optional)" : "Create password"
                  }
                  required={!editingId}
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
                disabled={loading}
                className="px-4 py-2.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">
              Staff Accounts
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {accounts.length} total accounts
            </p>
          </div>

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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-sm text-slate-500"
                    >
                      Loading.....
                    </td>
                  </tr>
                ) : accounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-sm text-slate-500"
                    >
                      No staff accounts created yet.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account) => (
                    <tr
                      key={account._id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {account.staffName}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.staffId}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.phone}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-purple-100 text-[#9333EA] rounded-md text-xs font-medium">
                          {account.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {account.location}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            className="px-3 py-1.5 bg-purple-100 text-[#9333EA] hover:bg-purple-200 rounded-md text-xs font-medium"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(account._id)}
                            className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}