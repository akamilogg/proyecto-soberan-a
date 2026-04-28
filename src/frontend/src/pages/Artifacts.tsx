import { useArtifacts, useRegisterArtifact } from "@/hooks/use-backend";
import type { Artifact, ArtifactType, RegisterArtifactPayload } from "@/types";
import {
  formatTimestamp,
  getArtifactTypeLabel,
  truncatePrincipal,
} from "@/types";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Filter ───────────────────────────────────────────────────────────────────
type FilterKey = "ALL" | "MODEL" | "DATASET" | "CONFIG" | "KERNEL";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "ALL", label: "ALL" },
  { key: "MODEL", label: "MODEL WEIGHTS" },
  { key: "DATASET", label: "DATASETS" },
  { key: "CONFIG", label: "CONFIG" },
  { key: "KERNEL", label: "KERNEL" },
];

function artifactMatchesFilter(a: Artifact, filter: FilterKey): boolean {
  if (filter === "ALL") return true;
  const label = getArtifactTypeLabel(a.artifactType);
  return label === filter;
}

function emptyStateLabel(filter: FilterKey): string {
  const map: Record<FilterKey, string> = {
    ALL: "> NO ARTIFACTS REGISTERED",
    MODEL: "> NO MODEL WEIGHTS ARTIFACTS REGISTERED",
    DATASET: "> NO DATASET ARTIFACTS REGISTERED",
    CONFIG: "> NO CONFIG ARTIFACTS REGISTERED",
    KERNEL: "> NO KERNEL ARTIFACTS REGISTERED",
  };
  return map[filter];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function shortStr(s: string, head = 10, tail = 8): string {
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

// ─── Type badge ───────────────────────────────────────────────────────────────
function TypeBadge({ type }: { type: ArtifactType }) {
  const label = getArtifactTypeLabel(type);
  const baseClass =
    "font-mono text-[10px] px-1.5 py-0.5 border tracking-widest";
  const styles: Record<string, string> = {
    MODEL: `${baseClass} text-primary border-primary/50 bg-primary/5 crt-glow`,
    DATASET: `${baseClass} text-secondary border-secondary/50 bg-secondary/5 crt-glow-amber`,
    CONFIG: `${baseClass} border`,
    KERNEL: `${baseClass} border`,
  };
  // CONFIG and KERNEL use CSS custom property styles (no raw oklch literals)
  const extraStyle: React.CSSProperties | undefined =
    label === "CONFIG"
      ? {
          color: "var(--color-config)",
          borderColor: "var(--color-config-border)",
          background: "var(--color-config-bg)",
        }
      : label === "KERNEL"
        ? {
            color: "var(--color-kernel)",
            borderColor: "var(--color-kernel-border)",
            background: "var(--color-kernel-bg)",
          }
        : undefined;

  return (
    <span className={styles[label] ?? styles.MODEL} style={extraStyle}>
      [{label}]
    </span>
  );
}

// ─── Integrity badge ──────────────────────────────────────────────────────────
function IntegrityBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="font-mono text-[10px] tracking-widest text-primary crt-glow border border-primary/50 bg-primary/5 px-1.5 py-0.5 whitespace-nowrap">
      [✓ VERIFIED]
    </span>
  ) : (
    <span className="font-mono text-[10px] tracking-widest text-secondary crt-glow-amber border border-secondary/50 bg-secondary/5 px-1.5 py-0.5 whitespace-nowrap">
      [⚠ UNVERIFIED]
    </span>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      className="shrink-0 font-mono text-[10px] tracking-widest border border-border px-1.5 py-0.5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth"
    >
      {copied ? "[✓ COPIED]" : `[COPY ${label}]`}
    </button>
  );
}

