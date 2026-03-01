"use client";

import { useEffect, useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAccessToken, parseJwt } from "@/lib/authStorage";

type PersonaType = "applicant" | "employee" | "hr" | "manager";

const roleLabel: Record<PersonaType, string> = {
  hr: "HR Administration",
  employee: "Internal Staff",
  applicant: "Job Applicant",
  manager: "Manager",
};

const searchPlaceholder: Record<PersonaType, string> = {
  hr: "Search employees...",
  employee: "Search...",
  applicant: "Search jobs...",
  manager: "Search team members...",
};

const avatarColor: Record<PersonaType, string> = {
  hr: "bg-blue-100 text-blue-700",
  employee: "bg-blue-600 text-white",
  applicant: "bg-blue-100 text-blue-700",
  manager: "bg-blue-600 text-white",
};

export function Topbar({ persona = "applicant" }: { persona?: PersonaType }) {
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

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">

      {/* Search Section */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={searchPlaceholder[persona]}
          className="pl-9 bg-gray-50/50 border-gray-200 focus-visible:ring-1"
        />
      </div>

      {/* Actions and Profile Section */}
      <div className="flex items-center gap-6">

        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <button className="flex items-center gap-3 border-l pl-6 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex flex-col text-right">
            <span className="text-sm font-semibold leading-none text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground mt-1">{roleLabel[persona]}</span>
          </div>
          <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${avatarColor[persona]}`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

      </div>
    </header>
  );
}