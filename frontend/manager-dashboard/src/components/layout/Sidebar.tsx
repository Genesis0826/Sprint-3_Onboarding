"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  LogOut, 
  Users, 
  UserPlus, 
  DollarSign, 
  BarChart, 
  FileCheck, 
  Layers,
  ClipboardCheck,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { getAccessToken, parseJwt, clearAuthStorage } from "@/lib/authStorage";

type PersonaType = "applicant" | "employee" | "hr" | "manager";

export function Sidebar({ persona = "applicant" }: { persona?: PersonaType }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("User");
  


useEffect(() => {
  const token = getAccessToken();
  if (!token) return;
  const decoded = parseJwt(token);
  const first = decoded?.first_name || "";
  const last = decoded?.last_name || "";
  const full = (first + " " + last).trim();
  setUserName(full || decoded?.username || decoded?.email || "User");
}, []);

  const handleLogout = () => {
    clearAuthStorage();
    router.push("/login");
  };

  const linkStyle = (href: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-colors ${
      pathname === href
        ? "bg-white/15 text-white"
        : "text-white/70 hover:text-white hover:bg-white/5"
    }`;

  return (
    <div className="w-64 bg-[#1e3a8a] text-white flex flex-col min-h-screen shrink-0">

      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 mb-4">
        <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-wide">HRIS</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/50 mb-3 px-2 tracking-widest uppercase">
          MAIN MENU
        </p>

        <nav className="space-y-1">

          {/* ================= MANAGER LINKS ================= */}
          {persona === "manager" && (
            <>
              <Link href="/manager" className={linkStyle("/manager")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/manager/team" className={linkStyle("/manager/team")}>
                <Users className="h-4 w-4" /> Team
              </Link>
              <Link href="/manager/approvals" className={linkStyle("/manager/approvals")}>
                <ClipboardCheck className="h-4 w-4" /> Approvals
              </Link>
            </>
          )}

          {/* ================= APPLICANT LINKS ================= */}
          {persona === "applicant" && (
            <>
              <Link href="/applicant/dashboard" className={linkStyle("/applicant/dashboard")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/applicant/jobs" className={linkStyle("/applicant/jobs")}>
                <Briefcase className="h-4 w-4" /> Jobs
              </Link>
              <Link href="/applicant/applications" className={linkStyle("/applicant/applications")}>
                <FileText className="h-4 w-4" /> My Applications
              </Link>
            </>
          )}

          {/* ================= EMPLOYEE LINKS ================= */}
          {persona === "employee" && (
            <>
              <Link href="/employee" className={linkStyle("/employee")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/employee/profile" className={linkStyle("/employee/profile")}>
                <Users className="h-4 w-4" /> My Profile
              </Link>
              <Link href="/employee/documents" className={linkStyle("/employee/documents")}>
                <FileCheck className="h-4 w-4" /> Documents
              </Link>
            </>
          )}

          {/* ================= HR LINKS ================= */}
          {persona === "hr" && (
            <>
              <Link href="/hr" className={linkStyle("/hr")}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
              <Link href="/hr/recruitment" className={linkStyle("/hr/recruitment")}>
                <Users className="h-4 w-4" /> Recruitment
              </Link>
              <Link href="/hr/onboarding" className={linkStyle("/hr/onboarding")}>
                <UserPlus className="h-4 w-4" /> Onboarding
              </Link>
              <Link href="/hr/payroll" className={linkStyle("/hr/payroll")}>
                <DollarSign className="h-4 w-4" /> Compensation
              </Link>
              <Link href="/hr/performance" className={linkStyle("/hr/performance")}>
                <BarChart className="h-4 w-4" /> Performance
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="mt-auto px-4 pb-6 border-t border-white/10 pt-4">
        <p className="text-[10px] font-semibold text-white/50 mb-3 px-2 tracking-widest uppercase">
          ACCOUNT
        </p>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="flex items-center gap-3 px-3 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-md font-medium text-sm w-full text-left">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Log Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Profile Block */}
      <div className="bg-black/20 p-4 flex items-center gap-3">
        <div className="h-9 w-9 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm border border-white/10">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold">{userName}</p>
          <p className="text-xs text-white/60 capitalize">{persona} Portal</p>
        </div>
      </div>
    </div>
  );
}