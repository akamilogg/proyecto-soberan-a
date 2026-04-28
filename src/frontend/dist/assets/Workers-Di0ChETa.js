import { v as useWorkers, d as useRegisterWorker, u as useInternetIdentity, j as jsxRuntimeExports, t as truncatePrincipal, w as getWorkerStatusLabel, f as formatTimestamp, e as ue } from "./index-DVlwnvdG.js";
import { B as Button } from "./button-zrSAMkkb.js";
import { S as Skeleton } from "./skeleton-l1qUmVfh.js";
const SKELETONS = [1, 2, 3, 4, 5];
function eloColor(elo) {
  if (elo >= 1200) return "text-primary crt-glow";
  if (elo >= 1e3) return "crt-glow-amber text-secondary";
  return "text-destructive";
}
function statusClasses(status) {
  if ("Active" in status) return "text-primary crt-glow";
  if ("Slashed" in status) return "text-secondary crt-glow-amber animate-pulse";
  return "terminal-dim";
}
function rankLabel(n) {
  return `${String(n).padStart(2, "0")}.`;
}
function Workers() {
  const { data: workers, isLoading } = useWorkers();
  const registerMutation = useRegisterWorker();
  const { identity } = useInternetIdentity();
  const currentPrincipal = identity == null ? void 0 : identity.getPrincipal().toText();
  const sorted = workers ? [...workers].sort((a, b) => b.elo - a.elo) : [];
  const total = sorted.length;
  const active = sorted.filter((w) => "Active" in w.status).length;
  const slashed = sorted.filter((w) => "Slashed" in w.status).length;
  function handleRegister() {
    registerMutation.mutate(void 0, {
      onSuccess: () => {
        ue.success("> WORKER REGISTERED — node added to registry", {
          duration: 5e3
        });
      },
      onError: (err) => {
        ue.error(`> ERROR: ${err.message}`, { duration: 6e3 });
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 font-mono", "data-ocid": "workers.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crt-border bg-card p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mb-1", children: "┌─ PROTOCOL NODE LAYER ──────────────────────────────────" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "text-primary crt-glow text-2xl font-bold tracking-widest",
            "data-ocid": "workers.title",
            children: "> WORKER REGISTRY"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mt-1", children: "└─ DISTRIBUTED EVALUATION NODES ─ EGGROLL FITNESS PROTOCOL" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-3 gap-3 flex-1",
            "data-ocid": "workers.stats_panel",
            children: [
              {
                label: "TOTAL NODES",
                value: isLoading ? "—" : total,
                color: "text-primary crt-glow"
              },
              {
                label: "ACTIVE",
                value: isLoading ? "—" : active,
                color: "text-primary crt-glow"
              },
              {
                label: "SLASHED",
                value: isLoading ? "—" : slashed,
                color: slashed > 0 ? "crt-glow-amber text-secondary" : "terminal-dim"
              }
            ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "border border-border bg-background p-3 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: s.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold mt-1 tabular-nums ${s.color}`, children: s.value })
                ]
              },
              s.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleRegister,
            disabled: registerMutation.isPending,
            className: "shrink-0 crt-border-active border bg-background text-primary crt-glow tracking-widest text-xs uppercase px-4 py-2 h-auto hover:bg-primary/10 transition-smooth disabled:opacity-50",
            "data-ocid": "workers.register_button",
            children: registerMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "REGISTERING" }) : "[&gt; REGISTER AS WORKER]"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "crt-border bg-card overflow-x-auto",
        "data-ocid": "workers.list",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted-foreground tracking-widest bg-muted/30 min-w-[640px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3", children: "WORKER ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "ELO RATING" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: "STATUS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1 text-right", children: "SUBS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1 text-right", children: "SLASHES" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "LAST SUBMISSION" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border min-w-[640px]", children: isLoading ? SKELETONS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 grid grid-cols-12 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-1 h-4 bg-muted/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-3 h-4 bg-muted/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-2 h-4 bg-muted/50 ml-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-2 h-4 bg-muted/50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-1 h-4 bg-muted/50 ml-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-1 h-4 bg-muted/50 ml-auto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "col-span-2 h-4 bg-muted/50 ml-auto" })
          ] }, k)) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-14 text-center space-y-3",
              "data-ocid": "workers.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary crt-glow text-base tracking-widest", children: "> NO WORKERS REGISTERED" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: "──────────────────────────────────────────────────" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-wide", children: "Be the first node in the network. Click [> REGISTER AS WORKER] to join the EGGROLL fitness protocol." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: "──────────────────────────────────────────────────" })
              ]
            }
          ) : sorted.map((worker, i) => {
            const isCurrentUser = currentPrincipal && worker.id.toText() === currentPrincipal;
            const isSlashed = "Slashed" in worker.status;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: [
                  "px-4 py-3 grid grid-cols-12 gap-2 items-center terminal-row-hover transition-smooth",
                  isCurrentUser ? "crt-active" : "",
                  isSlashed ? "opacity-50" : ""
                ].filter(Boolean).join(" "),
                "data-ocid": `workers.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1 text-muted-foreground text-xs tabular-nums", children: rankLabel(i + 1) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "col-span-3 flex items-center gap-2 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-xs font-mono truncate tracking-wide", children: truncatePrincipal(worker.id) }),
                    isCurrentUser && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "shrink-0 text-primary crt-glow border border-primary/60 px-1 text-xs tracking-widest",
                        "data-ocid": `workers.you_badge.${i + 1}`,
                        children: "[ YOU ]"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `col-span-2 text-xs text-right font-mono tabular-nums ${isSlashed ? "line-through opacity-60" : eloColor(worker.elo)}`,
                      "data-ocid": `workers.elo.${i + 1}`,
                      children: worker.elo.toFixed(2)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `col-span-2 text-xs tracking-widest ${statusClasses(worker.status)}`,
                      "data-ocid": `workers.status.${i + 1}`,
                      children: [
                        "#",
                        getWorkerStatusLabel(worker.status)
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1 text-muted-foreground text-xs text-right tabular-nums", children: worker.totalSubmissions.toString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `col-span-1 text-xs text-right tabular-nums ${worker.slashCount > BigInt(0) ? "crt-glow-amber text-secondary" : "terminal-dim"}`,
                      children: worker.slashCount.toString()
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-muted-foreground text-xs text-right truncate", children: worker.lastSubmission.length > 0 && worker.lastSubmission[0] ? formatTimestamp(worker.lastSubmission[0]) : "NEVER" })
                ]
              },
              worker.id.toText()
            );
          }) })
        ]
      }
    ),
    !isLoading && sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-bar flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "NODES: ",
        total,
        "  |  SORTED BY ELO DESC"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "> REGISTRY ONLINE" })
    ] })
  ] });
}
export {
  Workers as default
};
