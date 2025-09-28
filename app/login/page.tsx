import LoginForm from "@/components/login-fom";

export default function LoginPage() {
  return (
    <main className="min-h-dvh grid place-items-center bg-background text-foreground p-6">
      <div className="w-full max-w-md">
        <LoginForm redirectTo="/tasks" />
      </div>
    </main>
  )
}
