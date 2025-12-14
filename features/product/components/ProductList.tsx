"use client";
import React, { useState, useRef } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import ProductForm from "./ProductForm";
import ConfirmationModal from "@/shared/components/ConfirmationModal";
import toast from "react-hot-toast";
import Spinner from "@/shared/components/Spinner";
import { useProducts } from "../hooks/useProducts";
import { useProductMutations } from "../hooks/useProductMutations";
import { useVirtualizer } from '@tanstack/react-virtual';

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

    // virtualization setup
    const listRef = useRef<HTMLDivElement | null>(null);
    const asideRef = useRef<HTMLDivElement | null>(null);
    const rowHeight = 56; // estimated row height in px
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => listRef.current,
        estimateSize: () => rowHeight,
        overscan: 6,
    });

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
                <aside ref={asideRef} className="lg:col-span-1 bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-2">Create Product</h2>
                    {formErrors && <div className="text-red-700 bg-red-100 p-2 rounded mb-2">{formErrors}</div>}
                    <ProductForm onCreated={onCreated} />
                </aside>
            )}

            {/* Right: Header, List and controls */}
            <section className={`${canCreate ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Products</h1>
                        <p className="text-sm text-gray-600">{meta.total ?? 0} products</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {canCreate && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => asideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            >
                                New Product
                            </button>
                        )}

                        <button className="btn" onClick={() => reload()}>Refresh</button>
                    </div>
                </div>
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
                        <div ref={listRef} className="overflow-auto" style={{ maxHeight: 520 }}>
                            {/* Virtualized rows container */}
                            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
                                {virtualizer.getVirtualItems().map((virtualRow) => {
                                    const r = rows[virtualRow.index];
                                    return (
                                        <div
                                            key={r.id}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                            className="border-b hover:bg-gray-50 flex items-center"
                                        >
                                            <div className="py-3 px-3 w-1/3 font-medium">{r.name}</div>
                                            <div className="py-3 px-3 w-1/6">{r.count}</div>
                                            <div className="py-3 px-3 w-1/6">{typeof r.price === 'number' ? `$${r.price.toFixed(2)}` : r.price}</div>
                                            <div className="py-3 px-3 w-1/6">{r.groupType}</div>
                                            <div className="py-3 px-3 w-1/12"><span className={`px-2 py-1 rounded text-xs ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{r.status}</span></div>
                                            <div className="py-3 px-3 w-1/6">
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <ConfirmationModal open={confirmOpen} title="Delete product" message={`Delete ${selectedName ?? 'this product'}?`} onCancel={() => setConfirmOpen(false)} onConfirm={() => selectedId && handleDelete(selectedId)} />
            </section>
        </div>
    );
}
