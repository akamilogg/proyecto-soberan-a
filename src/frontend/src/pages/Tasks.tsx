import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/use-backend";
import { formatTimestamp, getTaskStatusLabel } from "@/types";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

const TASK_SKELETONS = ["t1", "t2", "t3", "t4", "t5"];

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();

  return (
    <div className="space-y-6 font-mono" data-ocid="tasks.page">
      <div className="border-b border-border pb-4 flex items-end justify-between">
        <div>
          <p className="text-muted-foreground text-xs tracking-widest">
            ┌─ TRAINING OPERATIONS
          </p>
          <h1 className="text-primary crt-glow text-xl font-bold tracking-widest mt-1">
            TASKS
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest">
            └──────────────────────
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest border border-primary text-primary hover:bg-primary/10 hover:crt-glow transition-smooth"
          data-ocid="tasks.new_task_button"
        >
          <Plus className="w-3 h-3" />
          NEW TASK
        </Link>
      </div>

      <div className="border border-border bg-card" data-ocid="tasks.list">
        <div className="px-4 py-2 border-b border-border grid grid-cols-12 gap-2 text-xs text-muted-foreground tracking-widest">
          <span className="col-span-5">TASK ID</span>
          <span className="col-span-2">STATUS</span>
          <span className="col-span-2 text-right">GENERATION</span>
          <span className="col-span-3 text-right">CREATED</span>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            TASK_SKELETONS.map((k) => (
              <div key={k} className="px-4 py-3">
                <Skeleton className="h-5 w-full bg-muted" />
              </div>
            ))
          ) : !tasks || tasks.length === 0 ? (
            <div
              className="px-4 py-12 text-center"
              data-ocid="tasks.empty_state"
            >
              <p className="text-muted-foreground text-sm tracking-wide">
                NO TASKS FOUND
              </p>
              <p className="text-muted-foreground text-xs mt-1 tracking-wide">
                Launch your first fine-tuning task to begin.
              </p>
              <Link
                to="/tasks/new"
                className="mt-4 inline-block text-primary text-xs hover:crt-glow transition-smooth border border-primary px-4 py-2 tracking-widest"
                data-ocid="tasks.create_first_task_button"
              >
                ► LAUNCH TASK
              </Link>
            </div>
          ) : (
            tasks.map((task, i) => (
              <Link
                key={task.id}
                to="/tasks/$taskId"
                params={{ taskId: task.id }}
                className="px-4 py-3 grid grid-cols-12 gap-2 items-center terminal-row-hover transition-smooth group"
                data-ocid={`tasks.item.${i + 1}`}
              >
                <span className="col-span-5 text-primary text-xs truncate tracking-wide group-hover:crt-glow font-mono">
                  {task.id}
                </span>
                <span
                  className={`col-span-2 text-xs tracking-widest ${
                    "Active" in task.status
                      ? "text-primary crt-glow"
                      : "Completed" in task.status
                        ? "text-secondary"
                        : "Cancelled" in task.status
                          ? "text-destructive"
                          : "text-muted-foreground"
                  }`}
                >
                  {getTaskStatusLabel(task.status)}
                </span>
                <span className="col-span-2 text-muted-foreground text-xs text-right">
                  {task.currentGeneration.toString()}/
                  {task.totalGenerations.toString()}
                </span>
                <span className="col-span-3 text-muted-foreground text-xs text-right truncate">
                  {formatTimestamp(task.createdAt)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
