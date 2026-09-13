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

  // Weight can be entered to two decimal places, e.g. 1.03 or 2.50.
  const roundedUnits = Math.round(rawUnits * 100) / 100
  if (Math.abs(rawUnits - roundedUnits) > Number.EPSILON) {
    return { ok: false, error: "จำนวนขีดใส่ทศนิยมได้ไม่เกิน 2 ตำแหน่ง" }
  }

  if (roundedUnits <= 0) {
    return { ok: false, error: "จำนวนขีดต้องมากกว่า 0" }
  }

  if (roundedUnits > MAX_UNITS) {
    return { ok: false, error: `จำนวนขีดต้องไม่เกิน ${MAX_UNITS}` }
  }

  return {
    ok: true,
    units: roundedUnits,
    // Round to satang-equivalent precision so values like 1.03 × 80
    // never display an IEEE-754 floating-point artifact.
    amount: Math.round(roundedUnits * PRICE_PER_UNIT * 100) / 100,
  }
}

/** Format a THB amount for display, e.g. 240 => "240" */
export function formatBaht(amount: number): string {
  return new Intl.NumberFormat("th-TH").format(amount)
}
