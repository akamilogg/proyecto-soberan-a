import { a as useNavigate, b as useProtocolStats, c as useTasks, d as useRegisterWorker, j as jsxRuntimeExports, e as ue, f as formatTimestamp, t as truncatePrincipal, g as getTaskStatusLabel } from "./index-DVlwnvdG.js";
function StatCard({ label, value, ocid }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "crt-border bg-card p-4 flex flex-col gap-2 relative overflow-hidden",
      "data-ocid": ocid,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 left-1.5 text-muted-foreground text-xs select-none leading-none", children: "┌" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-1 right-1.5 text-muted-foreground text-xs select-none leading-none", children: "┐" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 left-1.5 text-muted-foreground text-xs select-none leading-none", children: "└" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-1 right-1.5 text-muted-foreground text-xs select-none leading-none", children: "┘" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "terminal-dim text-[10px] tracking-widest uppercase font-mono px-1", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary crt-glow text-3xl font-mono font-bold tracking-tight px-1", children: value })
      ]
    }
  );
}
function StatusBadge({ status }) {
  const label = getTaskStatusLabel(status);
  const classes = {
    ACTIVE: "text-primary crt-glow border border-primary/60 bg-primary/10",
    PENDING: "text-secondary crt-glow-amber border border-secondary/60 bg-secondary/10",
    COMPLETED: "text-muted-foreground border border-border bg-muted/40",
    CANCELLED: "text-destructive border border-destructive/60 bg-destructive/10",
    UNKNOWN: "text-muted-foreground border border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-block font-mono text-[10px] tracking-widest px-2 py-0.5 ${classes[label] ?? classes.UNKNOWN}`,
      children: label
    }
  );
}
function TaskRow({
  task,
  index,
  onClick
}) {
  const shortId = task.id.length > 12 ? `${task.id.slice(0, 10)}…` : task.id;
  const progress = `${String(task.currentGeneration)}/${String(task.totalGenerations)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "terminal-row-hover cursor-pointer border-b border-border/40 transition-smooth",
      onClick: () => onClick(task.id),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") onClick(task.id);
      },
      tabIndex: 0,
      "data-ocid": `tasks.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-mono text-xs text-muted-foreground tracking-wider", children: shortId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: task.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-mono text-xs text-foreground tracking-wider", children: progress }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-mono text-[10px] text-muted-foreground tracking-wider whitespace-nowrap", children: formatTimestamp(task.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2.5 px-3 font-mono text-[10px] text-muted-foreground tracking-wider hidden sm:table-cell", children: truncatePrincipal(task.createdBy) })
      ]
    }
  );
}
function Dashboard() {
  var _a;
  const navigate = useNavigate();
  const statsQuery = useProtocolStats();
  const tasksQuery = useTasks();
  const registerWorker = useRegisterWorker();
  const stats = statsQuery.data;
  const allTasks = tasksQuery.data ?? [];
  const recentTasks = allTasks.slice(-5).reverse();
  const isLoading = statsQuery.isLoading || tasksQuery.isLoading;
  const error = statsQuery.error ?? tasksQuery.error;
  function handleRowClick(taskId) {
    void navigate({ to: "/tasks/$taskId", params: { taskId } });
  }
  function handleLaunchTask() {
    void navigate({ to: "/tasks/new" });
  }
  async function handleRegisterWorker() {
    try {
      await registerWorker.mutateAsync();
      ue.success("WORKER REGISTERED", {
        description: "Your node has joined the training network.",
        className: "font-mono text-xs tracking-wider"
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      ue.error("REGISTRATION FAILED", {
        description: msg,
        className: "font-mono text-xs tracking-wider"
      });
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-64 gap-4",
        "data-ocid": "dashboard.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-primary crt-glow tracking-widest cursor-blink", children: "LOADING" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "terminal-dim font-mono text-xs tracking-widest", children: "CONNECTING TO CANISTER..." })
        ]
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-start gap-3 p-6 crt-border bg-card max-w-2xl",
        "data-ocid": "dashboard.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-secondary crt-glow-amber tracking-widest", children: "!! CONNECTION ERROR" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground tracking-wide", children: error instanceof Error ? error.message : String(error) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "terminal-dim font-mono text-[10px] tracking-widest", children: "RETRY: RELOAD THE PAGE OR CHECK CANISTER STATUS" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8 font-mono", "data-ocid": "dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "terminal-dim text-[10px] tracking-widest uppercase", children: "PROYECTO SOBERANÍA // PROTOCOL DASHBOARD" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary crt-glow text-xl font-bold tracking-widest", children: "> SYSTEM STATUS" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-3",
        "data-ocid": "dashboard.stats.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "CURRENT GENERATION",
              value: stats ? String(stats.currentGeneration).padStart(4, "0") : "—",
              ocid: "dashboard.stat.generation"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "ACTIVE WORKERS",
              value: stats ? String(stats.activeWorkers) : "—",
              ocid: "dashboard.stat.active_workers"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "PENDING TASKS",
              value: stats ? String(stats.pendingTasks) : "—",
              ocid: "dashboard.stat.pending_tasks"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "COMPLETED TASKS",
              value: stats ? String(stats.completedTasks) : "—",
              ocid: "dashboard.stat.completed_tasks"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col gap-3",
        "data-ocid": "dashboard.tasks.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-primary tracking-widest text-sm", children: [
              "> RECENT TASKS",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "terminal-dim text-xs", children: [
                "[",
                recentTasks.length,
                " / 5]"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "terminal-dim text-[10px] tracking-widest hidden sm:block", children: "─────────────────────" })
          ] }),
          recentTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "crt-border bg-card p-6",
              "data-ocid": "dashboard.tasks.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest cursor-blink", children: "> NO ACTIVE TASKS FOUND" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "terminal-dim text-[10px] tracking-widest mt-2", children: "LAUNCH A TASK TO BEGIN TRAINING" })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crt-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", "data-ocid": "dashboard.tasks.table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/60", children: ["TASK ID", "STATUS", "GEN", "CREATED", "LAUNCHED BY"].map(
              (h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "th",
                {
                  className: `py-2 px-3 text-left text-[10px] terminal-dim tracking-widest uppercase${i === 4 ? " hidden sm:table-cell" : ""}`,
                  children: h
                },
                h
              )
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recentTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              TaskRow,
              {
                task,
                index: i + 1,
                onClick: handleRowClick
              },
              task.id
            )) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "flex flex-col gap-3",
        "data-ocid": "dashboard.actions.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-primary tracking-widest text-sm", children: "> QUICK ACTIONS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "terminal-dim text-[10px] tracking-widest hidden sm:block", children: "─────────────────────" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleLaunchTask,
                className: "crt-border bg-card px-6 py-3 text-xs text-primary crt-glow tracking-widest hover:bg-primary/10 transition-smooth text-left",
                "data-ocid": "dashboard.launch_task.primary_button",
                children: "> LAUNCH NEW TASK"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleRegisterWorker,
                disabled: registerWorker.isPending,
                className: "crt-border bg-card px-6 py-3 text-xs text-secondary crt-glow-amber tracking-widest hover:bg-secondary/10 transition-smooth text-left disabled:opacity-50 disabled:cursor-not-allowed",
                "data-ocid": "dashboard.register_worker.secondary_button",
                children: registerWorker.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "> REGISTERING" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "> REGISTER AS WORKER" })
              }
            )
          ] }),
          registerWorker.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-[10px] text-primary tracking-widest",
              "data-ocid": "dashboard.register_worker.success_state",
              children: "✓ NODE REGISTERED SUCCESSFULLY"
            }
          ),
          registerWorker.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-[10px] text-secondary crt-glow-amber tracking-widest",
              "data-ocid": "dashboard.register_worker.error_state",
              children: [
                "!! ",
                ((_a = registerWorker.error) == null ? void 0 : _a.message) ?? "REGISTRATION FAILED"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-bar flex items-center justify-between mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "terminal-dim", children: [
        "TOTAL WORKERS: ",
        stats ? String(stats.totalWorkers) : "—"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "terminal-dim", children: "POLL INTERVAL: 5s" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/60 animate-flicker", children: "● LIVE" })
    ] })
  ] });
}
export {
  Dashboard as default
};
