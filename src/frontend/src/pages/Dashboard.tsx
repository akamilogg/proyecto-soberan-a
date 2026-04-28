import {
  useProtocolStats,
  useRegisterWorker,
  useTasks,
} from "@/hooks/use-backend";
import {
  formatTimestamp,
  getTaskStatusLabel,
  truncatePrincipal,
} from "@/types";
import type { Task, TaskStatus } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

// ── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  ocid: string;
}

function StatCard({ label, value, ocid }: StatCardProps) {
  return (
    <div
      className="crt-border bg-card p-4 flex flex-col gap-2 relative overflow-hidden"
      data-ocid={ocid}
    >
      <span className="absolute top-1 left-1.5 text-muted-foreground text-xs select-none leading-none">
        ┌
      </span>
      <span className="absolute top-1 right-1.5 text-muted-foreground text-xs select-none leading-none">
        ┐
      </span>
      <span className="absolute bottom-1 left-1.5 text-muted-foreground text-xs select-none leading-none">
        └
      </span>
      <span className="absolute bottom-1 right-1.5 text-muted-foreground text-xs select-none leading-none">
        ┘
      </span>
      <p className="terminal-dim text-[10px] tracking-widest uppercase font-mono px-1">
        {label}
      </p>
      <p className="text-primary crt-glow text-3xl font-mono font-bold tracking-tight px-1">
        {value}
      </p>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TaskStatus }) {
  const label = getTaskStatusLabel(status);
  const classes: Record<string, string> = {
    ACTIVE: "text-primary crt-glow border border-primary/60 bg-primary/10",
    PENDING:
      "text-secondary crt-glow-amber border border-secondary/60 bg-secondary/10",
    COMPLETED: "text-muted-foreground border border-border bg-muted/40",
    CANCELLED:
      "text-destructive border border-destructive/60 bg-destructive/10",
    UNKNOWN: "text-muted-foreground border border-border",
  };
  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-widest px-2 py-0.5 ${classes[label] ?? classes.UNKNOWN}`}
    >
      {label}
    </span>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  index,
  onClick,
}: { task: Task; index: number; onClick: (id: string) => void }) {
  const shortId = task.id.length > 12 ? `${task.id.slice(0, 10)}…` : task.id;
  const progress = `${String(task.currentGeneration)}/${String(task.totalGenerations)}`;

  return (
    <tr
      className="terminal-row-hover cursor-pointer border-b border-border/40 transition-smooth"
      onClick={() => onClick(task.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(task.id);
      }}
      tabIndex={0}
      data-ocid={`tasks.item.${index}`}
    >
      <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground tracking-wider">
        {shortId}
      </td>
      <td className="py-2.5 px-3">
        <StatusBadge status={task.status} />
      </td>
      <td className="py-2.5 px-3 font-mono text-xs text-foreground tracking-wider">
        {progress}
      </td>
      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground tracking-wider whitespace-nowrap">
        {formatTimestamp(task.createdAt)}
      </td>
      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground tracking-wider hidden sm:table-cell">
        {truncatePrincipal(task.createdBy)}
      </td>
    </tr>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const statsQuery = useProtocolStats();
  const tasksQuery = useTasks();
  const registerWorker = useRegisterWorker();

  const stats = statsQuery.data;
  const allTasks = tasksQuery.data ?? [];
  const recentTasks = allTasks.slice(-5).reverse();

  const isLoading = statsQuery.isLoading || tasksQuery.isLoading;
  const error = statsQuery.error ?? tasksQuery.error;

  function handleRowClick(taskId: string) {
    void navigate({ to: "/tasks/$taskId", params: { taskId } });
  }

  function handleLaunchTask() {
    void navigate({ to: "/tasks/new" });
  }

  async function handleRegisterWorker() {
    try {
      await registerWorker.mutateAsync();
      toast.success("WORKER REGISTERED", {
        description: "Your node has joined the training network.",
        className: "font-mono text-xs tracking-wider",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("REGISTRATION FAILED", {
        description: msg,
        className: "font-mono text-xs tracking-wider",
      });
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-64 gap-4"
        data-ocid="dashboard.loading_state"
      >
        <p className="font-mono text-sm text-primary crt-glow tracking-widest cursor-blink">
          LOADING
        </p>
        <p className="terminal-dim font-mono text-xs tracking-widest">
          CONNECTING TO CANISTER...
        </p>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        className="flex flex-col items-start gap-3 p-6 crt-border bg-card max-w-2xl"
        data-ocid="dashboard.error_state"
      >
        <p className="font-mono text-sm text-secondary crt-glow-amber tracking-widest">
          !! CONNECTION ERROR
        </p>
        <p className="font-mono text-xs text-muted-foreground tracking-wide">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <p className="terminal-dim font-mono text-[10px] tracking-widest">
          RETRY: RELOAD THE PAGE OR CHECK CANISTER STATUS
        </p>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8 font-mono" data-ocid="dashboard.page">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-border pb-4">
        <p className="terminal-dim text-[10px] tracking-widest uppercase">
          {"PROYECTO SOBERANÍA // PROTOCOL DASHBOARD"}
        </p>
        <h1 className="text-primary crt-glow text-xl font-bold tracking-widest">
          &gt; SYSTEM STATUS
        </h1>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="dashboard.stats.section"
      >
        <StatCard
          label="CURRENT GENERATION"
          value={stats ? String(stats.currentGeneration).padStart(4, "0") : "—"}
          ocid="dashboard.stat.generation"
        />
        <StatCard
          label="ACTIVE WORKERS"
          value={stats ? String(stats.activeWorkers) : "—"}
          ocid="dashboard.stat.active_workers"
        />
        <StatCard
          label="PENDING TASKS"
          value={stats ? String(stats.pendingTasks) : "—"}
          ocid="dashboard.stat.pending_tasks"
        />
        <StatCard
          label="COMPLETED TASKS"
          value={stats ? String(stats.completedTasks) : "—"}
          ocid="dashboard.stat.completed_tasks"
        />
      </section>

      {/* ── Recent Tasks ─────────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3"
        data-ocid="dashboard.tasks.panel"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-primary tracking-widest text-sm">
            &gt; RECENT TASKS{" "}
            <span className="terminal-dim text-xs">
              [{recentTasks.length} / 5]
            </span>
          </h2>
          <span className="terminal-dim text-[10px] tracking-widest hidden sm:block">
            ─────────────────────
          </span>
        </div>

        {recentTasks.length === 0 ? (
          <div
            className="crt-border bg-card p-6"
            data-ocid="dashboard.tasks.empty_state"
          >
            <p className="text-muted-foreground text-xs tracking-widest cursor-blink">
              &gt; NO ACTIVE TASKS FOUND
            </p>
            <p className="terminal-dim text-[10px] tracking-widest mt-2">
              LAUNCH A TASK TO BEGIN TRAINING
            </p>
          </div>
        ) : (
          <div className="crt-border bg-card overflow-x-auto">
            <table className="w-full" data-ocid="dashboard.tasks.table">
              <thead>
                <tr className="border-b border-border/60">
                  {["TASK ID", "STATUS", "GEN", "CREATED", "LAUNCHED BY"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`py-2 px-3 text-left text-[10px] terminal-dim tracking-widest uppercase${i === 4 ? " hidden sm:table-cell" : ""}`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((task, i) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={i + 1}
                    onClick={handleRowClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3"
        data-ocid="dashboard.actions.panel"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-primary tracking-widest text-sm">
            &gt; QUICK ACTIONS
          </h2>
          <span className="terminal-dim text-[10px] tracking-widest hidden sm:block">
            ─────────────────────
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleLaunchTask}
            className="crt-border bg-card px-6 py-3 text-xs text-primary crt-glow tracking-widest hover:bg-primary/10 transition-smooth text-left"
            data-ocid="dashboard.launch_task.primary_button"
          >
            &gt; LAUNCH NEW TASK
          </button>

          <button
            type="button"
            onClick={handleRegisterWorker}
            disabled={registerWorker.isPending}
            className="crt-border bg-card px-6 py-3 text-xs text-secondary crt-glow-amber tracking-widest hover:bg-secondary/10 transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed"
            data-ocid="dashboard.register_worker.secondary_button"
          >
            {registerWorker.isPending ? (
              <span className="cursor-blink">&gt; REGISTERING</span>
            ) : (
              <>&gt; REGISTER AS WORKER</>
            )}
          </button>
        </div>

        {registerWorker.isSuccess && (
          <p
            className="text-[10px] text-primary tracking-widest"
            data-ocid="dashboard.register_worker.success_state"
          >
            ✓ NODE REGISTERED SUCCESSFULLY
          </p>
        )}
        {registerWorker.isError && (
          <p
            className="text-[10px] text-secondary crt-glow-amber tracking-widest"
            data-ocid="dashboard.register_worker.error_state"
          >
            !! {registerWorker.error?.message ?? "REGISTRATION FAILED"}
          </p>
        )}
      </section>

      {/* Status bar */}
      <div className="status-bar flex items-center justify-between mt-2">
        <span className="terminal-dim">
          TOTAL WORKERS: {stats ? String(stats.totalWorkers) : "—"}
        </span>
        <span className="terminal-dim">POLL INTERVAL: 5s</span>
        <span className="text-primary/60 animate-flicker">● LIVE</span>
      </div>
    </div>
  );
}
