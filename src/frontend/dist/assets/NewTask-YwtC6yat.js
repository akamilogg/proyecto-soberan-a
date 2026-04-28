import { h as createLucideIcon, a as useNavigate, i as useArtifacts, k as useCreateTask, r as reactExports, j as jsxRuntimeExports, C as ChevronRight, l as getArtifactTypeLabel, m as useRegisterArtifact } from "./index-DVlwnvdG.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode);
function TerminalPanel({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crt-border bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-b border-border flex items-center gap-2 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs shrink-0", children: "┌──" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs tracking-widest text-primary crt-glow uppercase shrink-0", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-muted-foreground font-mono text-xs overflow-hidden", children: "─".repeat(50) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-mono text-xs shrink-0", children: "──┐" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", children })
  ] });
}
function FieldRow({
  label,
  children,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block font-mono text-xs text-primary crt-glow tracking-widest", children: label }),
    children,
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs terminal-dim tracking-wide", children: hint })
  ] });
}
function ArtifactSelect({
  artifacts,
  value,
  onChange,
  filterType,
  ocid
}) {
  const filtered = artifacts.filter((a) => filterType in a.artifactType);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "select",
    {
      "data-ocid": ocid,
      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide appearance-none cursor-pointer",
      value,
      onChange: (e) => onChange(e.target.value),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- SELECT ARTIFACT --" }),
        filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: a.id, children: [
          "[",
          getArtifactTypeLabel(a.artifactType),
          "] ",
          a.id.slice(0, 12),
          "…",
          "  ",
          "hash:",
          a.contentHash.slice(0, 10),
          "…",
          "  ",
          a.verified ? "[VERIFIED]" : "[UNVERIFIED]"
        ] }, a.id)),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "", disabled: true, children: [
          "NO ",
          filterType.toUpperCase(),
          " ARTIFACTS REGISTERED"
        ] })
      ]
    }
  );
}
function RegisterArtifactForm({ onSuccess }) {
  const registerArtifact = useRegisterArtifact();
  const [cid, setCid] = reactExports.useState("");
  const [hash, setHash] = reactExports.useState("");
  const [artifactTypeName, setArtifactTypeName] = reactExports.useState("ModelWeights");
  const [localError, setLocalError] = reactExports.useState("");
  const typeOptions = [
    { value: "ModelWeights", label: "MODEL WEIGHTS" },
    { value: "Dataset", label: "DATASET" },
    { value: "Config", label: "CONFIG" },
    { value: "Kernel", label: "KERNEL" }
  ];
  const artifactTypeMap = {
    ModelWeights: { ModelWeights: null },
    Dataset: { Dataset: null },
    Config: { Config: null },
    Kernel: { Kernel: null }
  };
  async function handleRegister(e) {
    e.preventDefault();
    setLocalError("");
    if (!cid.trim()) {
      setLocalError("CID is required.");
      return;
    }
    if (!hash.trim()) {
      setLocalError("Content hash is required.");
      return;
    }
    if (!/^(ipfs|ar):\/\//i.test(cid.trim())) {
      setLocalError("CID must start with ipfs:// or ar://");
      return;
    }
    const payload = {
      artifactType: artifactTypeMap[artifactTypeName],
      contentHash: hash.trim(),
      cid: cid.trim()
    };
    try {
      await registerArtifact.mutateAsync(payload);
      setCid("");
      setHash("");
      setArtifactTypeName("ModelWeights");
      onSuccess();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "REGISTRATION FAILED");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleRegister,
      className: "space-y-3 pt-3 border-t border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs tracking-widest text-primary/60", children: "// REGISTER NEW ARTIFACT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FieldRow,
            {
              label: "> CID (ipfs:// or ar://)",
              hint: "Content identifier on IPFS or Arweave",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "register_artifact.cid_input",
                  type: "text",
                  className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                  placeholder: "ipfs://Qm...",
                  value: cid,
                  onChange: (e) => setCid(e.target.value)
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FieldRow,
            {
              label: "> CONTENT HASH (SHA256)",
              hint: "On-chain integrity fingerprint",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "register_artifact.hash_input",
                  type: "text",
                  className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                  placeholder: "sha256:abc123...",
                  value: hash,
                  onChange: (e) => setHash(e.target.value)
                }
              )
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRow, { label: "> ARTIFACT TYPE", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            "data-ocid": "register_artifact.type_select",
            className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide appearance-none cursor-pointer",
            value: artifactTypeName,
            onChange: (e) => setArtifactTypeName(
              e.target.value
            ),
            children: typeOptions.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        ) }),
        localError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "p",
          {
            "data-ocid": "register_artifact.error_state",
            className: "font-mono text-xs crt-glow-amber tracking-wide",
            children: [
              "!! ",
              localError
            ]
          }
        ),
        registerArtifact.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            "data-ocid": "register_artifact.success_state",
            className: "font-mono text-xs crt-glow tracking-wide",
            children: "✓ ARTIFACT REGISTERED — UPDATING LIST..."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            "data-ocid": "register_artifact.submit_button",
            type: "submit",
            disabled: registerArtifact.isPending,
            className: "font-mono text-xs tracking-widest px-4 py-2 crt-border text-primary crt-glow hover:bg-primary/10 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed",
            children: registerArtifact.isPending ? "[> REGISTERING...]" : "[> REGISTER ARTIFACT]"
          }
        )
      ]
    }
  );
}
function NewTask() {
  const navigate = useNavigate();
  const { data: allArtifacts = [], isLoading: artifactsLoading } = useArtifacts();
  const createTask = useCreateTask();
  const [modelArtifactId, setModelArtifactId] = reactExports.useState("");
  const [datasetArtifactId, setDatasetArtifactId] = reactExports.useState("");
  const [showRegister, setShowRegister] = reactExports.useState(false);
  const [rank, setRank] = reactExports.useState(4);
  const [alpha, setAlpha] = reactExports.useState(0.01);
  const [nPopulation, setNPopulation] = reactExports.useState(10);
  const [epochs, setEpochs] = reactExports.useState(3);
  const [totalGenerations, setTotalGenerations] = reactExports.useState(5);
  const [formError, setFormError] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!modelArtifactId) {
      setFormError("MODEL ARTIFACT is required.");
      return;
    }
    if (!datasetArtifactId) {
      setFormError("DATASET ARTIFACT is required.");
      return;
    }
    try {
      const task = await createTask.mutateAsync({
        modelArtifactId,
        datasetArtifactId,
        params: {
          r: BigInt(rank),
          alpha,
          nPopulation: BigInt(nPopulation),
          epochs: BigInt(epochs)
        },
        totalGenerations: BigInt(totalGenerations)
      });
      navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "TASK CREATION FAILED");
    }
  }
  const effectiveScale = (alpha / Math.sqrt(rank)).toFixed(6);
  const totalEvals = nPopulation * totalGenerations;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto px-4 py-6 space-y-5 animate-terminal-boot font-mono",
      "data-ocid": "new_task.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs tracking-widest text-muted-foreground", children: "/tasks/new" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg tracking-widest text-primary crt-glow uppercase cursor-blink", children: "NEW FINE-TUNING TASK" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs terminal-dim tracking-wide", children: "Launch an EGGROLL evolutionary fine-tuning run across the distributed worker network." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalPanel, { title: "[1/3] ARTIFACT REFERENCES", children: artifactsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "artifacts.loading_state",
              className: "text-xs terminal-dim tracking-widest cursor-blink",
              children: "LOADING ARTIFACTS..."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FieldRow,
              {
                label: "> MODEL ARTIFACT (ModelWeights)",
                hint: "Base checkpoint for fine-tuning — 1B params, int8 recommended.",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ArtifactSelect,
                    {
                      ocid: "newtask.model_select",
                      artifacts: allArtifacts,
                      value: modelArtifactId,
                      onChange: setModelArtifactId,
                      filterType: "ModelWeights"
                    }
                  ),
                  allArtifacts.filter((a) => "ModelWeights" in a.artifactType).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs crt-glow-amber tracking-wide mt-1", children: "► No model artifacts yet — register one below." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FieldRow,
              {
                label: "> DATASET ARTIFACT",
                hint: "Fine-tuning instruction/response dataset (jsonl format).",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ArtifactSelect,
                    {
                      ocid: "newtask.dataset_select",
                      artifacts: allArtifacts,
                      value: datasetArtifactId,
                      onChange: setDatasetArtifactId,
                      filterType: "Dataset"
                    }
                  ),
                  allArtifacts.filter((a) => "Dataset" in a.artifactType).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs crt-glow-amber tracking-wide mt-1", children: "► No dataset artifacts yet — register one below." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crt-border bg-background/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "newtask.register_artifact_toggle",
                  onClick: () => setShowRegister((v) => !v),
                  className: "w-full flex items-center gap-2 px-4 py-2 text-xs tracking-widest text-primary/70 hover:text-primary hover:bg-primary/5 transition-smooth text-left",
                  children: [
                    showRegister ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 shrink-0" }),
                    "OR REGISTER NEW ARTIFACT"
                  ]
                }
              ),
              showRegister && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                RegisterArtifactForm,
                {
                  onSuccess: () => setShowRegister(false)
                }
              ) })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TerminalPanel, { title: "[2/3] EGGROLL PARAMETERS", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldRow,
                {
                  label: "> RANK (r)",
                  hint: "Low-rank dimension. Higher = more expressive, more memory.",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "newtask.rank_input",
                      type: "number",
                      min: 1,
                      max: 64,
                      step: 1,
                      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                      value: rank,
                      onChange: (e) => setRank(Number(e.target.value))
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldRow,
                {
                  label: "> ALPHA (α)",
                  hint: "Learning rate scalar. Effective scale = α/√r.",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "newtask.alpha_input",
                      type: "number",
                      min: 1e-4,
                      max: 1,
                      step: 1e-4,
                      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                      value: alpha,
                      onChange: (e) => setAlpha(Number(e.target.value))
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldRow,
                {
                  label: "> POPULATION SIZE (N)",
                  hint: "Workers evaluated per generation. More = better consensus.",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "newtask.population_input",
                      type: "number",
                      min: 2,
                      max: 100,
                      step: 1,
                      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                      value: nPopulation,
                      onChange: (e) => setNPopulation(Number(e.target.value))
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldRow,
                {
                  label: "> EPOCHS",
                  hint: "Dataset passes per worker per generation.",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "newtask.epochs_input",
                      type: "number",
                      min: 1,
                      max: 50,
                      step: 1,
                      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                      value: epochs,
                      onChange: (e) => setEpochs(Number(e.target.value))
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FieldRow,
                {
                  label: "> TOTAL GENERATIONS",
                  hint: "Evolutionary cycles to run before task completion.",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      "data-ocid": "newtask.generations_input",
                      type: "number",
                      min: 1,
                      max: 200,
                      step: 1,
                      className: "terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide",
                      value: totalGenerations,
                      onChange: (e) => setTotalGenerations(Number(e.target.value))
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 bg-background/60 crt-border text-xs space-y-1 terminal-dim", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/60 tracking-widest", children: "// COMPUTED SUMMARY" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "update_scale",
                "    ",
                "= α/√r",
                "  ",
                "= ",
                effectiveScale
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "total_evaluations = N×gen = ",
                totalEvals
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "perturbation_dim",
                "  ",
                "= r",
                "    ",
                "= ",
                rank,
                " (vs full-rank 1B)"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TerminalPanel, { title: "[3/3] LAUNCH", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary/60 tracking-widest", children: "// PRE-FLIGHT CHECK" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: modelArtifactId ? "text-primary" : "terminal-dim", children: [
                modelArtifactId ? "✓" : "○",
                " Model artifact:",
                " ",
                modelArtifactId ? `${modelArtifactId.slice(0, 18)}…` : "NOT SET"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  className: datasetArtifactId ? "text-primary" : "terminal-dim",
                  children: [
                    datasetArtifactId ? "✓" : "○",
                    " Dataset artifact:",
                    " ",
                    datasetArtifactId ? `${datasetArtifactId.slice(0, 18)}…` : "NOT SET"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary", children: [
                "✓ EGGROLL r=",
                rank,
                " α=",
                alpha,
                " N=",
                nPopulation,
                " epochs=",
                epochs
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary", children: [
                "✓ ",
                totalGenerations,
                " generations scheduled (",
                totalEvals,
                " total evaluations)"
              ] })
            ] }),
            formError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                "data-ocid": "new_task.error_state",
                className: "text-xs crt-glow-amber tracking-wide",
                children: [
                  "!! ERROR: ",
                  formError
                ]
              }
            ),
            (!modelArtifactId || !datasetArtifactId) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs terminal-dim tracking-wide", children: "↑ Select both artifacts above to enable launch." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-wrap pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "new_task.submit_button",
                  type: "submit",
                  disabled: createTask.isPending || !modelArtifactId || !datasetArtifactId,
                  className: "text-sm tracking-widest px-6 py-3 crt-border crt-box-glow text-primary crt-glow hover:bg-primary/10 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed uppercase",
                  children: createTask.isPending ? "[> LAUNCHING...]" : "[> LAUNCH FINE-TUNING TASK]"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  "data-ocid": "new_task.cancel_button",
                  type: "button",
                  onClick: () => navigate({ to: "/tasks" }),
                  className: "text-xs tracking-widest px-4 py-2 text-muted-foreground hover:text-primary transition-smooth",
                  children: "[CANCEL]"
                }
              )
            ] })
          ] }) })
        ] })
      ]
    }
  );
}
export {
  NewTask as default
};
