import { c as useTasks, j as jsxRuntimeExports, L as Link, P as Plus, g as getTaskStatusLabel, f as formatTimestamp } from "./index-DVlwnvdG.js";
import { S as Skeleton } from "./skeleton-l1qUmVfh.js";
const TASK_SKELETONS = ["t1", "t2", "t3", "t4", "t5"];
function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 font-mono", "data-ocid": "tasks.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border pb-4 flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: "┌─ TRAINING OPERATIONS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary crt-glow text-xl font-bold tracking-widest mt-1", children: "TASKS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: "└──────────────────────" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/tasks/new",
          className: "flex items-center gap-2 px-4 py-2 text-xs tracking-widest border border-primary text-primary hover:bg-primary/10 hover:crt-glow transition-smooth",
          "data-ocid": "tasks.new_task_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
            "NEW TASK"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card", "data-ocid": "tasks.list", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border grid grid-cols-12 gap-2 text-xs text-muted-foreground tracking-widest", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5", children: "TASK ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: "STATUS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "GENERATION" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-right", children: "CREATED" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: isLoading ? TASK_SKELETONS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-full bg-muted" }) }, k)) : !tasks || tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "px-4 py-12 text-center",
          "data-ocid": "tasks.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm tracking-wide", children: "NO TASKS FOUND" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1 tracking-wide", children: "Launch your first fine-tuning task to begin." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/tasks/new",
                className: "mt-4 inline-block text-primary text-xs hover:crt-glow transition-smooth border border-primary px-4 py-2 tracking-widest",
                "data-ocid": "tasks.create_first_task_button",
                children: "► LAUNCH TASK"
              }
            )
          ]
        }
      ) : tasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/tasks/$taskId",
          params: { taskId: task.id },
          className: "px-4 py-3 grid grid-cols-12 gap-2 items-center terminal-row-hover transition-smooth group",
          "data-ocid": `tasks.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5 text-primary text-xs truncate tracking-wide group-hover:crt-glow font-mono", children: task.id }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `col-span-2 text-xs tracking-widest ${"Active" in task.status ? "text-primary crt-glow" : "Completed" in task.status ? "text-secondary" : "Cancelled" in task.status ? "text-destructive" : "text-muted-foreground"}`,
                children: getTaskStatusLabel(task.status)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-2 text-muted-foreground text-xs text-right", children: [
              task.currentGeneration.toString(),
              "/",
              task.totalGenerations.toString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-muted-foreground text-xs text-right truncate", children: formatTimestamp(task.createdAt) })
          ]
        },
        task.id
      )) })
    ] })
  ] });
}
export {
  Tasks as default
};
