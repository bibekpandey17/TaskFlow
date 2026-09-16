import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";


import ManageStaff from "./pages/ManageStaff";

import AllTasks from "./pages/AllTasks";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}

        <Route path="/login" element={<Login />} />

        {/* Redirect root to login */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />


        {/* ================= ADMIN DASHBOARD ================= */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            index
            element={<AdminDashboard />}
          />

          {/* Employee Details */}
          <Route
            path="employee-details"
            element={<EmployeeList />}
          />

          {/* Add Employee */}
          <Route
            path="employee-details/add"
            element={<AddEmployee />}
          />

          {/* Edit Employee */}
          <Route
            path="employee-details/:id/edit"
            element={<EditEmployee />}
          />

          

          {/* Manage Staff */}
          <Route
            path="manage-staff"
            element={<ManageStaff />}
          />

          

          {/* All Tasks */}
          <Route
            path="tasks"
            element={<AllTasks />}
          />

        </Route>


        {/* ================= EMPLOYEE DASHBOARD ================= */}

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />


        {/* ================= INVALID URL ================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;