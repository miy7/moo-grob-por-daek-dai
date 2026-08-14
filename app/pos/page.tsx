import { PosClient } from "@/components/pos/pos-client"
import { PRICE_PER_UNIT } from "@/lib/pricing"

// Server component: reads the authoritative price from the environment and
// passes it down for display only. The real total is always recomputed
// server-side in the API routes.
export default function PosPage() {
  return <PosClient pricePerUnit={PRICE_PER_UNIT} />
}
