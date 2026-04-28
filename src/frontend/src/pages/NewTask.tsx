import {
  useArtifacts,
  useCreateTask,
  useRegisterArtifact,
} from "@/hooks/use-backend";
import type { Artifact, ArtifactType, RegisterArtifactPayload } from "@/types";
import { getArtifactTypeLabel } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

// ── ASCII panel wrapper ──────────────────────────────────────────────────────
function TerminalPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="crt-border bg-card">
      <div className="px-4 py-2 border-b border-border flex items-center gap-2 overflow-hidden">
        <span className="text-muted-foreground font-mono text-xs shrink-0">
          ┌──
        </span>
        <span className="font-mono text-xs tracking-widest text-primary crt-glow uppercase shrink-0">
          {title}
        </span>
        <span className="flex-1 text-muted-foreground font-mono text-xs overflow-hidden">
          {"─".repeat(50)}
        </span>
        <span className="text-muted-foreground font-mono text-xs shrink-0">
          ──┐
        </span>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

// ── Labelled field row ───────────────────────────────────────────────────────
function FieldRow({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <span className="block font-mono text-xs text-primary crt-glow tracking-widest">
        {label}
      </span>
      {children}
      {hint && (
        <p className="font-mono text-xs terminal-dim tracking-wide">{hint}</p>
      )}
    </div>
  );
}

// ── Artifact dropdown ────────────────────────────────────────────────────────
function ArtifactSelect({
  artifacts,
  value,
  onChange,
  filterType,
  ocid,
}: {
  artifacts: Artifact[];
  value: string;
  onChange: (v: string) => void;
  filterType: "ModelWeights" | "Dataset";
  ocid: string;
}) {
  const filtered = artifacts.filter((a) => filterType in a.artifactType);

  return (
    <select
      data-ocid={ocid}
      className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide appearance-none cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">-- SELECT ARTIFACT --</option>
      {filtered.map((a) => (
        <option key={a.id} value={a.id}>
          [{getArtifactTypeLabel(a.artifactType)}] {a.id.slice(0, 12)}…{"  "}
          hash:{a.contentHash.slice(0, 10)}…{"  "}
          {a.verified ? "[VERIFIED]" : "[UNVERIFIED]"}
        </option>
      ))}
      {filtered.length === 0 && (
        <option value="" disabled>
          NO {filterType.toUpperCase()} ARTIFACTS REGISTERED
        </option>
      )}
    </select>
  );
}

