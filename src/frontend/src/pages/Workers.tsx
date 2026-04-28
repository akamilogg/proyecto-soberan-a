import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRegisterWorker, useWorkers } from "@/hooks/use-backend";
import {
  type Worker,
  formatTimestamp,
  getWorkerStatusLabel,
  truncatePrincipal,
} from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { toast } from "sonner";

const SKELETONS = [1, 2, 3, 4, 5];

function eloColor(elo: number): string {
  if (elo >= 1200) return "text-primary crt-glow";
  if (elo >= 1000) return "crt-glow-amber text-secondary";
  return "text-destructive";
}

function statusClasses(status: Worker["status"]): string {
  if ("Active" in status) return "text-primary crt-glow";
  if ("Slashed" in status) return "text-secondary crt-glow-amber animate-pulse";
  return "terminal-dim";
}
function rankLabel(n: number): string {
  return `${String(n).padStart(2, "0")}.`;
}

export default function Workers() {
  const { data: workers, isLoading } = useWorkers();
  const registerMutation = useRegisterWorker();
  const { identity } = useInternetIdentity();

  const currentPrincipal = identity?.getPrincipal().toText();

  const sorted = workers ? [...workers].sort((a, b) => b.elo - a.elo) : [];

  const total = sorted.length;
  const active = sorted.filter((w) => "Active" in w.status).length;
  const slashed = sorted.filter((w) => "Slashed" in w.status).length;

  function handleRegister() {
    registerMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("> WORKER REGISTERED — node added to registry", {
          duration: 5000,
        });
      },
      onError: (err) => {
        toast.error(`> ERROR: ${err.message}`, { duration: 6000 });
      },
    });
  }

  return (
    <div className="space-y-6 font-mono" data-ocid="workers.page">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <div className="crt-border bg-card p-4 space-y-4">
        {/* Title row */}
        <div>
          <p className="text-muted-foreground text-xs tracking-widest mb-1">
            ┌─ PROTOCOL NODE LAYER ──────────────────────────────────
          </p>
          <h1
            className="text-primary crt-glow text-2xl font-bold tracking-widest"
            data-ocid="workers.title"
          >
            &gt; WORKER REGISTRY
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest mt-1">
            └─ DISTRIBUTED EVALUATION NODES ─ EGGROLL FITNESS PROTOCOL
          </p>
        </div>

        {/* Stats + register */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-3 flex-1"
            data-ocid="workers.stats_panel"
          >
            {[
              {
                label: "TOTAL NODES",
                value: isLoading ? "—" : total,
                color: "text-primary crt-glow",
              },
              {
                label: "ACTIVE",
                value: isLoading ? "—" : active,
                color: "text-primary crt-glow",
              },
              {
                label: "SLASHED",
                value: isLoading ? "—" : slashed,
                color:
                  slashed > 0
                    ? "crt-glow-amber text-secondary"
                    : "terminal-dim",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-border bg-background p-3 text-center"
              >
                <p className="text-muted-foreground text-xs tracking-widest">
                  {s.label}
                </p>
                <p className={`text-xl font-bold mt-1 tabular-nums ${s.color}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Register button */}
          <Button
            onClick={handleRegister}
            disabled={registerMutation.isPending}
            className="shrink-0 crt-border-active border bg-background text-primary crt-glow tracking-widest text-xs uppercase px-4 py-2 h-auto hover:bg-primary/10 transition-smooth disabled:opacity-50"
            data-ocid="workers.register_button"
          >
            {registerMutation.isPending ? (
              <span className="cursor-blink">REGISTERING</span>
            ) : (
              "[&gt; REGISTER AS WORKER]"
            )}
          </Button>
        </div>
      </div>

      {/* ── TABLE ───────────────────────────────────────────── */}
      <div
        className="crt-border bg-card overflow-x-auto"
        data-ocid="workers.list"
      >
        {/* Table header */}
        <div className="border-b border-border grid grid-cols-12 gap-2 px-4 py-2 text-xs text-muted-foreground tracking-widest bg-muted/30 min-w-[640px]">
          <span className="col-span-1">#</span>
          <span className="col-span-3">WORKER ID</span>
          <span className="col-span-2 text-right">ELO RATING</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-1 text-right">SUBS</span>
          <span className="col-span-1 text-right">SLASHES</span>
          <span className="col-span-2 text-right">LAST SUBMISSION</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border min-w-[640px]">
          {isLoading ? (
            SKELETONS.map((k) => (
              <div key={k} className="px-4 py-3 grid grid-cols-12 gap-2">
                <Skeleton className="col-span-1 h-4 bg-muted/50" />
                <Skeleton className="col-span-3 h-4 bg-muted/50" />
                <Skeleton className="col-span-2 h-4 bg-muted/50 ml-auto" />
                <Skeleton className="col-span-2 h-4 bg-muted/50" />
                <Skeleton className="col-span-1 h-4 bg-muted/50 ml-auto" />
                <Skeleton className="col-span-1 h-4 bg-muted/50 ml-auto" />
                <Skeleton className="col-span-2 h-4 bg-muted/50 ml-auto" />
              </div>
            ))
          ) : sorted.length === 0 ? (
            <div
              className="px-4 py-14 text-center space-y-3"
              data-ocid="workers.empty_state"
            >
              <p className="text-primary crt-glow text-base tracking-widest">
                &gt; NO WORKERS REGISTERED
              </p>
              <p className="text-muted-foreground text-xs tracking-widest">
                ──────────────────────────────────────────────────
              </p>
              <p className="text-muted-foreground text-xs tracking-wide">
                Be the first node in the network. Click [&gt; REGISTER AS
                WORKER] to join the EGGROLL fitness protocol.
              </p>
              <p className="text-muted-foreground text-xs tracking-widest">
                ──────────────────────────────────────────────────
              </p>
            </div>
          ) : (
            sorted.map((worker, i) => {
              const isCurrentUser =
                currentPrincipal && worker.id.toText() === currentPrincipal;
              const isSlashed = "Slashed" in worker.status;

              return (
                <div
                  key={worker.id.toText()}
                  className={[
                    "px-4 py-3 grid grid-cols-12 gap-2 items-center terminal-row-hover transition-smooth",
                    isCurrentUser ? "crt-active" : "",
                    isSlashed ? "opacity-50" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  data-ocid={`workers.item.${i + 1}`}
                >
                  {/* Rank */}
                  <span className="col-span-1 text-muted-foreground text-xs tabular-nums">
                    {rankLabel(i + 1)}
                  </span>

                  {/* Worker ID */}
                  <span className="col-span-3 flex items-center gap-2 min-w-0">
                    <span className="text-primary text-xs font-mono truncate tracking-wide">
                      {truncatePrincipal(worker.id)}
                    </span>
                    {isCurrentUser && (
                      <span
                        className="shrink-0 text-primary crt-glow border border-primary/60 px-1 text-xs tracking-widest"
                        data-ocid={`workers.you_badge.${i + 1}`}
                      >
                        [ YOU ]
                      </span>
                    )}
                  </span>

                  {/* ELO */}
                  <span
                    className={`col-span-2 text-xs text-right font-mono tabular-nums ${
                      isSlashed
                        ? "line-through opacity-60"
                        : eloColor(worker.elo)
                    }`}
                    data-ocid={`workers.elo.${i + 1}`}
                  >
                    {worker.elo.toFixed(2)}
                  </span>

                  {/* Status */}
                  <span
                    className={`col-span-2 text-xs tracking-widest ${statusClasses(worker.status)}`}
                    data-ocid={`workers.status.${i + 1}`}
                  >
                    #{getWorkerStatusLabel(worker.status)}
                  </span>

                  {/* Submissions */}
                  <span className="col-span-1 text-muted-foreground text-xs text-right tabular-nums">
                    {worker.totalSubmissions.toString()}
                  </span>

                  {/* Slash count */}
                  <span
                    className={`col-span-1 text-xs text-right tabular-nums ${
                      worker.slashCount > BigInt(0)
                        ? "crt-glow-amber text-secondary"
                        : "terminal-dim"
                    }`}
                  >
                    {worker.slashCount.toString()}
                  </span>

                  {/* Last submission */}
                  <span className="col-span-2 text-muted-foreground text-xs text-right truncate">
                    {worker.lastSubmission.length > 0 &&
                    worker.lastSubmission[0]
                      ? formatTimestamp(worker.lastSubmission[0])
                      : "NEVER"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── STATUS BAR ──────────────────────────────────────── */}
      {!isLoading && sorted.length > 0 && (
        <div className="status-bar flex justify-between items-center">
          <span className="text-muted-foreground">
            NODES: {total} &nbsp;|&nbsp; SORTED BY ELO DESC
          </span>
          <span className="text-primary">&gt; REGISTRY ONLINE</span>
        </div>
      )}
    </div>
  );
}
