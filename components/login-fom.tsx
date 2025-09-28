"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginForm({ redirectTo = "/tasks" }: { redirectTo?: string }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Email and password are required.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Invalid credentials")
        return
      }

      // Save token (localStorage for demo, cookie/session is safer in prod)
      if (remember) {
        localStorage.setItem("token", data.token)
      } else {
        sessionStorage.setItem("token", data.token)
      }

      router.push(redirectTo)
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border">
      <CardHeader>
        <CardTitle className="text-balance">Sign in</CardTitle>
        <CardDescription>Use your account to access tasks and users.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
            />
          </div>
          {/* <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 accent-foreground"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                aria-label="Remember me"
              />
              Remember me
            </label>
            <span className="text-xs text-muted-foreground">Demo only</span>
          </div> */}

          {error ? (
            <div role="alert" aria-live="assertive" className="text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full cursor-pointer" disabled={loading} aria-busy={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="mt-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <p className="font-medium mb-1">Demo credentials</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Admin: admin@example.com / <span className="font-mono">1234</span>
              </li>
              <li>
                User: user@example.com / <span className="font-mono">1234</span>
              </li>
              <li>
                Owner: owner@example.com / <span className="font-mono">1234</span>
              </li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
