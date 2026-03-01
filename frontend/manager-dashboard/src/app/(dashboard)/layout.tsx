"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

import { getAccessToken, getRefreshToken, parseJwt, clearAuthStorage } from "@/lib/authStorage";
import { roleToPath } from "@/lib/roleMap";

type PersonaType =
  | "system-admin"
  | "admin"
  | "hr-manager"
  | "hr-recruiter"
  | "hr-interviewer"
  | "employee"
  | "applicant";

function roleNameToPersona(roleName?: string): PersonaType | null {
  switch (roleName) {
    case "System Admin":
      return "system-admin";
    case "Admin":
      return "admin";
    case "HR Manager":
      return "hr-manager";
    case "HR Recruiter":
      return "hr-recruiter";
    case "HR Interviewer":
      return "hr-interviewer";
    case "Active Employee":
      return "employee";
    case "Applicant":
      return "applicant";
    default:
      return null;
  }
}

export default function SharedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [persona, setPersona] = useState<PersonaType | null>(null);

  useEffect(() => {
    const access = getAccessToken();
    const refresh = getRefreshToken();

    // no tokens => go login
    if (!access && !refresh) {
      clearAuthStorage();
      router.replace("/login");
      return;
    }

    // if we have access token, read role_name from it
    if (access) {
      const decoded = parseJwt(access);
      const roleName = decoded?.role_name as string | undefined;

      const p = roleNameToPersona(roleName);

      if (!p) {
        // token invalid or role missing
        // if refresh exists, allow app to render and refresh will happen on first API call
        if (refresh) {
          setPersona("employee"); // fallback UI persona
          return;
        }
        clearAuthStorage();
        router.replace("/login");
        return;
      }

      // Optional: if someone tries to open wrong dashboard, send them to correct one
      const correctPath = roleToPath(roleName);
      const currentPath = window.location.pathname;
      if (correctPath && currentPath && !currentPath.startsWith(correctPath)) {
        router.replace(correctPath);
        return;
      }

      setPersona(p);
      return;
    }

    // access missing but refresh exists -> allow render (API will refresh later)
    setPersona("employee"); // fallback
  }, [router]);

  // Prevent flicker while loading
  if (!persona) return <div className="h-screen w-full bg-slate-50" />;

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
      <Sidebar persona={persona as any} />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar persona={persona as any} />

        <main className="flex-1 overflow-y-auto p-10">{children}</main>
      </div>
    </div>
  );
}