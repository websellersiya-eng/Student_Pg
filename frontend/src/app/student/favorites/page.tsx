"use client";

import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/property/property-card";
import { favoriteService } from "@/services/property-service";

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["favorites"], queryFn: favoriteService.list });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Saved properties</h1>
      {isLoading ? <p className="mt-6">Loading...</p> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((favorite) => <PropertyCard key={favorite.property.id} property={favorite.property} />)}
      </div>
    </main>
  );
}
