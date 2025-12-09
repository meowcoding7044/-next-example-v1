import { Role } from "@/shared/types";
import { HomeIcon, ShoppingBagIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";

export type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

export type NavConfigItem = {
  id: string;
  href: string;
  label: string;
  adminOnly?: boolean;
  requiredRoles?: Role[];
  icon?: IconComp;
};

export const NAV_LINKS: NavConfigItem[] = [
  { id: "home", href: "/", label: "Home", icon: HomeIcon },
  { id: "products", href: "/products", label: "Products", icon: ShoppingBagIcon },
  { id: "roles", href: "/admin/roles", label: "Roles", requiredRoles: ["admin"], icon: ShieldCheckIcon },
];

export default NAV_LINKS;
