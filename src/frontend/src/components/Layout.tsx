import { useProtocolStats } from "@/hooks/use-backend";
import { truncatePrincipal } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Archive,
  ChevronRight,
  Cpu,
  LayoutDashboard,
  LogOut,
  Plus,
  Wifi,
  WifiOff,
} from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "DASHBOARD",
    icon: LayoutDashboard,
    ocid: "nav.dashboard_link",
  },
  { to: "/tasks", label: "TASKS", icon: Activity, ocid: "nav.tasks_link" },
  {
    to: "/tasks/new",
    label: "NEW TASK",
    icon: Plus,
    ocid: "nav.new_task_link",
  },
  { to: "/workers", label: "WORKERS", icon: Cpu, ocid: "nav.workers_link" },
  {
    to: "/artifacts",
    label: "ARTIFACTS",
    icon: Archive,
    ocid: "nav.artifacts_link",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { identity, clear, isAuthenticated } = useInternetIdentity();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: stats } = useProtocolStats();

  const principal = identity?.getPrincipal();
  const principalText = principal ? truncatePrincipal(principal) : "ANONYMOUS";

  return (
    <div className="flex flex-col h-screen bg-background font-mono overflow-hidden animate-terminal-boot">
      {/* Top status bar */}
      <header
        className="flex items-center justify-between px-4 py-2 bg-card border-b border-border shrink-0"
        data-ocid="layout.header"
      >
        <div className="flex items-center gap-3">
          <span className="text-primary crt-glow text-xs tracking-widest font-bold uppercase">
            ┌─[ PROYECTO SOBERANÍA ]
          </span>
          {stats && (
            <span className="text-muted-foreground text-xs tracking-wide">
              GEN:{stats.currentGeneration.toString().padStart(4, "0")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span
            className={`flex items-center gap-1.5 ${isAuthenticated ? "text-primary crt-glow" : "text-muted-foreground"}`}
            data-ocid="layout.connection_status"
          >
            {isAuthenticated ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            {isAuthenticated ? "CONNECTED" : "OFFLINE"}
          </span>
          {isAuthenticated && (
            <>
              <span
                className="text-muted-foreground tracking-wider"
                data-ocid="layout.principal_display"
              >
                {principalText}
              </span>
              <button
                type="button"
                onClick={clear}
                className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-smooth hover:crt-glow"
                aria-label="Logout"
                data-ocid="layout.logout_button"
              >
                <LogOut className="w-3 h-3" />
                <span>LOGOUT</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar navigation */}
        <nav
          className="w-52 shrink-0 bg-card border-r border-border flex flex-col py-4 overflow-y-auto"
          data-ocid="layout.sidebar"
          aria-label="Main navigation"
        >
          <div className="px-3 mb-4">
            <p className="text-muted-foreground text-xs tracking-widest mb-1">
              ┌─────────────────
            </p>
            <p className="text-muted-foreground text-xs tracking-widest">
              │ NAVIGATION
            </p>
            <p className="text-muted-foreground text-xs tracking-widest">
              └─────────────────
            </p>
          </div>
          <ul className="flex flex-col gap-0.5 px-2 flex-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/dashboard"
                  ? currentPath === "/dashboard"
                  : currentPath.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 text-xs tracking-widest transition-smooth group ${
                      isActive
                        ? "crt-active crt-border-active"
                        : "text-muted-foreground hover:text-primary border border-transparent hover:border-border"
                    }`}
                    data-ocid={item.ocid}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      className={
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary transition-smooth"
                      }
                    >
                      {isActive ? "►" : "·"}
                    </span>
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="min-w-0 truncate">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Stats mini-panel */}
          {stats && (
            <div
              className="px-3 mt-4 pt-4 border-t border-border"
              data-ocid="layout.stats_panel"
            >
              <p className="text-muted-foreground text-xs tracking-widest mb-2">
                ┌─ PROTOCOL STATS
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WORKERS</span>
                  <span className="text-primary">
                    {stats.activeWorkers.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PENDING</span>
                  <span className="text-secondary">
                    {stats.pendingTasks.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DONE</span>
                  <span className="text-primary">
                    {stats.completedTasks.toString()}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-xs tracking-widest mt-2">
                └─────────────────
              </p>
            </div>
          )}
        </nav>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="layout.main_content"
        >
          <div className="min-h-full p-6">{children}</div>
        </main>
      </div>

      {/* Bottom status bar */}
      <footer
        className="status-bar flex items-center justify-between shrink-0"
        data-ocid="layout.footer"
      >
        <span className="text-muted-foreground">
          © {new Date().getFullYear()} — Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:crt-glow transition-smooth"
          >
            caffeine.ai
          </a>
        </span>
        <span className="text-muted-foreground tracking-widest">
          ICP MAINNET · SOBERANÍA PROTOCOL v0.1.0
        </span>
      </footer>
    </div>
  );
}
