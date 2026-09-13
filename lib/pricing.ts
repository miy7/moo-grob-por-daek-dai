// Pricing is the single source of truth for how an order total is computed.
// The client only ever sends "units" (จำนวนขีด) — the amount is ALWAYS
// derived on the server from this module so the client can never set its own price.

export const PRICE_PER_UNIT = Number(process.env.PRICE_PER_UNIT ?? 80)

export const MAX_UNITS = 200

export type ValidatedUnits = {
  ok: true
  units: number
  amount: number
}

export type InvalidUnits = {
  ok: false
  error: string
}

/**
 * Validate a raw "units" value coming from an untrusted client request and
 * compute the authoritative amount. Never trust an amount sent by the client.
 */
export function validateAndPrice(rawUnits: unknown): ValidatedUnits | InvalidUnits {
  if (typeof rawUnits !== "number" || !Number.isFinite(rawUnits)) {
    return { ok: false, error: "units ต้องเป็นตัวเลข" }
  }

  if (rawUnits <= 0) {
    return { ok: false, error: "units ต้องมากกว่า 0" }
  }

  // Use a tolerance because values such as 1.34 can be represented as
  // 1.3400000000000001 by JavaScript's floating-point number format.
  const roundedUnits = Math.round((rawUnits + Number.EPSILON) * 100) / 100
  if (Math.abs(rawUnits - roundedUnits) > Number.EPSILON * 10) {
    return { ok: false, error: "units กรอกทศนิยมได้ไม่เกิน 2 ตำแหน่ง" }
  }

  if (rawUnits > MAX_UNITS) {
    return { ok: false, error: `units ต้องไม่เกิน ${MAX_UNITS}` }
  }

  return {
    ok: true,
    units: roundedUnits,
    // PromptPay amounts must be stable decimal values, not floating-point
    // artifacts such as 402.40000000000003.
    amount: Math.round(roundedUnits * PRICE_PER_UNIT * 100) / 100,
  }
}

/** Format a THB amount for display, e.g. 240 => "240" */
export function formatBaht(amount: number): string {
  return new Intl.NumberFormat("th-TH").format(amount)
}