// ─── Artifact expanded detail ─────────────────────────────────────────────────
function ArtifactDetail({ artifact }: { artifact: Artifact }) {
  const rows = [
    { label: "ID", value: artifact.id },
    { label: "CID", value: artifact.cid, isLink: true },
    { label: "HASH", value: artifact.contentHash },
    { label: "PRINCIPAL", value: artifact.uploadedBy.toText() },
  ];
  return (
    <div className="crt-border p-3 space-y-3 bg-background">
      {rows.map(({ label, value, isLink }) => (
        <div key={label} className="flex items-start gap-3">
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest w-20 shrink-0 pt-0.5">
            &gt; {label}
          </span>
          {isLink ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-primary/90 hover:text-primary hover:underline break-all flex-1 min-w-0 transition-smooth"
            >
              {value}
            </a>
          ) : (
            <span className="font-mono text-xs text-foreground break-all flex-1 min-w-0">
              {value}
            </span>
          )}
          <CopyButton value={value} label={label} />
        </div>
      ))}
    </div>
  );
}

// ─── Artifact row ─────────────────────────────────────────────────────────────
function ArtifactRow({
  artifact,
  index,
}: { artifact: Artifact; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        data-ocid={`artifacts.item.${index + 1}`}
        className="terminal-row-hover border-b border-border/40 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
        }}
        tabIndex={0}
        title={`CID: ${artifact.cid}\nHash: ${artifact.contentHash}`}
      >
        <td className="px-3 py-2 font-mono text-xs text-muted-foreground tracking-wider whitespace-nowrap">
          {shortStr(artifact.id, 6, 4)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <TypeBadge type={artifact.artifactType} />
        </td>
        <td className="px-3 py-2 font-mono text-xs text-primary/80 whitespace-nowrap max-w-[200px]">
          <a
            href={artifact.cid}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:text-primary hover:underline transition-smooth truncate block"
            title={artifact.cid}
          >
            {shortStr(artifact.cid, 12, 8)}
          </a>
        </td>
        <td
          className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap"
          title={artifact.contentHash}
        >
          {shortStr(artifact.contentHash, 8, 6)}
        </td>
        <td className="px-3 py-2 whitespace-nowrap">
          <IntegrityBadge verified={artifact.verified} />
        </td>
        <td className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
          {truncatePrincipal(artifact.uploadedBy)}
        </td>
        <td className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">
          {formatTimestamp(artifact.timestamp)}
        </td>
        <td className="px-3 py-2 text-center font-mono text-[10px] text-muted-foreground tracking-widest">
          {expanded ? "[▲]" : "[▼]"}
        </td>
      </tr>

      {expanded && (
        <tr
          data-ocid={`artifacts.item.${index + 1}.detail`}
          className="border-b border-primary/20 bg-card/60"
        >
          <td colSpan={8} className="px-4 py-3">
            <ArtifactDetail artifact={artifact} />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Register form ────────────────────────────────────────────────────────────
type TypeKey = "ModelWeights" | "Dataset" | "Config" | "Kernel";

const TYPE_OPTIONS: { value: TypeKey; label: string; variant: ArtifactType }[] =
  [
    {
      value: "ModelWeights",
      label: "MODEL WEIGHTS",
      variant: { ModelWeights: null },
    },
    { value: "Dataset", label: "DATASET", variant: { Dataset: null } },
    { value: "Config", label: "CONFIG", variant: { Config: null } },
    { value: "Kernel", label: "KERNEL", variant: { Kernel: null } },
  ];

function RegisterForm({ onClose }: { onClose: () => void }) {
  const registerArtifact = useRegisterArtifact();
  const [cid, setCid] = useState("");
  const [hash, setHash] = useState("");
  const [typeKey, setTypeKey] = useState<TypeKey>("ModelWeights");
  const [cidError, setCidError] = useState("");
  const [hashError, setHashError] = useState("");

  const validateCid = (v: string): string => {
    if (!v.trim()) return "CID is required";
    if (!v.startsWith("ipfs://") && !v.startsWith("ar://"))
      return 'CID must start with "ipfs://" or "ar://"';
    return "";
  };

  const validateHash = (v: string): string => {
    if (!v.trim()) return "Content hash is required";
    if (!/^[0-9a-fA-F]{64}$/.test(v.trim()))
      return "Must be a valid SHA256 hex string (64 hex chars)";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ce = validateCid(cid);
    const he = validateHash(hash);
    setCidError(ce);
    setHashError(he);
    if (ce || he) return;

    const selected = TYPE_OPTIONS.find((o) => o.value === typeKey);
    if (!selected) return;

    const payload: RegisterArtifactPayload = {
      cid: cid.trim(),
      contentHash: hash.trim(),
      artifactType: selected.variant,
    };

    try {
      const artifact = await registerArtifact.mutateAsync(payload);
      toast.success("ARTIFACT REGISTERED", {
        description: `ID: ${artifact.id.slice(0, 12)}…`,
        duration: 4000,
      });
      onClose();
    } catch (err) {
      toast.error("REGISTRATION FAILED", {
        description: err instanceof Error ? err.message : "Unknown error",
        duration: 5000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-ocid="artifacts.register_form"
      className="crt-border p-4 space-y-4 bg-background mt-2"
    >
      <div className="font-mono text-[10px] text-border tracking-widest">
        ┌─ REGISTER NEW ARTIFACT
        ───────────────────────────────────────────────┐
      </div>

      {/* CID */}
      <div className="space-y-1">
        <label
          htmlFor="artifact-cid"
          className="font-mono text-[10px] text-muted-foreground tracking-widest block"
        >
          &gt; CID
        </label>
        <input
          id="artifact-cid"
          data-ocid="artifacts.cid_input"
          type="text"
          value={cid}
          onChange={(e) => {
            setCid(e.target.value);
            if (cidError) setCidError(validateCid(e.target.value));
          }}
          onBlur={() => setCidError(validateCid(cid))}
          placeholder="ipfs://Qm... or ar://..."
          className="terminal-input w-full px-3 py-2 text-xs tracking-wide"
          autoComplete="off"
          spellCheck={false}
        />
        {cidError && (
          <p
            data-ocid="artifacts.cid_input.field_error"
            className="font-mono text-[10px] text-destructive tracking-wider"
          >
            [!] {cidError}
          </p>
        )}
      </div>

      {/* Hash */}
      <div className="space-y-1">
        <label
          htmlFor="artifact-hash"
          className="font-mono text-[10px] text-muted-foreground tracking-widest block"
        >
          &gt; CONTENT HASH (SHA256)
        </label>
        <input
          id="artifact-hash"
          data-ocid="artifacts.hash_input"
          type="text"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
            if (hashError) setHashError(validateHash(e.target.value));
          }}
          onBlur={() => setHashError(validateHash(hash))}
          placeholder="e3b0c44298fc1c149afbf4c8996fb924..."
          className="terminal-input w-full px-3 py-2 text-xs tracking-wide"
          autoComplete="off"
          spellCheck={false}
        />
        {hashError && (
          <p
            data-ocid="artifacts.hash_input.field_error"
            className="font-mono text-[10px] text-destructive tracking-wider"
          >
            [!] {hashError}
          </p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-1">
        <label
          htmlFor="artifact-type"
          className="font-mono text-[10px] text-muted-foreground tracking-widest block"
        >
          &gt; TYPE
        </label>
        <select
          id="artifact-type"
          data-ocid="artifacts.type_select"
          value={typeKey}
          onChange={(e) => setTypeKey(e.target.value as TypeKey)}
          className="terminal-input w-full px-3 py-2 text-xs tracking-wide"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        <button
          type="submit"
          data-ocid="artifacts.register_submit_button"
          disabled={registerArtifact.isPending}
          className="font-mono text-xs tracking-widest border border-primary/60 text-primary hover:bg-primary/10 hover:border-primary crt-box-glow disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 transition-smooth"
        >
          {registerArtifact.isPending ? "[▸ REGISTERING...]" : "[> REGISTER]"}
        </button>
        <button
          type="button"
          data-ocid="artifacts.register_cancel_button"
          onClick={onClose}
          className="font-mono text-xs tracking-widest border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground px-4 py-2 transition-smooth"
        >
          [CANCEL]
        </button>
        {registerArtifact.isPending && (
          <span
            data-ocid="artifacts.register_form.loading_state"
            className="font-mono text-[10px] text-muted-foreground tracking-widest cursor-blink"
          >
            WRITING TO CHAIN
          </span>
        )}
      </div>

      <div className="font-mono text-[10px] text-border tracking-widest">
        └───────────────────────────────────────────────────────────────────────┘
      </div>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Artifacts() {
  const { data: artifacts, isLoading, isError } = useArtifacts();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");
  const [showForm, setShowForm] = useState(false);

  const filtered = (artifacts ?? []).filter((a) =>
    artifactMatchesFilter(a, activeFilter),
  );

  return (
    <div
      data-ocid="artifacts.page"
      className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full font-mono"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-primary crt-glow text-xl tracking-widest">
          &gt; ARTIFACT REGISTRY
        </h1>

        {/* Filter tabs */}
        <div
          data-ocid="artifacts.filter_tabs"
          className="flex flex-wrap gap-1"
          role="tablist"
          aria-label="Filter artifacts by type"
        >
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeFilter === key}
              data-ocid={`artifacts.filter.${key.toLowerCase()}`}
              onClick={() => setActiveFilter(key)}
              className={`font-mono text-[10px] tracking-widest px-3 py-1.5 border transition-smooth ${
                activeFilter === key
                  ? "crt-active border-primary/60 crt-box-glow"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              [{label}]
            </button>
          ))}
        </div>
      </div>

      {/* Register panel */}
      <div>
        <button
          type="button"
          data-ocid="artifacts.register_toggle_button"
          onClick={() => setShowForm((v) => !v)}
          className={`font-mono text-xs tracking-widest px-4 py-2 border transition-smooth ${
            showForm
              ? "border-primary/60 text-primary crt-active"
              : "border-border text-muted-foreground hover:text-primary hover:border-primary/40"
          }`}
        >
          {showForm ? "[▲ CLOSE REGISTRATION]" : "[+ REGISTER NEW ARTIFACT]"}
        </button>

        {showForm && <RegisterForm onClose={() => setShowForm(false)} />}
      </div>

      {/* Table section */}
      <section data-ocid="artifacts.table" className="w-full overflow-x-auto">
        {isLoading && (
          <div
            data-ocid="artifacts.table.loading_state"
            className="font-mono text-xs text-muted-foreground tracking-widest py-8 text-center crt-border"
          >
            <span className="cursor-blink">
              &gt; QUERYING ARTIFACT REGISTRY
            </span>
          </div>
        )}

        {isError && !isLoading && (
          <div
            data-ocid="artifacts.table.error_state"
            className="font-mono text-xs text-destructive tracking-widest py-8 text-center crt-border"
          >
            [!] FAILED TO LOAD ARTIFACTS — CHECK CANISTER CONNECTION
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div
            data-ocid="artifacts.table.empty_state"
            className="font-mono text-xs text-muted-foreground tracking-widest py-12 text-center crt-border"
          >
            {emptyStateLabel(activeFilter)}
            {activeFilter === "ALL" && (
              <div className="mt-4">
                <button
                  type="button"
                  data-ocid="artifacts.empty_state.register_button"
                  onClick={() => setShowForm(true)}
                  className="font-mono text-xs tracking-widest border border-primary/50 text-primary hover:bg-primary/10 px-4 py-2 transition-smooth"
                >
                  [+ REGISTER FIRST ARTIFACT]
                </button>
              </div>
            )}
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-primary/30">
                {[
                  "ID",
                  "TYPE",
                  "CID",
                  "CONTENT HASH",
                  "INTEGRITY",
                  "UPLOADED BY",
                  "TIMESTAMP",
                  "",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-mono text-[10px] tracking-widest text-primary/60 whitespace-nowrap border-b border-border/40"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((artifact, i) => (
                <ArtifactRow key={artifact.id} artifact={artifact} index={i} />
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Status bar */}
      <div className="status-bar flex items-center justify-between mt-auto">
        <span>
          TOTAL:{" "}
          <span className="text-primary crt-glow">
            {(artifacts ?? []).length} ARTIFACTS
          </span>
        </span>
        <span>
          FILTERED:{" "}
          <span className="text-primary crt-glow">
            {filtered.length} RESULTS
          </span>
        </span>
        <span className="text-muted-foreground">[{activeFilter}]</span>
      </div>
    </div>
  );
}
