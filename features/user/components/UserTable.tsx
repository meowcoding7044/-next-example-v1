"use client";
import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useUserMutations } from "../hooks/useUserMutations";
import { useRoleMutations } from "../hooks/useRoleMutations";
import DataTable, { Column } from "@/shared/components/DataTable";
import UserForm from "./UserForm";

export default function UserTable() {
    const { rows, isLoading } = useUsers();
    const { deleteMutation } = useUserMutations();
    const { updateRoles } = useRoleMutations();
    const { createMutation, updateMutation } = useUserMutations();
    const [formOpen, setFormOpen] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    if (isLoading) return <div className="p-4">Loading users...</div>;

    const columns: Column<any>[] = [
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        {
            key: "roles",
            label: "Roles",
            render: (r) => (Array.isArray(r.roles) ? r.roles.join(", ") : ""),
        },
        {
            key: "actions",
            label: "Actions",
                render: (r) => (
                    <>
                        <button
                            className="px-2 py-1 mr-2 bg-yellow-400"
                            onClick={() => {
                                setSelected(r);
                                setFormOpen(true);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className={`px-2 py-1 text-white ${deleteMutation.status === "pending" ? "bg-gray-400" : "bg-red-500"}`}
                            onClick={() => {
                                if (confirm("Delete user?")) {
                                    deleteMutation.mutate(String(r.id));
                                }
                            }}
                            disabled={deleteMutation.status === "pending"}
                        >
                            {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
                        </button>
                    </>
                ),
        },
    ];

    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Users</h3>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setSelected(null);
                            setFormOpen(true);
                        }}
                    >
                        New User
                    </button>
                </div>
            </div>
            <DataTable columns={columns} data={rows} rowKey={(r) => String(r.id)} />
            <UserForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                initial={selected}
                onSaved={() => {
                    // nothing special; query invalidation happens in mutations
                }}
            />
        </div>
    );
}
