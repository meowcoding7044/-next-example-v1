"use client";
import React from "react";
import { Menu } from "@headlessui/react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { USER_ACTIONS } from "../config";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function UserMenu({ compact = false }: { compact?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const rehydrated = useAuthStore((s) => s.rehydrated);
  const { logout } = useAuth();

  if (!rehydrated) return null;

  if (!user) {
    return (
      <a href="/auth/login" className="text-sm text-indigo-600 hover:underline">
        Sign in
      </a>
    );
  }

  return (
    <Menu as="div" className={`relative inline-block text-left ${compact ? "text-sm" : "text-sm"}`}>
      <div>
        <Menu.Button className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-100">
          <UserCircleIcon className="h-8 w-8 text-indigo-500" />
          <span className="font-medium text-gray-800">{user.name || user.email}</span>
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
        <div className="py-1">
          {USER_ACTIONS.map((a) => (
            <Menu.Item key={a.id}>
              {({ active }) =>
                a.id === "logout" ? (
                  <button
                    onClick={() => logout()}
                    className={`w-full text-left block px-4 py-2 text-sm text-red-600 ${active ? "bg-gray-100" : ""}`}
                  >
                    {a.label}
                  </button>
                ) : (
                  <a
                    href={a.href}
                    className={`block px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                  >
                    {a.label}
                  </a>
                )
              }
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
