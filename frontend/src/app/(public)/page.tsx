import { SearchBar } from "@/components/search/search-bar";
import { BadgeCheck, MapPinned, ShieldCheck, Star, Users } from "lucide-react";

const popularCities = ["Indore", "Bhopal", "Jaipur", "Pune"];

const highlights = [
  {
    title: "Verified listing flow",
    description: "Properties stay pending until admin approval, so students see cleaner options.",
    icon: ShieldCheck
  },
  {
    title: "Location aware search",
    description: "City, locality, and map coordinates are stored for future radius based discovery.",
    icon: MapPinned
  },
  {
    title: "Direct owner requests",
    description: "Students send booking requests and track status without broker dependency.",
    icon: Users
  }
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2200&q=80"
            alt="Bright student accommodation room"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/55" />
        </div>
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur">
              <BadgeCheck size={17} />
              Smart PG/Hostel Finder for Students
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl lg:text-6xl">
              Find a student stay that feels clear before you visit.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-100 sm:text-lg">
              Search verified PGs and hostels by city, locality, rent, amenities, gender preference, and availability.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-100">
              <span className="rounded-md bg-white/12 px-3 py-2 ring-1 ring-white/20">Admin approved listings</span>
              <span className="rounded-md bg-white/12 px-3 py-2 ring-1 ring-white/20">Map based detail pages</span>
              <span className="rounded-md bg-white/12 px-3 py-2 ring-1 ring-white/20">Direct booking requests</span>
            </div>
          </div>
          <div className="soft-shadow rounded-lg bg-white p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-brand-700">Start searching</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">Student accommodation near you</h2>
            </div>
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {popularCities.map((city) => (
            <a
              key={city}
              href={`/search?city=${city.toLowerCase().replaceAll(" ", "-")}`}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
            >
              <p className="text-sm text-slate-500">Explore stays in</p>
              <p className="mt-2 text-xl font-semibold text-slate-950 group-hover:text-brand-700">{city}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold text-brand-700">Built for trust</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">Owners manage listings. Admins moderate. Students decide faster.</h2>
          <p className="mt-4 leading-7 text-slate-600">
            NearStay keeps property information structured: rent, deposit, beds, amenities, rules, location, images, reviews, and booking status.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["12+", "Search filters"],
            ["5", "Booking states"],
            ["1-5", "Rating control"]
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <Star className="text-brand-600" size={20} />
              <p className="mt-5 text-3xl font-semibold text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
