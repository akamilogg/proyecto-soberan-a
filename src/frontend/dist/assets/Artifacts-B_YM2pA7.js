import { i as useArtifacts, r as reactExports, j as jsxRuntimeExports, l as getArtifactTypeLabel, m as useRegisterArtifact, t as truncatePrincipal, f as formatTimestamp, e as ue } from "./index-DVlwnvdG.js";
const FILTERS = [
  { key: "ALL", label: "ALL" },
  { key: "MODEL", label: "MODEL WEIGHTS" },
  { key: "DATASET", label: "DATASETS" },
  { key: "CONFIG", label: "CONFIG" },
  { key: "KERNEL", label: "KERNEL" }
];
function artifactMatchesFilter(a, filter) {
  if (filter === "ALL") return true;
  const label = getArtifactTypeLabel(a.artifactType);
  return label === filter;
}
function emptyStateLabel(filter) {
  const map = {
    ALL: "> NO ARTIFACTS REGISTERED",
    MODEL: "> NO MODEL WEIGHTS ARTIFACTS REGISTERED",
    DATASET: "> NO DATASET ARTIFACTS REGISTERED",
    CONFIG: "> NO CONFIG ARTIFACTS REGISTERED",
    KERNEL: "> NO KERNEL ARTIFACTS REGISTERED"
  };
  return map[filter];
}
function shortStr(s, head = 10, tail = 8) {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}
function TypeBadge({ type }) {
  const label = getArtifactTypeLabel(type);
  const baseClass = "font-mono text-[10px] px-1.5 py-0.5 border tracking-widest";
  const styles = {
    MODEL: `${baseClass} text-primary border-primary/50 bg-primary/5 crt-glow`,
    DATASET: `${baseClass} text-secondary border-secondary/50 bg-secondary/5 crt-glow-amber`,
    CONFIG: `${baseClass} border`,
    KERNEL: `${baseClass} border`
  };
  const extraStyle = label === "CONFIG" ? {
    color: "var(--color-config)",
    borderColor: "var(--color-config-border)",
    background: "var(--color-config-bg)"
  } : label === "KERNEL" ? {
    color: "var(--color-kernel)",
    borderColor: "var(--color-kernel-border)",
    background: "var(--color-kernel-bg)"
  } : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: styles[label] ?? styles.MODEL, style: extraStyle, children: [
    "[",
    label,
    "]"
  ] });
}
function IntegrityBadge({ verified }) {
  return verified ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-widest text-primary crt-glow border border-primary/50 bg-primary/5 px-1.5 py-0.5 whitespace-nowrap", children: "[✓ VERIFIED]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-widest text-secondary crt-glow-amber border border-secondary/50 bg-secondary/5 px-1.5 py-0.5 whitespace-nowrap", children: "[⚠ UNVERIFIED]" });
}
function CopyButton({ value, label }) {
  const [copied, setCopied] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      },
      className: "shrink-0 font-mono text-[10px] tracking-widest border border-border px-1.5 py-0.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth",
      children: copied ? "[✓ COPIED]" : `[COPY ${label}]`
    }
  );
}
function ArtifactDetail({ artifact }) {
  const rows = [
    { label: "ID", value: artifact.id },
    { label: "CID", value: artifact.cid, isLink: true },
    { label: "HASH", value: artifact.contentHash },
    { label: "PRINCIPAL", value: artifact.uploadedBy.toText() }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crt-border p-3 space-y-3 bg-background", children: rows.map(({ label, value, isLink }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground tracking-widest w-20 shrink-0 pt-0.5", children: [
      "> ",
      label
    ] }),
    isLink ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: value,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "font-mono text-xs text-primary/90 hover:text-primary hover:underline break-all flex-1 min-w-0 transition-smooth",
        children: value
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-foreground break-all flex-1 min-w-0", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value, label })
  ] }, label)) });
}
function ArtifactRow({
  artifact,
  index
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        "data-ocid": `artifacts.item.${index + 1}`,
        className: "terminal-row-hover border-b border-border/40 cursor-pointer",
        onClick: () => setExpanded((v) => !v),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
        },
        tabIndex: 0,
        title: `CID: ${artifact.cid}
Hash: ${artifact.contentHash}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-muted-foreground tracking-wider whitespace-nowrap", children: shortStr(artifact.id, 6, 4) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: artifact.artifactType }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-primary/80 whitespace-nowrap max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: artifact.cid,
              target: "_blank",
              rel: "noopener noreferrer",
              onClick: (e) => e.stopPropagation(),
              className: "hover:text-primary hover:underline transition-smooth truncate block",
              title: artifact.cid,
              children: shortStr(artifact.cid, 12, 8)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: "px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap",
              title: artifact.contentHash,
              children: shortStr(artifact.contentHash, 8, 6)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrityBadge, { verified: artifact.verified }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap", children: truncatePrincipal(artifact.uploadedBy) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap", children: formatTimestamp(artifact.timestamp) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center font-mono text-[10px] text-muted-foreground tracking-widest", children: expanded ? "[▲]" : "[▼]" })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "tr",
      {
        "data-ocid": `artifacts.item.${index + 1}.detail`,
        className: "border-b border-primary/20 bg-card/60",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArtifactDetail, { artifact }) })
      }
    )
  ] });
}
const TYPE_OPTIONS = [
  {
    value: "ModelWeights",
    label: "MODEL WEIGHTS",
    variant: { ModelWeights: null }
  },
  { value: "Dataset", label: "DATASET", variant: { Dataset: null } },
  { value: "Config", label: "CONFIG", variant: { Config: null } },
  { value: "Kernel", label: "KERNEL", variant: { Kernel: null } }
];
function RegisterForm({ onClose }) {
  const registerArtifact = useRegisterArtifact();
  const [cid, setCid] = reactExports.useState("");
  const [hash, setHash] = reactExports.useState("");
  const [typeKey, setTypeKey] = reactExports.useState("ModelWeights");
  const [cidError, setCidError] = reactExports.useState("");
  const [hashError, setHashError] = reactExports.useState("");
  const validateCid = (v) => {
    if (!v.trim()) return "CID is required";
    if (!v.startsWith("ipfs://") && !v.startsWith("ar://"))
      return 'CID must start with "ipfs://" or "ar://"';
    return "";
  };
  const validateHash = (v) => {
    if (!v.trim()) return "Content hash is required";
    if (!/^[0-9a-fA-F]{64}$/.test(v.trim()))
      return "Must be a valid SHA256 hex string (64 hex chars)";
    return "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const ce = validateCid(cid);
    const he = validateHash(hash);
    setCidError(ce);
    setHashError(he);
    if (ce || he) return;
    const selected = TYPE_OPTIONS.find((o) => o.value === typeKey);
    if (!selected) return;
    const payload = {
      cid: cid.trim(),
      contentHash: hash.trim(),
      artifactType: selected.variant
    };
    try {
      const artifact = await registerArtifact.mutateAsync(payload);
      ue.success("ARTIFACT REGISTERED", {
        description: `ID: ${artifact.id.slice(0, 12)}…`,
        duration: 4e3
      });
      onClose();
    } catch (err) {
      ue.error("REGISTRATION FAILED", {
        description: err instanceof Error ? err.message : "Unknown error",
        duration: 5e3
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      "data-ocid": "artifacts.register_form",
      className: "crt-border p-4 space-y-4 bg-background mt-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-border tracking-widest", children: "┌─ REGISTER NEW ARTIFACT ───────────────────────────────────────────────┐" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "artifact-cid",
              className: "font-mono text-[10px] text-muted-foreground tracking-widest block",
              children: "> CID"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "artifact-cid",
              "data-ocid": "artifacts.cid_input",
              type: "text",
              value: cid,
              onChange: (e) => {
                setCid(e.target.value);
                if (cidError) setCidError(validateCid(e.target.value));
              },
              onBlur: () => setCidError(validateCid(cid)),
              placeholder: "ipfs://Qm... or ar://...",
              className: "terminal-input w-full px-3 py-2 text-xs tracking-wide",
              autoComplete: "off",
              spellCheck: false
            }
          ),
          cidError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              "data-ocid": "artifacts.cid_input.field_error",
              className: "font-mono text-[10px] text-destructive tracking-wider",
              children: [
                "[!] ",
                cidError
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "artifact-hash",
              className: "font-mono text-[10px] text-muted-foreground tracking-widest block",
              children: "> CONTENT HASH (SHA256)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "artifact-hash",
              "data-ocid": "artifacts.hash_input",
              type: "text",
              value: hash,
              onChange: (e) => {
                setHash(e.target.value);
                if (hashError) setHashError(validateHash(e.target.value));
              },
              onBlur: () => setHashError(validateHash(hash)),
              placeholder: "e3b0c44298fc1c149afbf4c8996fb924...",
              className: "terminal-input w-full px-3 py-2 text-xs tracking-wide",
              autoComplete: "off",
              spellCheck: false
            }
          ),
          hashError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              "data-ocid": "artifacts.hash_input.field_error",
              className: "font-mono text-[10px] text-destructive tracking-wider",
              children: [
                "[!] ",
                hashError
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "artifact-type",
              className: "font-mono text-[10px] text-muted-foreground tracking-widest block",
              children: "> TYPE"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              id: "artifact-type",
              "data-ocid": "artifacts.type_select",
              value: typeKey,
              onChange: (e) => setTypeKey(e.target.value),
              className: "terminal-input w-full px-3 py-2 text-xs tracking-wide",
              children: TYPE_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              "data-ocid": "artifacts.register_submit_button",
              disabled: registerArtifact.isPending,
              className: "font-mono text-xs tracking-widest border border-primary/60 text-primary hover:bg-primary/10 hover:border-primary crt-box-glow disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 transition-smooth",
              children: registerArtifact.isPending ? "[▸ REGISTERING...]" : "[> REGISTER]"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "artifacts.register_cancel_button",
              onClick: onClose,
              className: "font-mono text-xs tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground px-4 py-2 transition-smooth",
              children: "[CANCEL]"
            }
          ),
          registerArtifact.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "data-ocid": "artifacts.register_form.loading_state",
              className: "font-mono text-[10px] text-muted-foreground tracking-widest cursor-blink",
              children: "WRITING TO CHAIN"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-border tracking-widest", children: "└───────────────────────────────────────────────────────────────────────┘" })
      ]
    }
  );
}
function Artifacts() {
  const { data: artifacts, isLoading, isError } = useArtifacts();
  const [activeFilter, setActiveFilter] = reactExports.useState("ALL");
  const [showForm, setShowForm] = reactExports.useState(false);
  const filtered = (artifacts ?? []).filter(
    (a) => artifactMatchesFilter(a, activeFilter)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "artifacts.page",
      className: "flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full font-mono",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-primary crt-glow text-xl tracking-widest", children: "> ARTIFACT REGISTRY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "artifacts.filter_tabs",
              className: "flex flex-wrap gap-1",
              role: "tablist",
              "aria-label": "Filter artifacts by type",
              children: FILTERS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": activeFilter === key,
                  "data-ocid": `artifacts.filter.${key.toLowerCase()}`,
                  onClick: () => setActiveFilter(key),
                  className: `font-mono text-[10px] tracking-widest px-3 py-1.5 border transition-smooth ${activeFilter === key ? "crt-active border-primary/60 crt-box-glow" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"}`,
                  children: [
                    "[",
                    label,
                    "]"
                  ]
                },
                key
              ))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "artifacts.register_toggle_button",
              onClick: () => setShowForm((v) => !v),
              className: `font-mono text-xs tracking-widest px-4 py-2 border transition-smooth ${showForm ? "border-primary/60 text-primary crt-active" : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"}`,
              children: showForm ? "[▲ CLOSE REGISTRATION]" : "[+ REGISTER NEW ARTIFACT]"
            }
          ),
          showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterForm, { onClose: () => setShowForm(false) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "artifacts.table", className: "w-full overflow-x-auto", children: [
          isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "artifacts.table.loading_state",
              className: "font-mono text-xs text-muted-foreground tracking-widest py-8 text-center crt-border",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor-blink", children: "> QUERYING ARTIFACT REGISTRY" })
            }
          ),
          isError && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "artifacts.table.error_state",
              className: "font-mono text-xs text-destructive tracking-widest py-8 text-center crt-border",
              children: "[!] FAILED TO LOAD ARTIFACTS — CHECK CANISTER CONNECTION"
            }
          ),
          !isLoading && !isError && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "artifacts.table.empty_state",
              className: "font-mono text-xs text-muted-foreground tracking-widest py-12 text-center crt-border",
              children: [
                emptyStateLabel(activeFilter),
                activeFilter === "ALL" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "artifacts.empty_state.register_button",
                    onClick: () => setShowForm(true),
                    className: "font-mono text-xs tracking-widest border border-primary/50 text-primary hover:bg-primary/10 px-4 py-2 transition-smooth",
                    children: "[+ REGISTER FIRST ARTIFACT]"
                  }
                ) })
              ]
            }
          ),
          !isLoading && !isError && filtered.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full border-collapse", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-primary/30", children: [
              "ID",
              "TYPE",
              "CID",
              "CONTENT HASH",
              "INTEGRITY",
              "UPLOADED BY",
              "TIMESTAMP",
              ""
            ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-3 py-2 text-left font-mono text-[10px] tracking-widest text-primary/60 whitespace-nowrap border-b border-border/40",
                children: col
              },
              col
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((artifact, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ArtifactRow, { artifact, index: i }, artifact.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-bar flex items-center justify-between mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "TOTAL:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary crt-glow", children: [
              (artifacts ?? []).length,
              " ARTIFACTS"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "FILTERED:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary crt-glow", children: [
              filtered.length,
              " RESULTS"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            "[",
            activeFilter,
            "]"
          ] })
        ] })
      ]
    }
  );
}
export {
  Artifacts as default
};
