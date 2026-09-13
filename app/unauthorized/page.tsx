import Link from "next/link"

export default function UnauthorizedPage() {
  return <main className="flex min-h-dvh items-center justify-center px-6 text-center"><section><h1 className="text-3xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1><p className="mt-2 text-muted-foreground">บัญชีของคุณไม่มีสิทธิ์สำหรับหน้านี้</p><Link href="/pos" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground">กลับหน้า POS</Link></section></main>
}
