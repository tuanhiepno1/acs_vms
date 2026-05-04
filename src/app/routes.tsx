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
import { RealTimeEvents } from "./pages/RealTimeEvents";
import { Occupancy } from "./pages/Occupancy";
import { Rules } from "./pages/Rules";
import { Groups } from "./pages/Groups";
import { Schedules } from "./pages/Schedules";
import { Events } from "./pages/Events";
import { System } from "./pages/System";
import { NotFound } from "./pages/NotFound";
import { DoorControl } from "./pages/DoorControl";
import { UserDetail } from "./pages/UserDetail";
import { GroupDetail } from "./pages/GroupDetail";
import { DeviceDetail } from "./pages/DeviceDetail";
import Login from "./pages/Login";

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
      { path: "real-time-events", Component: RealTimeEvents },
      { path: "users", Component: UserManagement },
      { path: "users/:id", Component: UserDetail },
      // Group section
      { path: "groups", Component: Groups },
      { path: "groups/:id", Component: GroupDetail },
      { path: "groups/user", Component: Groups },
      { path: "groups/device", Component: Groups },
      { path: "groups/ta", Component: Groups },
      { path: "groups/access", Component: Groups },
      { path: "schedules", Component: Schedules },
      // Device section
      { path: "devices", Component: Devices },
      { path: "devices/:id", Component: DeviceDetail },
      { path: "emergency-control", Component: Devices },
      // Door section
      { path: "doors", Component: DoorControl },
      // Event section - consolidated into Events page with tabs
      { path: "events", Component: Events },
      { path: "events/rules", Component: Events },
      { path: "events/actions", Component: Events },
      { path: "events/action-logs", Component: Events },
      // Log section
      { path: "logs/device", Component: LogManagement },
      { path: "logs/door", Component: LogManagement },
      { path: "logs/emergency", Component: LogManagement },
      { path: "logs/authentication", Component: LogManagement },
      { path: "logs/ta", Component: LogManagement },
      // Occupancy section
      { path: "occupancy", Component: Occupancy },
      // System section - consolidated into System page with tabs
      { path: "system", Component: System },
      { path: "audit-log", Component: System },
      { path: "settings", Component: System },
      { path: "accounts", Component: System },
      { path: "remote-management", Component: System },
      // Legacy routes (redirects)
      { path: "logs", Component: LogManagement },
      { path: "rules", Component: Rules },
      { path: "branches", Component: Branches },
      { path: "reports", Component: Reports },
      { path: "*", Component: NotFound },
    ],
  },
  {
    path: "*",
    element: <RequireAuth><NotFound /></RequireAuth>,
  },
]);
