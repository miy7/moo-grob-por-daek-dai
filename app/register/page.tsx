import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/auth-session"

export default async function RegisterPage() {
  if (await getSessionUser()) redirect("/pos")
  return <main className="flex min-h-dvh items-center justify-center px-6"><section className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm"><p className="text-sm font-semibold text-primary">ตั้งค่าผู้ใช้งาน</p><h1 className="mt-2 text-3xl font-bold">สร้างบัญชีพนักงาน</h1><p className="mt-2 text-muted-foreground">บัญชีใหม่เริ่มต้นด้วยสิทธิ์ STAFF</p><div className="mt-6"><AuthForm mode="signup" /></div><p className="mt-6 text-center text-sm text-muted-foreground">มีบัญชีแล้ว? <Link href="/login" className="font-semibold text-primary underline">เข้าสู่ระบบ</Link></p></section></main>
}
