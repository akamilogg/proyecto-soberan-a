import type { Principal } from "@icp-sdk/core/principal";

export interface EggrollParams {
  r: bigint;
  alpha: number;
  nPopulation: bigint;
  epochs: bigint;
}

export type TaskStatus =
  | { Active: null }
  | { Pending: null }
  | { Completed: null }
  | { Cancelled: null };

export type WorkerStatus =
  | { Active: null }
  | { Inactive: null }
  | { Slashed: null };

export type ArtifactType =
  | { ModelWeights: null }
  | { Dataset: null }
  | { Config: null }
  | { Kernel: null };

export interface Task {
  id: string;
  modelArtifactId: string;
  datasetArtifactId: string;
  params: EggrollParams;
  status: TaskStatus;
  currentGeneration: bigint;
  totalGenerations: bigint;
  createdBy: Principal;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface Worker {
  id: Principal;
  elo: number;
  status: WorkerStatus;
  lastSubmission: [] | [bigint];
  totalSubmissions: bigint;
  slashCount: bigint;
}

export interface Artifact {
  id: string;
  artifactType: ArtifactType;
  contentHash: string;
  cid: string;
  uploadedBy: Principal;
  timestamp: bigint;
  verified: boolean;
}

export interface ProtocolStats {
  currentGeneration: bigint;
  activeWorkers: bigint;
  pendingTasks: bigint;
  completedTasks: bigint;
  totalWorkers: bigint;
}

export interface GenerationResult {
  taskId: string;
  generation: bigint;
  bestFitness: number;
  averageFitness: number;
  workerCount: bigint;
  timestamp: bigint;
}

export interface WorkerSubmission {
  workerId: Principal;
  taskId: string;
  generation: bigint;
  fitness: number;
  timestamp: bigint;
}

export interface CreateTaskPayload {
  modelArtifactId: string;
  datasetArtifactId: string;
  params: EggrollParams;
  totalGenerations: bigint;
}

export interface RegisterArtifactPayload {
  artifactType: ArtifactType;
  contentHash: string;
  cid: string;
}

// Utility helpers
export function getTaskStatusLabel(status: TaskStatus): string {
  if ("Active" in status) return "ACTIVE";
  if ("Pending" in status) return "PENDING";
  if ("Completed" in status) return "COMPLETED";
  if ("Cancelled" in status) return "CANCELLED";
  return "UNKNOWN";
}

export function getWorkerStatusLabel(status: WorkerStatus): string {
  if ("Active" in status) return "ACTIVE";
  if ("Inactive" in status) return "INACTIVE";
  if ("Slashed" in status) return "SLASHED";
  return "UNKNOWN";
}

export function getArtifactTypeLabel(type: ArtifactType): string {
  if ("ModelWeights" in type) return "MODEL";
  if ("Dataset" in type) return "DATASET";
  if ("Config" in type) return "CONFIG";
  if ("Kernel" in type) return "KERNEL";
  return "UNKNOWN";
}

export function truncatePrincipal(p: Principal): string {
  const s = p.toText();
  if (s.length <= 12) return s;
  return `${s.slice(0, 5)}…${s.slice(-4)}`;
}

export function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
