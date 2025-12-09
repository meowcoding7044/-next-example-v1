"use client";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRoles } from "../hooks/useRoles";
import { useUserMutations } from "../hooks/useUserMutations";
import { userCreateSchema, userUpdateSchema } from "../validators/user.validator";
import Spinner from "@/shared/components/Spinner";

type User = {
  id?: string | number;
  name?: string;
  email?: string;
  roles?: string[];
};

export default function UserForm({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial?: User | null;
  onSaved?: () => void;
}) {
  const { roles: allRoles } = useRoles();
  const { createMutation, updateMutation } = useUserMutations();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
    setRoles(initial?.roles ? [...initial.roles] : []);
    setError(null);
    setFieldErrors({});
  }, [initial, open]);

  const saving = createMutation.status === "pending" || updateMutation.status === "pending";

  function toggleRole(r: string) {
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const input = { name: name.trim(), email: email.trim(), roles };
    const parsed = initial?.id
      ? userUpdateSchema.safeParse({ id: String(initial.id), ...input })
      : userCreateSchema.safeParse(input);

    if (!parsed.success) {
      const flat = parsed.error.flatten();
      setFieldErrors(flat.fieldErrors || {});
      const first = Object.values(flat.fieldErrors || {}).flat()[0];
      setError(first || "Validation failed");
      return;
    }

    const payload = { name: parsed.data.name, email: parsed.data.email, roles: parsed.data.roles || [] };
    try {
      if (initial?.id) {
        await updateMutation.mutateAsync({ id: String(initial.id), payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSaved?.();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Save failed");
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {initial?.id ? "Edit User" : "New User"}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  {error && <div className="text-red-700 bg-red-100 p-2 rounded">{error}</div>}
                  <div>
                    <label className="block text-sm">Name</label>
                    <input className="w-full p-2 border" value={name} onChange={(e) => setName(e.target.value)} />
                    {fieldErrors.name && <div className="text-red-600 text-sm mt-1">{fieldErrors.name[0]}</div>}
                  </div>
                  <div>
                    <label className="block text-sm">Email</label>
                    <input className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {fieldErrors.email && <div className="text-red-600 text-sm mt-1">{fieldErrors.email[0]}</div>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {(allRoles || []).map((r) => (
                        <label key={r} className="inline-flex items-center gap-2">
                          <input type="checkbox" checked={roles.includes(r)} onChange={() => toggleRole(r)} />
                          <span className="text-sm">{r}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" className="btn" onClick={onClose} disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? <Spinner size={14} /> : initial?.id ? "Save" : "Create"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
