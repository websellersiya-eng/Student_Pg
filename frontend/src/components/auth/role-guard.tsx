"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { UserRole } from "@/types/domain";

export function RoleGuard({
  allow,
  children
}: Readonly<{ allow: UserRole[]; children: React.ReactNode }>) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace(user.role === "ADMIN" ? "/admin" : user.role === "OWNER" ? "/owner" : "/");
      return;
    }
    setReady(true);
  }, [user, allow, router]);

  if (!ready) {
    return (
      <main className="grid min-h-[50vh] place-items-center px-4 py-10 text-sm text-slate-600">
        Checking access...
      </main>
    );
  }

  return <>{children}</>;
}
