import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthContext from "./Context/authContext";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummery from "./components/Dashboard/AdminSummery";
import DepartmentList from "./components/Department/DepartmentList";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AddDepartment from "./components/Department/AddDepartment.jsx";
import EditDepartment from "./components/Department/EditDepartment.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthContext>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />

          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoutes>
                <RoleBasedRoutes requiredRole={["admin"]}>
                  <AdminDashboard />
                </RoleBasedRoutes>
              </PrivateRoutes>
            }
          >
            <Route index element={<AdminSummery />} />
            <Route
              path="/admin-dashboard/departments"
              element={<DepartmentList />}
            />
            <Route
              path="/admin-dashboard/add-department"
              element={<AddDepartment />}
            />
            <Route
              path="/admin-dashboard/department/:id"
              element={<EditDepartment />}
            />
          </Route>
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoutes>
                <EmployeeDashboard />
              </PrivateRoutes>
            }
          />
        </Routes>
      </AuthContext>
    </BrowserRouter>
  );
}

export default App;
