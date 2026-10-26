"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Heart, LayoutDashboard, LogIn, LogOut, User, UserPlus } from "lucide-react";
import { clearAuth } from "@/store/auth-slice";
import { authService } from "@/services/auth-service";
import type { RootState, AppDispatch } from "@/store/store";

export function SiteHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    const refreshToken = window.localStorage.getItem("nearstay_refresh_token");
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // server-side revocation is best effort
      }
    }
    dispatch(clearAuth());
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white">
            <Building2 size={20} />
          </span>
          NearStay
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/search" className="hover:text-brand-700">Explore</Link>
          {!user || user.role === "STUDENT" ? (
            <Link href="/student/favorites" className="hover:text-brand-700">Saved</Link>
          ) : null}
          {user?.role === "OWNER" ? (
            <>
              <Link href="/owner" className="hover:text-brand-700">Dashboard</Link>
              <Link href="/owner/properties" className="hover:text-brand-700">Properties</Link>
              <Link href="/owner/inquiries" className="hover:text-brand-700">Inquiries</Link>
            </>
          ) : null}
          {user?.role === "ADMIN" ? (
            <>
              <Link href="/admin" className="hover:text-brand-700">Dashboard</Link>
              <Link href="/admin/properties" className="hover:text-brand-700">Properties</Link>
              <Link href="/admin/users" className="hover:text-brand-700">Users</Link>
              <Link href="/admin/inquiries" className="hover:text-brand-700">Inquiries</Link>
            </>
          ) : null}
          {!user ? (
            <Link href="/auth/register/owner" className="hover:text-brand-700">For owners</Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {!user || user.role === "STUDENT" ? (
            <Link
              href="/student/favorites"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:inline-flex"
              aria-label="Saved properties"
            >
              <Heart size={18} />
            </Link>
          ) : null}
          {user?.role === "OWNER" ? (
            <Link
              href="/owner/profile"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:inline-flex"
              aria-label="Profile"
            >
              <User size={18} />
            </Link>
          ) : null}
          {user?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 sm:inline-flex"
              aria-label="Dashboard"
            >
              <LayoutDashboard size={18} />
            </Link>
          ) : null}
          {user ? (
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-4"
              >
                <LogIn size={17} />
                Login
              </Link>
              <Link
                href="/auth/register/student"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700 sm:px-4"
              >
                <UserPlus size={17} />
                <span className="hidden sm:inline">Sign up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
