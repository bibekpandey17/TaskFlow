import { useEffect, useState } from "react";

import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "../utils/storage";

export default function Projects() {

  
  // STATE
  

  const [projects, setProjects] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [filter, setFilter] = useState("All");

  // Custom success message
  const [message, setMessage] = useState("");

  // Custom delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    assignedTo: "",
    dueDate: "",
    status: "Pending",
  });


  
  // LOAD DATA
  

  useEffect(() => {
    setProjects(getProjects());
  }, []);


  // HANDLE INPUT
  

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }


  

  function showMessage(text) {
    setMessage(text);
  }


  // CLOSE MESSAGE

  function closeMessage() {
    setMessage("");
  }


    // RESET FORM

  function resetForm() {

    setFormData({
      name: "",
      assignedTo: "",
      dueDate: "",
      status: "Pending",
    });

    setEditingId(null);
    setShowForm(false);
  }


  // OPEN ADD PROJECT FORM

  function handleAddProject() {

    setEditingId(null);

    setFormData({
      name: "",
      assignedTo: "",
      dueDate: "",
      status: "Pending",
    });

    setShowForm(true);
  }

 // SUBMIT FORM

  function handleSubmit(e) {

    e.preventDefault();


    // EDIT PROJECT

    if (editingId) {

      updateProject(editingId, {
        name: formData.name,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        status: formData.status,
      });

      setProjects(getProjects());

      resetForm();

      showMessage(
        "Project changes saved successfully!"
      );
    }


     // ADD PROJECT

    else {

      addProject({
        name: formData.name,
        assignedTo: formData.assignedTo,
        dueDate: formData.dueDate,
        status: formData.status,
      });

      setProjects(getProjects());

      resetForm();

      showMessage(
        "Project added successfully!"
      );
    }
  }


  // EDIT PROJECT

  function handleEdit(project) {

    setFormData({
      name: project.name || "",

      /*
        New projects use assignedTo.

        Old projects may still have doneBy,
        so we support both.
      */
      assignedTo:
        project.assignedTo ||
        project.doneBy ||
        "",

      dueDate: project.dueDate || "",

      status:
        project.status || "Pending",
    });

    setEditingId(project.id);

    setShowForm(true);
  }


  // OPEN DELETE CONFIRMATION

  function handleDelete(id) {
    setDeleteId(id);
  }


  
  // CONFIRM DELETE

  function confirmDelete() {

    if (!deleteId) {
      return;
    }

    deleteProject(deleteId);

    setProjects(getProjects());

    setDeleteId(null);

    showMessage(
      "Project deleted successfully!"
    );
  }


  
  // CANCEL DELETE
  

  function cancelDelete() {
    setDeleteId(null);
  }


  
  // FILTER
  

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter(
          (project) =>
            project.status === filter
        );


  

  function getStatusStyle(status) {

    if (status === "Completed") {
      return "bg-green-50 text-green-600";
    }

    if (status === "In Progress") {
      return "bg-blue-50 text-blue-600";
    }

    return "bg-purple-50 text-[#9333EA]";
  }


 

  return (

    <div className="space-y-5 font-[Poppins]">


      

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-xl font-bold text-slate-800">
            Projects ({filteredProjects.length})
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Create and manage company projects.
          </p>

        </div>


        <button
          onClick={handleAddProject}
          className="bg-[#9333EA] hover:bg-[#7E22CE] text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
        >
          + Add Project
        </button>

      </div>


      

      {message && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">

          <div className="bg-white w-[400px] rounded-xl shadow-xl border border-slate-200 p-6">

            <div className="flex items-start gap-4">

              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">

                <span className="text-[#9333EA] text-lg font-bold">
                  ✓
                </span>

              </div>


              <div className="flex-1">

                <h3 className="text-base font-semibold text-slate-800">
                  Success
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {message}
                </p>

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

                <span className="text-red-600 text-lg font-bold">
                  !
                </span>

              </div>


              <div className="flex-1">

                <h3 className="text-base font-semibold text-slate-800">
                  Delete Project?
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete this
                  project? This action cannot be undone.
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


      

      <div className="flex items-center gap-6 border-b border-slate-200">

        {[
          "All",
          "Pending",
          "In Progress",
          "Completed",
        ].map((item) => (

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

        ))}

      </div>


      

      {showForm && (

        <div className="bg-white rounded-xl shadow-sm p-6">

          <h3 className="text-lg font-semibold text-slate-800 mb-5">

            {editingId
              ? "Edit Project"
              : "Add Project"}

          </h3>


          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


              

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Project Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />

              </div>


              

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Assigned To
                </label>

                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  placeholder="Enter employee name"
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />

              </div>


              {/* 
                  DUE DATE
             */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA]"
                />

              </div>


              {/* 
                  STATUS
            */}

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

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

              </div>

            </div>


            {/*
                BUTTONS
             */}

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

                {editingId
                  ? "Save Changes"
                  : "Add Project"}

              </button>

            </div>

          </form>

        </div>

      )}


     

      {!showForm && (

        <>

          {filteredProjects.length === 0 ? (

            <div className="bg-white rounded-xl shadow-sm py-12 text-center">

              <h3 className="text-base font-semibold text-slate-700">
                No projects found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Click "+ Add Project" to create your first
                project.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {filteredProjects.map((project) => (

                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow"
                >


                  {/* 
                      PROJECT HEADER
                   */}

                  <div className="flex justify-between items-start gap-4">

                    <h3 className="text-base font-semibold text-slate-800">
                      {project.name}
                    </h3>


                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>

                  </div>


                  {/* 
                      PROJECT INFO
                   */}

                  <div className="flex justify-between items-center mt-5">

                    <p className="text-sm text-slate-500">

                      Assigned to{" "}

                      <span className="text-slate-700 font-medium">

                        {project.assignedTo ||
                          project.doneBy ||
                          "Unassigned"}

                      </span>

                    </p>


                    <p className="text-sm text-slate-400">
                      Due: {project.dueDate}
                    </p>

                  </div>


                  {/* 
                      ACTIONS
                   */}

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() =>
                        handleEdit(project)
                      }
                      className="px-3 py-1.5 bg-[#9333EA] hover:bg-[#7E22CE] text-white rounded-md text-xs font-medium transition-colors"
                    >
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(project.id)
                      }
                      className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md text-xs font-medium"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </>

      )}

    </div>
  );
}