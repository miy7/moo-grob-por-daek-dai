// Pricing is the single source of truth for how an order total is computed.
// The client only ever sends "units" (จำนวนขีด) — the amount is ALWAYS
// derived on the server from this module so the client can never set its own price.

export const PRICE_PER_UNIT = Number(process.env.PRICE_PER_UNIT ?? 1)

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

  if (!Number.isInteger(rawUnits)) {
    return { ok: false, error: "units ต้องเป็นจำนวนเต็ม" }
  }

  if (rawUnits < 1) {
    return { ok: false, error: "units ต้องมากกว่า 0" }
  }

  if (rawUnits > MAX_UNITS) {
    return { ok: false, error: `units ต้องไม่เกิน ${MAX_UNITS}` }
  }

  return {
    ok: true,
    units: rawUnits,
    amount: rawUnits * PRICE_PER_UNIT,
  }
}

/** Format a THB amount for display, e.g. 240 => "240" */
export function formatBaht(amount: number): string {
  return new Intl.NumberFormat("th-TH").format(amount)
}
