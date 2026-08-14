// LINE OA notification client (Messaging API push).
// The channel access token and target id live ONLY on the server.
// Docs: POST https://api.line.me/v2/bot/message/push

const LINE_PUSH_ENDPOINT = "https://api.line.me/v2/bot/message/push"

export type LineResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Push a plain-text message to the configured LINE target (user or group id).
 * Returns a result object instead of throwing so a notification failure never
 * blocks the order from being marked complete.
 */
export async function pushLineMessage(text: string): Promise<LineResult> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN
  const to = process.env.LINE_TARGET_ID

  if (!token || !to) {
    return { ok: false, error: "ยังไม่ได้ตั้งค่า LINE_CHANNEL_ACCESS_TOKEN หรือ LINE_TARGET_ID" }
  }

  try {
    const res = await fetch(LINE_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text }],
      }),
      signal: AbortSignal.timeout(15_000),
    })

    if (!res.ok) {
      const detail = await res.text()
      return { ok: false, error: `LINE ตอบกลับสถานะ ${res.status}: ${detail}` }
    }

    return { ok: true }
  } catch {
    return { ok: false, error: "ไม่สามารถเชื่อมต่อ LINE API ได้" }
  }
}

/** Build the sales notification message for a completed order. */
export function buildSaleMessage(params: {
  orderId: string
  units: number
  amount: number
  time: string
}): string {
  const { orderId, units, amount, time } = params
  return [
    "🧾 รายการขายใหม่",
    "",
    `จำนวน: ${units} ขีด`,
    `ยอดเงิน: ${amount} บาท`,
    `เวลา: ${time}`,
    "สถานะ: ชำระเงินแล้ว",
    `เลขที่: ${orderId}`,
  ].join("\n")
}