// ── Register artifact sub-form ───────────────────────────────────────────────
function RegisterArtifactForm({ onSuccess }: { onSuccess: () => void }) {
  const registerArtifact = useRegisterArtifact();
  const [cid, setCid] = useState("");
  const [hash, setHash] = useState("");
  const [artifactTypeName, setArtifactTypeName] = useState<
    "ModelWeights" | "Dataset" | "Config" | "Kernel"
  >("ModelWeights");
  const [localError, setLocalError] = useState("");

  const typeOptions: {
    value: "ModelWeights" | "Dataset" | "Config" | "Kernel";
    label: string;
  }[] = [
    { value: "ModelWeights", label: "MODEL WEIGHTS" },
    { value: "Dataset", label: "DATASET" },
    { value: "Config", label: "CONFIG" },
    { value: "Kernel", label: "KERNEL" },
  ];

  const artifactTypeMap: Record<string, ArtifactType> = {
    ModelWeights: { ModelWeights: null },
    Dataset: { Dataset: null },
    Config: { Config: null },
    Kernel: { Kernel: null },
  };

  async function handleRegister(e: React.FormEvent) {
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

    const payload: RegisterArtifactPayload = {
      artifactType: artifactTypeMap[artifactTypeName] as ArtifactType,
      contentHash: hash.trim(),
      cid: cid.trim(),
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

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-3 pt-3 border-t border-border"
    >
      <p className="font-mono text-xs tracking-widest text-primary/60">
        {"// REGISTER NEW ARTIFACT"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldRow
          label="> CID (ipfs:// or ar://)"
          hint="Content identifier on IPFS or Arweave"
        >
          <input
            data-ocid="register_artifact.cid_input"
            type="text"
            className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
            placeholder="ipfs://Qm..."
            value={cid}
            onChange={(e) => setCid(e.target.value)}
          />
        </FieldRow>

        <FieldRow
          label="> CONTENT HASH (SHA256)"
          hint="On-chain integrity fingerprint"
        >
          <input
            data-ocid="register_artifact.hash_input"
            type="text"
            className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
            placeholder="sha256:abc123..."
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
        </FieldRow>
      </div>

      <FieldRow label="> ARTIFACT TYPE">
        <select
          data-ocid="register_artifact.type_select"
          className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide appearance-none cursor-pointer"
          value={artifactTypeName}
          onChange={(e) =>
            setArtifactTypeName(
              e.target.value as
                | "ModelWeights"
                | "Dataset"
                | "Config"
                | "Kernel",
            )
          }
        >
          {typeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </FieldRow>

      {localError && (
        <p
          data-ocid="register_artifact.error_state"
          className="font-mono text-xs crt-glow-amber tracking-wide"
        >
          !! {localError}
        </p>
      )}

      {registerArtifact.isSuccess && (
        <p
          data-ocid="register_artifact.success_state"
          className="font-mono text-xs crt-glow tracking-wide"
        >
          ✓ ARTIFACT REGISTERED — UPDATING LIST...
        </p>
      )}

      <button
        data-ocid="register_artifact.submit_button"
        type="submit"
        disabled={registerArtifact.isPending}
        className="font-mono text-xs tracking-widest px-4 py-2 crt-border text-primary crt-glow hover:bg-primary/10 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {registerArtifact.isPending
          ? "[> REGISTERING...]"
          : "[> REGISTER ARTIFACT]"}
      </button>
    </form>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function NewTask() {
  const navigate = useNavigate();
  const { data: allArtifacts = [], isLoading: artifactsLoading } =
    useArtifacts();
  const createTask = useCreateTask();

  const [modelArtifactId, setModelArtifactId] = useState("");
  const [datasetArtifactId, setDatasetArtifactId] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const [rank, setRank] = useState(4);
  const [alpha, setAlpha] = useState(0.01);
  const [nPopulation, setNPopulation] = useState(10);
  const [epochs, setEpochs] = useState(3);
  const [totalGenerations, setTotalGenerations] = useState(5);

  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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
          epochs: BigInt(epochs),
        },
        totalGenerations: BigInt(totalGenerations),
      });
      navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "TASK CREATION FAILED");
    }
  }

  const effectiveScale = (alpha / Math.sqrt(rank)).toFixed(6);
  const totalEvals = nPopulation * totalGenerations;

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-6 space-y-5 animate-terminal-boot font-mono"
      data-ocid="new_task.page"
    >
      {/* Page header */}
      <div className="space-y-1">
        <div className="text-xs tracking-widest text-muted-foreground">
          /tasks/new
        </div>
        <h1 className="text-lg tracking-widest text-primary crt-glow uppercase cursor-blink">
          NEW FINE-TUNING TASK
        </h1>
        <p className="text-xs terminal-dim tracking-wide">
          Launch an EGGROLL evolutionary fine-tuning run across the distributed
          worker network.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Panel 1: Artifact References ──────────────────────────────── */}
        <TerminalPanel title="[1/3] ARTIFACT REFERENCES">
          {artifactsLoading ? (
            <p
              data-ocid="artifacts.loading_state"
              className="text-xs terminal-dim tracking-widest cursor-blink"
            >
              LOADING ARTIFACTS...
            </p>
          ) : (
            <div className="space-y-4">
              <FieldRow
                label="> MODEL ARTIFACT (ModelWeights)"
                hint="Base checkpoint for fine-tuning — 1B params, int8 recommended."
              >
                <ArtifactSelect
                  ocid="newtask.model_select"
                  artifacts={allArtifacts}
                  value={modelArtifactId}
                  onChange={setModelArtifactId}
                  filterType="ModelWeights"
                />
                {allArtifacts.filter((a) => "ModelWeights" in a.artifactType)
                  .length === 0 && (
                  <p className="text-xs crt-glow-amber tracking-wide mt-1">
                    ► No model artifacts yet — register one below.
                  </p>
                )}
              </FieldRow>

              <FieldRow
                label="> DATASET ARTIFACT"
                hint="Fine-tuning instruction/response dataset (jsonl format)."
              >
                <ArtifactSelect
                  ocid="newtask.dataset_select"
                  artifacts={allArtifacts}
                  value={datasetArtifactId}
                  onChange={setDatasetArtifactId}
                  filterType="Dataset"
                />
                {allArtifacts.filter((a) => "Dataset" in a.artifactType)
                  .length === 0 && (
                  <p className="text-xs crt-glow-amber tracking-wide mt-1">
                    ► No dataset artifacts yet — register one below.
                  </p>
                )}
              </FieldRow>

              {/* Expandable register section */}
              <div className="crt-border bg-background/40">
                <button
                  type="button"
                  data-ocid="newtask.register_artifact_toggle"
                  onClick={() => setShowRegister((v) => !v)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs tracking-widest text-primary/70 hover:text-primary hover:bg-primary/5 transition-smooth text-left"
                >
                  {showRegister ? (
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  ) : (
                    <ChevronRight className="h-3 w-3 shrink-0" />
                  )}
                  OR REGISTER NEW ARTIFACT
                </button>

                {showRegister && (
                  <div className="px-4 pb-4">
                    <RegisterArtifactForm
                      onSuccess={() => setShowRegister(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </TerminalPanel>

        {/* ── Panel 2: EGGROLL Parameters ───────────────────────────────── */}
        <TerminalPanel title="[2/3] EGGROLL PARAMETERS">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow
              label="> RANK (r)"
              hint="Low-rank dimension. Higher = more expressive, more memory."
            >
              <input
                data-ocid="newtask.rank_input"
                type="number"
                min={1}
                max={64}
                step={1}
                className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
              />
            </FieldRow>

            <FieldRow
              label="> ALPHA (α)"
              hint="Learning rate scalar. Effective scale = α/√r."
            >
              <input
                data-ocid="newtask.alpha_input"
                type="number"
                min={0.0001}
                max={1.0}
                step={0.0001}
                className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
              />
            </FieldRow>

            <FieldRow
              label="> POPULATION SIZE (N)"
              hint="Workers evaluated per generation. More = better consensus."
            >
              <input
                data-ocid="newtask.population_input"
                type="number"
                min={2}
                max={100}
                step={1}
                className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
                value={nPopulation}
                onChange={(e) => setNPopulation(Number(e.target.value))}
              />
            </FieldRow>

            <FieldRow
              label="> EPOCHS"
              hint="Dataset passes per worker per generation."
            >
              <input
                data-ocid="newtask.epochs_input"
                type="number"
                min={1}
                max={50}
                step={1}
                className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
              />
            </FieldRow>

            <FieldRow
              label="> TOTAL GENERATIONS"
              hint="Evolutionary cycles to run before task completion."
            >
              <input
                data-ocid="newtask.generations_input"
                type="number"
                min={1}
                max={200}
                step={1}
                className="terminal-input w-full px-3 py-2 text-xs font-mono tracking-wide"
                value={totalGenerations}
                onChange={(e) => setTotalGenerations(Number(e.target.value))}
              />
            </FieldRow>
          </div>

          {/* Computed summary */}
          <div className="mt-2 p-3 bg-background/60 crt-border text-xs space-y-1 terminal-dim">
            <p className="text-primary/60 tracking-widest">
              {"// COMPUTED SUMMARY"}
            </p>
            <p>
              update_scale{"    "}= α/√r{"  "}= {effectiveScale}
            </p>
            <p>total_evaluations = N×gen = {totalEvals}</p>
            <p>
              perturbation_dim{"  "}= r{"    "}= {rank} (vs full-rank 1B)
            </p>
          </div>
        </TerminalPanel>

        {/* ── Panel 3: Launch ──────────────────────────────────────────── */}
        <TerminalPanel title="[3/3] LAUNCH">
          <div className="space-y-3">
            <div className="text-xs space-y-1">
              <p className="text-primary/60 tracking-widest">
                {"// PRE-FLIGHT CHECK"}
              </p>
              <p className={modelArtifactId ? "text-primary" : "terminal-dim"}>
                {modelArtifactId ? "✓" : "○"} Model artifact:{" "}
                {modelArtifactId
                  ? `${modelArtifactId.slice(0, 18)}…`
                  : "NOT SET"}
              </p>
              <p
                className={datasetArtifactId ? "text-primary" : "terminal-dim"}
              >
                {datasetArtifactId ? "✓" : "○"} Dataset artifact:{" "}
                {datasetArtifactId
                  ? `${datasetArtifactId.slice(0, 18)}…`
                  : "NOT SET"}
              </p>
              <p className="text-primary">
                ✓ EGGROLL r={rank} α={alpha} N={nPopulation} epochs={epochs}
              </p>
              <p className="text-primary">
                ✓ {totalGenerations} generations scheduled ({totalEvals} total
                evaluations)
              </p>
            </div>

            {formError && (
              <p
                data-ocid="new_task.error_state"
                className="text-xs crt-glow-amber tracking-wide"
              >
                !! ERROR: {formError}
              </p>
            )}

            {(!modelArtifactId || !datasetArtifactId) && (
              <p className="text-xs terminal-dim tracking-wide">
                ↑ Select both artifacts above to enable launch.
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap pt-1">
              <button
                data-ocid="new_task.submit_button"
                type="submit"
                disabled={
                  createTask.isPending || !modelArtifactId || !datasetArtifactId
                }
                className="text-sm tracking-widest px-6 py-3 crt-border crt-box-glow text-primary crt-glow hover:bg-primary/10 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed uppercase"
              >
                {createTask.isPending
                  ? "[> LAUNCHING...]"
                  : "[> LAUNCH FINE-TUNING TASK]"}
              </button>

              <button
                data-ocid="new_task.cancel_button"
                type="button"
                onClick={() => navigate({ to: "/tasks" })}
                className="text-xs tracking-widest px-4 py-2 text-muted-foreground hover:text-primary transition-smooth"
              >
                [CANCEL]
              </button>
            </div>
          </div>
        </TerminalPanel>
      </form>
    </div>
  );
}
