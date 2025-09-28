"use client";
import AppShell from "@/components/app-shell";
import { useAuthGuard } from "@/components/auth-guard";
import { User, Task } from "@prisma/client";
import { useEffect, useState } from "react";

type TaskWithUser = Task & { assignee: User | null };

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);

  useAuthGuard();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?page=${currentPage}&limit=${limit}`);
      const data = await res.json();
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (taskId: number) => {
    console.log("taskId", taskId);
    const confirmed = confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");

      setCurrentPage(1)
      alert("Task deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <AppShell
      title="Tasks"
      subtitle="Create, update, delete, and assign tasks"
      actions={
        <a
          href="/tasks/new"
          className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
        >
          Create Task
        </a>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                <th>Title</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Time To Complete</th>
                <th>Priority</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task) => (
                <tr key={task.id} className="[&>td]:px-3 [&>td]:py-3">
                  <td>{task.title}</td>
                  <td className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs">
                      {task.assignee?.name[0].toUpperCase()}
                    </span>
                    {task.assignee?.name}
                  </td>
                  <td>
                    <span className="rounded-full bg-accent px-2 py-1 text-xs">
                      {task.status}
                    </span>
                  </td>
                  <td>5 min</td>
                  <td>
                    <span className="rounded-full bg-secondary px-2 py-1 text-xs">
                      {task.priority}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="inline-flex gap-2">
                      <a
                        href={`/tasks/${task.id}/edit`}
                        className="rounded-md bg-accent px-2 py-1 text-xs"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="rounded-md bg-destructive/10 px-2 cursor-pointer py-1 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <footer className="border-t border-border p-3">
          <nav className="flex items-center justify-between text-sm">
            <button
              disabled={currentPage <= 1 || loading}
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`rounded-md px-2 py-1 border border-input cursor-pointer ${
                currentPage <= 1 || loading ? "text-muted-foreground" : ""
              }`}
            >
              {loading ? "Loading..." : "Previous"}
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage >= totalPages || loading}
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={`rounded-md px-2 py-1 border border-input cursor-pointer ${
                currentPage >= totalPages || loading
                  ? "text-muted-foreground"
                  : ""
              }`}
            >
              {loading ? "Loading..." : "Next"}
            </button>
          </nav>
        </footer>
      </div>
    </AppShell>
  );
}
