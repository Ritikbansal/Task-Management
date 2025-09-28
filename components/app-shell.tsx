'use client'
import type React from "react"
import AppSidebar from "./app-sidebar"
import { useAuthGuard } from "./auth-guard"

export default function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  }) {
   const authChecked = useAuthGuard()

  if (!authChecked) {
    return <p className="p-6 text-center">Checking authentication...</p>
  }
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      <AppSidebar />
      <main className="bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-balance">{title}</h2>
              {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 py-6">{children}</section>
      </main>
    </div>
  )
}
