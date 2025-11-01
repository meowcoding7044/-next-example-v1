
"use client"
import { useAuthStore, initAuthStore } from "@/shared/stores/auth.store";
import { useAuth } from "../../features/auth/hooks/useAuth";
import Link from "next/link";
import { useEffect } from "react";

export default function NavBar() {
    const user = useAuthStore((s) => s.user);
    const rehydrated = useAuthStore((s) => s.rehydrated);
    const { logout } = useAuth();
    useEffect(() => {
        initAuthStore()
    }, [])
    return (
        <div className="space-x-2">
            {user == null ? (
                <Link href="/auth/login" className="underline">
                    Login
                </Link>
            ) : (
                <>
                    <button onClick={logout}>logout</button>
                    <Link href="/admin/roles" className="underline">
                        Role Manage (admin)
                    </Link>
                    <Link href="/products" className="underline">
                        Products
                    </Link>
                </>
            )
            }
        </div>
    )
}