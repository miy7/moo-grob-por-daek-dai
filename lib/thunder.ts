// Thunder API client — used to generate PromptPay QR codes.
// The API key and PromptPay identifier live ONLY on the server (env vars).
// Docs: POST https://api.thunder.in.th/v1/qr/generate
//   body: { type: "PROMPTPAY", msisdn | natId | eWalletId, amount }
//   response: { status, data: { image (base64 png), mime, payload } }

const THUNDER_QR_ENDPOINT = "https://api.thunder.in.th/v1/qr/generate"

export type ThunderQr = {
  /** Base64-encoded PNG (no data: prefix) */
  image: string
  /** e.g. "image/png" */
  mime: string
  /** Raw EMVCo / PromptPay payload string */
  payload: string
}

export class ThunderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ThunderError"
  }
}

type PromptPayIdentifier =
  | { msisdn: string }
  | { natId: string }
  | { eWalletId: string }

/**
 * Resolve the shop's PromptPay identifier from env.
 *
 * PROMPTPAY_TYPE may explicitly force the type ("msisdn" | "natId" | "eWalletId").
 * When it is not set, the type is auto-detected from the number of digits,
 * which is what PromptPay/Thunder expect:
 *   - 10 digits  -> msisdn     (Thai mobile number, e.g. 0812345678)
 *   - 13 digits  -> natId      (national ID / tax ID)
 *   - 15 digits  -> eWalletId  (e-Wallet ID)
 */
function getIdentifier(): PromptPayIdentifier {
  const raw = process.env.PROMPTPAY_ID
  if (!raw) {
    throw new ThunderError("ยังไม่ได้ตั้งค่า PROMPTPAY_ID")
  }

  // Thunder expects digits only — strip spaces and dashes first.
  let id = raw.replace(/[\s-]/g, "")
  // Normalize a +66 / 66 country-code prefix to a local 0-prefixed mobile
  // number, but only when the result is a 10-digit number (so a 15-digit
  // eWalletId that happens to start with 66 is left untouched).
  const stripped = id.replace(/^\+?66/, "0")
  if (stripped.length === 10) id = stripped

  const explicit = process.env.PROMPTPAY_TYPE?.trim()
  if (explicit === "natId") return { natId: id }
  if (explicit === "eWalletId") return { eWalletId: id }
  if (explicit === "msisdn") return { msisdn: id }

  // Auto-detect from length.
  switch (id.length) {
    case 15:
      return { eWalletId: id }
    case 13:
      return { natId: id }
    case 10:
    default:
      return { msisdn: id }
  }
}

/**
 * Generate a PromptPay QR for the given amount (in THB).
 * The caller is responsible for computing `amount` on the server.
 */
export async function generatePromptPayQr(amount: number): Promise<ThunderQr> {
  const apiKey = process.env.THUNDER_API_KEY
  if (!apiKey) {
    throw new ThunderError("ยังไม่ได้ตั้งค่า THUNDER_API_KEY")
  }

  const identifier = getIdentifier()

  let res: Response
  try {
    res = await fetch(THUNDER_QR_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "PROMPTPAY",
        amount,
        ...identifier,
      }),
      // QR generation is a quick call; fail fast if Thunder is unreachable.
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    throw new ThunderError(
      err instanceof Error && err.name === "TimeoutError"
        ? "เชื่อมต่อ Thunder API หมดเวลา"
        : "ไม่สามารถเชื่อมต่อ Thunder API ได้",
    )
  }

  const raw = await res.text()
  let json: unknown
  try {
    json = raw ? JSON.parse(raw) : {}
  } catch {
    throw new ThunderError("Thunder API ส่งข้อมูลผิดรูปแบบ")
  }

  if (!res.ok) {
    const message =
      (json as { message?: string; error?: string })?.message ??
      (json as { error?: string })?.error ??
      `Thunder API ตอบกลับสถานะ ${res.status}`
    throw new ThunderError(message)
  }

  const data = (json as { data?: Partial<ThunderQr> }).data
  if (!data?.image || !data.payload) {
    throw new ThunderError("Thunder API ไม่ได้ส่ง QR กลับมา")
  }

  return {
    image: data.image,
    mime: data.mime ?? "image/png",
    payload: data.payload,
  }
}
