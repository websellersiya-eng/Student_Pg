"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { adminService } from "@/services/admin-service";
import type { Booking } from "@/types/domain";

const columns: ColumnDef<Booking>[] = [
  { accessorFn: (row) => row.property.name, header: "Property" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "createdAt", header: "Requested at" }
];

export default function AdminBookingsPage() {
  const { data } = useQuery({ queryKey: ["admin-bookings"], queryFn: adminService.bookings });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>
      <DataTable data={data?.data ?? []} columns={columns} />
    </main>
  );
}
