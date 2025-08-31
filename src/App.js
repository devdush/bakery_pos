import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Screens/Dashboard";
import TestComponent from "./Screens/Dashboard/test";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLogin from "./Screens/Auth/login";
import EmployeeLayout from "./Layouts/employeeLayout";
import AdminLayout from "./Layouts/adminLayout";
import AdminDashboard from "./Screens/Admin";
import CreateCategory from "./Screens/Admin/create-category";
import CreateProduct from "./Screens/Admin/create-product";
import CreateUser from "./Screens/Admin/create-user";
import ViewReports from "./Screens/Admin/view-reports";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth">
          <Route path="login" element={<AuthLogin />} />
        </Route>
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<TestComponent />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="create-user" element={<CreateUser />} />
          <Route path="view-reports" element={<ViewReports />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
