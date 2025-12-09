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

    if (isLoading) return <div className="p-6">Loading products...</div>;
    if (error) return <div className="p-6 text-red-600">Error loading products</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Create form (if allowed) */}
            {canCreate && (
                <aside className="lg:col-span-1 bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Create Product</h2>
                    {formErrors && <div className="text-red-700 bg-red-100 p-2 rounded mb-2">{formErrors}</div>}
                    <ProductForm onCreated={onCreated} />
                </aside>
            )}

            {/* Right: List and controls */}
            <section className={`${canCreate ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input className="p-2 border rounded flex-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." />
                        <button className="ml-2 btn" onClick={() => setPage(1)}>Search</button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600">Page {meta.page} / {Math.max(1, Math.ceil((meta.total || 0) / (meta.pageSize || 1)))}</div>
                        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
                        <button className="btn" onClick={() => setPage((p) => p + 1)} disabled={page * meta.pageSize >= meta.total}>Next</button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    {rows.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">No products found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="text-left text-sm text-gray-600 border-b">
                                        <th className="py-2 px-3">Name</th>
                                        <th className="py-2 px-3">Count</th>
                                        <th className="py-2 px-3">Price</th>
                                        <th className="py-2 px-3">Group</th>
                                        <th className="py-2 px-3">Status</th>
                                        <th className="py-2 px-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r: any) => (
                                        <tr key={r.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-3 font-medium">{r.name}</td>
                                            <td className="py-3 px-3">{r.count}</td>
                                            <td className="py-3 px-3">{typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : r.price}</td>
                                            <td className="py-3 px-3">{r.groupType}</td>
                                            <td className="py-3 px-3"><span className={`px-2 py-1 rounded text-xs ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span></td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        title="Update count"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded bg-indigo-600 text-white"
                                                        onClick={() => {
                                                            const newCount = prompt('New count', String(r.count));
                                                            if (newCount) handleUpdate(r.id, Number(newCount));
                                                        }}
                                                        disabled={loadingIds.includes(r.id)}
                                                    >
                                                        {loadingIds.includes(r.id) ? <Spinner size={14} /> : '↻'}
                                                    </button>

                                                    <button
                                                        title="Delete"
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded bg-red-600 text-white"
                                                        onClick={() => showDeleteConfirm(r.id, r.name)}
                                                        disabled={loadingIds.includes(r.id)}
                                                    >
                                                        {loadingIds.includes(r.id) ? <Spinner size={14} /> : '🗑'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <ConfirmationModal open={confirmOpen} title="Delete product" message={`Delete ${selectedName ?? 'this product'}?`} onCancel={() => setConfirmOpen(false)} onConfirm={() => selectedId && handleDelete(selectedId)} />
            </section>
        </div>
    );
}
