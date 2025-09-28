'use client'
import AppShell from "@/components/app-shell"
import { useAuthGuard } from "@/components/auth-guard"
import { getUser } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewUserPage() {
  useAuthGuard()
  const user = getUser()
  const router = useRouter()
  if(user?.role !== 'Owner') router.push('/')
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      password: formData.get('password')
    }
    const res = await fetch('/api/users', {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      alert('User Created')
      router.push('/users')
    }
    else {
      alert('User creation failed. Either Email Already Exist or some other error occured!')
    }
    setLoading(false)
  }
  return (
    <AppShell title="Create User" subtitle="Static form preview — no submission">
      <form onSubmit={handleSubmit}  className="mx-auto max-w-xl rounded-lg border border-border bg-card p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="Full name"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            defaultValue="User"
          >
            <option value="Admin">Admin</option>
            <option value="Owner">Owner</option>
            <option value="User">User</option>
          </select>
          <p className="mt-2 text-xs text-muted-foreground">RBAC note: Only Owner can assign roles.</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <a href="/users" className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm">
            Cancel
          </a>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm cursor-pointer"
          >
            {loading ? 'Saving' : 'Save User'}
          </button>
        </div>
      </form>
    </AppShell>
  )
}
