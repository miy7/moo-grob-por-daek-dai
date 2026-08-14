import { NextResponse } from "next/server"
import { validateAndPrice } from "@/lib/pricing"
import { buildSaleMessage, pushLineMessage } from "@/lib/line"

// POST /api/order/complete
// Request:  { units: number }
// Response: { order: { id, units, amount, timestamp, status }, notified }
//
// Like /api/qr, this trusts ONLY the units and recomputes the amount server-side.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "รูปแบบคำขอไม่ถูกต้อง" }, { status: 400 })
  }

  const units = (body as { units?: unknown })?.units
  const priced = validateAndPrice(units)
  if (!priced.ok) {
    return NextResponse.json({ error: priced.error }, { status: 400 })
  }

  const now = new Date()
  const order = {
    id: `ORD-${now.getTime()}`,
    units: priced.units,
    amount: priced.amount,
    timestamp: now.toISOString(),
    status: "completed" as const,
  }

  // NOTE: This is where an order would be persisted to a database. For now the
  // order object is the record; a future step can add slip verification with
  // Thunder and durable storage here.
  console.log("[v0] Order completed:", order)

  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  })

  const notify = await pushLineMessage(
    buildSaleMessage({
      orderId: order.id,
      units: order.units,
      amount: order.amount,
      time,
    }),
  )

  if (!notify.ok) {
    // Don't fail the order just because the LINE push failed — log it and
    // report the notification status back to the client.
    console.log("[v0] LINE notification failed:", notify.error)
  }

  return NextResponse.json({ order, notified: notify.ok })
}
