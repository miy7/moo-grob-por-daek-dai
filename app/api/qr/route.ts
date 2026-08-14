import { NextResponse } from "next/server"
import { validateAndPrice } from "@/lib/pricing"
import { generatePromptPayQr, ThunderError } from "@/lib/thunder"

// POST /api/qr
// Request:  { units: number }
// Response: { units, amount, image, mime, payload }
//
// The client sends ONLY the number of units. The amount is computed here on
// the server — a client-supplied amount is never trusted or read.
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

  try {
    const qr = await generatePromptPayQr(priced.amount)
    return NextResponse.json({
      units: priced.units,
      amount: priced.amount,
      image: qr.image,
      mime: qr.mime,
      payload: qr.payload,
    })
  } catch (err) {
    if (err instanceof ThunderError) {
      console.log("[v0] Thunder QR generation failed:", err.message)
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    console.log("[v0] Unexpected QR error:", err)
    return NextResponse.json({ error: "ไม่สามารถสร้าง QR ได้" }, { status: 500 })
  }
}
