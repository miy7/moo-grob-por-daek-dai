import "server-only"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export type Role = "OWNER" | "MANAGER" | "STAFF"

/** Role hierarchy — higher number = more privilege. */
const ROLE_RANK: Record<Role, number> = {
  STAFF: 1,
  MANAGER: 2,
  OWNER: 3,
}

export type SessionUser = {
  id: string
  name: string
  username: string | null
  role: Role
}

/**
 * Returns the current session user or null. Never throws.
 * Use in layouts/pages that want to branch on auth state.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const u = session.user as typeof session.user & {
    username?: string | null
    role?: string | null
  }
  return {
    id: u.id,
    name: u.name,
    username: u.username ?? null,
    role: (u.role as Role) ?? "STAFF",
  }
}

/**
 * Requires an authenticated user. Redirects to /login when signed out.
 * This is the server-side authorization gate — never rely on the client.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect("/login")
  return user
}

/** True when `role` meets or exceeds `min` in the hierarchy. */
export function hasRole(role: Role, min: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[min]
}

/**
 * Requires an authenticated user with at least the given role.
 * Redirects signed-out users to /login and under-privileged users to /unauthorized.
 */
export async function requireRole(min: Role): Promise<SessionUser> {
  const user = await requireUser()
  if (!hasRole(user.role, min)) redirect("/unauthorized")
  return user
}
