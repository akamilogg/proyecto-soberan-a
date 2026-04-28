import List "mo:core/List";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat64 "mo:core/Nat64";
import Types "../types/protocol";

module {
  public type State = {
    tasks : List.List<Types.Task>;
    workers : List.List<Types.Worker>;
    artifacts : List.List<Types.Artifact>;
    generations : Map.Map<Types.TaskId, List.List<Types.GenerationResult>>;
    submissions : List.List<Types.WorkerSubmission>;
    currentGeneration : Nat;
  };

  // ─── helpers ────────────────────────────────────────────────────────────────

  func nowTs() : Types.Timestamp {
    Nat64.fromNat(Int.abs(Time.now()))
  };

  func makeId(caller : Principal, salt : Text) : Text {
    Time.now().toText().concat("-").concat(caller.toText()).concat("-").concat(salt)
  };

  // ELO: K=32, expected = 1 / (1 + 10^((rB-rA)/400))
  func eloExpected(rA : Float, rB : Float) : Float {
    1.0 / (1.0 + Float.pow(10.0, (rB - rA) / 400.0))
  };

  func eloUpdate(rating : Float, score : Float, expected : Float) : Float {
    rating + 32.0 * (score - expected)
  };

  // ─── state init ─────────────────────────────────────────────────────────────

  public func newState() : State {
    {
      tasks = List.empty<Types.Task>();
      workers = List.empty<Types.Worker>();
      artifacts = List.empty<Types.Artifact>();
      generations = Map.empty<Types.TaskId, List.List<Types.GenerationResult>>();
      submissions = List.empty<Types.WorkerSubmission>();
      currentGeneration = 0;
    }
  };

  // ─── stats ──────────────────────────────────────────────────────────────────

  public func getStats(state : State) : Types.ProtocolStats {
    let activeWorkers = state.workers.filter(func(w) { w.status == #Active }).size();
    let pendingTasks = state.tasks.filter(func(t) { t.status == #Pending }).size();
    let completedTasks = state.tasks.filter(func(t) { t.status == #Completed }).size();
    {
      currentGeneration = state.currentGeneration;
      activeWorkers;
      pendingTasks;
      completedTasks;
      totalWorkers = state.workers.size();
    }
  };

  // ─── tasks ───────────────────────────────────────────────────────────────────

  public func getTasks(state : State) : [Types.Task] {
    state.tasks.toArray()
  };

  public func getTask(state : State, id : Types.TaskId) : ?Types.Task {
    state.tasks.find(func(t) { t.id == id })
  };

  public func createTask(
    state : State,
    caller : Principal,
    modelArtifactId : Types.ArtifactId,
    datasetArtifactId : Types.ArtifactId,
    params : Types.EggrollParams,
    totalGenerations : Nat,
  ) : { #ok : Types.Task; #err : Text } {
    // validate artifacts exist
    switch (state.artifacts.find(func(a) { a.id == modelArtifactId })) {
      case null { return #err("Model artifact not found: " # modelArtifactId) };
      case _ {};
    };
    switch (state.artifacts.find(func(a) { a.id == datasetArtifactId })) {
      case null { return #err("Dataset artifact not found: " # datasetArtifactId) };
      case _ {};
    };
    let ts = nowTs();
    let task : Types.Task = {
      id = makeId(caller, "task");
      modelArtifactId;
      datasetArtifactId;
      params;
      status = #Pending;
      currentGeneration = 0;
      totalGenerations = totalGenerations;
      createdBy = caller;
      createdAt = ts;
      updatedAt = ts;
    };
    state.tasks.add(task);
    #ok(task)
  };

  public func getTaskGenerations(state : State, taskId : Types.TaskId) : [Types.GenerationResult] {
    switch (state.generations.get(taskId)) {
      case null { [] };
      case (?genList) { genList.toArray() };
    }
  };

  // ─── workers ─────────────────────────────────────────────────────────────────

  public func getWorkers(state : State) : [Types.Worker] {
    state.workers.toArray()
  };

  public func getWorker(state : State, id : Principal) : ?Types.Worker {
    state.workers.find(func(w) { w.id == id })
  };

  public func registerWorker(state : State, caller : Principal) : { #ok : Types.Worker; #err : Text } {
    switch (state.workers.find(func(w) { w.id == caller })) {
      case (?_) { #err("Worker already registered") };
      case null {
        let worker : Types.Worker = {
          id = caller;
          elo = 1200.0;
          status = #Active;
          lastSubmission = null;
          totalSubmissions = 0;
          slashCount = 0;
        };
        state.workers.add(worker);
        #ok(worker)
      };
    }
  };

  // ─── fitness submission & ELO ────────────────────────────────────────────────

  public func submitFitness(
    state : State,
    caller : Principal,
    taskId : Types.TaskId,
    generation : Nat,
    fitness : Float,
  ) : { #ok; #err : Text } {
    // worker must be registered and active
    switch (state.workers.find(func(w) { w.id == caller })) {
      case null { return #err("Worker not registered") };
      case (?w) {
        if (w.status != #Active) { return #err("Worker is not active") };
      };
    };
    // task must exist and be active or pending
    switch (state.tasks.find(func(t) { t.id == taskId })) {
      case null { return #err("Task not found") };
      case (?t) {
        if (t.status == #Completed or t.status == #Cancelled) {
          return #err("Task is not accepting submissions")
        };
      };
    };

    let ts = nowTs();
    let sub : Types.WorkerSubmission = {
      workerId = caller;
      taskId;
      generation;
      fitness;
      timestamp = ts;
    };
    state.submissions.add(sub);

    // Update worker ELO against the mean of existing submissions for this (task, generation)
    let genSubs = state.submissions.filter(func(s) {
      s.taskId == taskId and s.generation == generation and s.workerId != caller
    });
    let genSubsArr = genSubs.toArray();
    let n = genSubsArr.size();

    if (n > 0) {
      // compute mean fitness of other workers for this generation
      let sumFitness = genSubsArr.foldLeft(0.0 : Float, func(acc : Float, s : Types.WorkerSubmission) : Float { acc + s.fitness });
      let meanFitness = sumFitness / n.toFloat();
      // score: 1.0 if caller fitness > mean, 0.5 if equal, 0.0 if less
      let score : Float = if (fitness > meanFitness) { 1.0 } else if (fitness == meanFitness) { 0.5 } else { 0.0 };

      state.workers.mapInPlace(func(w) {
        if (w.id == caller) {
          // find mean ELO of opponents as surrogate rating
          let meanOpponentElo = genSubsArr.foldLeft(0.0 : Float, func(acc : Float, s : Types.WorkerSubmission) : Float {
            let opponentElo = switch (state.workers.find(func(ow) { ow.id == s.workerId })) {
              case (?ow) { ow.elo };
              case null { 1200.0 };
            };
            acc + opponentElo
          }) / n.toFloat();
          let expected = eloExpected(w.elo, meanOpponentElo);
          let newElo = eloUpdate(w.elo, score, expected);
          {
            w with
            elo = newElo;
            lastSubmission = ?ts;
            totalSubmissions = w.totalSubmissions + 1;
          }
        } else { w }
      });
    } else {
      // first submission for this generation — just update metadata
      state.workers.mapInPlace(func(w) {
        if (w.id == caller) {
          { w with lastSubmission = ?ts; totalSubmissions = w.totalSubmissions + 1 }
        } else { w }
      });
    };

    // Check if we should advance generation / mark task active
    // Activate task on first submission
    state.tasks.mapInPlace(func(t) {
      if (t.id == taskId and t.status == #Pending) {
        { t with status = #Active; updatedAt = ts }
      } else { t }
    });

    // Count distinct workers for this generation
    let distinctWorkerCount = state.submissions
      .filter(func(s) { s.taskId == taskId and s.generation == generation })
      .toArray()
      .size();

    // Advance generation when at least nPopulation submissions received
    let taskOpt = state.tasks.find(func(t) { t.id == taskId });
    switch (taskOpt) {
      case null {};
      case (?task) {
        if (distinctWorkerCount >= task.params.nPopulation) {
          // Compute generation result
          let genSubsFull = state.submissions.filter(func(s) {
            s.taskId == taskId and s.generation == generation
          }).toArray();
          let count = genSubsFull.size();
          if (count > 0) {
            let fitnessVals = genSubsFull.map(func(s : Types.WorkerSubmission) : Float { s.fitness });
            let sumF = fitnessVals.foldLeft(0.0 : Float, func(acc : Float, f : Float) : Float { acc + f });
            let avgF = sumF / count.toFloat();
            let bestF = switch (fitnessVals.foldLeft<Float, ?Float>(null, func(acc, f) {
              switch acc { case null { ?f }; case (?best) { if (f > best) ?f else ?best } }
            })) { case (?v) v; case null 0.0 };
            let genResult : Types.GenerationResult = {
              taskId;
              generation;
              bestFitness = bestF;
              averageFitness = avgF;
              workerCount = count;
              timestamp = ts;
            };
            // Store generation result
            switch (state.generations.get(taskId)) {
              case null {
                let newList = List.empty<Types.GenerationResult>();
                newList.add(genResult);
                state.generations.add(taskId, newList);
              };
              case (?genList) { genList.add(genResult) };
            };
            // Advance task generation counter or complete it
            let nextGen = generation + 1;
            state.tasks.mapInPlace(func(t) {
              if (t.id == taskId) {
                if (nextGen >= t.totalGenerations) {
                  { t with currentGeneration = nextGen; status = #Completed; updatedAt = ts }
                } else {
                  { t with currentGeneration = nextGen; updatedAt = ts }
                }
              } else { t }
            });
          };
        };
      };
    };

    #ok
  };

  // ─── artifacts ───────────────────────────────────────────────────────────────

  public func getArtifacts(state : State) : [Types.Artifact] {
    state.artifacts.toArray()
  };

  public func getArtifact(state : State, id : Types.ArtifactId) : ?Types.Artifact {
    state.artifacts.find(func(a) { a.id == id })
  };

  public func registerArtifact(
    state : State,
    caller : Principal,
    artifactType : Types.ArtifactType,
    contentHash : Text,
    cid : Text,
  ) : { #ok : Types.Artifact; #err : Text } {
    if (contentHash == "") { return #err("contentHash cannot be empty") };
    if (cid == "") { return #err("cid cannot be empty") };
    let artifact : Types.Artifact = {
      id = makeId(caller, "artifact");
      artifactType;
      contentHash;
      cid;
      uploadedBy = caller;
      timestamp = nowTs();
      verified = false;
    };
    state.artifacts.add(artifact);
    #ok(artifact)
  };

  // ─── submissions ─────────────────────────────────────────────────────────────

  public func getTaskSubmissions(state : State, taskId : Types.TaskId) : [Types.WorkerSubmission] {
    state.submissions.filter(func(s) { s.taskId == taskId }).toArray()
  };
};
