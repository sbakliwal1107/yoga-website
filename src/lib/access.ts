import type { UserDoc } from "./types";

export function hasPaidAccess(user: UserDoc | null): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.freeAccess) return true;
  if (!user.accessUntil) return false;
  return user.accessUntil.toDate().getTime() > Date.now();
}

export function demoClassesLeft(user: UserDoc | null, limit: number): number {
  if (!user) return 0;
  return Math.max(0, limit - (user.demoClassesJoined ?? 0));
}
