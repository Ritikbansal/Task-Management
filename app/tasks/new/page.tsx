'use client'
import AppShell from "@/components/app-shell"
import { getUser } from "@/lib/utils"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get('title'),
      description: formData.get('description'),
      assignee: formData.get('assignee'),
      status: formData.get('status'),
      priority: formData.get('priority'),
    }
    console.log(payload)
    const result = await fetch('/api/tasks', {
      body: JSON.stringify(payload),
      method: 'POST'
    })
    if (result.ok) {
      alert('Task added')
    }
    else alert('Task Add Failed')
    setLoading(false)
    router.push('/tasks')
  }
  useEffect(() => {
    const fetchUsers = async () => {
      const resp = await fetch('/api/users', {
        method: 'GET'
      })
      const body = await resp.json()
      setUsers(body)
    }
    fetchUsers()
  }, [])
  const currentUser = getUser()
  return (
    <AppShell title="Create Task" subtitle="Static form preview — no submission">
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              min={1}
              name="title"
              placeholder="e.g., Implement role-based access"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea minLength={5}
              name="description"
              id="description"
              placeholder="Brief details about the task..."
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm h-28"
            />
          </div>
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium">
              Assignee
            </label>
            <select
              id="assignee"
              name="assignee"
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {currentUser?.role !== 'User' && users.map(u => {
                return <option value={u.id}>{u.name}</option>
              })}
               {currentUser?.role === 'User' && <option value={currentUser.id}>{currentUser?.name}</option>}
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              RBAC note: Users can only assign tasks to themselves. Admin/Owner can assign to anyone.
            </p>
          </div>
          {/* <div>
            <label htmlFor="due" className="block text-sm font-medium">
              Due Date
            </label>
            <input
              id="due"
              name="due"
              type="date"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div> */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="NOT_STARTED"
            >
              <option value="NOT_STARTED">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Done</option>
            </select>
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="MEDIUM"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <a href="/tasks" className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm">
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm cursor-pointer"
          >
            {loading?'Saving...':'Save Task '}
          </button>
        </div>
      </form>
    </AppShell>
  )
}
