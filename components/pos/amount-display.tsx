import { formatBaht } from "@/lib/pricing"

type AmountDisplayProps = {
  units: number
  amount: number
  pricePerUnit: number
}

/** Prominent, glanceable running total for the current order. */
export function AmountDisplay({ units, amount, pricePerUnit }: AmountDisplayProps) {
  return (
    <div className="rounded-3xl bg-card p-6 text-center shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        {units} ขีด × {pricePerUnit} บาท
      </p>
      <div className="mt-1 flex items-end justify-center gap-2">
        <span className="text-6xl font-bold tabular-nums tracking-tight text-foreground">
          {formatBaht(amount)}
        </span>
        <span className="pb-2 text-2xl font-semibold text-muted-foreground">บาท</span>
      </div>
    </div>
  )
}
