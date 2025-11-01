"use client";
import React from "react";
import LoginForm from "@/features/auth/components/LoginForm";
export default function LoginPage() {
    return (
        <main className="p-6">
            <h1 className="text-2xl mb-4">Login</h1>
            <div className="max-w-md">
                <LoginForm />
            </div>
        </main>
    );
}
