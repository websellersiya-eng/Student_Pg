"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Building2, CalendarCheck, Plus } from "lucide-react";
import { bookingService, propertyService } from "@/services/property-service";

export default function OwnerDashboardPage() {
  const properties = useQuery({ queryKey: ["owner-properties"], queryFn: propertyService.ownerList });
  const bookings = useQuery({ queryKey: ["owner-bookings"], queryFn: bookingService.ownerList });

  return (
    <main className="page-shell bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm font-semibold text-brand-700">Owner workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Manage listings and requests</h1>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <Building2 className="text-brand-700" />
            <p className="mt-5 text-3xl font-semibold">{properties.data?.data?.length ?? 0}</p>
            <p className="text-sm text-slate-600">Properties</p>
          </div>
          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <CalendarCheck className="text-brand-700" />
            <p className="mt-5 text-3xl font-semibold">{bookings.data?.data?.length ?? 0}</p>
            <p className="text-sm text-slate-600">Booking requests</p>
          </div>
          <Link href="/owner/properties/new" className="rounded-lg border bg-white p-5 font-semibold text-brand-700 shadow-sm hover:border-brand-200">
            <Plus className="mb-5" />
            Add property
          </Link>
        </div>
      </section>
    </main>
  );
}
