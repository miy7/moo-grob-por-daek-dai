"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type UnitCounterProps = {
  units: number
  min?: number
  max?: number
  onIncrement: () => void
  onDecrement: () => void
  disabled?: boolean
}

/**
 * Big +/- stepper for choosing the number of "ขีด".
 * No keyboard entry — staff only tap the buttons.
 */
export function UnitCounter({
  units,
  min = 1,
  max = 200,
  onIncrement,
  onDecrement,
  disabled,
}: UnitCounterProps) {
  const canDecrement = !disabled && units > min
  const canIncrement = !disabled && units < max

  return (
    <div className="flex items-center justify-between gap-4">
      <StepButton
        label="ลดจำนวน"
        onClick={onDecrement}
        disabled={!canDecrement}
      >
        <Minus className="size-10" strokeWidth={3} aria-hidden="true" />
      </StepButton>

      <div className="flex min-w-0 flex-1 flex-col items-center">
        <span
          className="text-8xl font-bold tabular-nums leading-none text-foreground"
          aria-live="polite"
        >
          {units}
        </span>
        <span className="mt-2 text-lg font-medium text-muted-foreground">ขีด</span>
      </div>

      <StepButton
        label="เพิ่มจำนวน"
        onClick={onIncrement}
        disabled={!canIncrement}
      >
        <Plus className="size-10" strokeWidth={3} aria-hidden="true" />
      </StepButton>
    </div>
  )
}

function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-24 shrink-0 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
        "transition-transform duration-100 active:scale-90",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:active:scale-100",
      )}
    >
      {children}
    </button>
  )
}
