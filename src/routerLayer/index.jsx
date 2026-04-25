import { createBrowserRouter, Outlet } from "react-router-dom";
import RequireAuth, { requireDataLoader } from "../componentLayer/pages/layout/RequireAuth";

import DashboardRoutes from "./dashboard/DashboardRoutes";
import RouteBlocker from "../rbac/RouteBlocker";
import UserRoutes from "./users/UserRoutes";
import StudentRoutes from "./students/StudentRoutes";
import BatchManagementRoutes from "./batchmanagement/BatchManagementRoutes";
import ReportsRoutes from "./reports/ReportsRoutes";
import SettingsRoutes from "./settings/SettingsRoutes";
import PublicLayout from "../componentLayer/pages/layout/PublicLayout";
import InternalServer from "../componentLayer/pages/Error/InternalServer";
import UnauthorisedAccess from "../componentLayer/pages/Error/UnauthorisedAccess";
import AuthRoutes from "./auth/AuthRoutes";
import ErrorBoundary from "../componentLayer/pages/Error/ErrorBoundary";
import ProfileView, { profileViewLoader } from "../componentLayer/pages/users/ProfileView";
import TicketsRoute from "./tickets/TicktesRoute";
import ExamsRoutes from "./exams/ExamsRoutes"

const router = createBrowserRouter([
    {
        path: "/",
        element: <RequireAuth />,
        loader: requireDataLoader,
        ErrorBoundary: ErrorBoundary,
        children: [
            {
                path: "/",
                element: (
                    <RouteBlocker requiredModule="Dashboard" requiredPermission="all" />
                ),
                element:<Outlet/>,
                children: [...DashboardRoutes],
            },
            {
                path: "user/profileview/:id",
                loader:profileViewLoader,
                element: <ProfileView />
            },
            {
                path: "user",
                element: (
                    <RouteBlocker requiredModule="User Mangement" requiredPermission="all" />
                ),
                children: [...UserRoutes],
            },
            {
                path: "exam",
                element: (
                    <RouteBlocker requiredModule="Exam Mangement" requiredPermission="all" />
                ),
                children: [...ExamsRoutes],
            },
            {
                path: "tickets",
                element: (
                    <RouteBlocker requiredModule="Tickets Mangement" requiredPermission="all" />
                ),
                children: [...TicketsRoute],
            },
            {
                path: "student",
                element: (
                    <RouteBlocker requiredModule="Student Management" requiredPermission="all" />
                ),
                children: [...StudentRoutes],
            },

            {
                path: "batchmanagement",
                element: (
                    <RouteBlocker requiredModule="Batch Management" requiredPermission="all" />
                ),
                children: [...BatchManagementRoutes],
            },

            {
                path: "reports",
                element: (
                    <RouteBlocker requiredModule="Reports" requiredPermission="all" />
                ),
                children: [...ReportsRoutes],
            },

            {
                path: "settings",
                element: (
                    <RouteBlocker requiredModule="Settings" requiredPermission="all" />
                ),
                children: [...SettingsRoutes],
            },
        ],
    },
    {
        path: "/",
        element: <PublicLayout />,

        children: [
            {
                path: "auth",
                element: <Outlet />,
                children: [...AuthRoutes],
            },
            { path: '500', element: <InternalServer /> },
            { path: '422', element: <UnauthorisedAccess /> },
        ],
    },
]);

export default router;