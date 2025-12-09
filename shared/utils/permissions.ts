import { User } from "@/shared/types";

export function hasRole(user: User | null | undefined, role: string) {
  if (!user || !user.roles) return false;
  return user.roles.includes(role as any);
}

export function hasAnyRole(user: User | null | undefined, roles: string[] = []) {
  if (!user || !user.roles) return false;
  return roles.some((r) => user.roles.includes(r as any));
}

export function can(user: User | null | undefined, requiredRoles?: string[] | undefined) {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return hasAnyRole(user, requiredRoles);
}

export default { hasRole, hasAnyRole, can };
