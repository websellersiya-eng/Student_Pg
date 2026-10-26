"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/property-service";

export default function StudentBookingsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["student-bookings"], queryFn: bookingService.studentList });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">My booking requests</h1>
      {isLoading ? <p className="mt-6">Loading...</p> : null}
      <div className="mt-6 grid gap-3">
        {data?.data?.map((booking) => (
          <div key={booking.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium">{booking.property.name}</p>
            <p className="text-sm text-slate-600">{booking.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
