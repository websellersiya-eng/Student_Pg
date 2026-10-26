import Link from "next/link";
import { Building2 } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
            <Building2 size={17} />
          </span>
          NearStay — Smart PG/Hostel Finder for Students
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <Link href="/search" className="hover:text-brand-700">Explore stays</Link>
          <Link href="/auth/register/owner" className="hover:text-brand-700">List your property</Link>
          <Link href="/auth/register/student" className="hover:text-brand-700">Student signup</Link>
          <Link href="/auth/login" className="hover:text-brand-700">Login</Link>
        </nav>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} NearStay</p>
      </div>
    </footer>
  );
}
