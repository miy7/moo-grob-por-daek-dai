import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/auth-form"
import { getSessionUser } from "@/lib/auth-session"

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/pos")
  return <main className="flex min-h-dvh items-center justify-center px-6"><section className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm"><p className="text-sm font-semibold text-primary">หมูกรอบพ่อแดกได้</p><h1 className="mt-2 text-3xl font-bold">เข้าสู่ระบบ</h1><p className="mt-2 text-muted-foreground">สำหรับพนักงานหน้าร้าน</p><div className="mt-6"><AuthForm /></div><p className="mt-6 text-center text-sm text-muted-foreground">ยังไม่มีบัญชี? <Link href="/register" className="font-semibold text-primary underline">สร้างบัญชีพนักงาน</Link></p></section></main>
}
