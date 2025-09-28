export default function AppSidebar() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-balance">Task Manager</h1>
        <p className="text-sm text-muted-foreground">Curate tasks</p>
      </div>
      <nav className="p-2">
        <ul className="flex flex-col gap-1">
          <li>
            <a
              href="/"
              className="block rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              Overview
            </a>
          </li>
          <li>
            <a
              href="/users"
              className="block rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              Users
            </a>
          </li>
          <li>
            <a
              href="/tasks"
              className="block rounded-md px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              Tasks
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
