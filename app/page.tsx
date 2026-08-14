import Link from "next/link"
import { ArrowRight, QrCode } from "lucide-react"
import { PRICE_PER_UNIT } from "@/lib/pricing"

export default function Page() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
          <QrCode className="size-10" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            หมูกรอบพอแดกได้
          </h1>
          <p className="mt-2 text-base text-muted-foreground text-pretty">
            ระบบขายหน้าร้านสำหรับพนักงาน คิดเงินตามจำนวนขีด ขีดละ {PRICE_PER_UNIT} บาท
          </p>
        </div>
      </div>

      <Link
        href="/pos"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-5 text-xl font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
      >
        เริ่มขาย
        <ArrowRight className="size-6" aria-hidden="true" />
      </Link>
    </main>
  )
}
