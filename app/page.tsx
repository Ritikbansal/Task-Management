import AppShell from "@/components/app-shell"

export default function Page() {
  return (
    <AppShell title="Task Management" subtitle="Create/Manage Users and Tasks.">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium">Users</h3>
          <p className="text-sm text-muted-foreground">Create and list users.</p>
          <div className="mt-3">
            <a
              href="/users"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
            >
              Open Users
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium">Tasks</h3>
          <p className="text-sm text-muted-foreground">Create, update, delete tasks; assign to users.</p>
          <div className="mt-3">
            <a
              href="/tasks"
              className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm hover:opacity-90"
            >
              Open Tasks
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium">Access Control</h3>
          <p className="text-sm text-muted-foreground">UI cues for role-based access control.</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2 py-1 text-xs">User</span>
            <span className="rounded-full bg-secondary px-2 py-1 text-xs">Admin</span>
            <span className="rounded-full bg-secondary px-2 py-1 text-xs">Owner</span>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-4">
        <h4 className="font-medium">Notes</h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
          <li>Only Owner can create User.</li>
          <li>Admin/Owener can creater and assign tasks.</li>
          <li>This is a task Management Application with role based access.</li>
        </ul>
      </div>
    </AppShell>
  )
}
