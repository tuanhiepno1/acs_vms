import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";
import { Dashboard } from "./pages/Dashboard";
import { UserManagement } from "./pages/UserManagement";
import { LogManagement } from "./pages/LogManagement";
import { Devices } from "./pages/Devices";
import { Branches } from "./pages/Branches";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";
import Login from "./pages/Login";
import ModuleHub from "./pages/ModuleHub";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <RequireAuth><ModuleHub /></RequireAuth>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/acs",
    element: <RequireAuth><Layout /></RequireAuth>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: UserManagement },
      { path: "devices", Component: Devices },
      { path: "logs", Component: LogManagement },
      { path: "branches", Component: Branches },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "*",
    element: <RequireAuth><NotFound /></RequireAuth>,
  },
]);
