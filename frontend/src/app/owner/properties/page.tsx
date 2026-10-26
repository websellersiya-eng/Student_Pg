"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Pencil, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { propertyService } from "@/services/property-service";
import type { PropertyStatus } from "@/types/domain";

const statusStyles: Record<PropertyStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  SUSPENDED: "bg-slate-100 text-slate-600"
};

export default function OwnerPropertiesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["owner-properties"], queryFn: propertyService.ownerList });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-properties"] })
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => propertyService.submit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-properties"] })
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My properties</h1>
        <Link href="/owner/properties/new">
          <Button>Add property</Button>
        </Link>
      </div>

      {isLoading ? <p className="mt-6 text-slate-600">Loading properties...</p> : null}

      <div className="mt-6 grid gap-4">
        {data?.data?.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
            You have no properties yet. Add your first listing to start receiving inquiries.
          </p>
        ) : null}
        {data?.data?.map((property) => (
          <div key={property.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start gap-4">
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {property.images?.[0] ? (
                  <img src={property.images[0].url} alt={property.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-950">{property.name}</h2>
                  <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[property.status]}`}>
                    {property.status}
                  </span>
                  {property.status === "REJECTED" ? (
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {property.rejectionReason ?? "Rejected by admin"}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {property.propertyType} · ₹{Number(property.monthlyRent).toLocaleString("en-IN")}/mo ·{" "}
                  {property.availableBeds}/{property.totalBeds} beds
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {property.locality?.name}, {property.city?.name}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {property.status === "APPROVED" ? (
                  <Link href={`/properties/${property.slug}`}>
                    <Button variant="secondary" className="gap-2">
                      <Eye size={16} /> View
                    </Button>
                  </Link>
                ) : null}
                {property.status === "REJECTED" ? (
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => submitMutation.mutate(property.id)}
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Resubmit
                  </Button>
                ) : null}
                <Link href={`/owner/properties/${property.id}/edit`}>
                  <Button variant="secondary" className="gap-2">
                    <Pencil size={16} /> Edit
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="gap-2 text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(property.id, property.name)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}