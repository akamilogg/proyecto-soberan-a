import { createActor } from "@/backend";
import { createActorWithConfig } from "@caffeineai/core-infrastructure";

// Re-export createActor bound with config so useActor can use it
export async function createBackendActor() {
  return createActorWithConfig(createActor);
}

// Export the createActor function for direct use with useActor hook
export { createActor };
