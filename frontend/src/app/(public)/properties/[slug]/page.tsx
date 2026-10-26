"use client";

import dynamic from "next/dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  BedDouble,
  CheckCircle2,
  Heart,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UsersRound
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookingService, favoriteService, inquiryService, propertyService } from "@/services/property-service";

const Map = dynamic(() => import("@/components/property/property-map"), { ssr: false });

export default function PropertyDetailPage({ params }: Readonly<{ params: { slug: string } }>) {
  const queryClient = useQueryClient();
  const [inquirySent, setInquirySent] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", params.slug],
    queryFn: () => propertyService.detail(params.slug)
  });
  const property = data?.data;
  const bookingMutation = useMutation({
    mutationFn: () => bookingService.create({ propertyId: property!.id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["student-bookings"] })
  });
  const favoriteMutation = useMutation({
    mutationFn: () => favoriteService.add(property!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] })
  });
  const inquiryMutation = useMutation({
    mutationFn: (formData: FormData) =>
      inquiryService.create(property!.id, {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        message: String(formData.get("message") ?? "")
      }),
    onSuccess: () => setInquirySent(true)
  });

  if (isLoading) return <main className="p-6">Loading property...</main>;
  if (isError || !property) return <main className="p-6 text-red-600">Property not found.</main>;

  const cover =
    property.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80";

  return (
    <main className="page-shell bg-slate-50">
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr]">
            <div className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
              <img src={cover} alt={property.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {(property.images?.slice(1, 3) ?? []).map((image) => (
                <div key={image.id} className="aspect-[16/9] overflow-hidden rounded-lg bg-slate-100">
                  <img src={image.url} alt={image.altText ?? property.name} className="h-full w-full object-cover" />
                </div>
              ))}
              {property.images.length < 2 ? (
                <div className="hidden rounded-lg border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 lg:block">
                  More property images can be added by the owner from the listing form.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="min-w-0">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                    {property.propertyType}
                  </span>
                  <span className="rounded-md bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {property.genderPreference}
                  </span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-slate-950">{property.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-slate-600">
                  <MapPin size={18} className="text-brand-700" />
                  {property.addressLine}, {property.locality.name}, {property.city.name}
                </p>
              </div>
              <p className="flex items-center gap-1 rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                <Star size={16} fill="currentColor" /> {(property.averageRating ?? 0).toFixed(1)} rating
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4">
                <IndianRupee className="text-brand-700" size={20} />
                <p className="mt-3 text-lg font-semibold">₹{Number(property.monthlyRent).toLocaleString("en-IN")}</p>
                <p className="text-sm text-slate-600">Monthly rent</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <BedDouble className="text-brand-700" size={20} />
                <p className="mt-3 text-lg font-semibold">{property.availableBeds}/{property.totalBeds}</p>
                <p className="text-sm text-slate-600">Beds available</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <UsersRound className="text-brand-700" size={20} />
                <p className="mt-3 text-lg font-semibold">{property.genderPreference}</p>
                <p className="text-sm text-slate-600">Preference</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">About this stay</h2>
            <p className="mt-3 leading-7 text-slate-700">{property.description}</p>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Amenities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {property.amenities.map((item) => (
                <span key={item.amenity.id} className="rounded-md bg-brand-50 px-3 py-2 text-sm font-medium text-brand-700">
                  {item.amenity.name}
                </span>
              ))}
            </div>
          </div>

          {property.rules ? (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">House rules</h2>
              <p className="mt-3 leading-7 text-slate-700">{property.rules}</p>
            </div>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-xl font-semibold text-slate-950">Location</h2>
              <p className="mt-1 text-sm text-slate-600">Map position is based on owner provided coordinates.</p>
            </div>
            <div className="h-80">
            <Map latitude={Number(property.latitude)} longitude={Number(property.longitude)} name={property.name} />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold">₹{Number(property.monthlyRent).toLocaleString("en-IN")}/mo</p>
              <p className="mt-1 text-sm text-slate-600">{property.availableBeds} beds available</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <ShieldCheck size={20} />
            </span>
          </div>
          <div className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
            Your request goes directly to the property owner. Status updates appear in student bookings.
          </div>
          <div className="mt-5 grid gap-3">
            <Button onClick={() => bookingMutation.mutate()} disabled={bookingMutation.isPending}>
              Request booking
            </Button>
            <Button variant="secondary" onClick={() => favoriteMutation.mutate()} disabled={favoriteMutation.isPending}>
              <Heart size={17} />
              Save property
            </Button>
          </div>

          {property.contactName || property.contactPhone ? (
            <div className="mt-6 rounded-md bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-900">Contact owner directly</p>
              {property.contactName ? <p className="mt-1 text-slate-700">{property.contactName}</p> : null}
              {property.contactPhone ? (
                <a href={`tel:${property.contactPhone}`} className="mt-1 flex items-center gap-2 font-medium text-brand-700 hover:underline">
                  <Phone size={16} /> {property.contactPhone}
                </a>
              ) : null}
            </div>
          ) : null}

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="flex items-center gap-2 font-semibold text-slate-950">
              <Mail size={17} className="text-brand-700" /> Enquire on this stay
            </h3>
            {inquirySent ? (
              <div className="mt-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 size={18} className="mb-1" />
                Enquiry sent. The owner has been notified by email and will contact you shortly.
              </div>
            ) : (
              <form
                className="mt-4 grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  inquiryMutation.mutate(new FormData(event.currentTarget));
                }}
              >
                <Input name="name" placeholder="Your name" required />
                <Input name="email" type="email" placeholder="Your email" required />
                <Input name="phone" placeholder="Phone (optional)" />
                <textarea
                  name="message"
                  placeholder="Message (optional)"
                  className="min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                />
                <Button type="submit" disabled={inquiryMutation.isPending}>
                  Send enquiry
                </Button>
              </form>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}
