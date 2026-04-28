import { h as createLucideIcon, j as jsxRuntimeExports, r as reactExports, n as useParams, o as useTask, p as useTaskGenerations, q as useTaskSubmissions, L as Link, t as truncatePrincipal, f as formatTimestamp, s as useSubmitFitness, C as ChevronRight, g as getTaskStatusLabel, e as ue } from "./index-DVlwnvdG.js";
import { c as createSlot, B as Button } from "./button-zrSAMkkb.js";
import { c as cn, S as Skeleton } from "./skeleton-l1qUmVfh.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function AsciiProgressBar({
  current,
  total
}) {
  const WIDTH = 30;
  const pct = total > 0n ? Number(current * BigInt(WIDTH) / total) : 0;
  const filled = Math.min(pct, WIDTH);
  const empty = WIDTH - filled;
  const bar = filled === 0 ? `[${"·".repeat(WIDTH)}]` : filled === WIDTH ? `[${"=".repeat(WIDTH)}]` : `[${"=".repeat(filled - 1)}>${"·".repeat(empty)}]`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary crt-glow font-mono", children: bar });
}
function StatusBadge({ status }) {
  const label = getTaskStatusLabel(status);
  if ("Active" in status)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-primary crt-glow text-xs tracking-widest font-bold border border-primary/60 px-2 py-0.5",
        "data-ocid": "task_detail.status_badge",
        children: [
          "◉ ",
          label
        ]
      }
    );
  if ("Completed" in status)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-secondary crt-glow-amber text-xs tracking-widest font-bold border border-secondary/60 px-2 py-0.5",
        "data-ocid": "task_detail.status_badge",
        children: [
          "✓ ",
          label
        ]
      }
    );
  if ("Cancelled" in status)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "text-destructive text-xs tracking-widest font-bold border border-destructive/40 px-2 py-0.5 opacity-70",
        "data-ocid": "task_detail.status_badge",
        children: [
          "✗ ",
          label
        ]
      }
    );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "terminal-dim text-xs tracking-widest font-bold border border-border px-2 py-0.5",
      "data-ocid": "task_detail.status_badge",
      children: [
        "○ ",
        label
      ]
    }
  );
}
function PanelHeader({ title }) {
  const line = "─".repeat(Math.max(0, 38 - title.length - 4));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary text-xs tracking-widest font-bold crt-glow", children: [
    "┌─ ",
    title,
    " ",
    line,
    "┐"
  ] }) });
}
const GEN_SKELETONS = ["g1", "g2", "g3"];
const SUB_SKELETONS = ["s1", "s2", "s3"];
function SubmitFitnessForm({
  taskId,
  currentGeneration
}) {
  const [generation, setGeneration] = reactExports.useState(currentGeneration.toString());
  const [fitness, setFitness] = reactExports.useState("");
  const submitFitness = useSubmitFitness();
  function handleSubmit(e) {
    e.preventDefault();
    const gen = BigInt(generation);
    const fit = Number.parseFloat(fitness);
    if (Number.isNaN(fit)) {
      ue.error("FITNESS SCORE MUST BE A VALID NUMBER");
      return;
    }
    submitFitness.mutate(
      { taskId, generation: gen, fitness: fit },
      {
        onSuccess: () => {
          ue.success("EVALUATION SUBMITTED");
          setFitness("");
        },
        onError: (err) => ue.error(err.message)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-primary/40 crt-border bg-card",
      "data-ocid": "task_detail.submit_panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { title: "SUBMIT EVALUATION" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-4 py-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs tracking-widest", children: "GENERATION #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "terminal-input h-8 text-xs tracking-wider",
                  value: generation,
                  onChange: (e) => setGeneration(e.target.value),
                  pattern: "[0-9]+",
                  required: true,
                  "data-ocid": "task_detail.generation_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs tracking-widest", children: "FITNESS SCORE" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "terminal-input h-8 text-xs tracking-wider",
                  placeholder: "e.g. 0.8312",
                  value: fitness,
                  onChange: (e) => setFitness(e.target.value),
                  step: "any",
                  required: true,
                  "data-ocid": "task_detail.fitness_input"
                }
              )
            ] })
          ] }),
          submitFitness.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "text-destructive text-xs tracking-wide",
              "data-ocid": "task_detail.submit_error_state",
              children: [
                "✗ ERROR: ",
                submitFitness.error.message
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: submitFitness.isPending,
              className: "w-full sm:w-auto h-8 text-xs tracking-widest font-bold border border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:crt-glow transition-smooth",
              "data-ocid": "task_detail.submit_button",
              children: submitFitness.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "SUBMITTING" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 mr-1" }),
                "SUBMIT EVALUATION"
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function TaskDetail() {
  const { taskId } = useParams({ from: "/protected/tasks/$taskId" });
  const { data: task, isLoading } = useTask(taskId);
  const { data: generations } = useTaskGenerations(taskId);
  const { data: submissions } = useTaskSubmissions(taskId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-4 font-mono",
        "data-ocid": "task_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-72 bg-card border border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full bg-card border border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full bg-card border border-border" })
        ]
      }
    );
  }
  if (!task) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono", "data-ocid": "task_detail.error_state", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-8 text-center crt-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-destructive text-xs tracking-widest crt-glow mb-4", children: [
        "✗ TASK NOT FOUND: ",
        taskId
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/tasks",
          className: "inline-flex items-center gap-1 text-primary text-xs tracking-widest hover:crt-glow transition-smooth",
          "data-ocid": "task_detail.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3 h-3" }),
            "BACK TO TASKS"
          ]
        }
      )
    ] }) });
  }
  const progress = task.totalGenerations > 0n ? Number(task.currentGeneration * 100n / task.totalGenerations) : 0;
  const isActive = "Active" in task.status;
  const latestGen = generations && generations.length > 0 ? generations[generations.length - 1] : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 font-mono", "data-ocid": "task_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground tracking-widest", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/tasks",
          className: "hover:text-primary transition-smooth flex items-center gap-1",
          "data-ocid": "task_detail.back_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3 h-3" }),
            "TASKS"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary truncate max-w-xs", children: taskId })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card crt-border",
        "data-ocid": "task_detail.header_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { title: "TASK HEADER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest", children: "TASK ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h1",
                  {
                    className: "text-primary crt-glow text-sm font-bold tracking-wider break-all",
                    "data-ocid": "task_detail.task_id",
                    children: task.id
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: task.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 text-xs pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground tracking-widest mb-0.5", children: "CREATED BY" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary font-mono", children: truncatePrincipal(task.createdBy) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground tracking-widest mb-0.5", children: "CREATED AT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: formatTimestamp(task.createdAt) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground tracking-widest mb-0.5", children: "MODEL ARTIFACT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary truncate", children: task.modelArtifactId })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground tracking-widest mb-0.5", children: "DATASET ARTIFACT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary truncate", children: task.datasetArtifactId })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card crt-border",
        "data-ocid": "task_detail.progress_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { title: "PROGRESS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AsciiProgressBar,
                {
                  current: task.currentGeneration,
                  total: task.totalGenerations
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground tracking-widest mt-1", children: [
                "GENERATION",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: task.currentGeneration.toString() }),
                " ",
                "/",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: task.totalGenerations.toString() }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-4 text-primary", children: [
                  progress,
                  "%"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mb-2", children: "EGGROLL HYPERPARAMETERS" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                { label: "RANK (r)", value: task.params.r.toString() },
                { label: "ALPHA (α)", value: task.params.alpha.toFixed(4) },
                {
                  label: "POPULATION",
                  value: task.params.nPopulation.toString()
                },
                { label: "EPOCHS", value: task.params.epochs.toString() }
              ].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "border border-border bg-muted/20 px-3 py-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs tracking-widest mb-1", children: p.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary crt-glow text-sm font-bold font-mono", children: p.value })
                  ]
                },
                p.label
              )) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card crt-border",
        "data-ocid": "task_detail.generations_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { title: "GENERATION RESULTS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border grid grid-cols-5 gap-2 text-xs text-muted-foreground tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GEN #" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "BEST FITNESS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "AVG FITNESS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "WORKERS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "TIMESTAMP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-72 overflow-y-auto", children: !generations ? GEN_SKELETONS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-muted" }) }, k)) : generations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-8 text-muted-foreground text-xs tracking-wide",
              "data-ocid": "task_detail.generations.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/50", children: "> " }),
                "AWAITING FIRST GENERATION RESULTS"
              ]
            }
          ) : [...generations].reverse().map((gen, i) => {
            const isLatest = (latestGen == null ? void 0 : latestGen.generation) === gen.generation;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `px-4 py-2.5 grid grid-cols-5 gap-2 text-xs terminal-row-hover ${isLatest ? "crt-active" : ""}`,
                "data-ocid": `task_detail.generation.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `font-mono ${isLatest ? "text-primary crt-glow font-bold" : "text-primary"}`,
                      children: [
                        gen.generation.toString().padStart(4, "0"),
                        isLatest && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-secondary", children: "◄" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-right ${isLatest ? "text-primary crt-glow font-bold" : "text-primary"}`,
                      children: gen.bestFitness.toFixed(4)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-right", children: gen.averageFitness.toFixed(4) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-right", children: gen.workerCount.toString() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-right text-xs", children: formatTimestamp(gen.timestamp) })
                ]
              },
              `${gen.taskId}-${gen.generation}`
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border border-border bg-card crt-border",
        "data-ocid": "task_detail.submissions_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelHeader, { title: "WORKER SUBMISSIONS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border grid grid-cols-4 gap-2 text-xs text-muted-foreground tracking-widest", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2", children: "WORKER ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "GEN / FITNESS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "TIMESTAMP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border max-h-56 overflow-y-auto", children: !submissions ? SUB_SKELETONS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-muted" }) }, k)) : submissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-8 text-muted-foreground text-xs tracking-wide",
              "data-ocid": "task_detail.submissions.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/50", children: "> " }),
                "NO SUBMISSIONS YET"
              ]
            }
          ) : [...submissions].sort((a, b) => Number(b.timestamp - a.timestamp)).slice(0, 20).map((sub, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "px-4 py-2.5 grid grid-cols-4 gap-2 text-xs terminal-row-hover",
              "data-ocid": `task_detail.submission.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-primary font-mono truncate", children: truncatePrincipal(sub.workerId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-right font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: sub.generation.toString().padStart(3, "0") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border mx-1", children: "/" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: sub.fitness.toFixed(4) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-right text-xs", children: formatTimestamp(sub.timestamp) })
              ]
            },
            `${sub.workerId.toText()}-${sub.generation}-${sub.timestamp}`
          )) })
        ]
      }
    ),
    isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitFitnessForm,
      {
        taskId,
        currentGeneration: task.currentGeneration
      }
    )
  ] });
}
export {
  TaskDetail as default
};
