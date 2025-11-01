"use client"
import Link from "next/link";
import { useAuthStore, initAuthStore } from "@/shared/stores/auth.store";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useEffect } from "react";
import NavBar from "@/features/nav-bar/nav.bar";
export default function Page() {
    const user = useAuthStore((s) => s.user);
    const rehydrated = useAuthStore((s) => s.rehydrated);

    useEffect(() => {
        initAuthStore()
    }, [])

    if (!rehydrated) return <p>Loading...</p>;
    return (
        <main className="p-6">
            <h1 className="text-3xl font-bold mb-4">Next 16 ({user?.roles || "guest"})</h1>
        </main>
    );
}
