import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSubmitFitness,
  useTask,
  useTaskGenerations,
  useTaskSubmissions,
} from "@/hooks/use-backend";
import {
  formatTimestamp,
  getTaskStatusLabel,
  truncatePrincipal,
} from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

// ─── helpers ────────────────────────────────────────────────────────────────

function AsciiProgressBar({
  current,
  total,
}: { current: bigint; total: bigint }) {
  const WIDTH = 30;
  const pct = total > 0n ? Number((current * BigInt(WIDTH)) / total) : 0;
  const filled = Math.min(pct, WIDTH);
  const empty = WIDTH - filled;
  const bar =
    filled === 0
      ? `[${"·".repeat(WIDTH)}]`
      : filled === WIDTH
        ? `[${"=".repeat(WIDTH)}]`
        : `[${"=".repeat(filled - 1)}>${"·".repeat(empty)}]`;
  return <span className="text-primary crt-glow font-mono">{bar}</span>;
}

function StatusBadge({ status }: { status: import("@/types").TaskStatus }) {
  const label = getTaskStatusLabel(status);

  if ("Active" in status)
    return (
      <span
        className="text-primary crt-glow text-xs tracking-widest font-bold border border-primary/60 px-2 py-0.5"
        data-ocid="task_detail.status_badge"
      >
        ◉ {label}
      </span>
    );

  if ("Completed" in status)
    return (
      <span
        className="text-secondary crt-glow-amber text-xs tracking-widest font-bold border border-secondary/60 px-2 py-0.5"
        data-ocid="task_detail.status_badge"
      >
        ✓ {label}
      </span>
    );

  if ("Cancelled" in status)
    return (
      <span
        className="text-destructive text-xs tracking-widest font-bold border border-destructive/40 px-2 py-0.5 opacity-70"
        data-ocid="task_detail.status_badge"
      >
        ✗ {label}
      </span>
    );

  // Pending — dim
  return (
    <span
      className="terminal-dim text-xs tracking-widest font-bold border border-border px-2 py-0.5"
      data-ocid="task_detail.status_badge"
    >
      ○ {label}
    </span>
  );
}

function PanelHeader({ title }: { title: string }) {
  const line = "─".repeat(Math.max(0, 38 - title.length - 4));
  return (
    <div className="px-4 py-2 border-b border-border">
      <span className="text-primary text-xs tracking-widest font-bold crt-glow">
        ┌─ {title} {line}┐
      </span>
    </div>
  );
}

const GEN_SKELETONS = ["g1", "g2", "g3"];
const SUB_SKELETONS = ["s1", "s2", "s3"];

// ─── Submit fitness form ─────────────────────────────────────────────────────

