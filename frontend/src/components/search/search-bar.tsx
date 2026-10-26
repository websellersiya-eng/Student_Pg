"use client";

import { useRef, useState } from "react";
import { Crosshair, IndianRupee, Loader2, MapPin, Search, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const [locationState, setLocationState] = useState<"idle" | "loading" | "on" | "error">("idle");

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      return;
    }
    setLocationState("loading");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        coordsRef.current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocationState("on");
      },
      () => {
        coordsRef.current = null;
        setLocationState("error");
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  };

  const clearLocation = () => {
    coordsRef.current = null;
    setLocationState("idle");
  };

  return (
    <div className="grid gap-3 rounded-lg bg-white">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">Find your stay</span>
        {locationState === "on" ? (
          <button
            type="button"
            onClick={clearLocation}
            className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
          >
            <MapPin size={14} /> Near me · 10 km <span className="text-brand-400">×</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locationState === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            {locationState === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Crosshair size={14} />}
            Use my current location
          </button>
        )}
        {locationState === "error" ? (
          <span className="text-xs font-medium text-red-600">Location unavailable</span>
        ) : null}
      </div>

      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const params = new URLSearchParams();
          const city = String(formData.get("city") ?? "").trim().toLowerCase().replaceAll(" ", "-");
          const locality = String(formData.get("locality") ?? "").trim().toLowerCase().replaceAll(" ", "-");
          const type = String(formData.get("type") ?? "");
          const gender = String(formData.get("gender") ?? "");
          const maxRent = String(formData.get("maxRent") ?? "");
          if (city) params.set("city", city);
          if (locality) params.set("locality", locality);
          if (type) params.set("type", type);
          if (gender) params.set("gender", gender);
          if (maxRent) params.set("maxRent", maxRent);
          if (coordsRef.current) {
            params.set("lat", String(coordsRef.current.lat));
            params.set("lng", String(coordsRef.current.lng));
            params.set("radius", "10");
          }
          router.push(`/search?${params.toString()}`);
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <MapPin size={16} /> City
            </span>
            <Input name="city" aria-label="City" placeholder="Indore" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <MapPin size={16} /> Locality
            </span>
            <Input name="locality" aria-label="Locality" placeholder="Vijay Nagar" />
          </label>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span>Stay type</span>
            <select name="type" className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100">
              <option value="">Any type</option>
              <option value="PG">PG</option>
              <option value="HOSTEL">Hostel</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <IndianRupee size={16} /> Max rent
            </span>
            <Input name="maxRent" type="number" placeholder="10000" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            <span className="flex items-center gap-2">
              <UsersRound size={16} /> Gender
            </span>
            <select name="gender" className="h-11 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100">
              <option value="">Any</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </label>
        </div>
        <Button type="submit" className="mt-1 gap-2">
          <Search size={18} aria-hidden="true" />
          Search stays
        </Button>
      </form>
    </div>
  );
}