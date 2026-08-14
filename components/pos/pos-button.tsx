import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "danger"

type POSButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 active:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground border border-border active:bg-accent",
  danger:
    "bg-card text-destructive border-2 border-destructive/40 active:bg-destructive/10",
}

/**
 * Large, touch-friendly action button for front-of-store use.
 * Big hit target, clear pressed feedback, disabled-safe.
 */
export function POSButton({
  variant = "primary",
  className,
  disabled,
  children,
  ...props
}: POSButtonProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-5 text-xl font-semibold",
        "transition-transform duration-100 select-none",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40",
        "active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        variantClasses[variant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
