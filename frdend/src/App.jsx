import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthContext from "./Context/authContext";
import { EmployeeProvider } from "./Context/EmployeeContext.jsx";
import AdminSummery from "./components/Dashboard/AdminSummery";
import AddDepartment from "./components/Department/AddDepartment.jsx";
import DepartmentList from "./components/Department/DepartmentList.jsx";
import EditDepartment from "./components/Department/EditDepartment.jsx";
import AddEmployee from "./components/employee/Add.jsx";
import EditEmployee from "./components/employee/Edit.jsx";
import EmployeeList from "./components/employee/List.jsx";
import LeaveManagement from "./components/leave/LeaveManagement.jsx";
import Salary from "./components/employee/Salary.jsx";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx";

function App() {
  return (
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
                      Your account does not have permission for that route.
                    </p>
                  </div>
                </div>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoutes>
                  <RoleBasedRoutes requiredRole={["admin", "employee"]}>
                    <AdminDashboard />
                  </RoleBasedRoutes>
                </PrivateRoutes>
              }
            >
              <Route index element={<AdminSummery />} />
              <Route path="departments" element={<DepartmentList />} />
              <Route path="add-department" element={<AddDepartment />} />
              <Route path="department/:id" element={<EditDepartment />} />
              <Route path="add-new-employee" element={<AddEmployee />} />
              <Route path="department/employees" element={<EmployeeList />} />
              <Route path="employees/:id/edit" element={<EditEmployee />} />
              <Route path="salary" element={<Salary />} />
              <Route path="leaves" element={<LeaveManagement />} />
            </Route>

            <Route
              path="/employee-dashboard"
              element={
                <PrivateRoutes>
                  <Navigate to="/admin-dashboard/leaves" replace />
                </PrivateRoutes>
              }
            />
          </Routes>
        </AuthContext>
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
