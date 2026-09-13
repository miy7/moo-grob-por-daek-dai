"use server"

import { count, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"

/** Promote only the very first authenticated account to OWNER. */
export async function bootstrapOwner() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { ok: false as const }

  const [{ total }] = await db.select({ total: count() }).from(user)
  if (total !== 1) return { ok: true as const }

  await db.update(user).set({ role: "OWNER", updatedAt: new Date() }).where(eq(user.id, session.user.id))
  return { ok: true as const }
}
