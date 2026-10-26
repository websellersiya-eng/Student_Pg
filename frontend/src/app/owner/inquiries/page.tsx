"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, MessageSquareText, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { inquiryService } from "@/services/property-service";
import type { InquiryStatus } from "@/types/domain";

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "bg-brand-50 text-brand-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-600"
};

export default function OwnerInquiriesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["owner-inquiries"], queryFn: inquiryService.ownerList });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InquiryStatus }) => inquiryService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-inquiries"] })
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Inquiries</h1>
      <p className="mt-1 text-sm text-slate-600">
        Students enquire on your listings. Respond by phone/email — the enquirer is also notified on your mail.
      </p>

      {isLoading ? <p className="mt-6 text-slate-600">Loading inquiries...</p> : null}
      {data?.data?.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No inquiries yet. They appear here when a student contacts you from a property page.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {data?.data?.map((inquiry) => (
          <div key={inquiry.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{inquiry.property.name}</p>
                <span className={`mt-1 inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[inquiry.status]}`}>
                  {inquiry.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <UserRound size={16} className="text-brand-700" /> {inquiry.name}
              </p>
              <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 hover:text-brand-700">
                <Mail size={16} className="text-brand-700" /> {inquiry.email}
              </a>
              {inquiry.phone ? (
                <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-brand-700">
                  <Phone size={16} className="text-brand-700" /> {inquiry.phone}
                </a>
              ) : null}
            </div>
            {inquiry.message ? (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {inquiry.message}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {inquiry.status !== "CONTACTED" ? (
                <Button variant="secondary" onClick={() => mutation.mutate({ id: inquiry.id, status: "CONTACTED" })}>
                  Mark contacted
                </Button>
              ) : null}
              {inquiry.status !== "CLOSED" ? (
                <Button onClick={() => mutation.mutate({ id: inquiry.id, status: "CLOSED" })}>Close</Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}