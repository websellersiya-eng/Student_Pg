"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, Phone } from "lucide-react";
import { inquiryService } from "@/services/property-service";
import type { InquiryStatus } from "@/types/domain";

const statusStyles: Record<InquiryStatus, string> = {
  NEW: "bg-brand-50 text-brand-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-600"
};

export default function AdminInquiriesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-inquiries"], queryFn: inquiryService.adminList });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Inquiries</h1>
      <p className="mt-1 text-sm text-slate-600">Every enquiry sent by students to owners, across all properties.</p>

      {isLoading ? <p className="mt-6 text-slate-600">Loading inquiries...</p> : null}
      {data?.data?.length === 0 ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No inquiries have been sent yet.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {data?.data?.map((inquiry) => (
          <div key={inquiry.id} className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{inquiry.property.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Owner: {inquiry.property.owner?.user.name} · {inquiry.property.owner?.user.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[inquiry.status]}`}>
                  {inquiry.status}
                </span>
                <span className="text-xs text-slate-500">{new Date(inquiry.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p className="flex items-center gap-2"><Mail size={16} className="text-brand-700" /> {inquiry.name} ({inquiry.email})</p>
              {inquiry.phone ? <p className="flex items-center gap-2"><Phone size={16} className="text-brand-700" /> {inquiry.phone}</p> : null}
            </div>
            {inquiry.message ? (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">{inquiry.message}</p>
            ) : null}
          </div>
        ))}
      </div>
    </main>
  );
}