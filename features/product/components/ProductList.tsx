"use client";
import React, { useState } from "react";
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { productService } from "../services/product.service";

export default function ProductList() {
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", q, page], 
        queryFn: () => productService.list(q, page, 10),
        staleTime: 1000 * 30, 
    })


    const rows = data?.data || [];
    const meta = data?.meta || { page: 1, pageSize: 10, total: rows.length };

    const reload = () => queryClient.invalidateQueries({ queryKey: ["products"] });

    const handleUpdate = async (id: string, count: number) => {
        await productService.update(id, { count });
        reload();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete?")) return;
        await productService.remove(id);
        reload();
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading products</div>;

    return (
        <div className="space-y-4">
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
                                        className="px-2 py-1 bg-green-500 text-white mr-2"
                                        onClick={() => {
                                            const newCount = prompt("New count", String(r.count));
                                            if (newCount) handleUpdate(r.id, Number(newCount));
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-500 text-white"
                                        onClick={() => handleDelete(r.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
