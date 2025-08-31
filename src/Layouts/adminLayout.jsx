import * as React from "react";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
const NAVIGATION = [
  {
    segment: "admin/admin-dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "admin/create-category",
    title: "Create Category",
    icon: <CategoryIcon />,
  },
  {
    segment: "admin/create-product",
    title: "Create Product",
    icon: <InventoryIcon />,
  },
  {
    segment: "admin/create-user",
    title: "Create User",
    icon: <PersonIcon />,
  },
  {
    segment: "admin/view-reports",
    title: "View Reports",
    icon: <AssessmentIcon />,
  },
  {
    segment: "admin/logout",
    title: "Logout",
    icon: <LogoutIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
    },
  },
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

const AdminLayout = () => {
  const [pathname, setPathname] = React.useState("/dashboard");

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        logo: "",
        title: "ADMIN DASHBOARD",
      }}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AppProvider>
  );
};

export default AdminLayout;
