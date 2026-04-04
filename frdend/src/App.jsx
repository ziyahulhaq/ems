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
import List from "./components/employee/List.jsx";
import Add from "./components/employee/Add.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { EmployeeProvider } from "./Context/EmployeeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <EmployeeProvider>
        <BrowserRouter>
          <AuthContext>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/unauthorized"
                element={
                  <div className="status-screen">
                    <div className="status-screen__panel">
                      <p className="status-screen__eyebrow">Access blocked</p>
                      <h1 className="status-screen__title">Unauthorized</h1>
                      <p className="status-screen__text">
                        Your role does not have clearance for this route. Log in with
                        the right account or head back to your allowed dashboard.
                      </p>
                    </div>
                  </div>
                }
              />

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
                <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
                <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
                <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
                <Route path="/admin-dashboard/add-new-employee" element={<Add />} />
                <Route path="/admin-dashboard/department/employees" element={<List />} />
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
      </EmployeeProvider>
    </ThemeProvider>
  );
}

export default App;
