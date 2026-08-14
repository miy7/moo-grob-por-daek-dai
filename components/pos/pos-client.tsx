"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, QrCode } from "lucide-react"
import { AmountDisplay } from "./amount-display"
import { POSButton } from "./pos-button"
import { QRDisplay, type QrData } from "./qr-display"
import { UnitCounter } from "./unit-counter"

const MIN_UNITS = 1
const MAX_UNITS = 200

type PosClientProps = {
  pricePerUnit: number
}

export function PosClient({ pricePerUnit }: PosClientProps) {
  const [units, setUnits] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qr, setQr] = useState<QrData | null>(null)
  const [completing, setCompleting] = useState(false)
  const [done, setDone] = useState<{ units: number; amount: number } | null>(null)

  const amount = units * pricePerUnit

  function increment() {
    setUnits((u) => Math.min(MAX_UNITS, u + 1))
  }

  function decrement() {
    setUnits((u) => Math.max(MIN_UNITS, u - 1))
  }

  async function createQr() {
    if (loading) return // prevent double submit while a request is in flight
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units }), // send units only — never the amount
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? "สร้าง QR ไม่สำเร็จ")
      }
      setQr(data as QrData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด")
    } finally {
      setLoading(false)
    }
  }

  async function completeOrder() {
    if (!qr || completing) return
    setCompleting(true)
    setError(null)
    try {
      const res = await fetch("/api/order/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ units: qr.units }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error ?? "บันทึกรายการไม่สำเร็จ")
      }
      setDone({ units: qr.units, amount: qr.amount })
      setQr(null)
      setUnits(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด")
    } finally {
      setCompleting(false)
    }
  }

  function cancelQr() {
    if (completing) return
    setQr(null)
  }

  // Success screen after an order is finished.
  if (done) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
        <CheckCircle2 className="size-24 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">บันทึกรายการแล้ว</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {done.units} ขีด · {done.amount} บาท
          </p>
        </div>
        <div className="w-full">
          <POSButton onClick={() => setDone(null)}>
            <QrCode className="size-6" aria-hidden="true" />
            เริ่มรายการใหม่
          </POSButton>
        </div>
      </main>
    )
  }

  return (
    <>
      <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-8 pt-8">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            หมูกรอบพอแดกได้
          </h1>
          <p className="mt-1 text-base font-medium text-muted-foreground">
            ขีดละ {pricePerUnit} บาท
          </p>
        </header>

        <div className="mt-8 flex flex-1 flex-col justify-center gap-8">
          <UnitCounter
            units={units}
            min={MIN_UNITS}
            max={MAX_UNITS}
            onIncrement={increment}
            onDecrement={decrement}
            disabled={loading}
          />

          <AmountDisplay units={units} amount={amount} pricePerUnit={pricePerUnit} />
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        <div className="mt-6">
          <POSButton onClick={createQr} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-6 animate-spin" aria-hidden="true" />
                กำลังสร้าง QR…
              </>
            ) : (
              <>
                <QrCode className="size-6" aria-hidden="true" />
                สร้าง QR รับเงิน
              </>
            )}
          </POSButton>
        </div>
      </main>

      {qr && (
        <QRDisplay
          qr={qr}
          completing={completing}
          onComplete={completeOrder}
          onCancel={cancelQr}
        />
      )}
    </>
  )
}
