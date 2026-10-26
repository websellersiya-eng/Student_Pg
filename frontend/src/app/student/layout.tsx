"use client";

import { RoleGuard } from "@/components/auth/role-guard";

export default function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RoleGuard allow={["STUDENT"]}>{children}</RoleGuard>;
}
