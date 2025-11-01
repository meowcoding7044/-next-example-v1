"use client";
import React, { useEffect, useState } from "react";
import { userService } from "../services/user.service";
export default function UserTable() {
    const [rows, setRows] = useState<any[]>([]);
    async function load() {
        try {
            const res = await userService.list();
            setRows(res.data || res);
            console.log("UserTable load  : ",res);
        } catch (e) {
            console.error("UserTable Error : "+e);
            //alert("UserTable Failed : "+e);
        }
    }
    useEffect(() => {
        load();
    }, []);
    return (
        <div className="bg-white p-4 rounded shadow">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="p-2">{r.name}</td>
                            <td className="p-2">{r.email}</td>
                            <td className="p-2">{r.roles.join(", ")}</td>
                            <td className="p-2">
                                <button className="px-2 py-1 mr-2 bg-yellow-400">Edit</button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white"
                                    onClick={async () => {
                                        if (confirm("Delete?")) {
                                            await userService.remove(r.id);
                                            load();
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
