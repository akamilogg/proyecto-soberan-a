import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Tasks = lazy(() => import("@/pages/Tasks"));
const NewTask = lazy(() => import("@/pages/NewTask"));
const TaskDetail = lazy(() => import("@/pages/TaskDetail"));
const Workers = lazy(() => import("@/pages/Workers"));
const Artifacts = lazy(() => import("@/pages/Artifacts"));

// Loading fallback with terminal aesthetic
function TerminalLoading() {
  return (
    <div className="flex items-center justify-center min-h-64 font-mono">
      <div className="text-primary crt-glow text-sm tracking-widest cursor-blink">
        LOADING
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedLayout() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="font-mono text-primary crt-glow tracking-widest cursor-blink text-sm">
          AUTHENTICATING
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Suspense fallback={<TerminalLoading />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}

// Route definitions
const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => {
    const { isAuthenticated, isInitializing } = useInternetIdentity();
    if (isInitializing) return null;
    return isAuthenticated ? (
      <Navigate to="/dashboard" />
    ) : (
      <Navigate to="/login" />
    );
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<TerminalLoading />}>
      <Login />
    </Suspense>
  ),
});

// Protected layout route
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: Dashboard,
});

const tasksRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/tasks",
  component: Tasks,
});

const newTaskRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/tasks/new",
  component: NewTask,
});

const taskDetailRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/tasks/$taskId",
  component: TaskDetail,
});

const workersRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/workers",
  component: Workers,
});

const artifactsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/artifacts",
  component: Artifacts,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    tasksRoute,
    newTaskRoute,
    taskDetailRoute,
    workersRoute,
    artifactsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
