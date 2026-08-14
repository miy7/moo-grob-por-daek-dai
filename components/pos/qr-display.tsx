"use client"

import { Check, Loader2, X } from "lucide-react"
import { formatBaht } from "@/lib/pricing"
import { POSButton } from "./pos-button"

export type QrData = {
  units: number
  amount: number
  image: string
  mime: string
  payload: string
}

type QRDisplayProps = {
  qr: QrData
  completing: boolean
  onComplete: () => void
  onCancel: () => void
}

/**
 * Full-screen QR presentation, designed to be handed to the customer to scan.
 * Shows a large QR, the amount, and the unit count, with เสร็จสิ้น / ยกเลิก.
 */
export function QRDisplay({ qr, completing, onComplete, onCancel }: QRDisplayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">สแกนเพื่อชำระเงิน</p>
          <div className="mt-1 flex items-end justify-center gap-2">
            <span className="text-5xl font-bold tabular-nums text-foreground">
              {formatBaht(qr.amount)}
            </span>
            <span className="pb-1 text-xl font-semibold text-muted-foreground">บาท</span>
          </div>
          <p className="mt-1 text-base text-muted-foreground">{qr.units} ขีด</p>
        </div>

        <div className="w-full max-w-sm rounded-3xl bg-card p-5 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:${qr.mime};base64,${qr.image}`}
            alt={`PromptPay QR สำหรับยอด ${qr.amount} บาท`}
            className="aspect-square w-full rounded-xl object-contain"
          />
          <p className="mt-3 text-center text-sm font-medium text-muted-foreground">
            PromptPay · พร้อมเพย์
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-card px-6 pb-8 pt-4">
        <POSButton variant="primary" onClick={onComplete} disabled={completing}>
          {completing ? (
            <>
              <Loader2 className="size-6 animate-spin" aria-hidden="true" />
              กำลังบันทึก…
            </>
          ) : (
            <>
              <Check className="size-6" strokeWidth={3} aria-hidden="true" />
              เสร็จสิ้น
            </>
          )}
        </POSButton>
        <POSButton variant="danger" onClick={onCancel} disabled={completing}>
          <X className="size-6" strokeWidth={3} aria-hidden="true" />
          ยกเลิก
        </POSButton>
      </div>
    </div>
  )
}
