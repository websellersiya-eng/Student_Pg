"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { adminService } from "@/services/admin-service";

export default function AdminDashboardPage() {
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminService.dashboard });
  const stats = data?.data ?? {};

  return (
    <main className="page-shell bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-sm font-semibold text-brand-700">Platform control</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Admin dashboard</h1>
          <p className="mt-2 text-slate-600">Moderate listings, users, bookings, reviews, cities, and amenities.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="rounded-lg border bg-white p-5 shadow-sm">
            <Activity className="text-brand-700" size={20} />
            <p className="text-sm text-slate-600">{key}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
        </div>
      </section>
    </main>
  );
}
