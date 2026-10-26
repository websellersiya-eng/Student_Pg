"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { SearchBar } from "@/components/search/search-bar";
import { propertyService } from "@/services/property-service";

function SearchResults() {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());
  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertyService.search(filters)
  });

  return (
    <main className="page-shell bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <SlidersHorizontal size={20} />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Find PGs and hostels</h1>
              <p className="text-sm text-slate-600">Refine by city, locality, rent, gender, property type, or your location.</p>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <SearchBar />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            {data?.pagination ? `${data.pagination.total} properties found` : "Search results"}
          </p>
          <p className="text-sm text-slate-500">Showing approved and active stays</p>
        </div>
        {isLoading ? <p className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">Loading properties...</p> : null}
        {isError ? <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-700">Unable to load properties.</p> : null}
        {data?.data?.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
            No matching properties found. Try another locality, budget, or turn on your current location.
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
      </section>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="page-shell grid place-items-center bg-slate-50 px-4 py-16 text-slate-600">Loading...</main>}>
      <SearchResults />
    </Suspense>
  );
}