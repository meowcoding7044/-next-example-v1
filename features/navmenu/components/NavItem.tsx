"use client";
import Link from "next/link";
import React from "react";

import type { IconComp } from "../config";

export default function NavItem({ href, label, active, onClick, icon: Icon }: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: IconComp | undefined;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium inline-flex items-center gap-2 transition-colors ${
        active ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
      <span>{label}</span>
    </Link>
  );
}
