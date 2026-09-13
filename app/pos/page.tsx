import { PosClient } from "@/components/pos/pos-client"
import { PRICE_PER_UNIT } from "@/lib/pricing"
import { requireUser } from "@/lib/auth-session"

// Server component: reads the authoritative price from the environment and
// passes it down for display only. The real total is always recomputed
// server-side in the API routes.
export default async function PosPage() {
  await requireUser()
  return <PosClient pricePerUnit={PRICE_PER_UNIT} />
}
