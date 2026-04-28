import { createActor } from "@/backend";
import type {
  Artifact,
  ArtifactType,
  CreateTaskPayload,
  EggrollParams,
  GenerationResult,
  ProtocolStats,
  RegisterArtifactPayload,
  Task,
  Worker,
  WorkerSubmission,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// The actor from backend.ts — cast to our expected interface since bindgen
// will populate the real types once `pnpm bindgen` runs against the deployed canister.
type BackendActor = {
  getStats: () => Promise<ProtocolStats>;
  getTasks: () => Promise<Task[]>;
  getTask: (id: string) => Promise<[] | [Task]>;
  createTask: (
    modelArtifactId: string,
    datasetArtifactId: string,
    params: EggrollParams,
    totalGenerations: bigint,
  ) => Promise<{ ok: Task } | { err: string }>;
  getTaskGenerations: (taskId: string) => Promise<GenerationResult[]>;
  getWorkers: () => Promise<Worker[]>;
  getWorker: (id: string) => Promise<[] | [Worker]>;
  registerWorker: () => Promise<{ ok: Worker } | { err: string }>;
  submitFitness: (
    taskId: string,
    generation: bigint,
    fitness: number,
  ) => Promise<{ ok: null } | { err: string }>;
  getArtifacts: () => Promise<Artifact[]>;
  getArtifact: (id: string) => Promise<[] | [Artifact]>;
  registerArtifact: (
    artifactType: ArtifactType,
    contentHash: string,
    cid: string,
  ) => Promise<{ ok: Artifact } | { err: string }>;
  getTaskSubmissions: (taskId: string) => Promise<WorkerSubmission[]>;
};

const POLL_INTERVAL = 5000;

function useBackendActor() {
  return useActor(createActor as never) as {
    actor: BackendActor | null;
    isFetching: boolean;
  };
}

export function useProtocolStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ProtocolStats | null>({
    queryKey: ["protocolStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useTasks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useTask(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Task | null>({
    queryKey: ["task", id],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getTask(id);
      return result.length > 0 ? (result[0] ?? null) : null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useCreateTask() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<Task, Error, CreateTaskPayload>({
    mutationFn: async (payload) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.createTask(
        payload.modelArtifactId,
        payload.datasetArtifactId,
        payload.params,
        payload.totalGenerations,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useTaskGenerations(taskId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<GenerationResult[]>({
    queryKey: ["taskGenerations", taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTaskGenerations(taskId);
    },
    enabled: !!actor && !isFetching && !!taskId,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useTaskSubmissions(taskId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<WorkerSubmission[]>({
    queryKey: ["taskSubmissions", taskId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTaskSubmissions(taskId);
    },
    enabled: !!actor && !isFetching && !!taskId,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useWorkers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Worker[]>({
    queryKey: ["workers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useWorker(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Worker | null>({
    queryKey: ["worker", id],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getWorker(id);
      return result.length > 0 ? (result[0] ?? null) : null;
    },
    enabled: !!actor && !isFetching && !!id,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useRegisterWorker() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<Worker, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.registerWorker();
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useSubmitFitness() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { taskId: string; generation: bigint; fitness: number }
  >({
    mutationFn: async ({ taskId, generation, fitness }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.submitFitness(taskId, generation, fitness);
      if ("err" in result) throw new Error(result.err);
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["taskSubmissions", vars.taskId],
      });
      queryClient.invalidateQueries({ queryKey: ["protocolStats"] });
    },
  });
}

export function useArtifacts() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Artifact[]>({
    queryKey: ["artifacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArtifacts();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: POLL_INTERVAL,
    staleTime: POLL_INTERVAL / 2,
  });
}

export function useArtifact(id: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Artifact | null>({
    queryKey: ["artifact", id],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getArtifact(id);
      return result.length > 0 ? (result[0] ?? null) : null;
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useRegisterArtifact() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<Artifact, Error, RegisterArtifactPayload>({
    mutationFn: async (payload) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.registerArtifact(
        payload.artifactType,
        payload.contentHash,
        payload.cid,
      );
      if ("err" in result) throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artifacts"] });
    },
  });
}
