"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth-service";
import { setAuth } from "@/store/auth-slice";
import type { AppDispatch } from "@/store/store";

type Mode = "login" | "student" | "owner";

type FormFieldProps = Readonly<{
  htmlFor: string;
  label: string;
  optional?: boolean;
  children: ReactNode;
}>;

function FormField({ htmlFor, label, optional = false, children }: FormFieldProps) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label} {optional ? <span className="font-normal text-slate-400">(optional)</span> : null}
      </label>
      {children}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return "Unable to submit the form. Please check your details and try again.";
}

export function AuthForm({ mode }: Readonly<{ mode: Mode }>) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = mode === "login";

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const input = Object.fromEntries(formData.entries()) as Record<string, string>;
      if (mode === "login") return authService.login({ email: input.email, password: input.password });
      if (mode === "student") return authService.registerStudent(input);
      return authService.registerOwner(input);
    },
    onSuccess: (response) => {
      if (response.data) {
        dispatch(
          setAuth({
            user: response.data.user,
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken
          })
        );
        const role = response.data.user.role.toLowerCase();
        router.push(role === "student" ? "/" : `/${role}`);
      }
    }
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(new FormData(event.currentTarget));
      }}
      className="mx-auto grid w-full max-w-xl gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      {isLogin ? (
        <div className="grid gap-5">
          <FormField htmlFor="email" label="Email address">
            <Input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </FormField>
          <FormField htmlFor="password" label="Password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </FormField>
        </div>
      ) : (
        <div className="grid gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField htmlFor="name" label="Full name">
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                minLength={2}
                maxLength={120}
                required
              />
            </FormField>
            <FormField htmlFor="email" label="Email address">
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={180}
                required
              />
            </FormField>
            <FormField htmlFor="phone" label="Phone number" optional>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="10-digit phone number"
                maxLength={20}
              />
            </FormField>
            {mode === "student" ? (
              <FormField htmlFor="collegeName" label="College name" optional>
                <Input
                  id="collegeName"
                  name="collegeName"
                  autoComplete="organization"
                  placeholder="Your college or university"
                  maxLength={160}
                />
              </FormField>
            ) : (
              <FormField htmlFor="businessName" label="Business name">
                <Input
                  id="businessName"
                  name="businessName"
                  autoComplete="organization"
                  placeholder="Property or business name"
                  maxLength={160}
                  required
                />
              </FormField>
            )}
          </div>

          {mode === "owner" ? (
            <FormField htmlFor="address" label="Business address">
              <Input
                id="address"
                name="address"
                autoComplete="street-address"
                placeholder="Full business address"
                maxLength={255}
                required
              />
            </FormField>
          ) : null}

          <FormField htmlFor="password" label="Password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              minLength={8}
              maxLength={72}
              aria-describedby="password-help"
              required
            />
            <p id="password-help" className="text-xs text-slate-500">Use 8–72 characters.</p>
          </FormField>
        </div>
      )}

      {mutation.isError ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {getErrorMessage(mutation.error)}
        </p>
      ) : null}

      <Button type="submit" className="h-12 w-full" disabled={mutation.isPending}>
        {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : null}
        {mutation.isPending
          ? isLogin
            ? "Logging in..."
            : "Creating account..."
          : isLogin
            ? "Login"
            : "Create account"}
      </Button>

      <div className="border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
        {isLogin ? (
          <div className="grid gap-3">
            <p>New to NearStay? Choose an account type:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/auth/register/student"
                className="rounded-md border border-brand-200 bg-brand-50 px-4 py-2.5 font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                Sign up as student
              </Link>
              <Link
                href="/auth/register/owner"
                className="rounded-md border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                Sign up as owner
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <p>
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold text-brand-700 hover:text-brand-600">
                Login
              </Link>
            </p>
            {mode === "student" ? (
              <p>
                Are you a property owner?{" "}
                <Link
                  href="/auth/register/owner"
                  className="font-semibold text-brand-700 hover:text-brand-600"
                >
                  Create an owner account
                </Link>
              </p>
            ) : (
              <p>
                Looking for a place to stay?{" "}
                <Link
                  href="/auth/register/student"
                  className="font-semibold text-brand-700 hover:text-brand-600"
                >
                  Create a student account
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
