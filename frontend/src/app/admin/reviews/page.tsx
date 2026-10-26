"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/data-table";
import { adminService } from "@/services/admin-service";

type ReviewRow = { id: string; rating: number; comment?: string };

const columns: ColumnDef<ReviewRow>[] = [
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "comment", header: "Comment" }
];

export default function AdminReviewsPage() {
  const { data } = useQuery({ queryKey: ["admin-reviews"], queryFn: adminService.reviews });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-semibold">Reviews</h1>
      <DataTable data={data?.data ?? []} columns={columns} />
    </main>
  );
}
