
"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthStore, initAuthStore } from "@/shared/stores/auth.store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NAV_LINKS as LINKS } from "../config";
import { can } from "@/shared/utils/permissions";

type NavLink = { href: string; label: string; adminOnly?: boolean };

// `LINKS` now comes from `./config` barrel above

export default function NavBar() {
    const pathname = usePathname();
    const user = useAuthStore((s) => s.user);
    const { logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    // derive visible links for current user
    const visibleLinks = React.useMemo(() => LINKS.filter((l) => can(user, l.requiredRoles)), [user]);

    useEffect(() => { initAuthStore(); }, []);

    useEffect(() => {
        // Close mobile menu on navigation
        setMobileOpen(false);
    }, [pathname]);

    const isActive = React.useCallback((href: string) => {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href ?? "");
    }, [pathname]);

    return (
        <nav className="bg-white border-b font-sans">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center text-white font-extrabold">
                                M
                            </div>
                            <span className="font-semibold text-lg tracking-tight">MeowShop</span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-2">
                            {LINKS.map((l) => {
                                if (!can(user, l.requiredRoles)) return null;
                                const active = isActive(l.href);
                                return <NavItem key={l.href} href={l.href} label={l.label} active={active} icon={l.icon} />;
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center">
                            <UserMenu />
                        </div>

                        <button
                            aria-label="Toggle menu"
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            onClick={() => setMobileOpen((s) => !s)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                        >
                            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div id="mobile-menu" className="md:hidden border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {visibleLinks.map((l) => {
                            const active = isActive(l.href);
                            const Icon = l.icon;
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${
                                        active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
                                    {l.label}
                                </Link>
                            );
                        })}

                        <div className="border-t pt-2">
                            <div className="px-3 py-2">
                                <UserMenu compact />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}