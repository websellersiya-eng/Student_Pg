import { AuthForm } from "@/components/auth/auth-form";

export default function OwnerRegisterPage() {
  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-brand-700">Owner onboarding</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create owner account</h1>
          <p className="mt-2 text-sm text-slate-600">List properties, manage availability, and respond to students.</p>
        </div>
        <AuthForm mode="owner" />
      </section>
    </main>
  );
}
