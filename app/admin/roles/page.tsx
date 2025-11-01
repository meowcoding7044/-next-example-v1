import RequireRole from "@/shared/components/RequireRole";
import UserTable from "@/features/user/components/UserTable";
export default function Page() {
    return (
        <RequireRole roles={["admin"]}>
            <main className="p-6">
                <h1 className="text-2xl mb-4">Role Management (Admin)</h1>
                <UserTable />
            </main>
        </RequireRole>
    );
}
