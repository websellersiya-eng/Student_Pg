"use client";

import { PropertyForm } from "@/components/property/property-form";

export default function NewPropertyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Add property</h1>
      <PropertyForm mode="create" />
    </main>
  );
}