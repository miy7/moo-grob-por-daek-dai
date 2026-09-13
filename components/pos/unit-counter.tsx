"use client"

type UnitCounterProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function UnitCounter({ value, onChange, disabled }: UnitCounterProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <label htmlFor="units" className="text-lg font-medium text-muted-foreground">
        น้ำหนักสินค้า (ขีด)
      </label>
      <input
        id="units"
        name="units"
        type="number"
        inputMode="decimal"
        min="0.01"
        max="200"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        aria-describedby="units-help"
        className="h-24 w-full rounded-md border border-input bg-background px-3 text-center text-6xl font-bold tabular-nums text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <p id="units-help" className="text-sm text-muted-foreground">
        เช่น 1.23 หรือ 5.03 ขีด
      </p>
    </div>
  )
}
