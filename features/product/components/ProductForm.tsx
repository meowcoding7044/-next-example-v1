"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productCreateSchema, ProductCreateInput } from "../validators/product.validator";
import { productService } from "../services/product.service";
import Spinner from "@/shared/components/Spinner";

export default function ProductForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [count, setCount] = useState<number | string>(0);
  const [price, setPrice] = useState<number | string>(0);
  const [groupType, setGroupType] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, ProductCreateInput, { previous?: any }>({
    mutationFn: (payload: ProductCreateInput) => productService.create(payload),
    onMutate: async (newProduct: ProductCreateInput) => {
      setError(null);
      // cancel queries and snapshot
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<any>(["products"]);
      // optimistic insert at front
      const temp = { id: `tmp-${Date.now()}`, ...newProduct };
      queryClient.setQueryData(["products"], (old: any) => {
        if (!old) return { data: [temp], meta: { page: 1, pageSize: 10, total: 1 } };
        return { ...old, data: [temp, ...old.data], meta: { ...old.meta, total: (old.meta?.total || 0) + 1 } };
      });
      return { previous };
    },
    onError: (err: unknown, vars: ProductCreateInput, context: any) => {
      if (context?.previous) queryClient.setQueryData(["products"], context.previous);
      setError("Create failed");
    },
    onSuccess: (data: any) => {
      setSuccess("Product created");
      setName("");
      setCount(0);
      setPrice(0);
      setGroupType("");
      setStatus("active");
      // ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onCreated?.();
    },
    onSettled: () => {
      setTimeout(() => setSuccess(null), 2500);
      setLoading(false);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = productCreateSchema.safeParse({ name, count, price, groupType, status });
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message || "Invalid input");
      return;
    }
    const payload = parsed.data as ProductCreateInput;
    setLoading(true);
    mutation.mutate(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded space-y-2 shadow-sm">
      {error && <div className="text-red-700 bg-red-100 p-2 rounded">{error}</div>}
      {success && <div className="text-green-700 bg-green-100 p-2 rounded">{success}</div>}
      <div className="flex gap-2">
        <input className="p-2 border flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="p-2 border w-24" type="number" placeholder="Count" value={String(count)} onChange={(e) => setCount(e.target.value)} />
        <input className="p-2 border w-24" type="number" placeholder="Price" value={String(price)} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <div className="flex gap-2 items-center">
        <input className="p-2 border flex-1" placeholder="Group Type" value={groupType} onChange={(e) => setGroupType(e.target.value)} />
        <select className="p-2 border" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-primary flex items-center gap-2" type="submit" disabled={loading}>
          {loading ? <Spinner size={16} /> : null}
          <span>{loading ? "Creating" : "Create"}</span>
        </button>
      </div>
    </form>
  );
}
