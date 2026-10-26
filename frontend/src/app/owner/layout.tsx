"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, CalendarCheck, MessageSquare, Plus, User } from "lucide-react";
import { RoleGuard } from "@/components/auth/role-guard";

const navItems = [
  { href: "/owner", label: "Dashboard", icon: Building2, exact: true },
  { href: "/owner/properties", label: "My Properties", icon: Building2 },
  { href: "/owner/properties/new", label: "Add Property", icon: Plus },
  { href: "/owner/bookings", label: "Booking Requests", icon: CalendarCheck },
  { href: "/owner/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/owner/profile", label: "Profile", icon: User }
];

export default function OwnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <RoleGuard allow={["OWNER"]}>
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-16 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Owner workspace</p>
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/owner";
              const isExactOwner = item.exact && pathname === "/owner";
              const isActive = isExactOwner || (!item.exact && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                    isActive || (item.exact && active)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="w-full overflow-x-auto border-b border-slate-200 bg-white lg:hidden">
        <nav className="flex gap-1 px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="flex-1 bg-slate-50">{children}</main>
    </div>
    </RoleGuard>
  );
}
