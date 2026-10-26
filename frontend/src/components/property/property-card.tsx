import Link from "next/link";
import { BedDouble, MapPin, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Property } from "@/types/domain";

export function PropertyCard({ property }: Readonly<{ property: Property }>) {
  const image =
    property.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80";

  return (
    <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={image} alt={property.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            {property.propertyType}
          </span>
          <span className="rounded-md bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {property.genderPreference}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-950">{property.name}</h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin size={16} className="text-brand-700" /> {property.locality?.name}, {property.city?.name}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-lg font-semibold text-slate-950">₹{Number(property.monthlyRent).toLocaleString("en-IN")}</p>
            <p className="text-xs text-slate-500">per month</p>
          </div>
          <p className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-sm font-medium text-amber-700">
            <Star size={15} fill="currentColor" /> {(property.averageRating ?? 0).toFixed(1)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-slate-600">
            <BedDouble size={16} /> {property.availableBeds} beds available
          </span>
        </div>
        <Link
          href={`/properties/${property.slug}`}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          View details
        </Link>
      </div>
    </Card>
  );
}