function SubmitFitnessForm({
  taskId,
  currentGeneration,
}: { taskId: string; currentGeneration: bigint }) {
  const [generation, setGeneration] = useState(currentGeneration.toString());
  const [fitness, setFitness] = useState("");
  const submitFitness = useSubmitFitness();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const gen = BigInt(generation);
    const fit = Number.parseFloat(fitness);
    if (Number.isNaN(fit)) {
      toast.error("FITNESS SCORE MUST BE A VALID NUMBER");
      return;
    }
    submitFitness.mutate(
      { taskId, generation: gen, fitness: fit },
      {
        onSuccess: () => {
          toast.success("EVALUATION SUBMITTED");
          setFitness("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <div
      className="border border-primary/40 crt-border bg-card"
      data-ocid="task_detail.submit_panel"
    >
      <PanelHeader title="SUBMIT EVALUATION" />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs tracking-widest">
              GENERATION #
            </Label>
            <Input
              className="terminal-input h-8 text-xs tracking-wider"
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              pattern="[0-9]+"
              required
              data-ocid="task_detail.generation_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs tracking-widest">
              FITNESS SCORE
            </Label>
            <Input
              className="terminal-input h-8 text-xs tracking-wider"
              placeholder="e.g. 0.8312"
              value={fitness}
              onChange={(e) => setFitness(e.target.value)}
              step="any"
              required
              data-ocid="task_detail.fitness_input"
            />
          </div>
        </div>

        {submitFitness.isError && (
          <p
            className="text-destructive text-xs tracking-wide"
            data-ocid="task_detail.submit_error_state"
          >
            ✗ ERROR: {submitFitness.error.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={submitFitness.isPending}
          className="w-full sm:w-auto h-8 text-xs tracking-widest font-bold border border-primary/60 bg-primary/10 text-primary hover:bg-primary/20 hover:crt-glow transition-smooth"
          data-ocid="task_detail.submit_button"
        >
          {submitFitness.isPending ? (
            <span className="cursor-blink">SUBMITTING</span>
          ) : (
            <>
              <ChevronRight className="w-3 h-3 mr-1" />
              SUBMIT EVALUATION
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TaskDetail() {
  const { taskId } = useParams({ from: "/protected/tasks/$taskId" });
  const { data: task, isLoading } = useTask(taskId);
  const { data: generations } = useTaskGenerations(taskId);
  const { data: submissions } = useTaskSubmissions(taskId);

  // Loading state
  if (isLoading) {
    return (
      <div
        className="space-y-4 font-mono"
        data-ocid="task_detail.loading_state"
      >
        <Skeleton className="h-8 w-72 bg-card border border-border" />
        <Skeleton className="h-40 w-full bg-card border border-border" />
        <Skeleton className="h-40 w-full bg-card border border-border" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="font-mono" data-ocid="task_detail.error_state">
        <div className="border border-border bg-card p-8 text-center crt-border">
          <p className="text-destructive text-xs tracking-widest crt-glow mb-4">
            ✗ TASK NOT FOUND: {taskId}
          </p>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 text-primary text-xs tracking-widest hover:crt-glow transition-smooth"
            data-ocid="task_detail.back_link"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK TO TASKS
          </Link>
        </div>
      </div>
    );
  }

  const progress =
    task.totalGenerations > 0n
      ? Number((task.currentGeneration * 100n) / task.totalGenerations)
      : 0;

  const isActive = "Active" in task.status;
  const latestGen =
    generations && generations.length > 0
      ? generations[generations.length - 1]
      : null;

  return (
    <div className="space-y-6 font-mono" data-ocid="task_detail.page">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest">
        <Link
          to="/tasks"
          className="hover:text-primary transition-smooth flex items-center gap-1"
          data-ocid="task_detail.back_link"
        >
          <ArrowLeft className="w-3 h-3" />
          TASKS
        </Link>
        <span>/</span>
        <span className="text-primary truncate max-w-xs">{taskId}</span>
      </div>

      {/* ── TASK HEADER ──────────────────────────────────────────────── */}
      <div
        className="border border-border bg-card crt-border"
        data-ocid="task_detail.header_panel"
      >
        <PanelHeader title="TASK HEADER" />
        <div className="px-4 py-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <p className="text-muted-foreground text-xs tracking-widest">
                TASK ID
              </p>
              <h1
                className="text-primary crt-glow text-sm font-bold tracking-wider break-all"
                data-ocid="task_detail.task_id"
              >
                {task.id}
              </h1>
            </div>
            <StatusBadge status={task.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div>
              <p className="text-muted-foreground tracking-widest mb-0.5">
                CREATED BY
              </p>
              <p className="text-primary font-mono">
                {truncatePrincipal(task.createdBy)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground tracking-widest mb-0.5">
                CREATED AT
              </p>
              <p className="text-muted-foreground">
                {formatTimestamp(task.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground tracking-widest mb-0.5">
                MODEL ARTIFACT
              </p>
              <p className="text-primary truncate">{task.modelArtifactId}</p>
            </div>
            <div>
              <p className="text-muted-foreground tracking-widest mb-0.5">
                DATASET ARTIFACT
              </p>
              <p className="text-primary truncate">{task.datasetArtifactId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRESS ─────────────────────────────────────────────────── */}
      <div
        className="border border-border bg-card crt-border"
        data-ocid="task_detail.progress_panel"
      >
        <PanelHeader title="PROGRESS" />
        <div className="px-4 py-4 space-y-4">
          {/* ASCII progress bar */}
          <div className="space-y-1">
            <AsciiProgressBar
              current={task.currentGeneration}
              total={task.totalGenerations}
            />
            <p className="text-xs text-muted-foreground tracking-widest mt-1">
              GENERATION{" "}
              <span className="text-primary">
                {task.currentGeneration.toString()}
              </span>{" "}
              /{" "}
              <span className="text-muted-foreground">
                {task.totalGenerations.toString()}
              </span>
              <span className="ml-4 text-primary">{progress}%</span>
            </p>
          </div>

          {/* EGGROLL params grid */}
          <div>
            <p className="text-muted-foreground text-xs tracking-widest mb-2">
              EGGROLL HYPERPARAMETERS
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "RANK (r)", value: task.params.r.toString() },
                { label: "ALPHA (α)", value: task.params.alpha.toFixed(4) },
                {
                  label: "POPULATION",
                  value: task.params.nPopulation.toString(),
                },
                { label: "EPOCHS", value: task.params.epochs.toString() },
              ].map((p) => (
                <div
                  key={p.label}
                  className="border border-border bg-muted/20 px-3 py-2"
                >
                  <p className="text-muted-foreground text-xs tracking-widest mb-1">
                    {p.label}
                  </p>
                  <p className="text-primary crt-glow text-sm font-bold font-mono">
                    {p.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── GENERATION RESULTS ───────────────────────────────────────── */}
      <div
        className="border border-border bg-card crt-border"
        data-ocid="task_detail.generations_panel"
      >
        <PanelHeader title="GENERATION RESULTS" />
        {/* Column headers */}
        <div className="px-4 py-2 border-b border-border grid grid-cols-5 gap-2 text-xs text-muted-foreground tracking-widest">
          <span>GEN #</span>
          <span className="text-right">BEST FITNESS</span>
          <span className="text-right">AVG FITNESS</span>
          <span className="text-right">WORKERS</span>
          <span className="text-right">TIMESTAMP</span>
        </div>
        <div className="divide-y divide-border max-h-72 overflow-y-auto">
          {!generations ? (
            GEN_SKELETONS.map((k) => (
              <div key={k} className="px-4 py-3">
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            ))
          ) : generations.length === 0 ? (
            <div
              className="px-4 py-8 text-muted-foreground text-xs tracking-wide"
              data-ocid="task_detail.generations.empty_state"
            >
              <span className="text-primary/50">{"> "}</span>
              AWAITING FIRST GENERATION RESULTS
            </div>
          ) : (
            [...generations].reverse().map((gen, i) => {
              const isLatest = latestGen?.generation === gen.generation;
              return (
                <div
                  key={`${gen.taskId}-${gen.generation}`}
                  className={`px-4 py-2.5 grid grid-cols-5 gap-2 text-xs terminal-row-hover ${isLatest ? "crt-active" : ""}`}
                  data-ocid={`task_detail.generation.item.${i + 1}`}
                >
                  <span
                    className={`font-mono ${isLatest ? "text-primary crt-glow font-bold" : "text-primary"}`}
                  >
                    {gen.generation.toString().padStart(4, "0")}
                    {isLatest && <span className="ml-1 text-secondary">◄</span>}
                  </span>
                  <span
                    className={`text-right ${isLatest ? "text-primary crt-glow font-bold" : "text-primary"}`}
                  >
                    {gen.bestFitness.toFixed(4)}
                  </span>
                  <span className="text-muted-foreground text-right">
                    {gen.averageFitness.toFixed(4)}
                  </span>
                  <span className="text-muted-foreground text-right">
                    {gen.workerCount.toString()}
                  </span>
                  <span className="text-muted-foreground text-right text-xs">
                    {formatTimestamp(gen.timestamp)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── WORKER SUBMISSIONS ───────────────────────────────────────── */}
      <div
        className="border border-border bg-card crt-border"
        data-ocid="task_detail.submissions_panel"
      >
        <PanelHeader title="WORKER SUBMISSIONS" />
        {/* Column headers */}
        <div className="px-4 py-2 border-b border-border grid grid-cols-4 gap-2 text-xs text-muted-foreground tracking-widest">
          <span className="col-span-2">WORKER ID</span>
          <span className="text-right">GEN / FITNESS</span>
          <span className="text-right">TIMESTAMP</span>
        </div>
        <div className="divide-y divide-border max-h-56 overflow-y-auto">
          {!submissions ? (
            SUB_SKELETONS.map((k) => (
              <div key={k} className="px-4 py-3">
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            ))
          ) : submissions.length === 0 ? (
            <div
              className="px-4 py-8 text-muted-foreground text-xs tracking-wide"
              data-ocid="task_detail.submissions.empty_state"
            >
              <span className="text-primary/50">{"> "}</span>
              NO SUBMISSIONS YET
            </div>
          ) : (
            [...submissions]
              .sort((a, b) => Number(b.timestamp - a.timestamp))
              .slice(0, 20)
              .map((sub, i) => (
                <div
                  key={`${sub.workerId.toText()}-${sub.generation}-${sub.timestamp}`}
                  className="px-4 py-2.5 grid grid-cols-4 gap-2 text-xs terminal-row-hover"
                  data-ocid={`task_detail.submission.item.${i + 1}`}
                >
                  <span className="col-span-2 text-primary font-mono truncate">
                    {truncatePrincipal(sub.workerId)}
                  </span>
                  <span className="text-right font-mono">
                    <span className="text-muted-foreground">
                      {sub.generation.toString().padStart(3, "0")}
                    </span>
                    <span className="text-border mx-1">/</span>
                    <span className="text-primary">
                      {sub.fitness.toFixed(4)}
                    </span>
                  </span>
                  <span className="text-muted-foreground text-right text-xs">
                    {formatTimestamp(sub.timestamp)}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* ── SUBMIT FITNESS (only if Running) ─────────────────────────── */}
      {isActive && (
        <SubmitFitnessForm
          taskId={taskId}
          currentGeneration={task.currentGeneration}
        />
      )}
    </div>
  );
}
