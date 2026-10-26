"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/services/property-service";

export default function OwnerBookingsPage() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["owner-bookings"], queryFn: bookingService.ownerList });
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingService.updateStatus(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-bookings"] })
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Booking requests</h1>
      <div className="mt-6 grid gap-3">
        {data?.data?.map((booking) => (
          <div key={booking.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4">
            <div>
              <p className="font-medium">{booking.property.name}</p>
              <p className="text-sm text-slate-600">{booking.status}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => mutation.mutate({ id: booking.id, status: "ACCEPTED" })}>Accept</Button>
              <Button variant="secondary" onClick={() => mutation.mutate({ id: booking.id, status: "REJECTED" })}>
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
