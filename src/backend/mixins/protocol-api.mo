import Types "../types/protocol";
import ProtocolLib "../lib/protocol";

mixin (state : ProtocolLib.State) {

  public query func getStats() : async Types.ProtocolStats {
    ProtocolLib.getStats(state)
  };

  public query func getTasks() : async [Types.Task] {
    ProtocolLib.getTasks(state)
  };

  public query func getTask(id : Text) : async ?Types.Task {
    ProtocolLib.getTask(state, id)
  };

  public shared ({ caller }) func createTask(
    modelArtifactId : Text,
    datasetArtifactId : Text,
    params : Types.EggrollParams,
    totalGenerations : Nat,
  ) : async { #ok : Types.Task; #err : Text } {
    ProtocolLib.createTask(state, caller, modelArtifactId, datasetArtifactId, params, totalGenerations)
  };

  public query func getTaskGenerations(taskId : Text) : async [Types.GenerationResult] {
    ProtocolLib.getTaskGenerations(state, taskId)
  };

  public query func getWorkers() : async [Types.Worker] {
    ProtocolLib.getWorkers(state)
  };

  public query func getWorker(id : Principal) : async ?Types.Worker {
    ProtocolLib.getWorker(state, id)
  };

  public shared ({ caller }) func registerWorker() : async { #ok : Types.Worker; #err : Text } {
    ProtocolLib.registerWorker(state, caller)
  };

  public shared ({ caller }) func submitFitness(
    taskId : Text,
    generation : Nat,
    fitness : Float,
  ) : async { #ok; #err : Text } {
    ProtocolLib.submitFitness(state, caller, taskId, generation, fitness)
  };

  public query func getArtifacts() : async [Types.Artifact] {
    ProtocolLib.getArtifacts(state)
  };

  public query func getArtifact(id : Text) : async ?Types.Artifact {
    ProtocolLib.getArtifact(state, id)
  };

  public shared ({ caller }) func registerArtifact(
    artifactType : Types.ArtifactType,
    contentHash : Text,
    cid : Text,
  ) : async { #ok : Types.Artifact; #err : Text } {
    ProtocolLib.registerArtifact(state, caller, artifactType, contentHash, cid)
  };

  public query func getTaskSubmissions(taskId : Text) : async [Types.WorkerSubmission] {
    ProtocolLib.getTaskSubmissions(state, taskId)
  };
};
