"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/data-table";
import { propertyService } from "@/services/property-service";
import type { Property } from "@/types/domain";

export default function AdminPropertiesPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-properties"], queryFn: propertyService.adminList });
  const mutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) =>
      propertyService.moderate(id, { status, rejectionReason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-properties"] })
  });

  const columns: ColumnDef<Property>[] = [
    { accessorKey: "name", header: "Property" },
    {
      id: "owner",
      header: "Owner",
      cell: ({ row }) => (
        <span className="block">
          <span className="block text-sm font-medium text-slate-900">{row.original.owner?.user?.name ?? "—"}</span>
          <span className="block text-xs text-slate-500">{row.original.owner?.user?.email ?? ""}</span>
        </span>
      )
    },
    { accessorKey: "propertyType", header: "Type" },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => mutation.mutate({ id: row.original.id, status: "APPROVED" })}>Approve</Button>
          <Button
            variant="secondary"
            onClick={() => {
              const reason = window.prompt("Rejection reason (required):");
              if (reason === null) return;
              mutation.mutate({ id: row.original.id, status: "REJECTED", rejectionReason: reason || "Not approved" });
            }}
          >
            Reject
          </Button>
          {row.original.status === "APPROVED" ? (
            <Button
              variant="secondary"
              className="text-red-600 hover:bg-red-50"
              onClick={() => mutation.mutate({ id: row.original.id, status: "SUSPENDED" })}
            >
              Suspend
            </Button>
          ) : null}
        </div>
      )
    }
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Properties</h1>
      <DataTable data={data?.data ?? []} columns={columns} />
    </main>
  );
}