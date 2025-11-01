import { cache } from "react";
import { productService } from "../services/product.service";
import ProductListClient from "./ProductListClient";

const getProducts = cache(async (q: string, page: number, pageSize: number) => {
  const res = await productService.list(q, page, pageSize);
  return res;
});

export default async function ProductListServer() {
  // default load
  const data = await getProducts("", 1, 10);

  return <ProductListClient initialData={data} />;
}