"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";

export function useProducts(initialQ = "", initialPage = 1, initialPageSize = 10) {
  const [q, setQ] = useState(initialQ);
  const [page, setPage] = useState(initialPage);
  const [pageSize] = useState(initialPageSize);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["products", q, page],
    queryFn: () => productService.list(q, page, pageSize),
    staleTime: 1000 * 30,
  });

  const rows = query.data?.data || [];
  const meta = query.data?.meta || { page, pageSize, total: rows.length };

  function reload() {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  }

  return {
    q,
    setQ,
    page,
    setPage,
    pageSize,
    rows,
    meta,
    isLoading: query.isLoading,
    error: query.error,
    reload,
  };
}
