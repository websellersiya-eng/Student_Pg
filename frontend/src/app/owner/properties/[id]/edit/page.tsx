"use client";

import { useQuery } from "@tanstack/react-query";
import { PropertyForm } from "@/components/property/property-form";
import { propertyService } from "@/services/property-service";

export default function EditPropertyPage({ params }: Readonly<{ params: { id: string } }>) {
  const { data, isLoading } = useQuery({ queryKey: ["owner-properties"], queryFn: propertyService.ownerList });
  const property = data?.data?.find((item) => item.id === params.id);

  if (isLoading) return <main className="p-6 text-slate-600">Loading property...</main>;
  if (!property) return <main className="p-6 text-red-600">Property not found.</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Edit property</h1>
      <PropertyForm mode="edit" propertyId={property.id} initialValues={property} />
    </main>
  );
}