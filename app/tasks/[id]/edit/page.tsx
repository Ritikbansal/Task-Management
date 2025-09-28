"use client"

import AppShell from "@/components/app-shell"
import { User, Task } from "@prisma/client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditTaskPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      const res = await fetch(`/api/tasks/${id}`)
      const data = await res.json()
      setTask(data)
    }
    const fetchUsers = async () => {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
    }
    fetchTask()
    fetchUsers()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      assignee: formData.get("assignee"),
      status: formData.get("status"),
      priority: formData.get("priority"),
    }

    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      alert("Task updated successfully!")
      router.push("/tasks")
    } else {
      alert("Failed to update task")
    }
    setLoading(false)
  }

  if (!task) return <p className="p-4">Loading...</p>

  return (
    <AppShell title="Edit Task" subtitle={`Editing task #${id}`}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input
              id="title"
              name="title"
              defaultValue={task.title || ""}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={task.description || ""}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-28"
            />
          </div>

          <div>
            <label htmlFor="assignee" className="block text-sm font-medium">Assignee</label>
            <select id="assignee" name="assignee" defaultValue={task.userId || ""} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">Status</label>
            <select id="status" name="status" defaultValue={task.status} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="NOT_STARTED">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
            <select id="priority" name="priority" defaultValue={task.priority} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <a href="/tasks" className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm">Cancel</a>
          <button type="submit" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">
            {loading ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </AppShell>
  )
}
