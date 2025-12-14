"use client";
import React, { useState, useEffect, useRef } from "react";
import { productCreateSchema, ProductCreateInput } from "../validators/product.validator";
import Spinner from "@/shared/components/Spinner";
import { useProductMutations } from "../hooks/useProductMutations";

export default function ProductForm({ onCreated }: { onCreated?: () => void }) {
  const [name, setName] = useState("");
  const [count, setCount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [groupType, setGroupType] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { createMutation } = useProductMutations();
  const isLoading = createMutation.status === "pending";

  // track mounted state to avoid setting state after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
    setError(null);
    createMutation.mutate(payload, {
      onError: () => {
        if (!mountedRef.current) return;
        setError("Create failed");
      },
      onSuccess: () => {
        if (!mountedRef.current) return;
        setSuccess("Product created");
        setName("");
        setCount(0);
        setPrice(0);
        setGroupType("");
        setStatus("active");
        onCreated?.();
      },
      onSettled: () => {
        if (!mountedRef.current) return;
        setTimeout(() => setSuccess(null), 2500);
      },
    });
  }

  function resetForm() {
    setName("");
    setCount(0);
    setPrice(0);
    setGroupType("");
    setStatus("active");
    setError(null);
    setSuccess(null);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded space-y-2 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold">Create Product</h3>
          <p className="text-sm text-gray-600">Add a new product to the inventory.</p>
        </div>
        <div>
          <button
            type="button"
            className="text-sm text-gray-500 hover:underline"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>
      </div>

      {error && <div className="text-red-700 bg-red-100 p-2 rounded">{error}</div>}
      {success && <div className="text-green-700 bg-green-100 p-2 rounded">{success}</div>}
      <div className="flex gap-2">
        <label className="flex-1">
          <span className="sr-only">Name</span>
          <input
            className="p-2 border w-full"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Product name"
          />
        </label>

        <label className="w-24">
          <span className="sr-only">Count</span>
          <input
            className="p-2 border w-full"
            type="number"
            inputMode="numeric"
            placeholder="Count"
            value={String(count)}
            onChange={(e) => setCount(Number(e.target.value) || 0)}
            aria-label="Count"
          />
        </label>

        <label className="w-24">
          <span className="sr-only">Price</span>
          <input
            className="p-2 border w-full"
            type="number"
            inputMode="decimal"
            placeholder="Price"
            value={String(price)}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            aria-label="Price"
          />
        </label>
      </div>
      <div className="flex gap-2 items-center">
        <input className="p-2 border flex-1" placeholder="Group Type" value={groupType} onChange={(e) => setGroupType(e.target.value)} />
        <select className="p-2 border" value={status} onChange={(e) => setStatus(e.target.value as any)} aria-label="Status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-primary flex items-center gap-2" type="submit" disabled={isLoading} aria-disabled={isLoading}>
          {isLoading ? <Spinner size={16} /> : null}
          <span>{isLoading ? "Creating" : "Create"}</span>
        </button>
      </div>
    </form>
  );
}
