import { AuthForm } from "@/components/auth/auth-form";

export default function StudentRegisterPage() {
  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold text-brand-700">Student access</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">Create student account</h1>
          <p className="mt-2 text-sm text-slate-600">Save properties, send requests, and track booking status.</p>
        </div>
        <AuthForm mode="student" />
      </section>
    </main>
  );
}
