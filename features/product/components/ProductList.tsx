"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import ProductForm from "./ProductForm";
import ConfirmationModal from "@/shared/components/ConfirmationModal";
import toast from "react-hot-toast";
import Spinner from "@/shared/components/Spinner";
import { useProducts } from "../hooks/useProducts";
import { useProductMutations } from "../hooks/useProductMutations";

export default function ProductList() {
    const { q, setQ, page, setPage, rows, meta, isLoading, error, reload } = useProducts();
    const { createMutation, updateMutation, deleteMutation } = useProductMutations();
    const user = useAuthStore((s) => s.user);

    const [formErrors, setFormErrors] = useState<string | null>(null);
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    const canCreate = user?.roles?.some((r: any) => ["admin", "manage"].includes(r));

    function onCreated() {
        setFormErrors(null);
        reload();
    }

    const handleUpdate = (id: string, count: number) => {
        setLoadingIds((s) => [...s, id]);
        updateMutation.mutate({ id, patch: { count } }, {
            onError: () => toast.error("Update failed"),
            onSuccess: () => toast.success("Updated"),
            onSettled: () => setLoadingIds((s) => s.filter((x) => x !== id)),
        });
    };

    const handleDelete = (id: string) => {
        setLoadingIds((s) => [...s, id]);
        deleteMutation.mutate(id, {
            onError: () => toast.error("Delete failed"),
            onSuccess: () => toast.success("Deleted"),
            onSettled: () => {
                setLoadingIds((s) => s.filter((x) => x !== id));
                setConfirmOpen(false);
                setSelectedId(null);
            },
        });
    };

    function showDeleteConfirm(id: string, name?: string) {
        setSelectedId(id);
        setSelectedName(name ?? null);
        setConfirmOpen(true);
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className="space-y-4">
            {canCreate && (
                <div>
                    <h2 className="text-lg font-medium">Create Product</h2>
                    {formErrors && <div className="text-red-700 bg-red-100 p-2 rounded">{formErrors}</div>}
                    <ProductForm onCreated={onCreated} />
                </div>
            )}

            <div className="flex gap-2">
                <input className="p-2 border flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="search..." />
                <button className="btn" onClick={() => setPage(1)}>
                    Search
                </button>
            </div>

            <div className="bg-white p-4 rounded">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Count</th>
                            <th>Price</th>
                            <th>Group</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r: any) => (
                            <tr key={r.id} className="border-t">
                                <td className="p-2">{r.name}</td>
                                <td className="p-2">{r.count}</td>
                                <td className="p-2">{r.price}</td>
                                <td className="p-2">{r.groupType}</td>
                                <td className="p-2">{r.status}</td>
                                <td className="p-2">
                                    <button
                                        className="px-2 py-1 bg-green-500 text-white mr-2 flex items-center gap-2"
                                        onClick={() => {
                                            const newCount = prompt("New count", String(r.count));
                                            if (newCount) handleUpdate(r.id, Number(newCount));
                                        }}
                                        disabled={loadingIds.includes(r.id)}
                                    >
                                        {loadingIds.includes(r.id) ? <Spinner size={14} /> : "Update"}
                                    </button>
                                    <button className="px-2 py-1 bg-red-500 text-white flex items-center gap-2" onClick={() => showDeleteConfirm(r.id, r.name)} disabled={loadingIds.includes(r.id)}>
                                        {loadingIds.includes(r.id) ? <Spinner size={14} /> : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal open={confirmOpen} title="Delete product" message={`Delete ${selectedName ?? "this product"}?`} onCancel={() => setConfirmOpen(false)} onConfirm={() => selectedId && handleDelete(selectedId)} />

            <div className="flex gap-2 items-center">
                <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    Prev
                </button>
                <div>
                    Page {meta.page} / {Math.ceil(meta.total / meta.pageSize || 1)}
                </div>
                <button className="btn" onClick={() => setPage((p) => p + 1)} disabled={page * meta.pageSize >= meta.total}>
                    Next
                </button>
            </div>
        </div>
    );
}
