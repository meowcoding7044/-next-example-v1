"use client";
import React, { useEffect, useState } from "react";
import { productService } from "../services/product.service";

export default function ProductListClient({ initialData }: any) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<any[]>(initialData.data || []);
  const [meta, setMeta] = useState<any>(initialData.meta || { page: 1, pageSize: 10, total: rows.length });

  async function load() {
    try {
      const res = await productService.list(q, page, 10);
      setRows(res.data || res);
      setMeta(res.meta || { page: 1, pageSize: 10, total: (res.data || []).length });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="p-2 border flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search..."
        />
        <button className="btn" onClick={() => setPage(1)}>Search</button>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 items-center">
        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
        <div>Page {meta.page} / {Math.ceil(meta.total / meta.pageSize || 1)}</div>
        <button className="btn" onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
