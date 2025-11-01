import ProductList from "@/features/product/components/ProductList";
import ProductListServer from "@/features/product/components/ProductListServer";
export default function Page() {
    return (
        <main className="p-6">
            <h1 className="text-2xl mb-4">Products</h1>
            <ProductList />
        </main>
    );
}
