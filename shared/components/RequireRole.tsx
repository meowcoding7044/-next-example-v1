"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, initAuthStore } from "@/shared/stores/auth.store";
export default function RequireRole({
  roles,
  children,
}: {
  roles: string[];
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const rehydrated = useAuthStore((s) => s.rehydrated);
  const router = useRouter();

  //Rehydrate store
  useEffect(() => {
    initAuthStore();
  }, []);

  useEffect(() => {
    if (!rehydrated) return;// รอ rehydrate

    if (!user) {
      router.push("/auth/login");
      return;
    }
    const ok = user.roles?.some((r) => roles.includes(r));
    console.log("RequireRole : ", user)
    if (!ok) router.push("/");
  }, [rehydrated, user, roles, router]);

  if (!rehydrated) return null;

  return <>{children}</>;
}
