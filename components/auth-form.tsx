"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { bootstrapOwner } from "@/app/actions/bootstrap-owner"

export function AuthForm({ mode = "login" }: { mode?: "login" | "signup" }) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const result = mode === "login"
      ? await authClient.signIn.username({ username, password })
      : await authClient.signUp.email({
          name,
          username,
          displayUsername: username,
          email: `${username.toLowerCase()}@pos.local`,
          password,
        })
    if (result.error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือข้อมูลนี้ถูกใช้แล้ว")
      setLoading(false)
      return
    }
    if (mode === "signup") await bootstrapOwner()
    router.push("/pos")
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm space-y-4">
      {mode === "signup" && (
        <label className="block text-sm font-medium">ชื่อพนักงาน<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border bg-background px-4 text-base" /></label>
      )}
      <label className="block text-sm font-medium">ชื่อผู้ใช้<input required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border bg-background px-4 text-base" /></label>
      <label className="block text-sm font-medium">รหัสผ่าน<input required minLength={8} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 min-h-12 w-full rounded-xl border bg-background px-4 text-base" /></label>
      {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <button disabled={loading} className="min-h-12 w-full rounded-xl bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60">{loading ? "กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</button>
    </form>
  )
}

export function LogoutButton() {
  const router = useRouter()
  return <button className="min-h-11 rounded-xl border px-4 text-sm" onClick={async () => { await authClient.signOut(); router.push("/login"); router.refresh() }}>ออกจากระบบ</button>
}
