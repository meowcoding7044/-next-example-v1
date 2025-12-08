"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import { useAuthStore } from "@/shared/stores/auth.store";
import ProductForm from "./ProductForm";
import ConfirmationModal from "@/shared/components/ConfirmationModal";
import toast from "react-hot-toast";
import Spinner from "@/shared/components/Spinner";

export default function ProductList() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);

    // form error state (for any top-level messages)
    const [formErrors, setFormErrors] = useState<string | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", q, page], 
        queryFn: () => productService.list(q, page, 10),
        staleTime: 1000 * 30, 
    })


    const rows = data?.data || [];
    const meta = data?.meta || { page: 1, pageSize: 10, total: rows.length };

    const reload = () => queryClient.invalidateQueries({ queryKey: ["products"] });

    const canCreate = user?.roles?.some((r: any) => ["admin", "manage"].includes(r));

    function onCreated() {
        setFormErrors(null);
        reload();
    }

    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedName, setSelectedName] = useState<string | null>(null);

    const handleUpdate = async (id: string, count: number) => {
        setLoadingIds((s) => [...s, id]);
        const key = ["products", q, page];
        const prev = queryClient.getQueryData<any>(key);
        // optimistic update: update the cache
        queryClient.setQueryData(key, (old: any) => {
            if (!old) return old;
            return {
                ...old,
                data: old.data.map((it: any) => (it.id === id ? { ...it, count } : it)),
            };
        });
        try {
            await productService.update(id, { count });
            toast.success("Updated");
        } catch (e) {
            // rollback
            queryClient.setQueryData(key, prev);
            toast.error("Update failed");
        } finally {
            setLoadingIds((s) => s.filter((x) => x !== id));
        }
    };

    const handleDelete = async (id: string) => {
        setLoadingIds((s) => [...s, id]);
        const key = ["products", q, page];
        const prev = queryClient.getQueryData<any>(key);
        queryClient.setQueryData(key, (old: any) => {
            if (!old) return old;
            return { ...old, data: old.data.filter((it: any) => it.id !== id), meta: { ...old.meta, total: Math.max(0, (old.meta?.total || 1) - 1) } };
        });
        try {
            await productService.remove(id);
            toast.success("Deleted");
        } catch (e) {
            queryClient.setQueryData(key, prev);
            toast.error("Delete failed");
        } finally {
            setLoadingIds((s) => s.filter((x) => x !== id));
            setConfirmOpen(false);
            setSelectedId(null);
        }
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
                <input
                    className="p-2 border flex-1"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="search..."
                />
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
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white flex items-center gap-2"
                                        onClick={() => showDeleteConfirm(r.id, r.name)}
                                        disabled={loadingIds.includes(r.id)}
                                    >
                                        {loadingIds.includes(r.id) ? <Spinner size={14} /> : "Delete"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ConfirmationModal
                open={confirmOpen}
                title="Delete product"
                message={`Delete ${selectedName ?? "this product"}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => selectedId && handleDelete(selectedId)}
            />
            <div className="flex gap-2 items-center">
                <button
                    className="btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <div>
                    Page {meta.page} / {Math.ceil(meta.total / meta.pageSize || 1)}
                </div>
                <button
                    className="btn"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page * meta.pageSize >= meta.total}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
