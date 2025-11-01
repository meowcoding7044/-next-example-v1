export type Role = "admin" | "manage" | "general";
export type User = { id: string; name: string; email: string; roles: Role[] };
export type Product = {
  id: string;
  name: string;
  count: number;
  price: number;
  groupType?: string;
  status: "active" | "inactive";
};



export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
  };
}