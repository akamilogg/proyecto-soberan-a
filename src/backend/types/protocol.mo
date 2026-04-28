import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type TaskId = Common.TaskId;
  public type ArtifactId = Common.ArtifactId;

  public type TaskStatus = {
    #Pending;
    #Active;
    #Completed;
    #Cancelled;
  };

  public type ArtifactType = {
    #ModelWeights;
    #Dataset;
    #Config;
    #Kernel;
  };

  public type WorkerStatus = {
    #Active;
    #Inactive;
    #Slashed;
  };

  public type Artifact = {
    id : ArtifactId;
    artifactType : ArtifactType;
    contentHash : Text;
    cid : Text;
    uploadedBy : Principal;
    timestamp : Timestamp;
    verified : Bool;
  };

  public type Worker = {
    id : Principal;
    elo : Float;
    status : WorkerStatus;
    lastSubmission : ?Timestamp;
    totalSubmissions : Nat;
    slashCount : Nat;
  };

  public type EggrollParams = {
    r : Nat;
    alpha : Float;
    nPopulation : Nat;
    epochs : Nat;
  };

  public type Task = {
    id : TaskId;
    modelArtifactId : ArtifactId;
    datasetArtifactId : ArtifactId;
    params : EggrollParams;
    status : TaskStatus;
    currentGeneration : Nat;
    totalGenerations : Nat;
    createdBy : Principal;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type GenerationResult = {
    taskId : TaskId;
    generation : Nat;
    bestFitness : Float;
    averageFitness : Float;
    workerCount : Nat;
    timestamp : Timestamp;
  };

  public type WorkerSubmission = {
    workerId : Principal;
    taskId : TaskId;
    generation : Nat;
    fitness : Float;
    timestamp : Timestamp;
  };

  public type ProtocolStats = {
    currentGeneration : Nat;
    activeWorkers : Nat;
    pendingTasks : Nat;
    completedTasks : Nat;
    totalWorkers : Nat;
  };
};
