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
import { AuditLog } from "./pages/AuditLog";
import { LiveActivity } from "./pages/LiveActivity";
import { Occupancy } from "./pages/Occupancy";
import { Rules } from "./pages/Rules";
import { Groups } from "./pages/Groups";
import { Schedules } from "./pages/Schedules";
import { NotFound } from "./pages/NotFound";
import { ComingSoon } from "./pages/ComingSoon";
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
    element: <RequireAuth><Layout /></RequireAuth>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: UserManagement },
      { path: "groups", Component: Groups },
      { path: "devices", Component: Devices },
      { path: "logs", Component: LogManagement },
      { path: "audit-log", Component: AuditLog },
      { path: "live-activity", Component: LiveActivity },
      { path: "occupancy", Component: Occupancy },
      { path: "rules", Component: Rules },
      { path: "schedules", Component: Schedules },
      { path: "branches", Component: Branches },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
  // Temporarily disabled VMS and Hub Model
  // {
  //   path: "/hub",
  //   element: <RequireAuth><ModuleHub /></RequireAuth>,
  //   errorElement: <RouteErrorBoundary />,
  // },
  // {
  //   path: "/vms",
  //   element: <RequireAuth><ComingSoon /></RequireAuth>,
  //   errorElement: <RouteErrorBoundary />,
  // },
  {
    path: "*",
    element: <RequireAuth><NotFound /></RequireAuth>,
  },
]);
