"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { adminService } from "@/services/admin-service";
import type { User, UserRole } from "@/types/domain";

type RoleFilter = "" | "STUDENT" | "OWNER" | "ADMIN";

const roleLabel: Record<RoleFilter, string> = {
  "": "All",
  STUDENT: "Students",
  OWNER: "Owners",
  ADMIN: "Admin"
};

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [role, setRole] = useState<RoleFilter>("");

  const { data } = useQuery({
    queryKey: ["admin-users", role],
    queryFn: () => adminService.users(role || undefined)
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateUserStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] })
  });

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "role", header: "Role" },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "OWNER") {
          const profile = user.ownerProfile;
          return (
            <span className="block max-w-60 truncate text-sm text-slate-600">
              {profile?.businessName || profile?.address ? `${profile.businessName ?? ""}${profile.address ? ` · ${profile.address}` : ""}` : "—"}
            </span>
          );
        }
        if (user.role === "STUDENT") {
          const profile = user.studentProfile;
          return (
            <span className="block max-w-60 truncate text-sm text-slate-600">
              {profile?.collegeName ?? "—"}
            </span>
          );
        }
        return <span className="text-sm text-slate-600">—</span>;
      }
    },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.status === "ACTIVE" ? (
            <Button
              variant="secondary"
              onClick={() => statusMutation.mutate({ id: row.original.id, status: "SUSPENDED" })}
            >
              Suspend
            </Button>
          ) : row.original.status === "SUSPENDED" ? (
            <Button onClick={() => statusMutation.mutate({ id: row.original.id, status: "ACTIVE" })}>
              Activate
            </Button>
          ) : null}
        </div>
      )
    }
  ];

  const filters: RoleFilter[] = ["", "STUDENT", "OWNER", "ADMIN"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter || "all"}
              onClick={() => setRole(filter)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                role === filter
                  ? "bg-slate-950 text-white"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {roleLabel[filter]}
            </button>
          ))}
        </div>
      </div>
      <DataTable data={data?.data ?? []} columns={columns} />
    </main>
  );
}