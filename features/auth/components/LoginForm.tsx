"use client";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
export default function LoginForm() {
    const [email, setEmail] = useState("admin@example.com");
    const [password, setPassword] = useState("password");
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    async function onSubmit(e: any) {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            window.location.href = "/products";
        } catch {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    }
    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <input
                className="w-full p-2 border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                className="w-full p-2 border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" disabled={loading}>
                {loading ? "Logging..." : "Login"}
            </button>
        </form>
    );
}
