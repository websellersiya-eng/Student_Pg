"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService, profileService } from "@/services/auth-service";
import { updateUser } from "@/store/auth-slice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

const inputLabel = "text-sm font-medium text-slate-700";

export default function OwnerProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["auth-me"], queryFn: authService.me });
  const user = data?.data;

  const profileMutation = useMutation({
    mutationFn: (formData: FormData) =>
      profileService.update({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        businessName: String(formData.get("businessName") ?? ""),
        address: String(formData.get("address") ?? "")
      }),
    onSuccess: (response) => {
      if (response.data) dispatch(updateUser(response.data));
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    }
  });

  const passwordMutation = useMutation({
    mutationFn: (formData: FormData) =>
      profileService.changePassword({
        currentPassword: String(formData.get("currentPassword") ?? ""),
        newPassword: String(formData.get("newPassword") ?? "")
      })
  });

  if (!user) return <main className="p-6 text-slate-600">Loading profile...</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold">Profile settings</h1>
      <p className="mt-1 text-sm text-slate-600">
        {user.name} · {user.email} · Owner
      </p>

      <form
        className="mt-6 grid gap-4 rounded-lg border bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          profileMutation.mutate(new FormData(event.currentTarget));
        }}
      >
        <h2 className="font-semibold text-slate-950">Owner details</h2>
        <label className="grid gap-2">
          <span className={inputLabel}>Full name</span>
          <Input name="name" defaultValue={user.name} required />
        </label>
        <label className="grid gap-2">
          <span className={inputLabel}>Phone</span>
          <Input name="phone" defaultValue={user.phone ?? ""} />
        </label>
        <label className="grid gap-2">
          <span className={inputLabel}>Business name</span>
          <Input name="businessName" defaultValue={user.ownerProfile?.businessName ?? ""} />
        </label>
        <label className="grid gap-2">
          <span className={inputLabel}>Business address</span>
          <Input name="address" defaultValue={user.ownerProfile?.address ?? ""} />
        </label>
        <Button type="submit" disabled={profileMutation.isPending} className="gap-2">
          {profileMutation.isPending ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          Update profile
        </Button>
        {profileMutation.isSuccess ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Profile updated.</p>
        ) : null}
        {profileMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">Could not update profile.</p>
        ) : null}
      </form>

      <form
        className="mt-6 grid gap-4 rounded-lg border bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          passwordMutation.mutate(new FormData(event.currentTarget));
        }}
      >
        <h2 className="font-semibold text-slate-950">Change password</h2>
        <label className="grid gap-2">
          <span className={inputLabel}>Current password</span>
          <Input name="currentPassword" type="password" required />
        </label>
        <label className="grid gap-2">
          <span className={inputLabel}>New password</span>
          <Input name="newPassword" type="password" minLength={8} required />
        </label>
        <Button type="submit" disabled={passwordMutation.isPending}>
          {passwordMutation.isPending ? <Loader2 size={17} className="animate-spin" /> : null}
          Reset password
        </Button>
        {passwordMutation.isSuccess ? (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Password changed successfully.</p>
        ) : null}
        {passwordMutation.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Password change failed. Check your current password.
          </p>
        ) : null}
      </form>
    </main>
  );
}