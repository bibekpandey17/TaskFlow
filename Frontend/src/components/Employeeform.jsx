import { useState } from "react";

const departments = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "Cloud Solutions",
  "Graphic Design",
  "AI/ML",
];

const initialState = {
  name: "",
  email: "",
  phone: "",
  department: departments[0],
  position: "",
  joinDate: "",
  status: "Active",
};

export default function EmployeeForm({
  initialValues,
  onSubmit,
  submitLabel = "Add Employee",
}) {
  const [values, setValues] = useState(
    initialValues || initialState
  );

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error when user starts correcting the field
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!values.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!values.position.trim()) {
      newErrors.position = "Position is required.";
    }

    if (!values.joinDate) {
      newErrors.joinDate = "Join date is required.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(values);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 max-w-2xl"
    >

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Enter full name"
          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {errors.name && (
          <p className="text-red-600 text-xs mt-1">
            {errors.name}
          </p>
        )}
      </div>


      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="employee@example.com"
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.email && (
            <p className="text-red-600 text-xs mt-1">
              {errors.email}
            </p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>

          <input
            type="text"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            placeholder="98XXXXXXXX"
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">
              {errors.phone}
            </p>
          )}
        </div>

      </div>


      {/* Department + Position */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department
          </label>

          <select
            name="department"
            value={values.department}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map((department) => (
              <option
                key={department}
                value={department}
              >
                {department}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Position
          </label>

          <input
            type="text"
            name="position"
            value={values.position}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.position && (
            <p className="text-red-600 text-xs mt-1">
              {errors.position}
            </p>
          )}
        </div>

      </div>


      {/* Join Date + Status */}
      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Join Date
          </label>

          <input
            type="date"
            name="joinDate"
            value={values.joinDate}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.joinDate && (
            <p className="text-red-600 text-xs mt-1">
              {errors.joinDate}
            </p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>

          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Active">
              Active
            </option>

            <option value="On Leave">
              On Leave
            </option>
          </select>
        </div>

      </div>


      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-md transition-colors"
        >
          {submitLabel}
        </button>

      </div>

    </form>
  );
}