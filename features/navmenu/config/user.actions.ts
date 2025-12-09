export type UserAction = { id: string; label: string; href?: string };

export const USER_ACTIONS: UserAction[] = [
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "settings", label: "Settings", href: "/settings" },
  { id: "billing", label: "Billing", href: "/billing" },
  { id: "logout", label: "Sign out" },
];

export default USER_ACTIONS;
