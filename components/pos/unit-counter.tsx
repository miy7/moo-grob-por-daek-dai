"use client"

type UnitCounterProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function UnitCounter({ value, onChange, disabled }: UnitCounterProps) {
  const appendValue = (digit: string) => {
    if (disabled) return
    if (digit === "." && value.includes(".")) return
    if (value === "0" && digit !== ".") {
      onChange(digit)
      return
    }
    if (value.length >= 6) return
    onChange(`${value}${digit}`)
  }

  const removeLastValue = () => {
    if (disabled) return
    onChange(value.slice(0, -1))
  }

  const clearValue = () => {
    if (disabled) return
    onChange("")
  }

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
      <div className="grid w-full max-w-xs grid-cols-3 gap-2" aria-label="แป้นตัวเลข">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => appendValue(digit)}
            disabled={disabled}
            className="h-12 rounded-md border border-input bg-muted text-xl font-semibold tabular-nums text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`กรอกเลข ${digit}`}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={clearValue}
          disabled={disabled}
          className="h-12 rounded-md border border-input bg-muted text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ล้าง
        </button>
        <button
          type="button"
          onClick={() => appendValue("0")}
          disabled={disabled}
          className="h-12 rounded-md border border-input bg-muted text-xl font-semibold tabular-nums text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="กรอกเลข 0"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => appendValue(".")}
          disabled={disabled}
          className="h-12 rounded-md border border-input bg-muted text-xl font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="กรอกจุดทศนิยม"
        >
          .
        </button>
        <button
          type="button"
          onClick={removeLastValue}
          disabled={disabled}
          className="col-span-3 h-10 rounded-md border border-input bg-muted text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="ลบตัวเลขตัวสุดท้าย"
        >
          ลบตัวสุดท้าย
        </button>
      </div>
    </div>
  )
}
