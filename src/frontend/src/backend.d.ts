import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Artifact {
    id: ArtifactId;
    cid: string;
    verified: boolean;
    artifactType: ArtifactType;
    contentHash: string;
    timestamp: Timestamp;
    uploadedBy: Principal;
}
export type Timestamp = bigint;
export interface WorkerSubmission {
    workerId: Principal;
    generation: bigint;
    taskId: TaskId;
    fitness: number;
    timestamp: Timestamp;
}
export type TaskId = string;
export interface Task {
    id: TaskId;
    modelArtifactId: ArtifactId;
    status: TaskStatus;
    currentGeneration: bigint;
    datasetArtifactId: ArtifactId;
    createdAt: Timestamp;
    createdBy: Principal;
    totalGenerations: bigint;
    updatedAt: Timestamp;
    params: EggrollParams;
}
export interface ProtocolStats {
    currentGeneration: bigint;
    completedTasks: bigint;
    totalWorkers: bigint;
    activeWorkers: bigint;
    pendingTasks: bigint;
}
export interface EggrollParams {
    r: bigint;
    alpha: number;
    epochs: bigint;
    nPopulation: bigint;
}
export interface Worker {
    id: Principal;
    elo: number;
    status: WorkerStatus;
    slashCount: bigint;
    lastSubmission?: Timestamp;
    totalSubmissions: bigint;
}
export interface GenerationResult {
    bestFitness: number;
    generation: bigint;
    taskId: TaskId;
    timestamp: Timestamp;
    averageFitness: number;
    workerCount: bigint;
}
export type ArtifactId = string;
export enum ArtifactType {
    ModelWeights = "ModelWeights",
    Kernel = "Kernel",
    Dataset = "Dataset",
    Config = "Config"
}
export enum TaskStatus {
    Active = "Active",
    Cancelled = "Cancelled",
    Completed = "Completed",
    Pending = "Pending"
}
export enum WorkerStatus {
    Inactive = "Inactive",
    Active = "Active",
    Slashed = "Slashed"
}
export interface backendInterface {
    createTask(modelArtifactId: string, datasetArtifactId: string, params: EggrollParams, totalGenerations: bigint): Promise<{
        __kind__: "ok";
        ok: Task;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getArtifact(id: string): Promise<Artifact | null>;
    getArtifacts(): Promise<Array<Artifact>>;
    getStats(): Promise<ProtocolStats>;
    getTask(id: string): Promise<Task | null>;
    getTaskGenerations(taskId: string): Promise<Array<GenerationResult>>;
    getTaskSubmissions(taskId: string): Promise<Array<WorkerSubmission>>;
    getTasks(): Promise<Array<Task>>;
    getWorker(id: Principal): Promise<Worker | null>;
    getWorkers(): Promise<Array<Worker>>;
    registerArtifact(artifactType: ArtifactType, contentHash: string, cid: string): Promise<{
        __kind__: "ok";
        ok: Artifact;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerWorker(): Promise<{
        __kind__: "ok";
        ok: Worker;
    } | {
        __kind__: "err";
        err: string;
    }>;
    submitFitness(taskId: string, generation: bigint, fitness: number): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
